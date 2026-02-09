import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  sneakers: defineTable({
    name: v.string(),
    brand: v.optional(v.string()),
    comment: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    userId: v.string(),
    createdAt: v.number(),
    // Ratings 1-5
    ratingDesign: v.optional(v.number()),
    ratingComfort: v.optional(v.number()),
    ratingQuality: v.optional(v.number()),
    ratingValue: v.optional(v.number()),
  }).index("by_user", ["userId"]),
});
