import { convexClient } from "@/config";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(request: Request){
    const {imageId} = await request.json();

    await inngest.send({
        name: "zentro.image.cancel",
        data: {
            imageId,
        }
    })

    await convexClient.mutation(api.images.deleteImageGeneration, {
        imageId,
    });

    return NextResponse.json({
        success: true,
        message: "Image Generation Cancelled Successfully",
    });
}