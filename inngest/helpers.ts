import mime from "mime-types";
import {
  getFunctions,
  getRenderProgress,
  renderMediaOnLambda,
} from "@remotion/lambda/client";
import { google } from "googleapis";
import { Resend } from "resend";
import {
  convexClient,
  deepgramClient,
  googleAi,
  googleClientId,
  googleClientSecret,
  ik,
  nebiusClient,
  resend,
} from "@/config";
import {
  IMAGE_GENERATION_SCRIPT,
  IMAGE_PROMPT_SCRIPT,
  YOUTUBE_METADATA_GENERATE_SCRIPT,
} from "@/constants/prompts";
import { api } from "@/convex/_generated/api";
import {
  cleanJSONResponse,
  generateContentViaGemini,
  getAudioBuffer,
  getVideoStream,
} from "@/lib/helpers";
import { Modality } from "@google/genai";
import axios from "axios";
import { EmailTemplate } from "@/components/templates/video-uploaded-email-template";

export async function getVideoData(videoId: string, step: any) {
  const videoData = await step.run("get-video-data", async () => {
    const video = await convexClient.query(api.videos.getVideo, {
      videoId: videoId as any,
    });
    return video;
  });
  return videoData;
}

export async function updateVideoStatus(
  videoId: string,
  status: string,
  step: any
) {
  const updateVideoStatus = await step.run("update-video-status", async () => {
    await convexClient.mutation(api.videos.updateVideoStatus, {
      videoId: videoId as any,
      status,
      updatedAt: new Date().toISOString(),
    });
  });
}

export async function generateAudioUrl(
  script: string,
  voice: string,
  step: any
) {
  const url = await step.run("generate-audio-url", async () => {
    const response = await deepgramClient.speak.request(
      { text: script },
      {
        model: voice,
        encoding: "linear16",
        container: "wav",
      }
    );

    const stream = await response.getStream();
    if (!stream) {
      throw new Error("No audio stream received");
    }

    const audioBuffer = await getAudioBuffer(stream);

    const uploadResponse = await ik.upload({
      file: audioBuffer,
      fileName: `audio-${Date.now()}-${Math.floor(Math.random() * 100000)}.wav`,
      folder: "zentro-platform",
    });

    return uploadResponse.url;
  });
  return url;
}

export async function generateCaptions(audioUrl: string, step: any) {
  const captions = await step.run("generate-captions", async () => {
    // STEP 2: Call the transcribeUrl method with the audio payload and options
    const { result, error } =
      await deepgramClient.listen.prerecorded.transcribeUrl(
        {
          url: audioUrl,
        },
        // STEP 3: Configure Deepgram options for audio analysis
        {
          model: "nova-3",
          smart_format: true,
        }
      );
    if (error) throw error;
    return result.results.channels[0]?.alternatives[0].words;
  });
  return captions;
}

export async function generateImages(
  script: string,
  videoStyle: string,
  step: any
) {
  const imagesPrompts = await step.run("generate-images-prompts", async () => {
    const prompt = IMAGE_PROMPT_SCRIPT.replace("{{STYLE}}", videoStyle).replace(
      "{{SCRIPT}}",
      script
    );

    const responseText = await generateContentViaGemini(prompt);

    return cleanJSONResponse(responseText as string);
  });

  const images = await step.run("generate-images-from-prompts", async () => {
    const images = await Promise.all(
      imagesPrompts.map(async (el: any, index: number) => {
        const response = await nebiusClient.images.generate({
          model: "black-forest-labs/flux-schnell",
          response_format: "url",
          // @ts-expect-error
          response_extension: "png",
          width: 720,
          height: 1080,
          num_inference_steps: 4,
          negative_prompt: "",
          seed: -1,
          prompt: el?.imagePrompt,
        });
        if (response?.data?.[0]?.url) {
          return response?.data[0]?.url;
        }
      })
    );
    return images;
  });
  return images;
}

export async function updateImage(
  imageId: string,
  status: string,
  image: string,
  step: any
) {
  await step.run("update-image-generation", async () => {
    await convexClient.mutation(api.images.updateImageGeneration, {
      imageId: imageId as any,
      status,
      image,
    });
  });
}

export async function getImageData(imageId: string, step: any) {
  const imageGeneration = await step.run("get-image-generation", async () => {
    return await convexClient.query(api.images.getImageGeneration, {
      imageId: imageId as any,
    });
  });
  return imageGeneration;
}

export async function getDesiredImageProps(imageGeneration: any, step: any) {
  const getDesiredProps = await step.run(
    "get-desired-image-props",
    async () => {
      const promptText = IMAGE_GENERATION_SCRIPT.replace(
        "{{PROMPT}}",
        imageGeneration.prompt
      ).replace("{{TYPE}}", imageGeneration.type);
      const response = await generateContentViaGemini(promptText);

      const cleanJson = cleanJSONResponse(response as string);
      return {
        prompt: cleanJson.prompt,
        responseExtension: cleanJson.responseExtension,
      };
    }
  );
  return getDesiredProps;
}

export async function generateImageUrl(
  imageGeneration: any,
  props: any,
  step: any
) {
  const url = await step.run("generate-image-url", async () => {
 
    let response: any;
    if (imageGeneration.selectedImage) {
      console.log("I got image")
      const response2 = await axios.get(imageGeneration.selectedImage.url, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response2.data, "binary");
      const base64Image = buffer.toString("base64");

   response = await googleAi.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [
        {
          text: props.prompt,
        },
        {
          inlineData: {
            mimeType:
              imageGeneration.selectedImage && mime.lookup(imageGeneration.selectedImage.url)?.toString() ||
              "image/jpeg",
            data: base64Image as any,
          },
        },
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    }else{
      console.log("Where is my image?")
      response = await googleAi.models.generateContent({
       model: "gemini-2.0-flash-preview-image-generation",
       contents: [
         {
           text: props.prompt,
         }
       ],
       config: {
         responseModalities: [Modality.TEXT, Modality.IMAGE],
       },
     });
    }


    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");

          const uploadResponse = await ik.upload({
            file: buffer,
            fileName: `image-${Date.now()}-${Math.floor(Math.random() * 100000)}.${props.responseExtension}`,
            folder: "zentro-platform",
          });
          const imageUrl = uploadResponse.url;
          return imageUrl;
        }
      }
      return null;
    }
  });
  return url;
}


export async function updateVideoUrl(videoId: string, videoUrl: string, step: any) {
  await step.run("update-video-url", async () => {
    await convexClient.mutation(api.videos.updateVideoUrl, {
      videoId: videoId as any,
      videoUrl,
    });
  });
}

export const renderVideo = async (videoData: any, step: any) => {
  const renderVideo = await step.run("renderVideo", async () => {
    await updateVideoRenderStatus(videoData._id, "RENDERING", step);
    const functions = await getFunctions({
      region: "ap-south-1",
      compatibleOnly: true,
    });

    const functionName = functions[0].functionName;

    const { renderId, bucketName } = await renderMediaOnLambda({
      region: "ap-south-1",
      functionName,
      serveUrl: process.env.AWS_REMOTION_SERVE_URL as string,
      composition: "zentro-platform",
      inputProps: {
        videoData: {
          images: videoData.images,
          audioUrl: videoData.audioUrl,
          captions: videoData.captions,
        },
      },
      codec: "h264",
      imageFormat: "png",
      maxRetries: 1,
      framesPerLambda: 20,
      privacy: "public",
    });

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const progress = await getRenderProgress({
        renderId,
        bucketName,
        functionName,
        region: "ap-south-1",
      });
      if (progress.done) {
        await updateVideoRenderStatus(videoData._id, "RENDERED", step);
        console.log("Render finished!", progress.outputFile);
        return progress.outputFile;
        process.exit(0);
      }
      if (progress.fatalErrorEncountered) {
        await updateVideoRenderStatus(videoData._id, "NOT_RENDERED", step);
        console.error("Error enountered", progress.errors);
        return { message: "Error", data: progress.errors };
        process.exit(1);
      }
    }
  });
  return renderVideo;
}


export const generateMetaDataForYoutubeVideo = async (videoData: any, step: any) => {

    const metadata = await step.run("generate-metadata", async () => {
        const metadata = await generateContentViaGemini(YOUTUBE_METADATA_GENERATE_SCRIPT.replace("{{SCRIPT}}", videoData.script));
        return metadata;
    });

    return cleanJSONResponse(metadata as string);

}


export const uploadOnYoutube = async (videoUrl: string, metadata: any, googleRefreshToken: string, step: any) => {
        // Step 3: Generate fresh access token
        const accessToken = await step.run("generate-access-token", async () => {
          const refreshResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                client_id: googleClientId!,
                client_secret: googleClientSecret!,
                refresh_token: googleRefreshToken,
                grant_type: "refresh_token",
              } as Record<string, string>),
            }
          );
    
          const refreshData = await refreshResponse.json();
    
          if (!refreshResponse.ok) {
            console.error("Token refresh failed:", refreshData);
            throw new Error(`Token refresh failed: ${refreshData.error || 'Unknown error'}`);
          }
    
          return refreshData.access_token;
        });
        const uploadToYoutubeServer = await step.run('upload-to-youtube-server', async()=>{
          const oauth2Client = new google.auth.OAuth2();
          oauth2Client.setCredentials({ access_token: accessToken });

          const youtube = google.youtube({ version: "v3", auth: oauth2Client });

          try{
            const videoStream = await getVideoStream(videoUrl!);
            const uploadResponse = await youtube.videos.insert({
              part: "snippet,status" as any,
              requestBody: {
                snippet: {
                  title: metadata.title,
                  description: metadata.description,
                  tags: metadata.tags,
                },
                status: {
                  privacyStatus: "public",
                },
              },
              media: {
                body: videoStream,
              },
            });
            return uploadResponse.data;
          }catch(error: any){
            console.error("Upload failed:", error);
            throw new Error(error?.message || "Failed to upload video to YouTube");
          }
        })

        return uploadToYoutubeServer;

}


export const sendEmailForYoutubeVideoUpload = async(uploadResponse: any, user: any, step: any) => {
  const sendEmailToUser = await step.run(
    "send-email-notification",
    async () => {
      const emailObj = {
        name: user.name,
        videoUrl: `https://www.youtube.com/watch?v=${uploadResponse.id}`,
        channelName: uploadResponse.snippet?.channelTitle || "Unknown Channel",
        videoTitle: uploadResponse.snippet?.title || "Untitled Video",
        videoDescription:
          uploadResponse.snippet?.description || "No description available",
        videoTags: uploadResponse.snippet?.tags || [],
        videoThumbnail: {
          url: uploadResponse.snippet?.thumbnails?.medium?.url || "",
          height: uploadResponse.snippet?.thumbnails?.medium?.height || 0,
          width: uploadResponse.snippet?.thumbnails?.medium?.width || 0,
        },
      };

      try {
        const { data, error } = await resend.emails.send({
          from: "Zentro Platform <video@mail.vexx.fun>",
          to: [user.email],
          subject: "Scheduled upload complete: Your video is now on YouTube",
          react: EmailTemplate(emailObj as any),
        });

        if (error) {
          console.error("Email send error:", error);
          return { error };
        }

        return { data };
      } catch (error) {
        console.error("Email send error:", error);
        return { error };
      }
    }
  );
}

export const getUser = async(clerkId: any) => {
  const user = await convexClient.query(api.users.getUser, {
    clerkId,
  }); 
  return user;
}


export const getSchedule = async(scheduleId: string, step: any) => {
  const getScheduleData = await step.run("get-schedule", async () => {
    const schedule = await convexClient.query(api.schedules.getSchedule, {
      scheduleId: scheduleId as any,
    }); 
    return schedule;
  });
  return getScheduleData;
}

export const updateScheduleStatus = async(scheduleId: string, status: string, step: any) => {
  await step.run("update-schedule-status", async () => {
    await convexClient.mutation(api.schedules.updateScheduleStatus, {
      scheduleId: scheduleId as any,
      status,
    });
  });
}


export const uploadVideo = async (videoId: string, googleRefreshToken: string, step: any) => {
  const videoData = await getVideoData(videoId, step);
  let videoUrl: string;
  if(!videoData.videoUrl){
    videoUrl = await renderVideo(videoData, step);
  }else{
    videoUrl = videoData.videoUrl;
  }

  await updateVideoUrl(videoId, videoUrl, step);

  const metadata = await generateMetaDataForYoutubeVideo(videoData, step);

  const uploadResponse = await uploadOnYoutube(videoUrl, metadata, googleRefreshToken, step);

  const user = await getUser(videoData.clerkId);

  await sendEmailForYoutubeVideoUpload(uploadResponse, user, step);

}


export const updateVideoRenderStatus = async(videoId: string, rendering: string, step: any) => {
    await convexClient.mutation(api.videos.updateVideoRenderStatus, {
      videoId: videoId as any,
      rendering,
    });
}