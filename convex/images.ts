import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createImage = mutation({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const image = await ctx.db.insert("images", {
      url: args.url,
      clerkId: identity.subject,
    });
    return image;
  },
});

export const getImages = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const images = await ctx.db
      .query("images")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .order("desc")
      .collect();
    return images;
  },
});

export const createImageGeneration = mutation({
  args: {
    prompt: v.string(),
    type: v.string(),
    status: v.string(),
    selectedImage: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const image = await ctx.db.insert("imageGenerations", {
      prompt: args.prompt,
      type: args.type,
      status: args.status,
      clerkId: identity.subject,
      selectedImage: args.selectedImage,
    });
    return image;
  },
});

export const getImageGeneration = query({
  args: {
    imageId: v.id("imageGenerations"),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);
    return image;
  },
});

export const getImageGenerations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const images = await ctx.db
      .query("imageGenerations")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .order("desc")
      .collect();
    return images;
  },
});

export const updateImageGeneration = mutation({
  args: {
    imageId: v.id("imageGenerations"),
    status: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.patch(args.imageId, {
      status: args.status,
      image: args.image,
    });
    return image;
  },
});



export const deleteImageGeneration = mutation({
  args: {
    imageId: v.id("imageGenerations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.imageId);
    return { success: true };
  },
});
