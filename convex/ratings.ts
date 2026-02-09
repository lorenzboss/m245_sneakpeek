import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Add a rating for a sneaker
 */
export const addRating = mutation({
  args: {
    sneakerId: v.id("sneakers"),
    comment: v.string(),
    ratingDesign: v.number(),
    ratingComfort: v.number(),
    ratingQuality: v.number(),
    ratingValue: v.number(),
    sizing: v.number(), // -2 (too small) to +2 (too large), 0 = perfect
  },
  returns: v.id("ratings"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user document from the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found in database");
    }

    // Verify the sneaker exists
    const sneaker = await ctx.db.get(args.sneakerId);
    if (!sneaker) {
      throw new Error("Sneaker not found");
    }

    // Validate ratings are between 1 and 5
    if (
      args.ratingDesign < 1 ||
      args.ratingDesign > 5 ||
      args.ratingComfort < 1 ||
      args.ratingComfort > 5 ||
      args.ratingQuality < 1 ||
      args.ratingQuality > 5 ||
      args.ratingValue < 1 ||
      args.ratingValue > 5
    ) {
      throw new Error("Ratings must be between 1 and 5");
    }

    // Validate sizing is between -2 and 2
    if (args.sizing < -2 || args.sizing > 2) {
      throw new Error("Sizing must be between -2 and 2");
    }

    const ratingId = await ctx.db.insert("ratings", {
      sneakerId: args.sneakerId,
      creatorId: user._id,
      comment: args.comment,
      ratingDesign: args.ratingDesign,
      ratingComfort: args.ratingComfort,
      ratingQuality: args.ratingQuality,
      ratingValue: args.ratingValue,
      sizing: args.sizing,
      createdAt: Date.now(),
    });

    return ratingId;
  },
});

/**
 * Get all ratings for a specific sneaker
 */
export const getRatingsForSneaker = query({
  args: {
    sneakerId: v.id("sneakers"),
  },
  returns: v.array(
    v.object({
      _id: v.id("ratings"),
      sneakerId: v.id("sneakers"),
      creatorId: v.id("users"),
      comment: v.string(),
      ratingDesign: v.number(),
      ratingComfort: v.number(),
      ratingQuality: v.number(),
      ratingValue: v.number(),
      sizing: v.number(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const ratings = await ctx.db
      .query("ratings")
      .withIndex("by_sneaker", (q) => q.eq("sneakerId", args.sneakerId))
      .order("desc")
      .collect();

    return ratings;
  },
});

/**
 * Get all ratings created by the current user
 */
export const getMyRatings = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("ratings"),
      sneakerId: v.id("sneakers"),
      creatorId: v.id("users"),
      comment: v.string(),
      ratingDesign: v.number(),
      ratingComfort: v.number(),
      ratingQuality: v.number(),
      ratingValue: v.number(),
      sizing: v.number(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get the user document to use their _id
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!user) {
      return [];
    }

    const ratings = await ctx.db
      .query("ratings")
      .withIndex("by_creator", (q) => q.eq("creatorId", user._id))
      .order("desc")
      .collect();

    return ratings;
  },
});

/**
 * Delete a rating (only the creator can delete their own rating)
 */
export const deleteRating = mutation({
  args: {
    ratingId: v.id("ratings"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const rating = await ctx.db.get(args.ratingId);
    if (!rating) {
      throw new Error("Rating not found");
    }

    // Only the creator can delete their own rating
    if (rating.creatorId !== user._id) {
      throw new Error("Not authorized to delete this rating");
    }

    await ctx.db.delete(args.ratingId);

    return null;
  },
});
