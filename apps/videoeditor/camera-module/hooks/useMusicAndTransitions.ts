import { useCallback, useState } from "react";
import type { AudioTrack } from "../types/music.types";
import type { Transition, ClipTransition } from "../types/transitions.types";

/**
 * Hook for managing music and transitions in video editor
 */
export const useMusicAndTransitions = () => {
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [transitions, setTransitions] = useState<ClipTransition[]>([]);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [showTransitionModal, setShowTransitionModal] = useState(false);

  // Audio track management
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

  // Transition management
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

  // Modal management
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
    // Audio tracks
    audioTracks,
    addAudioTrack,
    updateAudioTrack,
    removeAudioTrack,
    clearAudioTracks,

    // Transitions
    transitions,
    addTransition,
    updateTransition,
    removeTransition,
    clearTransitions,

    // Modals
    showMusicModal,
    openMusicModal,
    closeMusicModal,
    showTransitionModal,
    openTransitionModal,
    closeTransitionModal,
  };
};
