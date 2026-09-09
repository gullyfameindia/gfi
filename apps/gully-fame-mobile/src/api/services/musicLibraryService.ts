










import apiClient from "../axios";
import { ApiResponse } from "../types";
import { mockDataManager } from "../../mockData/mockDataManager";
import * as mockMusicTracks from "../../mockData/musicTracks";





export type AudioSortOption = "trending" | "newest" | "popular";


export interface MusicTrack {
  _id: string;
  
  title: string;
  
  artist?: string;
  
  duration: number;
  
  audioUrl: string;
  
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


export interface ReelMusicPayload {
  id: string;
  name: string;
}






function normaliseTrack(raw: any): MusicTrack {
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
    console.log('[musicLibraryService] 🎵 [VERIFICATION] listAudio called - sort:', sort, 'page:', page, 'limit:', limit, 'search:', search);

    const params: Record<string, any> = { sort, page, limit };
    if (search && search.trim()) params.search = search.trim();

    console.log('[musicLibraryService] 🎵 [VERIFICATION] Calling GET /public/audio with params:', JSON.stringify(params));
    const response = await apiClient.get<any>("public/audio", { params });
    const responseData = response.data as any;

    console.log('[musicLibraryService] 🎵 [VERIFICATION] API response code:', responseData.code, 'message:', responseData.message);

    if (responseData.code === 1) {
      const raw = responseData.data;

      
      const rawTracks: any[] = Array.isArray(raw)
        ? raw
        : raw?.audios ?? raw?.tracks ?? raw?.audio ?? raw?.data ?? [];

      console.log('[musicLibraryService] 🎵 Raw data structure keys:', Object.keys(raw || {}));
      console.log('[musicLibraryService] 🎵 Extracted tracks:', rawTracks.length);

      const tracks: MusicTrack[] = rawTracks.map(normaliseTrack);

      const listData: AudioListData = {
        page: raw?.page ?? page,
        limit: raw?.limit ?? limit,
        total: raw?.total ?? tracks.length,
        tracks,
      };

      console.log(`[musicLibraryService] ✅ [VERIFICATION] Successfully loaded ${tracks.length} tracks from API`);
      console.log('[musicLibraryService] 🎵 [VERIFICATION] Sample tracks:');
      tracks.slice(0, 3).forEach((t, i) => {
        console.log(`  [${i}] title: ${t.title}, artist: ${t.artist}, audioUrl: ${t.audioUrl?.substring(0, 50)}...`);
      });

      return {
        success: true,
        data: listData,
        message: responseData.message ?? "Audio list fetched successfully",
      };
    }

    
    console.warn('[musicLibraryService] ⚠️ [VERIFICATION] API returned error code:', responseData.code, '- falling back to mock data');
    return _getMockAudioList(sort, page, limit, search);
  } catch (error: any) {
    console.warn('[musicLibraryService] ⚠️ [VERIFICATION] API call failed:', error.message, '- falling back to mock data');
    
    
    return _getMockAudioList(sort, page, limit, search);
  }
}





function _getMockAudioList(
  sort: AudioSortOption = "trending",
  page = 1,
  limit = 20,
  search?: string
): ApiResponse<AudioListData> {
  let tracks: mockMusicTracks.MusicTrack[] = [];

  
  switch (sort) {
    case "trending":
      tracks = mockMusicTracks.getTrendingTracks();
      break;
    case "popular":
      tracks = mockMusicTracks.getPopularTracks();
      break;
    case "newest":
      tracks = mockMusicTracks.getNewTracks();
      break;
    default:
      tracks = mockMusicTracks.mockMusicTracks;
  }

  
  if (search && search.trim()) {
    tracks = mockMusicTracks.searchMusicTracks(search);
  }

  
  const convertedTracks: MusicTrack[] = tracks.map((mockTrack) => ({
    _id: mockTrack.id,
    title: mockTrack.title,
    artist: mockTrack.artist,
    duration: mockTrack.duration,
    audioUrl: mockTrack.audioUrl ?? `mock://audio/${mockTrack.id}`,
    coverImage: mockTrack.thumbnail,
    usageCount: mockTrack.usageCount,
    isSaved: false,
    isActive: true,
  }));

  
  const start = (page - 1) * limit;
  const paginatedTracks = convertedTracks.slice(start, start + limit);

  const listData: AudioListData = {
    page,
    limit,
    total: convertedTracks.length,
    tracks: paginatedTracks,
  };

  console.log(`[musicLibraryService] ✅ [VERIFICATION] Using mock data - Loaded ${paginatedTracks.length} tracks (sort: ${sort}, page: ${page})`);
  console.log('[musicLibraryService] 🎵 [VERIFICATION] Sample mock tracks:');
  paginatedTracks.slice(0, 3).forEach((t, i) => {
    console.log(`  [${i}] title: ${t.title}, artist: ${t.artist}, audioUrl: ${t.audioUrl?.substring(0, 50)}...`);
  });

  return {
    success: true,
    data: listData,
    message: "Using mock audio library (API unavailable)",
  };
}













export async function toggleSaveAudio(
  audioId: string
): Promise<ApiResponse<{ isSaved: boolean }>> {
  try {
    console.log("[musicLibraryService] POST user/audio/:id/save", { audioId });

    
    const response = await apiClient.post<any>(`user/audio/${audioId}/save`, {}, {
      skipAuth: false,  
    });
    const responseData = response.data as any;

    if (responseData.code === 1) {
      
      const isSaved: boolean =
        responseData.data?.isSaved ??
        responseData.data?.is_saved ??
        responseData.data?.saved ??
        (!responseData.data?.removed ? true : false);

      console.log(`[musicLibraryService] Audio ${audioId} saved: ${isSaved}`);

      return {
        success: true,
        data: { isSaved },
        message: responseData.message ?? (isSaved ? "Audio saved" : "Audio unsaved"),
      };
    }

    
    console.warn("[musicLibraryService] API returned error for save, using mock behavior");
    return _getMockToggleSaveAudio(audioId);
  } catch (error: any) {
    console.warn("[musicLibraryService] toggleSaveAudio failed, using mock behavior:", error.message);
    return _getMockToggleSaveAudio(audioId);
  }
}





function _getMockToggleSaveAudio(audioId: string): ApiResponse<{ isSaved: boolean }> {
  console.log(`[musicLibraryService] Mock toggle: Audio ${audioId} saved (mock behavior)`);
  return {
    success: true,
    data: { isSaved: true },
    message: "Audio saved (using mock behavior)",
  };
}














export async function getSavedAudio(
  page = 1,
  limit = 20
): Promise<ApiResponse<AudioListData>> {
  try {
    console.log("[musicLibraryService] Fetching saved audio:", { page, limit });

    const response = await apiClient.get<any>("user/audio/saved", {
      params: { page, limit },
    });
    const responseData = response.data as any;

    if (responseData.code === 1) {
      const raw = responseData.data;

      const rawTracks: any[] = Array.isArray(raw)
        ? raw
        : raw?.tracks ?? raw?.audio ?? raw?.data ?? [];

      const tracks: MusicTrack[] = rawTracks.map((t) => ({
        ...normaliseTrack(t),
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

    
    console.warn("[musicLibraryService] API returned error for saved audio, using mock data");
    return _getMockSavedAudioList(page, limit);
  } catch (error: any) {
    console.warn("[musicLibraryService] Failed to fetch saved audio, falling back to mock data:", error.message);
    return _getMockSavedAudioList(page, limit);
  }
}




function _getMockSavedAudioList(page = 1, limit = 20): ApiResponse<AudioListData> {
  
  let tracks = mockMusicTracks.getPopularTracks().slice(0, 5);

  
  const convertedTracks: MusicTrack[] = tracks.map((mockTrack) => ({
    _id: mockTrack.id,
    title: mockTrack.title,
    artist: mockTrack.artist,
    duration: mockTrack.duration,
    audioUrl: mockTrack.audioUrl ?? `mock://audio/${mockTrack.id}`,
    coverImage: mockTrack.thumbnail,
    usageCount: mockTrack.usageCount,
    isSaved: true,
    isActive: true,
  }));

  
  const start = (page - 1) * limit;
  const paginatedTracks = convertedTracks.slice(start, start + limit);

  const listData: AudioListData = {
    page,
    limit,
    total: convertedTracks.length,
    tracks: paginatedTracks,
  };

  console.log(`[musicLibraryService] Using mock saved audio - Loaded ${paginatedTracks.length} tracks`);

  return {
    success: true,
    data: listData,
    message: "Using mock saved audio library (API unavailable)",
  };
}

















export function buildReelMusicPayload(
  track: MusicTrack | null | undefined
): ReelMusicPayload | null {
  if (!track || !track._id) return null;

  return {
    id: track._id,
    name: track.title,
  };
}









export function filterTracksBySearch(
  tracks: MusicTrack[],
  query: string
): MusicTrack[] {
  if (!query.trim()) return tracks;
  const q = query.toLowerCase();
  return tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      (t.artist ?? "").toLowerCase().includes(q)
  );
}





export const musicLibraryService = {
  
  listAudio,
  
  toggleSaveAudio,
  
  getSavedAudio,
  
  buildReelMusicPayload,
  
  filterTracksBySearch,
};

export default musicLibraryService;
