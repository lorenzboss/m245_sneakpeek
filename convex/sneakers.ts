import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
    comment: v.string(),
    imageStorageId: v.id("_storage"),
    ratingDesign: v.number(),
    ratingComfort: v.number(),
    ratingQuality: v.number(),
    ratingValue: v.number(),
  },
  returns: v.id("sneakers"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) {
      throw new Error("Image upload failed");
    }

    const sneakerId = await ctx.db.insert("sneakers", {
      name: args.name,
      brand: args.brand,
      comment: args.comment,
      imageUrl,
      imageStorageId: args.imageStorageId,
      userId: identity.subject,
      createdAt: Date.now(),
      ratingDesign: args.ratingDesign,
      ratingComfort: args.ratingComfort,
      ratingQuality: args.ratingQuality,
      ratingValue: args.ratingValue,
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
      comment: v.string(),
      imageUrl: v.string(),
      userId: v.string(),
      createdAt: v.number(),
      ratingDesign: v.number(),
      ratingComfort: v.number(),
      ratingQuality: v.number(),
      ratingValue: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const sneakers = await ctx.db.query("sneakers").order("desc").collect();
    return sneakers.map((sneaker) => ({
      _id: sneaker._id,
      name: sneaker.name,
      brand: sneaker.brand || "Unbekannt",
      comment: sneaker.comment,
      imageUrl: sneaker.imageUrl,
      userId: sneaker.userId,
      createdAt: sneaker.createdAt,
      ratingDesign: sneaker.ratingDesign || 0,
      ratingComfort: sneaker.ratingComfort || 0,
      ratingQuality: sneaker.ratingQuality || 0,
      ratingValue: sneaker.ratingValue || 0,
    }));
  },
});

export const getMySneakers = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("sneakers"),
      name: v.string(),
      brand: v.string(),
      comment: v.string(),
      imageUrl: v.string(),
      userId: v.string(),
      createdAt: v.number(),
      ratingDesign: v.number(),
      ratingComfort: v.number(),
      ratingQuality: v.number(),
      ratingValue: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const sneakers = await ctx.db
      .query("sneakers")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return sneakers.map((sneaker) => ({
      _id: sneaker._id,
      name: sneaker.name,
      brand: sneaker.brand || "Unbekannt",
      comment: sneaker.comment,
      imageUrl: sneaker.imageUrl,
      userId: sneaker.userId,
      createdAt: sneaker.createdAt,
      ratingDesign: sneaker.ratingDesign || 0,
      ratingComfort: sneaker.ratingComfort || 0,
      ratingQuality: sneaker.ratingQuality || 0,
      ratingValue: sneaker.ratingValue || 0,
    }));
  },
});
