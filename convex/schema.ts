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
    description: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    creatorId: v.id("users"),
    createdAt: v.number(),
  }).index("by_creator", ["creatorId"]),

  ratings: defineTable({
    sneakerId: v.id("sneakers"),
    creatorId: v.id("users"),
    comment: v.string(),
    ratingDesign: v.number(),
    ratingComfort: v.number(),
    ratingQuality: v.number(),
    ratingValue: v.number(),
    sizing: v.number(), // -2 (too small) to +2 (too large), 0 = perfect
    createdAt: v.number(),
  })
    .index("by_sneaker", ["sneakerId"])
    .index("by_creator", ["creatorId"]),
});
