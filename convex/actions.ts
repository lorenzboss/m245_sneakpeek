import { WorkOS } from "@workos-inc/node";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

/**
 * Fetches user details from WorkOS API and stores them in Convex.
 * Requires WORKOS_API_KEY to be set in Convex Dashboard.
 */
export const fetchAndStoreUserDetails = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    try {
      const apiKey = process.env.WORKOS_API_KEY;
      if (!apiKey) {
        console.warn("WORKOS_API_KEY not set - skipping user details fetch");
        return;
      }

      const workos = new WorkOS(apiKey);
      const user = await workos.userManagement.getUser(identity.subject);

      console.log("Fetched user details from WorkOS:", user.email);

      await ctx.runMutation(api.users.updateUserDetails, {
        userId: identity.subject,
        email: user.email,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
      });

      console.log("Successfully updated user details in Convex");
    } catch (error) {
      console.error("Failed to fetch user details from WorkOS:", error);
    }
  },
});
