import { googleAi } from "@/config";
import { ENHANCE_PROMPT_SCRIPT, TITLE_GENERATE_PROMPT } from "@/constants/prompts";
import axios from "axios";
import https from "https";

    export const cleanJSONResponse = (raw: string) => {
        const cleanContent = raw
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "")
        .trim();

        const parsedResponse = JSON.parse(cleanContent);

        return parsedResponse;

    };


    export async function getAudioBuffer(
        byteStream: ReadableStream<Uint8Array>
      ): Promise<Buffer> {
        const reader = byteStream.getReader();
        const buffers: Buffer[] = [];
        let totalLength = 0;
      
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            // Convert each chunk into a Buffer if it isn't one already
            const buf = Buffer.isBuffer(value)
              ? value
              : Buffer.from(value.buffer, value.byteOffset, value.byteLength);
            buffers.push(buf);
            totalLength += buf.length;
          }
        } catch (err) {
          await reader.cancel(err); // signal we no longer care about this stream
          throw err;
        } finally {
          reader.releaseLock();
        }
      
        return Buffer.concat(buffers, totalLength);
      }
      
    
      

      export async function generateContentViaGemini(prompt: string) {
        const response = await googleAi.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 1.5,
            },
          });
    
          return response.text;
    }


    export async function titleGenerator(content: string) {
        const titlePrompt = TITLE_GENERATE_PROMPT.replace("{{CONTENT}}", content);
        const response = await generateContentViaGemini(titlePrompt);
    
          return response;
    }


    

export async function getChannelData(access_token: string) {
    const {data} = await axios.get("https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return data;
}





export async function enhancePrompt(prompt:string){
  const promptDetails = ENHANCE_PROMPT_SCRIPT.replace("{{PROMPT}}", prompt);
  const response = await generateContentViaGemini(promptDetails);

    return response;
}


      // Function to get readable stream from HTTPS URL
      export const getVideoStream = (url: string): Promise<NodeJS.ReadableStream> => {
        return new Promise((resolve, reject) => {
          https
            .get(url, (res) => {
              if (res.statusCode !== 200) {
                reject(
                  new Error(
                    `Failed to fetch video. Status code: ${res.statusCode}`
                  )
                );
                res.resume(); // Consume response data to free memory
                return;
              }
              resolve(res);
            })
            .on("error", reject);
        });
      };