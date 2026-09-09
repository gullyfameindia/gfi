import React, { useCallback, useRef, useState } from 'react';
import type { CameraClipArray } from '../types/camera.types';

interface UndoRedoState {
  clips: CameraClipArray;
  
}





export function useUndoRedo(initialClips: CameraClipArray) {
  const [history, setHistory] = useState<UndoRedoState[]>([{ clips: initialClips }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const historyIndexRef = useRef(0);
  const historyRef = useRef<UndoRedoState[]>([{ clips: initialClips }]);
  const maxHistorySize = 50; 

  
  React.useEffect(() => {
    historyIndexRef.current = historyIndex;
    historyRef.current = history;
  }, [historyIndex, history]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const addToHistory = useCallback((newState: UndoRedoState) => {
    setHistory((prev) => {
      const currentIndex = historyIndexRef.current;
      
      
      const newHistory = prev.slice(0, currentIndex + 1);
      
      
      newHistory.push(newState);
      
      
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        
        setHistoryIndex((prevIndex) => {
          const newIndex = Math.max(0, prevIndex - 1);
          historyIndexRef.current = newIndex;
          return newIndex;
        });
      } else {
        
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
    
    
    return historyRef.current[newIndex];
  }, []);

  const redo = useCallback((): UndoRedoState | null => {
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    
    if (currentIndex >= currentHistory.length - 1) return null;
    
    const newIndex = currentIndex + 1;
    setHistoryIndex(newIndex);
    historyIndexRef.current = newIndex;
    
    
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
