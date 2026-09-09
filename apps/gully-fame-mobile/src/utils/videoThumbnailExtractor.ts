





import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as VideoThumbnails from "expo-video-thumbnails";

export interface ThumbnailResult {
  success: boolean;
  uri?: string;
  error?: string;
}





export async function extractVideoThumbnail(
  videoUri: string,
  options?: {
    timestamp?: number; 
    width?: number;
    height?: number;
  }
): Promise<ThumbnailResult> {
  try {
    const { timestamp = 0 } = options || {};

    console.log("[videoThumbnailExtractor] Extracting thumbnail from:", videoUri);

    
    const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      {
        time: timestamp,
        width: options?.width || 300,
        height: options?.height || 400,
      }
    );

    console.log("[videoThumbnailExtractor] Thumbnail extracted:", thumbnailUri);

    return {
      success: true,
      uri: thumbnailUri,
    };
  } catch (error: any) {
    console.error("[videoThumbnailExtractor] Extraction failed:", error.message);
    return {
      success: false,
      error: error.message || "Failed to extract thumbnail",
    };
  }
}





export async function generateAndCacheThumbnail(
  videoUri: string,
  videoId: string
): Promise<ThumbnailResult> {
  try {
    const cacheDir = `${FileSystem.cacheDirectory}video-thumbnails/`;
    const thumbnailPath = `${cacheDir}${videoId}.jpg`;

    
    const cacheExists = await FileSystem.getInfoAsync(thumbnailPath);
    if (cacheExists.exists) {
      console.log("[videoThumbnailExtractor] Using cached thumbnail for:", videoId);
      return {
        success: true,
        uri: thumbnailPath,
      };
    }

    
    const dirExists = await FileSystem.getInfoAsync(cacheDir);
    if (!dirExists.exists) {
      await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
    }

    
    const { uri: tempThumbnailUri } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      {
        time: 0, 
        width: 300,
        height: 400,
      }
    );

    
    await FileSystem.copyAsync({
      from: tempThumbnailUri,
      to: thumbnailPath,
    });

    console.log("[videoThumbnailExtractor] Thumbnail cached for:", videoId);

    return {
      success: true,
      uri: thumbnailPath,
    };
  } catch (error: any) {
    console.error("[videoThumbnailExtractor] Caching failed:", error.message);
    return {
      success: false,
      error: error.message || "Failed to cache thumbnail",
    };
  }
}





export function getFallbackThumbnailColor(index: number): string {
  const colors = ["#1a1410", "#2d2420", "#3d3530", "#4a4541"];
  return colors[index % colors.length];
}





export async function extractMultipleThumbnails(
  videoUris: Array<{ uri: string; id: string }>,
  maxConcurrent: number = 3
): Promise<ThumbnailResult[]> {
  try {
    const results: ThumbnailResult[] = [];
    
    
    for (let i = 0; i < videoUris.length; i += maxConcurrent) {
      const batch = videoUris.slice(i, i + maxConcurrent);
      const batchResults = await Promise.all(
        batch.map((video) => generateAndCacheThumbnail(video.uri, video.id))
      );
      results.push(...batchResults);
    }

    return results;
  } catch (error: any) {
    console.error("[videoThumbnailExtractor] Batch extraction failed:", error.message);
    return [];
  }
}

export const videoThumbnailExtractor = {
  extractVideoThumbnail,
  generateAndCacheThumbnail,
  extractMultipleThumbnails,
  getFallbackThumbnailColor,
};
