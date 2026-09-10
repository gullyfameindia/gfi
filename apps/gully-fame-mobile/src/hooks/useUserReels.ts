// Created by Kiro - Hook for fetching user reels
// Fetches user's reels/posts dynamically from API

import { useState, useEffect, useCallback } from "react";
import { reelsService, Reel } from "../api/services/reelsService";

export const useUserReels = (userId: string) => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user reels
  const fetchUserReels = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await reelsService.getUserReels(userId, {
        page: 1,
        limit: 50,
      });

      console.log("[useUserReels] Response from getUserReels:", {
        success: response.success,
        count: response.data?.items?.length,
        total: response.data?.total,
        message: response.message,
      });

      if (response.success && response.data) {
        console.log("[useUserReels] Reels fetched:", response.data.items.length);
        console.log("[useUserReels] Reel IDs:", response.data.items.map((r: any) => r._id || r.id).join(", "));
        setReels(response.data.items);
      } else {
        setError(response.message || "Failed to fetch reels");
        console.error("[useUserReels] Error:", response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch reels";
      setError(errorMessage);
      console.error("[useUserReels] Fetch error:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load reels on mount
  useEffect(() => {
    fetchUserReels();
  }, [userId, fetchUserReels]);

  return {
    reels,
    loading,
    error,
    refetch: fetchUserReels,
  };
};
