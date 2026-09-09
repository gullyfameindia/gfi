import apiClient from "./axios";
import type { SoundEffect } from "../types/soundEffect";

export async function listSoundFX(): Promise<SoundEffect[]> {
  try {
    console.log("[SoundFXService] Fetching sound effects from GET /soundfx");
    const response = await apiClient.get<any>("public/soundfx", { skipAuth: true });
    
    if (response.data?.code === 1 && response.data?.data) {
      const rawData = response.data.data;
      const effectsArray = Array.isArray(rawData) ? rawData : rawData?.data || [];
      
      return effectsArray.map((fx: any) => ({
        _id: fx._id ?? fx.id ?? "",
        id: fx.id ?? fx._id ?? "",
        name: fx.name ?? fx.title ?? "Unknown Effect",
        title: fx.title ?? fx.name ?? "Unknown Effect",
        audioUrl: fx.audioUrl ?? fx.audio_url ?? fx.url ?? "",
        duration: fx.duration ?? 3,
        category: fx.category ?? "effect",
        uri: fx.audioUrl ?? fx.audio_url ?? fx.url ?? "",
      }));
    }
    
    console.warn("[SoundFXService] API returned no data, returning empty array");
    return [];
  } catch (error: any) {
    console.error("[SoundFXService] Error fetching sound effects:", error.message);
    return [];
  }
}
