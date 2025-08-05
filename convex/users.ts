import { v } from "convex/values";
import { mutation, query } from "./_generated/server";



export const getOrCreateUser = mutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error("Unauthorized");
        }
      // Find existing user
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), identity.subject))
        .first(); // Instead of collect() + length check
  
      if (existingUser) {
        return existingUser; // Return if found
      }
  
      // Create new user if not found
      return ctx.db.insert("users", {
        clerkId: identity.subject,
        name: identity.name!,
        email: identity.email!,
        picture: identity.pictureUrl!,
      });
    },
  });


  export const getUser = query({
    args:{
      clerkId: v.string()
    },
    handler: async (ctx, args) => {
      return await ctx.db.query("users").filter((q) => q.eq(q.field("clerkId"), args.clerkId)).first();
    }
  })