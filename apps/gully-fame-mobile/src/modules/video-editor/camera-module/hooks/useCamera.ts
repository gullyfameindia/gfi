import { useCallback, useRef, useState, type MutableRefObject } from 'react';
import type { CameraRecordingOptions } from 'expo-camera';
import type { CameraClip } from '../types/camera.types';
import { CameraModeEnum } from '../utils/mediaTypes';

export interface UseCameraResult {
  cameraRef: MutableRefObject<any>;
  isRecording: boolean;
  takePhoto: () => Promise<CameraClip | null>;
  startRecording: (onFinished: (clip: CameraClip | null) => void | Promise<void>, maxDurationSeconds?: number, speed?: number) => Promise<void>;
  stopRecording: () => Promise<void>;
}

/**
 * Hook that encapsulates expo-camera capture logic.
 */
export const useCamera = (mode: CameraModeEnum, _flash: unknown): UseCameraResult => {
  const cameraRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRecordingRef = useRef(false);

  const takePhoto = useCallback(async (): Promise<CameraClip | null> => {
    if (!cameraRef.current || mode !== CameraModeEnum.Photo) {
      return null;
    }

    const makeId = () =>
      `clip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      const uri = (photo as { uri?: string }).uri ?? '';
      if (!uri) {
        return null;
      }

      return {
        id: makeId(),
        uri,
        duration: 0,
        type: 'photo',
        source: 'camera',
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to take photo', error);
      return null;
    }
  }, [mode]);

  const startRecording = useCallback(
    async (onFinished: (clip: CameraClip | null) => void | Promise<void>, maxDurationSeconds?: number, speed?: number): Promise<void> => {
      if (!cameraRef.current || mode !== CameraModeEnum.Video || isRecording) {
        console.log('[useCamera] startRecording: Cannot start recording', {
          hasRef: !!cameraRef.current,
          modeCorrect: mode === CameraModeEnum.Video,
          isRecording,
        });
        return;
      }

      const makeId = () =>
        `clip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

      setIsRecording(true);
      isRecordingRef.current = true;
      console.log('[useCamera] startRecording: Set recording to true');

      // Clear any existing timer
      if (maxDurationTimerRef.current) {
        clearTimeout(maxDurationTimerRef.current);
        maxDurationTimerRef.current = null;
      }

      try {
        console.log('[useCamera] startRecording: Starting camera recording');
        const options: CameraRecordingOptions = {};
        const recordingPromise = cameraRef.current.recordAsync(options);
        console.log('[useCamera] startRecording: Recording promise created');

        // Set up auto-stop timer if maxDuration is provided
        if (maxDurationSeconds && maxDurationSeconds > 0) {
          maxDurationTimerRef.current = setTimeout(async () => {
            if (cameraRef.current && isRecordingRef.current) {
              try {
                console.log('[useCamera] startRecording: Auto-stopping recording after', maxDurationSeconds, 'seconds');
                await cameraRef.current.stopRecording();
              } catch (error) {
                console.error('[useCamera] startRecording: Failed to auto-stop recording', error);
              }
            }
          }, maxDurationSeconds * 1000);
        }

        recordingPromise
          .then((video: any) => {
            console.log('[useCamera] startRecording: Recording finished successfully', {
              hasUri: !!video?.uri,
              duration: video?.duration,
            });
            // Clear timer if recording finishes before timeout
            if (maxDurationTimerRef.current) {
              clearTimeout(maxDurationTimerRef.current);
              maxDurationTimerRef.current = null;
            }
            setIsRecording(false);
            isRecordingRef.current = false;
            const uri = (video as { uri?: string }).uri ?? '';
            const duration = (video as { duration?: number }).duration ?? 0;

            if (!uri) {
              console.error('[useCamera] startRecording: No URI in video result');
              void onFinished(null);
            } else {
              console.log('[useCamera] startRecording: Calling onFinished with clip');
              void onFinished({
                id: makeId(),
                uri,
                duration,
                type: 'video',
                source: 'camera',
                speed: speed ?? 1, // Store speed multiplier with clip
              });
            }
          })
          .catch((error: any) => {
            console.error('[useCamera] startRecording: Recording promise rejected', {
              error,
              message: error?.message,
              code: error?.code,
              stack: error?.stack,
            });
            // Clear timer on error
            if (maxDurationTimerRef.current) {
              clearTimeout(maxDurationTimerRef.current);
              maxDurationTimerRef.current = null;
            }
            setIsRecording(false);
            isRecordingRef.current = false;
            void onFinished(null);
          });
      } catch (error) {
        console.error('[useCamera] startRecording: Sync error', {
          error,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        // Clear timer on error
        if (maxDurationTimerRef.current) {
          clearTimeout(maxDurationTimerRef.current);
          maxDurationTimerRef.current = null;
        }
        setIsRecording(false);
        isRecordingRef.current = false;
        void onFinished(null);
      }
    },
    [isRecording, mode],
  );

  const stopRecording = useCallback(async (): Promise<void> => {
    if (!cameraRef.current || !isRecording) {
      console.log('[useCamera] stopRecording: Camera ref or isRecording issue', {
        hasRef: !!cameraRef.current,
        isRecording,
      });
      return;
    }

    console.log('[useCamera] stopRecording: Starting stop recording process');

    // Clear auto-stop timer
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }

    isRecordingRef.current = false;

    try {
      console.log('[useCamera] stopRecording: Calling camera.stopRecording()');
      const result = await cameraRef.current.stopRecording();
      console.log('[useCamera] stopRecording: Successfully stopped recording', result);
      setIsRecording(false);
    } catch (error) {
      console.error('[useCamera] stopRecording: FAILED TO STOP RECORDING', {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      setIsRecording(false);
      throw error; // Re-throw so CameraScreen can handle it
    }
  }, [isRecording]);

  return {
    cameraRef,
    isRecording,
    takePhoto,
    startRecording,
    stopRecording,
  };
};

