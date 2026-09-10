/**
 * Social Features Service
 * KIRO: Complete social features integration
 * Handles: Follow/Unfollow, Search, Recommendations, User Discovery
 */

import apiClient from "../axios";
import { ApiResponse } from "../types";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  bio?: string;
  followers: number;
  following: number;
  reels: number;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
  verified?: boolean;
}

export interface SearchResult {
  users: UserProfile[];
  reels: any[];
  competitions: any[];
}

export interface UserRecommendation extends UserProfile {
  mutualFollowers?: number;
  reason?: string;
}

/**
 * Follow user
 * KIRO: Follow another user
 */
export async function followUser(userId: string): Promise<ApiResponse<{ status: string }>> {
  try {
    console.log("[socialFeaturesService] Following user:", userId);

    const response = await apiClient.post<any>(`follow/${userId}`);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      return {
        success: true,
        data: { status: "followed" },
        message: responseData.message || "User followed successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to follow user",
      error: "API returned unsuccessful response",
      data: { status: "failed" },
    };
  } catch (error: any) {
    console.error("[socialFeaturesService] Follow error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to follow user",
      error: error.message,
      data: { status: "error" },
    };
  }
}

/**
 * Unfollow user
 * KIRO: Unfollow another user
 */
export async function unfollowUser(userId: string): Promise<ApiResponse<{ status: string }>> {
  try {
    console.log("[socialFeaturesService] Unfollowing user:", userId);

    const response = await apiClient.post<any>(`unfollow/${userId}`);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      return {
        success: true,
        data: { status: "unfollowed" },
        message: responseData.message || "User unfollowed successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to unfollow user",
      error: "API returned unsuccessful response",
      data: { status: "failed" },
    };
  } catch (error: any) {
    console.error("[socialFeaturesService] Unfollow error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to unfollow user",
      error: error.message,
      data: { status: "error" },
    };
  }
}

/**
 * Get followers
 * KIRO: Fetch user's followers list
 */
export async function getFollowers(
  userId?: string,
  limit: number = 20,
  offset: number = 0
): Promise<ApiResponse<UserProfile[]>> {
  try {
    console.log("[socialFeaturesService] Fetching followers");

    const endpoint = userId ? `user/${userId}/followers` : "user/followers";
    const response = await apiClient.get<any>(endpoint, {
      params: { limit, offset },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && Array.isArray(responseData.data)) {
      return {
        success: true,
        data: responseData.data,
        message: "Followers fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to fetch followers",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[socialFeaturesService] Get followers error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to fetch followers",
      error: error.message,
      data: [],
    };
  }
}

/**
 * Get following
 * KIRO: Fetch users that current user is following
 */
export async function getFollowing(
  userId?: string,
  limit: number = 20,
  offset: number = 0
): Promise<ApiResponse<UserProfile[]>> {
  try {
    console.log("[socialFeaturesService] Fetching following");

    const endpoint = userId ? `user/${userId}/following` : "user/following";
    const response = await apiClient.get<any>(endpoint, {
      params: { limit, offset },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && Array.isArray(responseData.data)) {
      return {
        success: true,
        data: responseData.data,
        message: "Following fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to fetch following",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[socialFeaturesService] Get following error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to fetch following",
      error: error.message,
      data: [],
    };
  }
}

/**
 * Search users
 * KIRO: Search for users by name or username
 */
export async function searchUsers(
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<ApiResponse<UserProfile[]>> {
  try {
    console.log("[socialFeaturesService] Searching users:", query);

    const response = await apiClient.get<any>("search/users", {
      params: { q: query, limit, offset },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && Array.isArray(responseData.data)) {
      return {
        success: true,
        data: responseData.data,
        message: "Users found successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "No users found",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[socialFeaturesService] Search users error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to search users",
      error: error.message,
      data: [],
    };
  }
}

/**
 * Search reels
 * KIRO: Search for reels by title, description, or tags
 */
export async function searchReels(
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<ApiResponse<any[]>> {
  try {
    console.log("[socialFeaturesService] Searching reels:", query);

    const response = await apiClient.get<any>("search/reels", {
      params: { q: query, limit, offset },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && Array.isArray(responseData.data)) {
      return {
        success: true,
        data: responseData.data,
        message: "Reels found successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "No reels found",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[socialFeaturesService] Search reels error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to search reels",
      error: error.message,
      data: [],
    };
  }
}

/**
 * Global search
 * KIRO: Search across users, reels, and competitions
 */
export async function globalSearch(
  query: string,
  limit: number = 10
): Promise<ApiResponse<SearchResult>> {
  try {
    console.log("[socialFeaturesService] Global search:", query);

    const response = await apiClient.get<any>("search", {
      params: { q: query, limit },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: {
          users: responseData.data.users || [],
          reels: responseData.data.reels || [],
          competitions: responseData.data.competitions || [],
        },
        message: "Search results fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Search failed",
      error: "API returned unsuccessful response",
      data: { users: [], reels: [], competitions: [] },
    };
  } catch (error: any) {
    console.error("[socialFeaturesService] Global search error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to perform search",
      error: error.message,
      data: { users: [], reels: [], competitions: [] },
    };
  }
}

/**
 * Get user recommendations
 * KIRO: Get recommended users to follow
 */
export async function getUserRecommendations(
  limit: number = 10
): Promise<ApiResponse<UserRecommendation[]>> {
  try {
    console.log("[socialFeaturesService] Fetching user recommendations");

    const response = await apiClient.get<any>("user/recommendations", {
      params: { limit },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && Array.isArray(responseData.data)) {
      return {
        success: true,
        data: responseData.data,
        message: "Recommendations fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to fetch recommendations",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[socialFeaturesService] Get recommendations error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to fetch recommendations",
      error: error.message,
      data: [],
    };
  }
}

/**
 * Get trending users
 * KIRO: Get trending/popular users
 */
export async function getTrendingUsers(limit: number = 10): Promise<ApiResponse<UserProfile[]>> {
  try {
    console.log("[socialFeaturesService] Fetching trending users");

    const response = await apiClient.get<any>("user/trending", {
      params: { limit },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && Array.isArray(responseData.data)) {
      return {
        success: true,
        data: responseData.data,
        message: "Trending users fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to fetch trending users",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[socialFeaturesService] Get trending error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to fetch trending users",
      error: error.message,
      data: [],
    };
  }
}

/**
 * Get user profile
 * KIRO: Fetch detailed user profile
 */
export async function getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
  try {
    console.log("[socialFeaturesService] Fetching user profile:", userId);

    const response = await apiClient.get<any>(`user/${userId}`);
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: responseData.data,
        message: "Profile fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to fetch profile",
      error: "API returned unsuccessful response",
      data: {} as UserProfile,
    };
  } catch (error: any) {
    console.error("[socialFeaturesService] Get profile error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to fetch user profile",
      error: error.message,
      data: {} as UserProfile,
    };
  }
}
