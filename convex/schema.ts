import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  sneakers: defineTable({
    name: v.string(),
    brand: v.optional(v.string()),
    comment: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id('_storage'),
    userId: v.string(),
    createdAt: v.number(),
    // Ratings 1-5
    ratingDesign: v.optional(v.number()),
    ratingComfort: v.optional(v.number()),
    ratingQuality: v.optional(v.number()),
    ratingValue: v.optional(v.number()),
  }).index('by_user', ['userId']),
});
