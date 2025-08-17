import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createVideo = mutation({
  args: {
    clerkId: v.string(),
    script: v.string(),
    topic: v.string(),
    captionStyle: v.object({
      label: v.string(),
      className: v.string(),
    }),
    videoStyle: v.string(),
    voice: v.string(),
    status: v.string(),
    title: v.optional(v.string()),
    updatedAt: v.string(),
    rendering: v.string(),
  },
  handler: async (ctx, args) => {
    const {
      clerkId,
      script,
      topic,
      captionStyle,
      videoStyle,
      voice,
      title,
      status,
      updatedAt,
      rendering,
    } = args;

    const videoId = await ctx.db.insert("videos", {
      clerkId,
      script,
      topic,
      captionStyle,
      videoStyle,
      voice,
      status,
      title,
      updatedAt,
      rendering,
    });
    return videoId;
  },
});

export const updateVideoStatus = mutation({
  args: {
    videoId: v.id("videos"),
    status: v.string(),
    updatedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const { videoId, status, updatedAt } = args;

    await ctx.db.patch(videoId, {
      status,
      updatedAt,
    });
  },
});

export const getVideo = query({
  args: {
    videoId: v.id("videos"),
  },
  handler: async (ctx, args) => {
    const { videoId } = args;

    return await ctx.db.get(videoId);
  },
});

export const updateVideo = mutation({
  args: {
    videoId: v.id("videos"),
    audioUrl: v.string(),
    captions: v.array(v.any()),
    images: v.array(v.string()),
    status: v.string(),
    updatedAt: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const { videoId, audioUrl, captions, images, status, updatedAt, title } =
      args;

    await ctx.db.patch(videoId, {
      audioUrl,
      captions,
      images,
      title,
      status,
      updatedAt,
    });
  },
});

export const getVideos = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Query and sort by updatedAt descending (most recent first)
    const vids = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .collect();

    // Map to lean structure: pick only needed fields
    return vids
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .map((v) => ({
        _id: v._id,
        title: v.title,
        updatedAt: v.updatedAt,
        image: v.images?.[0] ?? null,
        status: v.status,
      }));
  },
});


export const deleteVideo = mutation({
  args: {
    videoId: v.id("videos"),
  },
  handler: async (ctx, args) => {
    const { videoId } = args;

    await ctx.db.delete(videoId);
  },
});

export const updateVideoUrl = mutation({
  args: {
    videoId: v.id("videos"),
    videoUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const { videoId, videoUrl } = args;

    await ctx.db.patch(videoId, {
      videoUrl,
    });
  },
});

export const updateVideoRenderStatus = mutation({
  args: {
    videoId: v.id("videos"),
    rendering: v.string()
  },
  handler: async (ctx, args) => {
    const { videoId, rendering } = args;

    await ctx.db.patch(videoId, {
      rendering
    });
  },
});