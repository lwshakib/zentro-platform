import { convexClient } from "@/config";
import { api } from "@/convex/_generated/api";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request){
    const {videoId, scheduledDateTime, schedulingType, description} = await request.json();
    const cookiesStore = await cookies();
    const googleRefreshToken = cookiesStore.get("googleRefreshToken")?.value;
    const googleAccessToken = cookiesStore.get("googleAccessToken")?.value;

    if(!googleAccessToken || !googleRefreshToken){
        return NextResponse.json({
            success: false,
            message: "Connect With Youtube to continue...",
        })
    }


    await convexClient.mutation(api.schedules.createSchedule, {
        videoId,
        clerkId: "",
        datetime: scheduledDateTime,
        status: "QUEUED",
        description,
    })

    await inngest.send({
        name: "zentro.schedule.upload",
        data: {
            videoId,
            scheduledDateTime,
            schedulingType,
            description,
            googleRefreshToken,
        }
    })

    return NextResponse.json({
        success: true,
        message: "Video Scheduled Successfully",
    })
}