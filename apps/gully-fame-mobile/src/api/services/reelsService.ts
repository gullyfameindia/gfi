

import apiClient from "../axios";
import { ApiResponse } from "../types";
import API_ENDPOINTS, { replaceParams } from "../endpoints";

export interface Reel {
  _id: string;
  id?: string;
  userId: string;
  title?: string;
  description?: string;
  videoUrl: string;
  thumbnail?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface ReelsResponse {
  items: Reel[];
  total?: number;
}

// Get Reels Feed
export async function getReelsFeed(params?: any): Promise<ApiResponse<ReelsResponse>> {
  try {
    console.log("[reelsService] GET Reels Feed");

   
    const response = await apiClient.get<any>(API_ENDPOINTS.FEED.GET_HOME_FEED, { params });
    const responseData = response.data as any;

    console.log("[reelsService] RAW response code:", responseData.code);
    console.log("[reelsService] RAW response data keys:", Object.keys(responseData.data || {}));
    if (Array.isArray(responseData.data)) {
      console.log("[reelsService] data is ARRAY, first item keys:", Object.keys(responseData.data[0] || {}));
      console.log("[reelsService] FIRST REEL SAMPLE:", JSON.stringify(responseData.data[0]));
    } else if (responseData.data) {
      const nested = responseData.data.items || responseData.data.reels || responseData.data;
      if (Array.isArray(nested) && nested.length > 0) {
        console.log("[reelsService] FIRST REEL SAMPLE:", JSON.stringify(nested[0]));
      }
    }

    if (responseData.code === 1 && responseData.data) {
      let reels: Reel[] = [];

      if (Array.isArray(responseData.data)) {
        reels = responseData.data;
      } else if (Array.isArray(responseData.data.items)) {
        reels = responseData.data.items;
      } else if (Array.isArray(responseData.data.reels)) {
        reels = responseData.data.reels;
      }

      return {
        success: true,
        data: { items: reels, total: reels.length },
        message: responseData.message || "Reels fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to fetch reels",
      error: "API returned unsuccessful response",
      data: { items: [], total: 0 },
    };
  } catch (error: any) {
    console.error("[reelsService] GET Reels Feed error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: { items: [], total: 0 },
    };
  }
}

// Get Reel by ID
export async function getReelById(reelId: string): Promise<ApiResponse<Reel>> {
  try {
    console.log("[reelsService] GET Reel By ID", { reelId });

    const endpoint = replaceParams(API_ENDPOINTS.REELS.GET_BY_ID, { id: reelId });
    const response = await apiClient.get<any>(endpoint);
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const reel: Reel = responseData.data.reel || responseData.data;

      return {
        success: true,
        data: reel,
        message: responseData.message || "Reel fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to fetch reel",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[reelsService] GET Reel By ID error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: undefined,
    };
  }
}

// Like Reel
export async function likeReel(reelId: string): Promise<ApiResponse<any>> {
  try {
    console.log("[reelsService] LIKE Reel", { reelId });

    const endpoint = replaceParams(API_ENDPOINTS.REELS.LIKE, { id: reelId });
    const response = await apiClient.post<any>(endpoint, {});
    const responseData = response.data as any;

    if (responseData.code === 1) {
      return {
        success: true,
        data: responseData.data,
        message: responseData.message || "Reel liked successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to like reel",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[reelsService] LIKE Reel error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: undefined,
    };
  }
}

// Unlike Reel
export async function unlikeReel(reelId: string): Promise<ApiResponse<any>> {
  try {
    console.log("[reelsService] UNLIKE Reel", { reelId });

    const endpoint = replaceParams(API_ENDPOINTS.REELS.UNLIKE, { id: reelId });
    const response = await apiClient.post<any>(endpoint, {});
    const responseData = response.data as any;

    if (responseData.code === 1) {
      return {
        success: true,
        data: responseData.data,
        message: responseData.message || "Reel unliked successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to unlike reel",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[reelsService] UNLIKE Reel error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: undefined,
    };
  }
}

// Comment on Reel
export async function commentReel(reelId: string, comment: string): Promise<ApiResponse<any>> {
  try {
    console.log("[reelsService] COMMENT Reel", { reelId, comment });

    const endpoint = replaceParams(API_ENDPOINTS.REELS.ADD_COMMENT, { id: reelId });
    const response = await apiClient.post<any>(endpoint, { comment });
    const responseData = response.data as any;

    if (responseData.code === 1) {
      return {
        success: true,
        data: responseData.data,
        message: responseData.message || "Comment added successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to add comment",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[reelsService] COMMENT Reel error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: undefined,
    };
  }
}

// Upload Reel
export async function uploadReel(formData: FormData): Promise<ApiResponse<Reel>> {
  try {
    console.log("[reelsService] UPLOAD Reel");

    // Use GET_UPLOAD_URL endpoint (presigned URL flow)
    const response = await apiClient.post<any>(API_ENDPOINTS.REELS.GET_UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const reel: Reel = responseData.data.reel || responseData.data;

      return {
        success: true,
        data: reel,
        message: responseData.message || "Reel uploaded successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to upload reel",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[reelsService] UPLOAD Reel error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: undefined,
    };
  }
}


export async function getUserReels(
  userId: string,
  params?: { page?: number; limit?: number }
): Promise<ApiResponse<ReelsResponse>> {
  try {
    console.log("[reelsService] GET User Reels", { userId, params });

    // Use the USER.GET_REELS endpoint which is "user/reels"
    // This gets the logged-in user's reels, not someone else's
    const endpoint = API_ENDPOINTS.USER.GET_REELS;
    console.log("[reelsService] Using endpoint:", endpoint);
    
    const response = await apiClient.get<any>(endpoint, { params });
    const responseData = response.data as any;

    console.log("[reelsService] Response code:", responseData.code);
    console.log("[reelsService] Response data keys:", Object.keys(responseData.data || {}));

    if (responseData.code === 1 && responseData.data) {
      let reels: Reel[] = [];

      if (Array.isArray(responseData.data)) {
        reels = responseData.data;
      } else if (Array.isArray(responseData.data.items)) {
        reels = responseData.data.items;
      } else if (Array.isArray(responseData.data.reels)) {
        reels = responseData.data.reels;
      }

      console.log("[reelsService] Reels found:", reels.length);
      reels.forEach((reel: any) => {
        console.log("[reelsService]   - Reel ID:", reel._id || reel.id, "- Status:", reel.status || reel.published);
      });

      return {
        success: true,
        data: { items: reels, total: responseData.data.total || reels.length },
        message: responseData.message || "User reels fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to fetch user reels",
      error: "API returned unsuccessful response",
      data: { items: [], total: 0 },
    };
  } catch (error: any) {
    console.error("[reelsService] GET User Reels error:", error.message);
    console.error("[reelsService] Error details:", error.response?.data || error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: { items: [], total: 0 },
    };
  }
}

export const reelsService = {
  getReelsFeed,
  getReelById,
  getUserReels,
  likeReel,
  unlikeReel,
  commentReel,
  uploadReel,
};
