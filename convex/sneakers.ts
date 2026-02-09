import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const addSneaker = mutation({
  args: {
    name: v.string(),
    brand: v.string(),
    description: v.string(),
    imageStorageId: v.id("_storage"),
  },
  returns: v.id("sneakers"),
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

    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) {
      throw new Error("Image upload failed");
    }

    const sneakerId = await ctx.db.insert("sneakers", {
      name: args.name,
      brand: args.brand,
      description: args.description,
      imageUrl,
      imageStorageId: args.imageStorageId,
      creatorId: user._id,
      createdAt: Date.now(),
    });

    return sneakerId;
  },
});

export const listSneakers = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("sneakers"),
      name: v.string(),
      brand: v.string(),
      description: v.string(),
      imageUrl: v.string(),
      creatorId: v.id("users"),
      createdAt: v.number(),
      avgRating: v.number(),
      ratingsCount: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const sneakers = await ctx.db.query("sneakers").order("desc").collect();

    const sneakersWithRatings = await Promise.all(
      sneakers.map(async (sneaker) => {
        // Get all ratings for this sneaker
        const ratings = await ctx.db
          .query("ratings")
          .withIndex("by_sneaker", (q) => q.eq("sneakerId", sneaker._id))
          .collect();

        // Calculate average rating from the 4 criteria (excluding sizing)
        let avgRating = 0;
        if (ratings.length > 0) {
          const totalRating = ratings.reduce((sum, rating) => {
            const ratingAvg =
              (rating.ratingDesign + rating.ratingComfort + rating.ratingQuality + rating.ratingValue) / 4;
            return sum + ratingAvg;
          }, 0);
          avgRating = totalRating / ratings.length;
        }

        return {
          _id: sneaker._id,
          name: sneaker.name,
          brand: sneaker.brand || "Unbekannt",
          description: sneaker.description,
          imageUrl: sneaker.imageUrl,
          creatorId: sneaker.creatorId,
          createdAt: sneaker.createdAt,
          avgRating,
          ratingsCount: ratings.length,
        };
      }),
    );

    return sneakersWithRatings;
  },
});

export const getMySneakers = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("sneakers"),
      name: v.string(),
      brand: v.string(),
      description: v.string(),
      imageUrl: v.string(),
      creatorId: v.id("users"),
      createdAt: v.number(),
      avgRating: v.number(),
      ratingsCount: v.number(),
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

    const sneakers = await ctx.db
      .query("sneakers")
      .withIndex("by_creator", (q) => q.eq("creatorId", user._id))
      .order("desc")
      .collect();

    const sneakersWithRatings = await Promise.all(
      sneakers.map(async (sneaker) => {
        // Get all ratings for this sneaker
        const ratings = await ctx.db
          .query("ratings")
          .withIndex("by_sneaker", (q) => q.eq("sneakerId", sneaker._id))
          .collect();

        // Calculate average rating from the 4 criteria (excluding sizing)
        let avgRating = 0;
        if (ratings.length > 0) {
          const totalRating = ratings.reduce((sum, rating) => {
            const ratingAvg =
              (rating.ratingDesign + rating.ratingComfort + rating.ratingQuality + rating.ratingValue) / 4;
            return sum + ratingAvg;
          }, 0);
          avgRating = totalRating / ratings.length;
        }

        return {
          _id: sneaker._id,
          name: sneaker.name,
          brand: sneaker.brand || "Unbekannt",
          description: sneaker.description,
          imageUrl: sneaker.imageUrl,
          creatorId: sneaker.creatorId,
          createdAt: sneaker.createdAt,
          avgRating,
          ratingsCount: ratings.length,
        };
      }),
    );

    return sneakersWithRatings;
  },
});
