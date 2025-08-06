import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSchedule = mutation({
    args: {
        videoId: v.id("videos"),
        clerkId: v.string(),
        datetime: v.string(),
        status: v.string(), // QUEUED | PROCESSING | COMPLETED | FAILED
        description: v.optional(v.string()),
        type: v.string(), // SMART | NORMAL
    },
    handler: async (ctx, args) => {
        const { videoId, clerkId, datetime, status, description, type } = args;
        return await ctx.db.insert("schedulers", {
            videoId,
            clerkId,
            datetime,
            status,
            description,
            type,
        });

    }
})


export const getSchedules = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error("Unauthorized");
        }
        const schedules = await ctx.db.query("schedulers").filter((q) => q.eq(q.field("clerkId"), identity.subject)).collect();
        return schedules;
  
    }
})

export const deleteSchedule = mutation({
    args: {
        scheduleId: v.id("schedulers"),
    },
    handler: async (ctx, args) => {
        const { scheduleId } = args;
        await ctx.db.delete(scheduleId);
    }
})


export const updateScheduleStatus = mutation({
    args: {
        scheduleId: v.id("schedulers"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const { scheduleId, status } = args;
        await ctx.db.patch(scheduleId, {
            status,
        });
    }
})

export const getSchedule = query({
    args: {
        scheduleId: v.id("schedulers"),
    },
    handler: async (ctx, args) => {
        const { scheduleId } = args;
        const schedule = await ctx.db.get(scheduleId);
        return schedule;
    }
})