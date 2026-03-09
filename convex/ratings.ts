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

    // Check if user already has a rating for this sneaker
    const existingRating = await ctx.db
      .query("ratings")
      .withIndex("by_sneaker", (q) => q.eq("sneakerId", args.sneakerId))
      .filter((q) => q.eq(q.field("creatorId"), user._id))
      .first();

    if (existingRating) {
      throw new Error("You have already rated this sneaker. Please edit your existing rating.");
    }

    // Validate ratings are between 1 and 5 and are integers
    if (
      args.ratingDesign < 1 ||
      args.ratingDesign > 5 ||
      args.ratingComfort < 1 ||
      args.ratingComfort > 5 ||
      args.ratingQuality < 1 ||
      args.ratingQuality > 5 ||
      args.ratingValue < 1 ||
      args.ratingValue > 5 ||
      !Number.isInteger(args.ratingDesign) ||
      !Number.isInteger(args.ratingComfort) ||
      !Number.isInteger(args.ratingQuality) ||
      !Number.isInteger(args.ratingValue)
    ) {
      throw new Error("Ratings must be whole numbers between 1 and 5");
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
 * Includes calculated average rating (business logic in backend)
 */
export const getRatingsForSneaker = query({
  args: {
    sneakerId: v.id("sneakers"),
  },
  handler: async (ctx, args) => {
    const ratings = await ctx.db
      .query("ratings")
      .withIndex("by_sneaker", (q) => q.eq("sneakerId", args.sneakerId))
      .order("desc")
      .collect();

    // Enrich ratings with user names and calculated average
    const ratingsWithUserNames = await Promise.all(
      ratings.map(async (rating) => {
        const user = await ctx.db.get(rating.creatorId);
        // Business logic: Calculate average rating from 4 categories
        const avgRating = (rating.ratingDesign + rating.ratingComfort + rating.ratingQuality + rating.ratingValue) / 4;

        return {
          _id: rating._id,
          sneakerId: rating.sneakerId,
          creatorId: rating.creatorId,
          creatorName: user?.name || user?.email || null,
          comment: rating.comment,
          ratingDesign: rating.ratingDesign,
          ratingComfort: rating.ratingComfort,
          ratingQuality: rating.ratingQuality,
          ratingValue: rating.ratingValue,
          avgRating: avgRating,
          sizing: rating.sizing,
          createdAt: rating.createdAt,
        };
      }),
    );

    return ratingsWithUserNames;
  },
});

/**
 * Get the current user's rating for a specific sneaker
 */
export const getMyRatingForSneaker = query({
  args: {
    sneakerId: v.id("sneakers"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    const rating = await ctx.db
      .query("ratings")
      .withIndex("by_sneaker", (q) => q.eq("sneakerId", args.sneakerId))
      .filter((q) => q.eq(q.field("creatorId"), user._id))
      .first();

    if (!rating) {
      return null;
    }

    return {
      _id: rating._id,
      sneakerId: rating.sneakerId,
      comment: rating.comment,
      ratingDesign: rating.ratingDesign,
      ratingComfort: rating.ratingComfort,
      ratingQuality: rating.ratingQuality,
      ratingValue: rating.ratingValue,
      sizing: rating.sizing,
    };
  },
});

/**
 * Update an existing rating
 */
export const updateRating = mutation({
  args: {
    ratingId: v.id("ratings"),
    comment: v.string(),
    ratingDesign: v.number(),
    ratingComfort: v.number(),
    ratingQuality: v.number(),
    ratingValue: v.number(),
    sizing: v.number(),
  },
  returns: v.id("ratings"),
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
      throw new Error("User not found in database");
    }

    const rating = await ctx.db.get(args.ratingId);
    if (!rating) {
      throw new Error("Rating not found");
    }

    // Only the creator can update their own rating
    if (rating.creatorId !== user._id) {
      throw new Error("Not authorized to update this rating");
    }

    // Validate ratings are between 1 and 5 and are integers
    if (
      args.ratingDesign < 1 ||
      args.ratingDesign > 5 ||
      args.ratingComfort < 1 ||
      args.ratingComfort > 5 ||
      args.ratingQuality < 1 ||
      args.ratingQuality > 5 ||
      args.ratingValue < 1 ||
      args.ratingValue > 5 ||
      !Number.isInteger(args.ratingDesign) ||
      !Number.isInteger(args.ratingComfort) ||
      !Number.isInteger(args.ratingQuality) ||
      !Number.isInteger(args.ratingValue)
    ) {
      throw new Error("Ratings must be whole numbers between 1 and 5");
    }

    // Validate sizing is between -2 and 2
    if (args.sizing < -2 || args.sizing > 2) {
      throw new Error("Sizing must be between -2 and 2");
    }

    await ctx.db.patch(args.ratingId, {
      comment: args.comment,
      ratingDesign: args.ratingDesign,
      ratingComfort: args.ratingComfort,
      ratingQuality: args.ratingQuality,
      ratingValue: args.ratingValue,
      sizing: args.sizing,
    });

    return args.ratingId;
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
