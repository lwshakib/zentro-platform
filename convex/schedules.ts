import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createSchedule = mutation({
    args: {
        videoId: v.id("videos"),
        clerkId: v.string(),
        datetime: v.string(),
        status: v.string(), // QUEUED | PROCESSING | COMPLETED | FAILED
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { videoId, clerkId, datetime, status, description } = args;
        await ctx.db.insert("schedulers", {
            videoId,
            clerkId,
            datetime,
            status,
            description,
        });
    }
})