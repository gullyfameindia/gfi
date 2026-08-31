/**
 * Feed Service
 * Handles home feed, trending content, and reel management
 * Connects to backend with mock data fallback for development
 */

import apiClient from "../axios";
import { ApiResponse } from "../types";
import API_ENDPOINTS, { replaceParams } from "../endpoints";
import * as mockReels from "../../mockData/reels";
import * as mockCategories from "../../mockData/categories";

export interface Reel {
  id: string;
  title: string;
  description?: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    isVerified?: boolean;
    followers?: number;
  };
  thumbnail?: string;
  videoUrl?: string;
  duration: number;
  category: string;
  tags?: string[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  createdAt: string;
  musicTrack?: {
    id: string;
    title: string;
    artist: string;
  };
  competition?: {
    id: string;
    title: string;
    prizePool?: number;
  };
  isTrending?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface FeedResponse {
  page: number;
  limit: number;
  total: number;
  reels: Reel[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  emoji?: string;
  color?: string;
  reelCount?: number;
  isTrending?: boolean;
}

export interface Collection {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  itemCount: number;
  featured: boolean;
}

// ─────────────────────────────────────────────
// Trending Reels
// ─────────────────────────────────────────────

/**
 * Fetch trending reels for home screen
 * Shows most viewed and engaged content
 */
export async function getTrendingReels(
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<FeedResponse>> {
  try {
    console.log("[feedService] Fetching trending reels:", { page, limit });

    const response = await apiClient.get<any>(API_ENDPOINTS.FEED.GET_TRENDING, {
      params: { page, limit },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const raw = responseData.data;
      const reels = Array.isArray(raw) ? raw : raw.reels || raw.data || [];

      const feedResponse: FeedResponse = {
        page: raw.page ?? page,
        limit: raw.limit ?? limit,
        total: raw.total ?? reels.length,
        reels: reels.map((r) => normalizeReel(r)),
      };

      console.log(`[feedService] Loaded ${feedResponse.reels.length} trending reels from API`);

      return {
        success: true,
        data: feedResponse,
        message: responseData.message || "Trending reels loaded successfully",
      };
    }

    // Fall back to mock data
    console.warn("[feedService] API returned error for trending reels, using mock data");
    return _getMockTrendingReels(page, limit);
  } catch (error: any) {
    console.warn("[feedService] Failed to fetch trending reels, falling back to mock data:", error.message);
    return _getMockTrendingReels(page, limit);
  }
}

// ─────────────────────────────────────────────
// For You (Personalized Feed)
// ─────────────────────────────────────────────

/**
 * Fetch personalized "For You" feed
 * Shows content tailored to user preferences
 */
export async function getForYouReels(
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<FeedResponse>> {
  try {
    console.log("[feedService] Fetching For You feed:", { page, limit });

    const response = await apiClient.get<any>(API_ENDPOINTS.FEED.GET_FOLLOWING_FEED, {
      params: { page, limit },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const raw = responseData.data;
      const reels = Array.isArray(raw) ? raw : raw.reels || raw.data || [];

      const feedResponse: FeedResponse = {
        page: raw.page ?? page,
        limit: raw.limit ?? limit,
        total: raw.total ?? reels.length,
        reels: reels.map((r) => normalizeReel(r)),
      };

      console.log(`[feedService] Loaded ${feedResponse.reels.length} For You reels from API`);

      return {
        success: true,
        data: feedResponse,
        message: responseData.message || "For You feed loaded successfully",
      };
    }

    // Fall back to mock data
    console.warn("[feedService] API returned error for For You feed, using mock data");
    return _getMockForYouReels(page, limit);
  } catch (error: any) {
    console.warn("[feedService] Failed to fetch For You feed, falling back to mock data:", error.message);
    return _getMockForYouReels(page, limit);
  }
}

// ─────────────────────────────────────────────
// Popular Reels
// ─────────────────────────────────────────────

/**
 * Fetch popular reels with highest engagement
 */
export async function getPopularReels(
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<FeedResponse>> {
  try {
    console.log("[feedService] Fetching popular reels:", { page, limit });

    const response = await apiClient.get<any>("public/feed/popular", {
      params: { page, limit },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const raw = responseData.data;
      const reels = Array.isArray(raw) ? raw : raw.reels || raw.data || [];

      const feedResponse: FeedResponse = {
        page: raw.page ?? page,
        limit: raw.limit ?? limit,
        total: raw.total ?? reels.length,
        reels: reels.map((r) => normalizeReel(r)),
      };

      console.log(`[feedService] Loaded ${feedResponse.reels.length} popular reels from API`);

      return {
        success: true,
        data: feedResponse,
        message: responseData.message || "Popular reels loaded successfully",
      };
    }

    // Fall back to mock data
    console.warn("[feedService] API returned error for popular reels, using mock data");
    return _getMockPopularReels(page, limit);
  } catch (error: any) {
    console.warn("[feedService] Failed to fetch popular reels, falling back to mock data:", error.message);
    return _getMockPopularReels(page, limit);
  }
}

// ─────────────────────────────────────────────
// Saved Reels
// ─────────────────────────────────────────────

/**
 * Fetch user's saved reels
 */
export async function getSavedReels(
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<FeedResponse>> {
  try {
    console.log("[feedService] Fetching saved reels:", { page, limit });

    const response = await apiClient.get<any>("user/feed/saved", {
      params: { page, limit },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const raw = responseData.data;
      const reels = Array.isArray(raw) ? raw : raw.reels || raw.data || [];

      const feedResponse: FeedResponse = {
        page: raw.page ?? page,
        limit: raw.limit ?? limit,
        total: raw.total ?? reels.length,
        reels: reels.map((r) => normalizeReel(r)),
      };

      console.log(`[feedService] Loaded ${feedResponse.reels.length} saved reels from API`);

      return {
        success: true,
        data: feedResponse,
        message: responseData.message || "Saved reels loaded successfully",
      };
    }

    // Fall back to mock data
    console.warn("[feedService] API returned error for saved reels, using mock data");
    return _getMockSavedReels(page, limit);
  } catch (error: any) {
    console.warn("[feedService] Failed to fetch saved reels, falling back to mock data:", error.message);
    return _getMockSavedReels(page, limit);
  }
}

// ─────────────────────────────────────────────
// Categories & Collections
// ─────────────────────────────────────────────

/**
 * Fetch all available content categories
 */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    console.log("[feedService] Fetching categories");

    const response = await apiClient.get<any>("public/categories");
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const categories = Array.isArray(responseData.data)
        ? responseData.data
        : responseData.data.categories || [];

      console.log(`[feedService] Loaded ${categories.length} categories from API`);

      return {
        success: true,
        data: categories,
        message: responseData.message || "Categories loaded successfully",
      };
    }

    // Fall back to mock data
    console.warn("[feedService] API returned error for categories, using mock data");
    return _getMockCategories();
  } catch (error: any) {
    console.warn("[feedService] Failed to fetch categories, falling back to mock data:", error.message);
    return _getMockCategories();
  }
}

/**
 * Fetch featured collections
 */
export async function getFeaturedCollections(): Promise<ApiResponse<Collection[]>> {
  try {
    console.log("[feedService] Fetching featured collections");

    const response = await apiClient.get<any>("public/collections/featured");
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const collections = Array.isArray(responseData.data)
        ? responseData.data
        : responseData.data.collections || [];

      console.log(`[feedService] Loaded ${collections.length} collections from API`);

      return {
        success: true,
        data: collections,
        message: responseData.message || "Collections loaded successfully",
      };
    }

    // Fall back to mock data
    console.warn("[feedService] API returned error for collections, using mock data");
    return _getMockFeaturedCollections();
  } catch (error: any) {
    console.warn("[feedService] Failed to fetch collections, falling back to mock data:", error.message);
    return _getMockFeaturedCollections();
  }
}

// ─────────────────────────────────────────────
// Reel Actions
// ─────────────────────────────────────────────

/**
 * Like / unlike a reel
 */
export async function toggleLikeReel(
  reelId: string
): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> {
  try {
    console.log("[feedService] Toggling like for reel:", reelId);

    const endpoint = replaceParams(API_ENDPOINTS.REELS.LIKE, { id: reelId });
    const response = await apiClient.post<any>(endpoint);
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: {
          isLiked: responseData.data.isLiked ?? true,
          likeCount: responseData.data.likeCount ?? 0,
        },
        message: responseData.message || "Like toggled successfully",
      };
    }

    // Mock behavior
    console.warn("[feedService] API error for like toggle, using mock behavior");
    return {
      success: true,
      data: { isLiked: true, likeCount: 1 },
      message: "Like toggled (mock)",
    };
  } catch (error: any) {
    console.warn("[feedService] Failed to toggle like:", error.message);
    return {
      success: true,
      data: { isLiked: true, likeCount: 1 },
      message: "Like toggled (mock behavior)",
    };
  }
}

/**
 * Save / unsave a reel
 */
export async function toggleSaveReel(
  reelId: string
): Promise<ApiResponse<{ isSaved: boolean }>> {
  try {
    console.log("[feedService] Toggling save for reel:", reelId);

    const endpoint = replaceParams(API_ENDPOINTS.REELS.GET_BY_ID, { id: `${reelId}/save` });
    const response = await apiClient.post<any>(endpoint);
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: { isSaved: responseData.data.isSaved ?? true },
        message: responseData.message || "Save toggled successfully",
      };
    }

    // Mock behavior
    console.warn("[feedService] API error for save toggle, using mock behavior");
    return {
      success: true,
      data: { isSaved: true },
      message: "Saved (mock)",
    };
  } catch (error: any) {
    console.warn("[feedService] Failed to toggle save:", error.message);
    return {
      success: true,
      data: { isSaved: true },
      message: "Saved (mock behavior)",
    };
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function normalizeReel(raw: any): Reel {
  return {
    id: raw._id ?? raw.id ?? "",
    title: raw.title ?? "Untitled",
    description: raw.description,
    creator: {
      id: raw.creator?.id ?? raw.creator?._id ?? "",
      name: raw.creator?.name ?? "Unknown",
      username: raw.creator?.username ?? "unknown",
      avatar: raw.creator?.avatar,
      isVerified: raw.creator?.isVerified,
      followers: raw.creator?.followers,
    },
    thumbnail: raw.thumbnail,
    videoUrl: raw.videoUrl ?? raw.video_url,
    duration: raw.duration ?? 0,
    category: raw.category ?? "general",
    tags: raw.tags ?? [],
    likes: raw.likes ?? 0,
    comments: raw.comments ?? 0,
    shares: raw.shares ?? 0,
    views: raw.views ?? 0,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    musicTrack: raw.musicTrack,
    competition: raw.competition,
    isTrending: raw.isTrending,
    isPopular: raw.isPopular,
    isNew: raw.isNew,
  };
}

function _getMockTrendingReels(page: number, limit: number): ApiResponse<FeedResponse> {
  const allReels = mockReels.getTrendingReels().map(normalizeReel);
  const start = (page - 1) * limit;
  const paginatedReels = allReels.slice(start, start + limit);

  console.log(`[feedService] Using mock trending reels - Loaded ${paginatedReels.length} reels`);

  return {
    success: true,
    data: {
      page,
      limit,
      total: allReels.length,
      reels: paginatedReels,
    },
    message: "Using mock trending reels (API unavailable)",
  };
}

function _getMockForYouReels(page: number, limit: number): ApiResponse<FeedResponse> {
  const allReels = mockReels.getForYouReels().map(normalizeReel);
  const start = (page - 1) * limit;
  const paginatedReels = allReels.slice(start, start + limit);

  console.log(`[feedService] Using mock For You reels - Loaded ${paginatedReels.length} reels`);

  return {
    success: true,
    data: {
      page,
      limit,
      total: allReels.length,
      reels: paginatedReels,
    },
    message: "Using mock For You reels (API unavailable)",
  };
}

function _getMockPopularReels(page: number, limit: number): ApiResponse<FeedResponse> {
  const allReels = mockReels.getPopularReels().map(normalizeReel);
  const start = (page - 1) * limit;
  const paginatedReels = allReels.slice(start, start + limit);

  console.log(`[feedService] Using mock popular reels - Loaded ${paginatedReels.length} reels`);

  return {
    success: true,
    data: {
      page,
      limit,
      total: allReels.length,
      reels: paginatedReels,
    },
    message: "Using mock popular reels (API unavailable)",
  };
}

function _getMockSavedReels(page: number, limit: number): ApiResponse<FeedResponse> {
  // Return empty for saved as user hasn't saved anything in mock
  console.log(`[feedService] Using mock saved reels - Empty (user hasn't saved any)`);

  return {
    success: true,
    data: {
      page,
      limit,
      total: 0,
      reels: [],
    },
    message: "Using mock saved reels (API unavailable)",
  };
}

function _getMockCategories(): ApiResponse<Category[]> {
  const categories = mockCategories.getAllCategories();
  console.log(`[feedService] Using mock categories - Loaded ${categories.length} categories`);

  return {
    success: true,
    data: categories,
    message: "Using mock categories (API unavailable)",
  };
}

function _getMockFeaturedCollections(): ApiResponse<Collection[]> {
  const collections = mockCategories.getFeaturedCollections();
  console.log(`[feedService] Using mock collections - Loaded ${collections.length} collections`);

  return {
    success: true,
    data: collections,
    message: "Using mock collections (API unavailable)",
  };
}

// ─────────────────────────────────────────────
// Service Export
// ─────────────────────────────────────────────

export const feedService = {
  getTrendingReels,
  getForYouReels,
  getPopularReels,
  getSavedReels,
  getCategories,
  getFeaturedCollections,
  toggleLikeReel,
  toggleSaveReel,
};

export default feedService;
