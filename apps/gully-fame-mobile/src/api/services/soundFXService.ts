/**
 * Sound Effects Service
 * Manages sound effects available in the video editor
 * Real-time backend integration for production
 */

import apiClient from "../axios";
import { ApiResponse } from "../types";

export interface SoundEffect {
  _id?: string;
  id?: string;
  name: string;
  title?: string;
  description?: string;
  icon?: string;
  thumbnail?: string;
  audioUrl: string;
  audio_url?: string;
  duration?: number;
  category?: string;
  tags?: string[];
  isActive?: boolean;
  createdAt?: string;
}

export interface SoundFXListResponse {
  page?: number;
  limit?: number;
  total?: number;
  soundEffects?: SoundEffect[];
  effects?: SoundEffect[];
  data?: SoundEffect[];
}

/**
 * Fetch all available sound effects from backend
 */
export async function listSoundFX(
  category?: string,
  page = 1,
  limit = 20,
  search?: string
): Promise<ApiResponse<SoundEffect[]>> {
  try {
    console.log("[soundFXService] Fetching sound effects:", { category, page, limit, search });

    const params: Record<string, any> = { page, limit };
    if (category) params.category = category;
    if (search) params.search = search;

    const response = await apiClient.get<any>("public/soundfx", { params, skipAuth: true });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const raw = responseData.data;

      // Handle array or wrapped response
      const rawEffects: any[] = Array.isArray(raw)
        ? raw
        : raw?.soundEffects ?? raw?.effects ?? raw?.data ?? [];

      const effects: SoundEffect[] = rawEffects.map((fx: any) => ({
        _id: fx._id ?? fx.id ?? "",
        id: fx.id ?? fx._id ?? "",
        name: fx.name ?? fx.title ?? "Unknown Effect",
        title: fx.title ?? fx.name ?? "Unknown Effect",
        description: fx.description,
        icon: fx.icon,
        thumbnail: fx.thumbnail ?? fx.thumbnailUrl ?? fx.preview,
        audioUrl: fx.audioUrl ?? fx.audio_url ?? fx.url ?? "",
        duration: fx.duration,
        category: fx.category,
        tags: fx.tags ?? [],
        isActive: fx.isActive ?? true,
        createdAt: fx.createdAt,
      }));

      return {
        success: true,
        data: effects,
        message: responseData.message ?? "Sound effects fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message ?? "Failed to fetch sound effects",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[soundFXService] listSoundFX error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message ?? error.message ?? "Network error",
      error: error.message,
      data: undefined,
    };
  }
}

/**
 * Get sound effect details by ID
 */
export async function getSoundFXById(effectId: string): Promise<ApiResponse<SoundEffect>> {
  try {
    console.log("[soundFXService] Getting sound effect:", effectId);

    const response = await apiClient.get<any>(`public/soundfx/${effectId}`, { skipAuth: true });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const fx = responseData.data;
      const effect: SoundEffect = {
        _id: fx._id ?? fx.id ?? "",
        id: fx.id ?? fx._id ?? "",
        name: fx.name ?? fx.title ?? "Unknown",
        title: fx.title ?? fx.name ?? "Unknown",
        description: fx.description,
        icon: fx.icon,
        thumbnail: fx.thumbnail ?? fx.thumbnailUrl,
        audioUrl: fx.audioUrl ?? fx.audio_url ?? fx.url ?? "",
        duration: fx.duration,
        category: fx.category,
        tags: fx.tags ?? [],
        isActive: fx.isActive ?? true,
        createdAt: fx.createdAt,
      };

      return {
        success: true,
        data: effect,
        message: "Sound effect retrieved successfully",
      };
    }

    return {
      success: false,
      message: responseData.message ?? "Failed to get sound effect",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[soundFXService] getSoundFXById error:", error.message);
    return {
      success: false,
      message: error.message ?? "Network error",
      error: error.message,
      data: undefined,
    };
  }
}

/**
 * Search sound effects by name or tags
 */
export async function searchSoundFX(query: string, limit = 20): Promise<ApiResponse<SoundEffect[]>> {
  try {
    console.log("[soundFXService] Searching sound effects:", query);

    const response = await apiClient.get<any>("public/soundfx", {
      params: { search: query, limit },
      skipAuth: true
    });
    const responseData = response.data as any;

    if (responseData.code === 1) {
      const raw = responseData.data;
      const rawEffects: any[] = Array.isArray(raw)
        ? raw
        : raw?.soundEffects ?? raw?.effects ?? raw?.data ?? [];

      const effects = rawEffects.map((fx: any) => ({
        _id: fx._id ?? fx.id ?? "",
        id: fx.id ?? fx._id ?? "",
        name: fx.name ?? fx.title ?? "Unknown Effect",
        title: fx.title ?? fx.name ?? "Unknown Effect",
        description: fx.description,
        icon: fx.icon,
        thumbnail: fx.thumbnail,
        audioUrl: fx.audioUrl ?? fx.audio_url ?? fx.url ?? "",
        duration: fx.duration,
        category: fx.category,
        tags: fx.tags ?? [],
        isActive: fx.isActive ?? true,
      }));

      return {
        success: true,
        data: effects,
        message: "Search completed",
      };
    }

    return {
      success: false,
      message: "Search failed",
      error: "API error",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[soundFXService] searchSoundFX error:", error.message);
    return {
      success: false,
      message: error.message ?? "Network error",
      error: error.message,
      data: undefined,
    };
  }
}

export const soundFXService = {
  listSoundFX,
  getSoundFXById,
  searchSoundFX,
};

export default soundFXService;
