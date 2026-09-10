// Created by Kiro - Hook for real-time follow stats
// Fetches and updates follower/following counts

import { useState, useEffect, useCallback } from "react";
import { followService } from "../api/services/followService";
import { followUpdateEmitter } from "../utils/followEmitter";

export const useFollowStats = (userId: string) => {
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch follow stats
  const fetchFollowStats = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get followers count
      const followersResponse = await followService.getFollowers(userId, {
        page: 1,
        limit: 1, // Just need the count, not all followers
      });

      // Get following count
      const followingResponse = await followService.getFollowing(userId, {
        page: 1,
        limit: 1,
      });

      setStats({
        followers: followersResponse.data?.total || 0,
        following: followingResponse.data?.total || 0,
      });

      console.log("[useFollowStats] Stats fetched:", {
        followers: followersResponse.data?.total,
        following: followingResponse.data?.total,
      });
    } catch (error) {
      console.error("[useFollowStats] Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load stats on mount
  useEffect(() => {
    fetchFollowStats();
  }, [userId, fetchFollowStats]);

  // Listen for real-time updates
  useEffect(() => {
    const unsubscribe = followUpdateEmitter.on((event) => {
      console.log("[useFollowStats] Real-time update received:", event);
      // Refresh stats when follow/unfollow happens
      fetchFollowStats();
    });

    return () => unsubscribe();
  }, [fetchFollowStats]);

  return {
    stats,
    loading,
    refetch: fetchFollowStats,
  };
};
