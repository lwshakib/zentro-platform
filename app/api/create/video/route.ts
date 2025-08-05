import { inngest } from "@/inngest/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const { videoId } = await req.json();

   await inngest.send({
    name: "zentro.video.create",
    data: {
        videoId,
    }
   })

   return NextResponse.json({
        success: true,
        message: "Video Created Successfully",
   })
}