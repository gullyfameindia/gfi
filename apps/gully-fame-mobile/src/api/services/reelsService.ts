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
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface ReelsResponse {
  items: Reel[];
  total?: number;
}

export async function getReelsFeed(params?: any): Promise<ApiResponse<ReelsResponse>> {
  try {
    console.log("[reelsService] GET Reels Feed", params);

    // Try `reels` endpoint first, then `user/homeScreen`
    let responseData: any = null;
    try {
      const response = await apiClient.get<any>("reels", { params: { limit: 10, ...params } });
      responseData = response.data;
    } catch {
      const response = await apiClient.get<any>(API_ENDPOINTS.FEED.GET_HOME_FEED, { params });
      responseData = response.data;
    }

    if (responseData && (responseData.code === 1 || responseData.success)) {
      let reels: Reel[] = [];

      if (Array.isArray(responseData.data)) {
        reels = responseData.data;
      } else if (Array.isArray(responseData.data?.items)) {
        reels = responseData.data.items;
      } else if (Array.isArray(responseData.data?.reels)) {
        reels = responseData.data.reels;
      } else if (Array.isArray(responseData.reels)) {
        reels = responseData.reels;
      }

      return {
        success: true,
        data: { items: reels, total: responseData.data?.total || reels.length },
        message: responseData.message || "Reels fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData?.message || "Failed to fetch reels",
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

export async function performReelAction(
  reelId: string,
  actionType: "like" | "vote" | "save"
): Promise<ApiResponse<any>> {
  try {
    console.log(`[reelsService] ACTION ${actionType} on Reel`, { reelId });

    const endpoint = `reels/${reelId}/action`;
    let response: any;
    try {
      response = await apiClient.post<any>(endpoint, { action_type: actionType });
    } catch {
      // Fallback to legacy endpoint if backend route differs
      const fallbackEndpoint = actionType === "save" ? `reels/${reelId}/save` : `reels/${reelId}/${actionType}`;
      response = await apiClient.post<any>(fallbackEndpoint, {});
    }

    const responseData = response.data as any;

    if (responseData.code === 1 || responseData.success) {
      return {
        success: true,
        data: responseData.data,
        message: responseData.message || `Reel ${actionType} successful`,
      };
    }

    return {
      success: false,
      message: responseData.message || `Failed to ${actionType} reel`,
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error(`[reelsService] ACTION ${actionType} error:`, error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
      data: undefined,
    };
  }
}

export async function likeReel(reelId: string): Promise<ApiResponse<any>> {
  return performReelAction(reelId, "like");
}

export async function unlikeReel(reelId: string): Promise<ApiResponse<any>> {
  return performReelAction(reelId, "like");
}

export async function voteReel(reelId: string): Promise<ApiResponse<any>> {
  return performReelAction(reelId, "vote");
}

export async function saveReel(reelId: string): Promise<ApiResponse<any>> {
  return performReelAction(reelId, "save");
}

export async function tipReel(reelId: string, amount: number, coin?: number): Promise<ApiResponse<any>> {
  try {
    console.log("[reelsService] TIP Reel", { reelId, amount, coin });
    const endpoint = `reels/${reelId}/tip`;
    const response = await apiClient.post<any>(endpoint, { amount, coin });
    const responseData = response.data as any;

    if (responseData.code === 1 || responseData.success) {
      return {
        success: true,
        data: responseData.data,
        message: responseData.message || "Tip sent successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to tip reel",
      error: "API returned unsuccessful response",
    };
  } catch (error: any) {
    console.error("[reelsService] TIP Reel error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message || "Network error",
    };
  }
}

export async function commentReel(reelId: string, comment: string): Promise<ApiResponse<any>> {
  try {
    console.log("[reelsService] COMMENT Reel", { reelId, comment });

    const endpoint = replaceParams(API_ENDPOINTS.REELS.ADD_COMMENT, { id: reelId });
    const response = await apiClient.post<any>(endpoint, { text: comment, comment });
    const responseData = response.data as any;

    if (responseData.code === 1 || responseData.success) {
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

export async function uploadReel(formData: FormData): Promise<ApiResponse<Reel>> {
  try {
    console.log("[reelsService] UPLOAD Reel");

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

    const queryParams = {
      ...params,
      userId,
    };

    const response = await apiClient.get<any>("reels", { params: queryParams });
    const responseData = response.data as any;

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
  voteReel,
  saveReel,
  tipReel,
  commentReel,
  uploadReel,
};

export default reelsService;
