/**
 * Filter Library Service
 * Manages video filters and effects available in the editor
 *  Real-time backend integration for production
 */

import apiClient from "../axios";
import { ApiResponse } from "../types";

export type FilterType = 
  | "brightness" 
  | "contrast" 
  | "saturation" 
  | "hue" 
  | "blur" 
  | "sepia" 
  | "grayscale"
  | "vintage"
  | "cool"
  | "warm"
  | "cinematic"
  | "noir";

export interface FilterPreset {
  id: string;
  name: string;
  type: FilterType;
  description?: string;
  icon?: string;
  thumbnail?: string;
  values: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
    blur?: number;
  };
  category?: "vintage" | "modern" | "nature" | "cool" | "warm";
  isCustom?: boolean;
  isLicensed?: boolean;
  createdAt?: string;
}

export interface FilterCategory {
  id: string;
  name: string;
  icon?: string;
  filters: FilterPreset[];
  total?: number;
}

export interface FilterListResponse {
  page: number;
  limit: number;
  total: number;
  categories?: FilterCategory[];
  filters: FilterPreset[];
}

/**
 * Fetch all available video filters from backend
 */
export async function listFilters(
  category?: string,
  page = 1,
  limit = 20
): Promise<ApiResponse<FilterListResponse>> {
  try {
    console.log("[filterLibraryService] Fetching filters:", { category, page, limit });

    const params: Record<string, any> = { page, limit };
    if (category) params.category = category;

    const response = await apiClient.get<any>("public/filters", { params, skipAuth: true });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const raw = responseData.data;

      // Handle array or wrapped response
      const rawFilters: any[] = Array.isArray(raw)
        ? raw
        : raw?.filters ?? raw?.data ?? [];

      const filters: FilterPreset[] = rawFilters.map((f: any) => ({
        id: f._id ?? f.id ?? "",
        name: f.name ?? f.title ?? "Unknown Filter",
        type: f.type ?? "brightness",
        description: f.description,
        icon: f.icon,
        thumbnail: f.thumbnail ?? f.thumbnailUrl ?? f.preview,
        values: f.values ?? {},
        category: f.category,
        isCustom: f.isCustom ?? false,
        isLicensed: f.isLicensed ?? true,
        createdAt: f.createdAt,
      }));

      return {
        success: true,
        data: {
          page: raw?.page ?? page,
          limit: raw?.limit ?? limit,
          total: raw?.total ?? filters.length,
          filters,
          categories: raw?.categories,
        },
        message: responseData.message ?? "Filters fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message ?? "Failed to fetch filters",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[filterLibraryService] listFilters error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message ?? error.message ?? "Network error",
      error: error.message,
      data: undefined,
    };
  }
}

/**
 * Get filter details by ID
 */
export async function getFilterById(filterId: string): Promise<ApiResponse<FilterPreset>> {
  try {
    console.log("[filterLibraryService] Getting filter:", filterId);

    const response = await apiClient.get<any>(`public/filters/${filterId}`, { skipAuth: true });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const f = responseData.data;
      const filter: FilterPreset = {
        id: f._id ?? f.id ?? "",
        name: f.name ?? f.title ?? "Unknown",
        type: f.type ?? "brightness",
        description: f.description,
        icon: f.icon,
        thumbnail: f.thumbnail ?? f.thumbnailUrl,
        values: f.values ?? {},
        category: f.category,
        isCustom: f.isCustom ?? false,
        isLicensed: f.isLicensed ?? true,
        createdAt: f.createdAt,
      };

      return {
        success: true,
        data: filter,
        message: "Filter retrieved successfully",
      };
    }

    return {
      success: false,
      message: responseData.message ?? "Failed to get filter",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[filterLibraryService] getFilterById error:", error.message);
    return {
      success: false,
      message: error.message ?? "Network error",
      error: error.message,
      data: undefined,
    };
  }
}

/**
 * Search filters by name
 */
export async function searchFilters(query: string, limit = 20): Promise<ApiResponse<FilterPreset[]>> {
  try {
    console.log("[filterLibraryService] Searching filters:", query);

    const response = await apiClient.get<any>("public/filters", {
      params: { search: query, limit },
      skipAuth: true
    });
    const responseData = response.data as any;

    if (responseData.code === 1) {
      const raw = responseData.data;
      const rawFilters: any[] = Array.isArray(raw)
        ? raw
        : raw?.filters ?? raw?.data ?? [];

      const filters = rawFilters.map((f: any) => ({
        id: f._id ?? f.id ?? "",
        name: f.name ?? f.title ?? "Unknown Filter",
        type: f.type ?? "brightness",
        description: f.description,
        icon: f.icon,
        thumbnail: f.thumbnail,
        values: f.values ?? {},
        category: f.category,
        isCustom: f.isCustom ?? false,
        isLicensed: f.isLicensed ?? true,
      }));

      return {
        success: true,
        data: filters,
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
    console.error("[filterLibraryService] searchFilters error:", error.message);
    return {
      success: false,
      message: error.message ?? "Network error",
      error: error.message,
      data: undefined,
    };
  }
}

export const filterLibraryService = {
  listFilters,
  getFilterById,
  searchFilters,
};

export default filterLibraryService;
