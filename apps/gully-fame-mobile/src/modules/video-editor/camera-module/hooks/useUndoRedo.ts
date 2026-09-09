import React, { useCallback, useRef, useState } from 'react';
import type { CameraClipArray } from '../types/camera.types';

interface UndoRedoState {
  clips: CameraClipArray;
  // Can add more state here like selectedClipIndex, filters, etc.
}

/**
 * Hook for managing undo/redo functionality
 * Fixed: Proper state synchronization using refs to avoid stale closures
 */
export function useUndoRedo(initialClips: CameraClipArray) {
  const [history, setHistory] = useState<UndoRedoState[]>([{ clips: initialClips }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const historyIndexRef = useRef(0);
  const historyRef = useRef<UndoRedoState[]>([{ clips: initialClips }]);
  const maxHistorySize = 50; // Limit history to prevent memory issues

  // Sync refs with state
  React.useEffect(() => {
    historyIndexRef.current = historyIndex;
    historyRef.current = history;
  }, [historyIndex, history]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const addToHistory = useCallback((newState: UndoRedoState) => {
    setHistory((prev) => {
      const currentIndex = historyIndexRef.current;
      
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        // Index stays the same (we removed from the beginning)
        setHistoryIndex((prevIndex) => {
          const newIndex = Math.max(0, prevIndex - 1);
          historyIndexRef.current = newIndex;
          return newIndex;
        });
      } else {
        // Update index to point to new state
        const newIndex = newHistory.length - 1;
        setHistoryIndex(newIndex);
        historyIndexRef.current = newIndex;
      }
      
      historyRef.current = newHistory;
      return newHistory;
    });
  }, []);

  const undo = useCallback((): UndoRedoState | null => {
    const currentIndex = historyIndexRef.current;
    if (currentIndex <= 0) return null;
    
    const newIndex = currentIndex - 1;
    setHistoryIndex(newIndex);
    historyIndexRef.current = newIndex;
    
    // Return the previous state
    return historyRef.current[newIndex];
  }, []);

  const redo = useCallback((): UndoRedoState | null => {
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    
    if (currentIndex >= currentHistory.length - 1) return null;
    
    const newIndex = currentIndex + 1;
    setHistoryIndex(newIndex);
    historyIndexRef.current = newIndex;
    
    // Return the next state
    return currentHistory[newIndex];
  }, []);

  const getCurrentState = useCallback((): UndoRedoState => {
    return history[historyIndex];
  }, [history, historyIndex]);

  const reset = useCallback((newClips: CameraClipArray) => {
    const newHistory = [{ clips: newClips }];
    setHistory(newHistory);
    setHistoryIndex(0);
    historyIndexRef.current = 0;
    historyRef.current = newHistory;
  }, []);

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    getCurrentState,
    reset,
  };
}
