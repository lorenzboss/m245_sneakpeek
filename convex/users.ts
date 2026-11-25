import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const createUser = internalMutation({
  args: {
    method: v.object({
      name: v.literal("emailPassword"),
      profile: v.object({}),
    }),
  },
  returns: v.id("users"),
  handler: async (ctx) => {
    return await ctx.db.insert("users", {});
  },
});

export const syncProfile = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get("users", userId);
    if (!user) {
      throw new Error("User not found in database");
    }

    if (identity.name && identity.name !== user.name) {
      await ctx.db.patch(userId, { name: identity.name });
    }

    return null;
  },
});

export const updateDisplayName = mutation({
  args: {
    displayName: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const displayName = args.displayName.trim();
    if (displayName.length === 0 || displayName.length > 32) {
      throw new Error("Display name must be between 1 and 32 characters");
    }

    const user = await ctx.db.get("users", userId);
    if (!user) {
      throw new Error("User not found in database");
    }

    await ctx.db.patch(userId, { displayName });
    return null;
  },
});

export const getCurrentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      _creationTime: v.number(),
      userId: v.optional(v.string()),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      displayName: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db.get("users", userId);
  },
});
