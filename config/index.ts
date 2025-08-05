import { createClient } from "@deepgram/sdk";
import { GoogleGenAI } from "@google/genai";
import { ConvexHttpClient } from "convex/browser";
import ImageKit from "imagekit";
import OpenAI from "openai";
import { Resend } from "resend";




export const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const googleClientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
export const googleAuthRedirectUri = process.env.NEXT_PUBLIC_GOOGLE_AUTH_REDIRECT_URI;
export const resendApiKey = process.env.NEXT_PUBLIC_RESEND_API_KEY!;
export const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
export const deepgramApiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!;
export const nebiusApiKey = process.env.NEXT_PUBLIC_NEBIUS_API_KEY!;
export const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
export const imagekitPublicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;
export const imagekitPrivateKey = process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!;
export const imagekitUrlEndpoint =
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
export const nextPublicBaseURL = process.env.NEXT_PUBLIC_BASE_URL!;

export const googleAi = new GoogleGenAI({
  apiKey: googleApiKey,
});

export const convexClient = new ConvexHttpClient(convexUrl);

export const nebiusClient = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: nebiusApiKey,
});

export const ik = new ImageKit({
  publicKey: imagekitPublicKey,
  privateKey: imagekitPrivateKey,
  urlEndpoint: imagekitUrlEndpoint,
});

export const deepgramClient = createClient(deepgramApiKey);

export const resend = new Resend(resendApiKey);
