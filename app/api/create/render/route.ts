import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

import { api } from "@/convex/_generated/api";
import { convexClient } from "@/config";

export async function POST(req: Request) {
    const { videoId } = await req.json();

    await convexClient.mutation(api.videos.updateVideoRenderStatus, {
        videoId: videoId as any,
        rendering: "RENDERING",
    });

    await inngest.send({
        name: "zentro.render.video",
        data: {
            videoId,
        }
    })

    return NextResponse.json({
        success: true,
        message: "Video Rendered Successfully",
    })
}