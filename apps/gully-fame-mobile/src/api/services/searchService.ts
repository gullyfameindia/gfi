


import apiClient from "../axios";
import { ApiResponse } from "../types";

export interface SearchUser {
  _id: string;
  id?: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  followerCount?: number;
  isFollowing?: boolean;
}

export interface SearchReel {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: string;
  likes?: number;
  views?: number;
  creatorName?: string;
  creatorAvatar?: string;
}

export interface SearchCompetition {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  image?: string;
  status: "active" | "upcoming" | "ended";
  participantCount?: number;
  prizePool?: number;
}

export interface SearchHashtag {
  tag: string;
  count: number;
  trending?: boolean;
}

export interface SearchResults {
  users?: SearchUser[];
  reels?: SearchReel[];
  competitions?: SearchCompetition[];
  hashtags?: SearchHashtag[];
  total?: number;
}


export async function searchUsers(
  query: string,
  params?: { page?: number; limit?: number }
): Promise<ApiResponse<SearchUser[]>> {
  try {
    console.log("[searchService] Searching users:", { query, params });

    
    const response = await apiClient.get<any>("search", {
      params: { q: query, type: 'users', ...params },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      let users: SearchUser[] = [];

      if (Array.isArray(responseData.data)) {
        users = responseData.data;
      } else if (Array.isArray(responseData.data.items)) {
        users = responseData.data.items;
      } else if (Array.isArray(responseData.data.users)) {
        users = responseData.data.users;
      }

      console.log("[searchService] Users found:", users.length);

      return {
        success: true,
        data: users,
        message: responseData.message || "Users found successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "No users found",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[searchService] Search users error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message,
      data: [],
    };
  }
}


export async function searchReels(
  query: string,
  params?: { page?: number; limit?: number }
): Promise<ApiResponse<SearchReel[]>> {
  try {
    console.log("[searchService] Searching reels:", { query, params });

    
    const response = await apiClient.get<any>("search", {
      params: { q: query, type: 'reels', ...params },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      let reels: SearchReel[] = [];

      if (Array.isArray(responseData.data)) {
        reels = responseData.data;
      } else if (Array.isArray(responseData.data.items)) {
        reels = responseData.data.items;
      } else if (Array.isArray(responseData.data.reels)) {
        reels = responseData.data.reels;
      }

      console.log("[searchService] Reels found:", reels.length);

      return {
        success: true,
        data: reels,
        message: responseData.message || "Reels found successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "No reels found",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[searchService] Search reels error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message,
      data: [],
    };
  }
}


export async function searchCompetitions(
  query: string,
  params?: { page?: number; limit?: number }
): Promise<ApiResponse<SearchCompetition[]>> {
  try {
    console.log("[searchService] Searching competitions:", { query, params });

    
    const response = await apiClient.get<any>("search", {
      params: { q: query, type: 'competitions', ...params },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      let competitions: SearchCompetition[] = [];

      if (Array.isArray(responseData.data)) {
        competitions = responseData.data;
      } else if (Array.isArray(responseData.data.items)) {
        competitions = responseData.data.items;
      } else if (Array.isArray(responseData.data.competitions)) {
        competitions = responseData.data.competitions;
      }

      console.log("[searchService] Competitions found:", competitions.length);

      return {
        success: true,
        data: competitions,
        message: responseData.message || "Competitions found successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "No competitions found",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[searchService] Search competitions error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message,
      data: [],
    };
  }
}


export async function searchHashtags(
  query: string,
  params?: { limit?: number }
): Promise<ApiResponse<SearchHashtag[]>> {
  try {
    console.log("[searchService] Searching hashtags:", { query, params });

    const response = await apiClient.get<any>("search/hashtags", {
      params: { q: query, ...params },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      let hashtags: SearchHashtag[] = [];

      if (Array.isArray(responseData.data)) {
        hashtags = responseData.data;
      } else if (Array.isArray(responseData.data.items)) {
        hashtags = responseData.data.items;
      } else if (Array.isArray(responseData.data.hashtags)) {
        hashtags = responseData.data.hashtags;
      }

      console.log("[searchService] Hashtags found:", hashtags.length);

      return {
        success: true,
        data: hashtags,
        message: responseData.message || "Hashtags found successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "No hashtags found",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[searchService] Search hashtags error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message,
      data: [],
    };
  }
}


export async function globalSearch(
  query: string,
  params?: { page?: number; limit?: number; type?: string }
): Promise<ApiResponse<SearchResults>> {
  try {
    const searchType = params?.type || 'all';
    console.log("[searchService] Global search:", { query, searchType });

    
    const response = await apiClient.get<any>("search", {
      params: { q: query, type: searchType, ...params },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const results: SearchResults = {
        users: responseData.data.users || [],
        reels: responseData.data.reels || [],
        competitions: responseData.data.competitions || [],
        hashtags: responseData.data.hashtags || [],
        total: responseData.data.total || 0,
      };

      console.log("[searchService] Global search results:", results.total);

      return {
        success: true,
        data: results,
        message: responseData.message || "Search results retrieved successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "No results found",
      error: "API returned unsuccessful response",
      data: { users: [], reels: [], competitions: [], hashtags: [], total: 0 },
    };
  } catch (error: any) {
    console.error("[searchService] Global search error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message,
      data: { users: [], reels: [], competitions: [], hashtags: [], total: 0 },
    };
  }
}


export async function getTrendingHashtags(params?: {
  limit?: number;
}): Promise<ApiResponse<SearchHashtag[]>> {
  try {
    console.log("[searchService] Getting trending hashtags:", params);

    const response = await apiClient.get<any>("search/trending-hashtags", { params });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      let hashtags: SearchHashtag[] = [];

      if (Array.isArray(responseData.data)) {
        hashtags = responseData.data;
      } else if (Array.isArray(responseData.data.items)) {
        hashtags = responseData.data.items;
      } else if (Array.isArray(responseData.data.hashtags)) {
        hashtags = responseData.data.hashtags;
      }

      console.log("[searchService] Trending hashtags retrieved:", hashtags.length);

      return {
        success: true,
        data: hashtags,
        message: responseData.message || "Trending hashtags retrieved successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to get trending hashtags",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[searchService] Get trending hashtags error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message,
      data: [],
    };
  }
}


export async function getSearchHistory(): Promise<ApiResponse<string[]>> {
  try {
    console.log("[searchService] Getting search history");

    const response = await apiClient.get<any>("search/history");
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      let history: string[] = [];

      if (Array.isArray(responseData.data)) {
        history = responseData.data;
      } else if (Array.isArray(responseData.data.items)) {
        history = responseData.data.items;
      } else if (Array.isArray(responseData.data.history)) {
        history = responseData.data.history;
      }

      console.log("[searchService] Search history retrieved:", history.length);

      return {
        success: true,
        data: history,
        message: responseData.message || "Search history retrieved successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to get search history",
      error: "API returned unsuccessful response",
      data: [],
    };
  } catch (error: any) {
    console.error("[searchService] Get search history error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message,
      data: [],
    };
  }
}


export async function clearSearchHistory(): Promise<ApiResponse<boolean>> {
  try {
    console.log("[searchService] Clearing search history");

    const response = await apiClient.post<any>("search/history/clear", {});
    const responseData = response.data as any;

    if (responseData.code === 1) {
      console.log("[searchService] Search history cleared");

      return {
        success: true,
        data: true,
        message: responseData.message || "Search history cleared successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to clear search history",
      error: "API returned unsuccessful response",
      data: false,
    };
  } catch (error: any) {
    console.error("[searchService] Clear search history error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message,
      data: false,
    };
  }
}

export const searchService = {
  searchUsers,
  searchReels,
  searchCompetitions,
  searchHashtags,
  globalSearch,
  getTrendingHashtags,
  getSearchHistory,
  clearSearchHistory,
};
