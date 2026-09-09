





import { useEffect, useState, useCallback } from "react";
import { reelsService, Reel } from "@/api/services/reelsService";
import { videoThumbnailService } from "@/api/services/videoThumbnailService";
import { generateAndCacheThumbnail } from "@/utils/videoThumbnailExtractor";

export interface ProfileVideoState {
  reels: Reel[];
  loading: boolean;
  error?: string;
  refreshing: boolean;
}

export function useProfileVideosWithThumbnails(
  userId: string,
  autoGenerateThumbnails: boolean = true
): ProfileVideoState & {
  refetch: () => Promise<void>;
  retry: () => Promise<void>;
} {
  const [state, setState] = useState<ProfileVideoState>({
    reels: [],
    loading: true,
    error: undefined,
    refreshing: false,
  });

  
  const fetchReels = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: undefined }));

      console.log("[useProfileVideosWithThumbnails] Fetching reels for user:", userId);

      const response = await reelsService.getUserReels(userId, {
        page: 1,
        limit: 50,
      });

      if (!response.success || !response.data?.items) {
        throw new Error(response.message || "Failed to fetch reels");
      }

      let reels = response.data.items || [];

      console.log("[useProfileVideosWithThumbnails] Fetched", reels.length, "reels");

      
      if (autoGenerateThumbnails && reels.length > 0) {
        console.log("[useProfileVideosWithThumbnails] Generating thumbnails...");
        reels = await generateThumbnailsForReels(reels);
      }

      setState((prev) => ({
        ...prev,
        reels,
        loading: false,
        error: undefined,
      }));
    } catch (error: any) {
      const errorMessage = error.message || "Failed to load videos";
      console.error("[useProfileVideosWithThumbnails] Error:", errorMessage);

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [userId, autoGenerateThumbnails]);

  
  const generateThumbnailsForReels = useCallback(async (reels: Reel[]): Promise<Reel[]> => {
    try {
      
      const reelIds = reels.map((r) => r._id || r.id).filter(Boolean);

      if (reelIds.length > 0) {
        const batchResponse = await videoThumbnailService.batchFetchThumbnails(reelIds);

        if (batchResponse.success && batchResponse.data) {
          
          const thumbnailMap = new Map(
            (batchResponse.data || []).map((t: any) => [t.reelId, t.thumbnailUrl])
          );

          return reels.map((reel) => ({
            ...reel,
            thumbnail: thumbnailMap.get(reel._id || reel.id) || reel.thumbnail,
          }));
        }
      }

      
      console.log("[useProfileVideosWithThumbnails] Generating thumbnails locally...");
      const reelsWithThumbnails = await Promise.all(
        reels.map(async (reel) => {
          try {
            
            if (reel.thumbnail) return reel;

            const result = await generateAndCacheThumbnail(
              reel.videoUrl,
              reel._id || reel.id
            );

            if (result.success && result.uri) {
              return {
                ...reel,
                thumbnail: result.uri,
              };
            }

            return reel;
          } catch (err: any) {
            console.warn("[useProfileVideosWithThumbnails] Thumbnail generation failed for:", reel._id);
            return reel;
          }
        })
      );

      return reelsWithThumbnails;
    } catch (error: any) {
      console.error("[useProfileVideosWithThumbnails] Thumbnail generation error:", error.message);
      
      return reels;
    }
  }, []);

  
  useEffect(() => {
    if (userId) {
      fetchReels();
    }
  }, [userId, fetchReels]);

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, refreshing: true }));
    await fetchReels();
    setState((prev) => ({ ...prev, refreshing: false }));
  }, [fetchReels]);

  const retry = useCallback(async () => {
    await fetchReels();
  }, [fetchReels]);

  return {
    ...state,
    refetch,
    retry,
  };
}
