import { convexClient } from "@/config";
import { api } from "@/convex/_generated/api";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { scheduleId } = await req.json();

    await inngest.send({
        name: "zentro.schedule.cancel",
        data: {
            scheduleId,     
        }
    }) 

    await convexClient.mutation(api.schedules.deleteSchedule, {
        scheduleId,
    });

    return NextResponse.json({
        success:true
    })
}