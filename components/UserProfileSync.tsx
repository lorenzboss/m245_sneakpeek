"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

export function UserProfileSync() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const syncProfile = useMutation(api.users.syncProfile);

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    syncProfile().catch((error: unknown) => {
      console.error("Failed to sync user profile:", error);
    });
  }, [isAuthenticated, isLoading, syncProfile]);

  return null;
}
