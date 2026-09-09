import apiClient from "./axios";

export type AudioSortOption = "trending" | "newest" | "popular";

export interface MusicTrack {
  _id: string;
  title: string;
  artist?: string;
  duration: number;
  audioUrl: string;
  url?: string;
  coverImage?: string;
  usageCount?: number;
  isSaved?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface AudioListData {
  page: number;
  limit: number;
  total: number;
  tracks: MusicTrack[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}




function normalizeTrack(raw: any): MusicTrack {
  return {
    _id: raw._id ?? raw.id ?? "",
    title: raw.title ?? raw.name ?? "Unknown Track",
    artist: raw.artist ?? raw.artistName ?? undefined,
    duration: raw.duration ?? 0,
    audioUrl: raw.audioUrl ?? raw.audio_url ?? raw.url ?? "",
    coverImage: raw.coverImage ?? raw.cover_image ?? raw.thumbnail ?? undefined,
    usageCount: raw.usageCount ?? raw.usage_count ?? undefined,
    isSaved: raw.isSaved ?? raw.is_saved ?? false,
    isActive: raw.isActive ?? true,
    createdAt: raw.createdAt ?? undefined,
  };
}





export async function listAudio(
  sort: AudioSortOption = "trending",
  page = 1,
  limit = 20,
  search?: string
): Promise<ApiResponse<AudioListData>> {
  try {
    console.log("[musicLibraryService] Fetching audio - sort:", sort, "page:", page, "limit:", limit, "search:", search);

    const params: Record<string, any> = { sort, page, limit };
    if (search && search.trim()) params.search = search.trim();

    const response = await apiClient.get<any>("public/audio", { params });
    const responseData = response.data as any;

    console.log("[musicLibraryService] API response code:", responseData.code, "message:", responseData.message);

    if (responseData.code === 1) {
      const raw = responseData.data;

      
      const rawTracks: any[] = Array.isArray(raw)
        ? raw
        : raw?.audios ?? raw?.tracks ?? raw?.audio ?? raw?.data ?? [];

      const tracks: MusicTrack[] = rawTracks.map(normalizeTrack);

      const listData: AudioListData = {
        page: raw?.page ?? page,
        limit: raw?.limit ?? limit,
        total: raw?.total ?? tracks.length,
        tracks,
      };

      console.log(`[musicLibraryService] ✅ Loaded ${tracks.length} tracks from API`);
      return {
        success: true,
        data: listData,
        message: responseData.message ?? "Audio list fetched successfully",
      };
    }

    console.warn("[musicLibraryService] API returned error code:", responseData.code);
    return {
      success: false,
      data: { page, limit, total: 0, tracks: [] },
      message: responseData.message ?? "Failed to load audio",
    };
  } catch (error: any) {
    console.error("[musicLibraryService] Error fetching audio:", error.message);
    return {
      success: false,
      data: { page, limit, total: 0, tracks: [] },
      message: "Failed to load audio: " + error.message,
    };
  }
}




export async function toggleSaveAudio(audioId: string): Promise<ApiResponse<{ isSaved: boolean }>> {
  try {
    console.log("[musicLibraryService] Toggling save for audio:", audioId);

    const response = await apiClient.post<any>(`user/audio/${audioId}/save`, {});
    const responseData = response.data as any;

    if (responseData.code === 1) {
      const isSaved: boolean =
        responseData.data?.isSaved ?? responseData.data?.is_saved ?? responseData.data?.saved ?? true;

      console.log(`[musicLibraryService] Audio ${audioId} saved: ${isSaved}`);
      return {
        success: true,
        data: { isSaved },
        message: responseData.message ?? (isSaved ? "Audio saved" : "Audio unsaved"),
      };
    }

    return {
      success: false,
      data: { isSaved: false },
      message: responseData.message ?? "Failed to save audio",
    };
  } catch (error: any) {
    console.error("[musicLibraryService] Error toggling save:", error.message);
    return {
      success: false,
      data: { isSaved: false },
      message: "Failed to save audio: " + error.message,
    };
  }
}




export async function getSavedAudio(page = 1, limit = 20): Promise<ApiResponse<AudioListData>> {
  try {
    console.log("[musicLibraryService] Fetching saved audio:", { page, limit });

    const response = await apiClient.get<any>("user/audio/saved", { params: { page, limit } });
    const responseData = response.data as any;

    if (responseData.code === 1) {
      const raw = responseData.data;

      const rawTracks: any[] = Array.isArray(raw)
        ? raw
        : raw?.audios ?? raw?.tracks ?? raw?.audio ?? raw?.data ?? [];

      const tracks: MusicTrack[] = rawTracks.map((t) => ({
        ...normalizeTrack(t),
        isSaved: true,
      }));

      const listData: AudioListData = {
        page: raw?.page ?? page,
        limit: raw?.limit ?? limit,
        total: raw?.total ?? tracks.length,
        tracks,
      };

      console.log(`[musicLibraryService] Loaded ${tracks.length} saved tracks from API`);
      return {
        success: true,
        data: listData,
        message: responseData.message ?? "Saved audio fetched successfully",
      };
    }

    return {
      success: false,
      data: { page, limit, total: 0, tracks: [] },
      message: responseData.message ?? "Failed to load saved audio",
    };
  } catch (error: any) {
    console.error("[musicLibraryService] Error fetching saved audio:", error.message);
    return {
      success: false,
      data: { page, limit, total: 0, tracks: [] },
      message: "Failed to load saved audio: " + error.message,
    };
  }
}

export const musicLibraryService = {
  listAudio,
  toggleSaveAudio,
  getSavedAudio,
};

export default musicLibraryService;
