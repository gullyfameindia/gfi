


import { useState, useEffect, useCallback } from "react";
import { reelsService, Reel } from "../api/services/reelsService";

export const useUserReels = (userId: string) => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
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
        
        
        console.log("[useUserReels] ===== RAW ITEMS FROM SERVICE =====");
        if (response.data.items.length > 0) {
          const firstReel = response.data.items[0];
          console.log("[useUserReels] First reel keys:", Object.keys(firstReel));
          console.log("[useUserReels] First reel ALL fields:", JSON.stringify(firstReel, null, 2));
        }
        console.log("[useUserReels] =====================================");
        
        
        const validReels = response.data.items.filter((reel: any) => {
          const hasVideoUrl = !!(reel.videoUrl || reel.url);
          return hasVideoUrl; 
        });

        console.log(`[useUserReels] Total reels: ${response.data.items.length}, Valid reels with video URLs: ${validReels.length}`);
        
        
        response.data.items.forEach((reel: any, idx: number) => {
          const hasVideoUrl = !!(reel.videoUrl || reel.url);
          console.log(`[useUserReels] Reel ${idx}:`, {
            _id: reel._id || reel.id,
            title: reel.title,
            hasVideoUrl: hasVideoUrl,
            videoUrl: reel.videoUrl || reel.url ? (reel.videoUrl || reel.url).substring(0, 60) : "❌ MISSING",
            hasThumbnail: !!reel.thumbnail,
            status: hasVideoUrl ? "✅ VALID" : "❌ SKIPPED (no video URL)",
          });
        });
        
        setReels(validReels);
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
