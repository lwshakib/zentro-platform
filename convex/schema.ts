import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    picture: v.string(),
  }),
  videos: defineTable({
    clerkId: v.string(),
    title: v.optional(v.string()),
    voice: v.string(),
    script: v.string(),
    captionStyle: v.object({
      label: v.string(),
      className: v.string(),
    }),
    topic: v.string(),
    videoStyle: v.string(),
    captions: v.optional(v.array(v.any())),
    images: v.optional(v.array(v.string())),
    audioUrl: v.optional(v.string()),
    status: v.string(), // QUEUED | PROCESSING | COMPLETED | FAILED
    updatedAt: v.string(),
    videoUrl: v.optional(v.string()),
    rendering: v.optional(v.string()) // NOT_FOUND | RENDERING | RENDERED
  }),
  imageGenerations: defineTable({
    clerkId: v.string(),
    prompt: v.string(),
    type: v.string(), // THUMBNAIL | LOGO | BANNER
    image: v.optional(v.string()),
    status: v.string(), // QUEUED | PROCESSING | COMPLETED | FAILED
    selectedImage: v.optional(v.any()),
  }),
  schedulers: defineTable({
    videoId: v.string(),
    clerkId: v.string(),
    datetime: v.string(),
    status: v.string(), // QUEUED | PROCESSING | COMPLETED | FAILED
    description: v.optional(v.string()),
    type: v.string(), // SMART | NORMAL
  }),
  images: defineTable({
    url: v.string(),
    clerkId: v.string(),
  }),
});
