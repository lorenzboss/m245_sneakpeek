"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useAction, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../convex/_generated/api";

/**
 * Automatically syncs authenticated users between WorkOS and Convex.
 * Should be called in the root layout to ensure users exist in Convex DB.
 */
export function useUserSync() {
  const { user, loading } = useAuth();
  const storeUser = useMutation(api.users.storeUser);
  const fetchUserDetails = useAction(api.actions.fetchAndStoreUserDetails);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    storeUser()
      .then(() => fetchUserDetails())
      .catch((error) => {
        console.error("Failed to sync user:", error);
      });
  }, [user, loading, storeUser, fetchUserDetails]);
}
