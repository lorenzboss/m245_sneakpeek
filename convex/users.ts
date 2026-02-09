import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const existing = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .first();

    if (!existing) {
      const userId = await ctx.db.insert('users', {
        userId: identity.subject,
        email: '',
        name: undefined,
      });
      console.log('Created new user:', userId, 'subject:', identity.subject);
    } else {
      console.log('User already exists:', existing._id);
    }
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .first();
  },
});

export const updateUserDetails = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();

    if (!user) {
      await ctx.db.insert('users', {
        userId: args.userId,
        email: args.email,
        name: [args.firstName, args.lastName].filter(Boolean).join(' '),
      });
    } else {
      await ctx.db.patch(user._id, {
        email: args.email,
        name: [args.firstName, args.lastName].filter(Boolean).join(' ') || user.name,
      });
    }
  },
});
