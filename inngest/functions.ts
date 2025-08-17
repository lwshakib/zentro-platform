import { convexClient, googleAi, ik } from "@/config";
import { IMAGE_GENERATION_SCRIPT } from "@/constants/prompts";
import { api } from "@/convex/_generated/api";
import {
  cleanJSONResponse,
  generateContentViaGemini,
  titleGenerator,
} from "@/lib/helpers";
import { Modality } from "@google/genai";
import axios from "axios";
import mime from "mime-types";
import { inngest } from "./client";
import {
  generateAudioUrl,
  generateCaptions,
  generateImages,
  generateImageUrl,
  getDesiredImageProps,
  getImageData,
  getSchedule,
  getVideoData,
  updateImage,
  updateScheduleStatus,
  updateVideoStatus,
  uploadOnYoutube,
  uploadVideo,
  renderVideo,
  updateVideoUrl,
} from "./helpers";

export const createVideo = inngest.createFunction(
  {
    id: "create-video",
    cancelOn: [
      {
        event: "zentro.video.cancel",
        match: "data.videoId",
      },
    ],
  },
  {
    event: "zentro.video.create",
  },
  async ({ event, step }) => {
    const { videoId } = event?.data;
    try {
      await updateVideoStatus(videoId, "PROCESSING", step);

      const videoData = await getVideoData(videoId, step);

      const audioUrl = await generateAudioUrl(
        videoData.script,
        videoData.voice,
        step
      );

      const captions = await generateCaptions(audioUrl, step);

      const images = await generateImages(
        videoData.script,
        videoData.videoStyle,
        step
      );

      const title = await step.run("generate-title", async () => {
        const title = await titleGenerator(videoData.script);
        return title as string;
      });

      await step.run("update-db-with-data", async () => {
        await convexClient.mutation(api.videos.updateVideo, {
          videoId: videoId as any,
          audioUrl,
          captions,
          images,
          title,
          status: "COMPLETED",
          updatedAt: new Date().toISOString(),
        });
      });

      return true;
    } catch (error: any) {
      await updateVideoStatus(videoId, "FAILED", step);
      return false;
    }
  }
);

export const generateImage = inngest.createFunction(
  {
    id: "generate-image",
    cancelOn: [
      {
        event: "zentro.image.cancel",
        match: "data.imageId",
      },
    ],
  },
  {
    event: "zentro.image.generate",
  },
  async ({ event, step }) => {
    const { imageId } = event?.data;
    try {
      
        await updateImage(imageId, "PROCESSING", "", step);

        const imageGeneration = await getImageData(imageId as string, step);

        const props = await getDesiredImageProps(imageGeneration, step);

        const imageUrl =  await generateImageUrl(imageGeneration, props, step);

        await updateImage(imageId, "COMPLETED", imageUrl, step);

      return true;
    } catch (error: any) {
      await updateImage(imageId, "FAILED", "", step);
      return false;
    }
  }
);



export const scheduleUpload = inngest.createFunction(
    {
        id: "schedule-upload",
        cancelOn: [
            {
                event: "zentro.schedule.cancel",
                match: "data.scheduleId",
            },
        ],
    },
    {
        event: "zentro.schedule.upload",
    },
    async ({ event, step }) => {
        const { googleRefreshToken, scheduleId } = event?.data;
        try {
            const schedule: any = await getSchedule(scheduleId, step);

            await step.sleepUntil("wait-for-scheduled-time", schedule?.datetime);
            if(schedule?.type === "SMART"){
              await updateScheduleStatus(scheduleId, "PROCESSING", step);
              // Upload Video
              await uploadVideo(schedule?.videoId, googleRefreshToken, step);

              await updateScheduleStatus(scheduleId, "COMPLETED", step);

              // For Tommororw
              await inngest.send({
                name: "zentro.schedule.upload",
                data: {
                  googleRefreshToken,
                  scheduleId,
                }
              })


            }else{

              await updateScheduleStatus(scheduleId, "PROCESSING", step);
              // Upload Video
              await uploadVideo(schedule?.videoId, googleRefreshToken, step);

              await updateScheduleStatus(scheduleId, "COMPLETED", step);
            }

            return true;
            
        } catch (error) {
            return false;
        }
    }
)



export const renderZentroVideo = inngest.createFunction(
    {
        id: "render-video",
        cancelOn: [
            {
                event: "zentro.render.cancel",
                match: "data.videoId",
            },
        ],
    },
    {
        event: "zentro.render.video",
    },
    async ({ event, step }) => {
        const { videoId } = event?.data;
        try {
            const videoData = await getVideoData(videoId, step);
            const videoUrl = await renderVideo(videoData, step);
            await updateVideoUrl(videoId, videoUrl, step);
            return true;
        } catch (error) {
            return false;
        }
    }
)