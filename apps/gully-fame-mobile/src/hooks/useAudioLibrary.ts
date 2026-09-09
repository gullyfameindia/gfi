import { useState, useCallback, useEffect } from 'react';
import { musicLibraryService, type MusicTrack, type AudioSortOption } from '@/api/services/musicLibraryService';

export interface AudioTrackWithMetadata extends MusicTrack {
  startTime?: number;
  endTime?: number;
  volume?: number;
  id: string;
}

interface UseAudioLibraryState {
  selectedTracks: AudioTrackWithMetadata[];
  isLoading: boolean;
  error: string | null;
  allTracks: MusicTrack[];
  activeCategory: string;
  searchQuery: string;
  savedTracks: Set<string>;
}

export const useAudioLibrary = () => {
  const [state, setState] = useState<UseAudioLibraryState>({
    selectedTracks: [],
    isLoading: false,
    error: null,
    allTracks: [],
    activeCategory: 'For you',
    searchQuery: '',
    savedTracks: new Set(),
  });

  
  const fetchTracks = useCallback(async (category: string, query?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      let sortOption: AudioSortOption = 'newest';
      if (category === 'Trending') sortOption = 'trending';
      else if (category === 'Popular') sortOption = 'popular';
      else if (category === 'For you') sortOption = 'newest';

      console.log('[useAudioLibrary] Fetching tracks:', { category, sortOption, query });
      
      const result = await musicLibraryService.listAudio(sortOption, 1, 50, query);
      
      console.log('[useAudioLibrary] API Response:', result);
      
      if (result.success && result.data) {
        const tracks = result.data.tracks || [];
        console.log('[useAudioLibrary] Tracks loaded:', tracks.length);
        
        setState(prev => ({
          ...prev,
          allTracks: tracks,
          isLoading: false,
          activeCategory: category,
          error: null,
        }));
      } else {
        const errorMsg = result.message || 'Failed to load tracks';
        console.warn('[useAudioLibrary] API Error:', errorMsg);
        
        setState(prev => ({
          ...prev,
          error: errorMsg,
          isLoading: false,
          allTracks: [],
        }));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[useAudioLibrary] Exception:', errorMsg);
      
      setState(prev => ({
        ...prev,
        error: errorMsg,
        isLoading: false,
        allTracks: [],
      }));
    }
  }, []);

  
  const addTrack = useCallback((track: MusicTrack, startTime: number = 0) => {
    const newTrack: AudioTrackWithMetadata = {
      ...track,
      id: `${track._id}-${Date.now()}`, 
      startTime,
      volume: 1,
    };

    setState(prev => ({
      ...prev,
      selectedTracks: [...prev.selectedTracks, newTrack],
    }));

    return newTrack;
  }, []);

  
  const removeTrack = useCallback((trackId: string) => {
    setState(prev => ({
      ...prev,
      selectedTracks: prev.selectedTracks.filter(t => t.id !== trackId),
    }));
  }, []);

  
  const updateTrack = useCallback((trackId: string, updates: Partial<AudioTrackWithMetadata>) => {
    setState(prev => ({
      ...prev,
      selectedTracks: prev.selectedTracks.map(t =>
        t.id === trackId ? { ...t, ...updates } : t
      ),
    }));
  }, []);

  
  const setTrackVolume = useCallback((trackId: string, volume: number) => {
    updateTrack(trackId, { volume: Math.max(0, Math.min(1, volume)) });
  }, [updateTrack]);

  
  const toggleSaveAudio = useCallback(async (trackId: string) => {
    try {
      const result = await musicLibraryService.toggleSaveAudio(trackId);
      if (result.success && result.data) {
        setState(prev => {
          const newSavedTracks = new Set(prev.savedTracks);
          if (result.data!.isSaved) {
            newSavedTracks.add(trackId);
          } else {
            newSavedTracks.delete(trackId);
          }
          return { ...prev, savedTracks: newSavedTracks };
        });
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  }, []);

  
  const clearTracks = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedTracks: [],
    }));
  }, []);

  
  const getTracksForExport = useCallback(() => {
    return state.selectedTracks.map(t => ({
      _id: t._id,
      title: t.title,
      artist: t.artist,
      audioUrl: t.audioUrl,
      startTime: t.startTime || 0,
      volume: t.volume || 1,
    }));
  }, [state.selectedTracks]);

  
  const reorderTracks = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      const newTracks = [...prev.selectedTracks];
      const [removed] = newTracks.splice(fromIndex, 1);
      newTracks.splice(toIndex, 0, removed);
      return { ...prev, selectedTracks: newTracks };
    });
  }, []);

  return {
    
    selectedTracks: state.selectedTracks,
    allTracks: state.allTracks,
    isLoading: state.isLoading,
    error: state.error,
    activeCategory: state.activeCategory,
    searchQuery: state.searchQuery,
    savedTracks: state.savedTracks,

    
    fetchTracks,
    addTrack,
    removeTrack,
    updateTrack,
    setTrackVolume,
    toggleSaveAudio,
    clearTracks,
    getTracksForExport,
    reorderTracks,

    
    setSearchQuery: (query: string) =>
      setState(prev => ({ ...prev, searchQuery: query })),
    setActiveCategory: (category: string) =>
      setState(prev => ({ ...prev, activeCategory: category })),
  };
};
