import { convexClient } from "@/config";
import { api } from "@/convex/_generated/api";
import { deleteVideo } from "@/convex/videos";
import { inngest } from "@/inngest/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
    const { videoId } = await request.json();

    await inngest.send({
        name: "zentro.video.cancel",
        data: {
            videoId,
        }
    })

    await convexClient.mutation(api.videos.deleteVideo, {
        videoId,
    });

    return NextResponse.json({
        success: true,
        message: "Video Cancelled Successfully",
    });
}
