




import apiClient from "../axios";
import { ApiResponse } from "../types";
import API_ENDPOINTS, { replaceParams } from "../endpoints";

export interface ThumbnailResponse {
  reelId: string;
  thumbnailUrl: string;
  coverImage?: string;
  success: boolean;
}





export async function generateVideoThumbnail(
  reelId: string,
  timestamp?: number 
): Promise<ApiResponse<ThumbnailResponse>> {
  try {
    console.log("[videoThumbnailService] Requesting thumbnail generation for:", reelId);

    const response = await apiClient.post<any>(
      `/reels/${reelId}/generate-thumbnail`,
      {
        timestamp: timestamp || 0,
      }
    );

    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: responseData.data,
        message: responseData.message || "Thumbnail generated successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to generate thumbnail",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[videoThumbnailService] Thumbnail generation error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: undefined,
    };
  }
}




export async function uploadCustomThumbnail(
  reelId: string,
  formData: FormData
): Promise<ApiResponse<ThumbnailResponse>> {
  try {
    console.log("[videoThumbnailService] Uploading custom thumbnail for:", reelId);

    const response = await apiClient.post<any>(
      `/reels/${reelId}/upload-thumbnail`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: responseData.data,
        message: responseData.message || "Thumbnail uploaded successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to upload thumbnail",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[videoThumbnailService] Custom thumbnail upload error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: undefined,
    };
  }
}




export async function getReelThumbnailUrl(
  reelId: string
): Promise<ApiResponse<{ thumbnailUrl: string }>> {
  try {
    console.log("[videoThumbnailService] Fetching thumbnail for:", reelId);

    const response = await apiClient.get<any>(`/reels/${reelId}/thumbnail`);
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: responseData.data,
        message: responseData.message || "Thumbnail retrieved successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to fetch thumbnail",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[videoThumbnailService] Fetch thumbnail error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: undefined,
    };
  }
}




export async function batchFetchThumbnails(
  reelIds: string[]
): Promise<ApiResponse<ThumbnailResponse[]>> {
  try {
    console.log("[videoThumbnailService] Batch fetching thumbnails for:", reelIds.length, "reels");

    const response = await apiClient.post<any>("/reels/batch-thumbnails", {
      reelIds,
    });

    const responseData = response.data as any;

    if (responseData.code === 1 && Array.isArray(responseData.data)) {
      return {
        success: true,
        data: responseData.data,
        message: responseData.message || "Thumbnails fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to fetch thumbnails",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[videoThumbnailService] Batch fetch error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: undefined,
    };
  }
}

export const videoThumbnailService = {
  generateVideoThumbnail,
  uploadCustomThumbnail,
  getReelThumbnailUrl,
  batchFetchThumbnails,
};
