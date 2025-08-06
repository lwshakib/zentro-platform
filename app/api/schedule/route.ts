import { convexClient } from "@/config";
import { api } from "@/convex/_generated/api";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request){
    const {videoId, scheduledDateTime, schedulingType, description} = await request.json();
    const cookiesStore = await cookies();
    const googleRefreshToken = cookiesStore.get("googleRefreshToken")?.value;
    const googleAccessToken = cookiesStore.get("googleAccessToken")?.value;
    const user = await currentUser();
    if(!user){
        return NextResponse.json({
            success: false,
            message: "User Not Found",
        }, {status: 404})
    }

    if(!googleAccessToken || !googleRefreshToken){
        return NextResponse.json({
            success: false,
            message: "Connect With Youtube to continue...",
        }, {status: 404})
    }


    const scheduleId = await convexClient.mutation(api.schedules.createSchedule, {
        videoId,
        clerkId: user.id,
        datetime: scheduledDateTime,
        status: "QUEUED",
        description,
        type: schedulingType.toUpperCase(),
    })

    await inngest.send({
        name: "zentro.schedule.upload",
        data: {
            scheduleId,
            googleRefreshToken,
        }
    })

    return NextResponse.json({
        success: true,
        message: "Video Scheduled Successfully",
    }, {status: 200})
}