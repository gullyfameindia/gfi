import apiClient from "./axios";
import { FILTER_PRESETS, FilterConfig } from "../types/filterTypes";

export interface FilterListResponse {
  page: number;
  limit: number;
  total: number;
  filters: FilterConfig[];
}

export async function listFilters(): Promise<FilterConfig[]> {
  try {
    console.log("[FilterService] Fetching filters from GET /filters");
    const response = await apiClient.get<any>("public/filters", { skipAuth: true });
    
    if (response.data?.code === 1 && response.data?.data) {
      const rawData = response.data.data;
      const filtersArray = Array.isArray(rawData) ? rawData : rawData?.filters || rawData?.data || [];
      
      if (filtersArray.length === 0) {
        console.warn("[FilterService] API returned empty list, using local presets");
        return FILTER_PRESETS;
      }
      
      return filtersArray.map((f: any) => ({
        name: f.name ?? f.title ?? "Unknown",
        brightness: f.brightness,
        contrast: f.contrast,
        saturation: f.saturation,
        temperature: f.temperature,
        tint: f.tint,
        gamma: f.gamma,
        vignette: f.vignette,
        grain: f.grain,
      }));
    }
    
    console.warn("[FilterService] API returned no data, using local presets");
    return FILTER_PRESETS;
  } catch (error: any) {
    console.error("[FilterService] Error fetching filters:", error.message);
    console.log("[FilterService] Falling back to local presets");
    return FILTER_PRESETS;
  }
}
