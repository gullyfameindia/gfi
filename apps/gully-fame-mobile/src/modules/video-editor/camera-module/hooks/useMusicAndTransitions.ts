import { useCallback, useState } from "react";
import type { AudioTrack } from "../types/music.types";
import type { Transition, ClipTransition } from "../types/transitions.types";




export const useMusicAndTransitions = () => {
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [transitions, setTransitions] = useState<ClipTransition[]>([]);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [showTransitionModal, setShowTransitionModal] = useState(false);

  
  const addAudioTrack = useCallback((track: AudioTrack) => {
    setAudioTracks((prev) => [...prev, track]);
  }, []);

  const updateAudioTrack = useCallback((trackId: string, updates: Partial<AudioTrack>) => {
    setAudioTracks((prev) =>
      prev.map((track) => (track.id === trackId ? { ...track, ...updates } : track))
    );
  }, []);

  const removeAudioTrack = useCallback((trackId: string) => {
    setAudioTracks((prev) => prev.filter((track) => track.id !== trackId));
  }, []);

  const clearAudioTracks = useCallback(() => {
    setAudioTracks([]);
  }, []);

  
  const addTransition = useCallback((clipTransition: ClipTransition) => {
    setTransitions((prev) => [...prev, clipTransition]);
  }, []);

  const updateTransition = useCallback((transitionId: string, updates: Partial<Transition>) => {
    setTransitions((prev) =>
      prev.map((ct) =>
        ct.id === transitionId ? { ...ct, transition: { ...ct.transition, ...updates } } : ct
      )
    );
  }, []);

  const removeTransition = useCallback((transitionId: string) => {
    setTransitions((prev) => prev.filter((ct) => ct.id !== transitionId));
  }, []);

  const clearTransitions = useCallback(() => {
    setTransitions([]);
  }, []);

  
  const openMusicModal = useCallback(() => {
    setShowMusicModal(true);
  }, []);

  const closeMusicModal = useCallback(() => {
    setShowMusicModal(false);
  }, []);

  const openTransitionModal = useCallback(() => {
    setShowTransitionModal(true);
  }, []);

  const closeTransitionModal = useCallback(() => {
    setShowTransitionModal(false);
  }, []);

  return {
    
    audioTracks,
    addAudioTrack,
    updateAudioTrack,
    removeAudioTrack,
    clearAudioTracks,

    
    transitions,
    addTransition,
    updateTransition,
    removeTransition,
    clearTransitions,

    
    showMusicModal,
    openMusicModal,
    closeMusicModal,
    showTransitionModal,
    openTransitionModal,
    closeTransitionModal,
  };
};
