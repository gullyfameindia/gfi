import { useCallback, useRef, useState, type MutableRefObject } from 'react';
import React from 'react';
import type { CameraRecordingOptions } from 'expo-camera';
import type { CameraClip } from '../types/camera.types';
import { CameraModeEnum } from '../utils/mediaTypes';
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
 
export interface UseCameraResult {
  cameraRef: MutableRefObject<any>;
  isRecording: boolean;
  recordingError: string | null;
  takePhoto: () => Promise<CameraClip | null>;
  startRecording: (
    onFinished: (clip: CameraClip | null) => void | Promise<void>,
    maxDurationSeconds?: number,
    speed?: number
  ) => Promise<void>;
  stopRecording: () => Promise<void>;
}
 
const IS_ANDROID = Platform.OS === 'android';
 
export const useCamera = (mode: CameraModeEnum, _flash: unknown): UseCameraResult => {
  const cameraRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const isRecordingRef = useRef(false);
 
  const recordingStartTimeRef = useRef<number>(0);
  const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 
  const takePhoto = useCallback(async (): Promise<CameraClip | null> => {
    if (!cameraRef.current || mode !== CameraModeEnum.Photo) return null;
    const makeId = () => `clip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
 
    try {
      const photo = await cameraRef.current.takePictureAsync();
      const uri = (photo as { uri?: string }).uri ?? '';
      if (!uri) return null;
      return { id: makeId(), uri, duration: 0, type: 'photo', source: 'camera' };
    } catch (error) {
      console.error('❌ Photo Error:', error);
      setRecordingError('Photo capture failed');
      Alert.alert("Photo Error", "Failed to capture photo.");
      return null;
    }
  }, [mode]);
 
  const startRecording = useCallback(
    async (
      onFinished: (clip: CameraClip | null) => void | Promise<void>,
      maxDurationSeconds?: number,
      speed?: number
    ): Promise<void> => {
      console.log('[RECORDING] startRecording called');
      console.log('[CAMERA] ref exists:', !!cameraRef.current);
      console.log('[CAMERA] isVideoMode:', mode === CameraModeEnum.Video);
      console.log('[CAMERA] alreadyRecording:', isRecordingRef.current);
      
      if (!cameraRef.current || mode !== CameraModeEnum.Video || isRecordingRef.current) {
        console.warn('[RECORDING] Guard failed - cannot start');
        return;
      }

      console.log('[RECORDING] ✅ All guards passed');
      setRecordingError(null);
      const makeId = () => `clip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const recordingId = makeId();

      
      isRecordingRef.current = true;
      setIsRecording(true);
      recordingStartTimeRef.current = Date.now();
      console.log('[RECORDING] ✅ UI state set to recording');

      if (maxDurationTimerRef.current) {
        clearTimeout(maxDurationTimerRef.current);
        maxDurationTimerRef.current = null;
      }

      
      const delayStartRecording = () => {
        console.log('[RECORDING] 150ms delay complete - calling recordAsync');

        try {
          const options: any = IS_ANDROID ? {
            mute: false,
            maxDuration: maxDurationSeconds || 60,
            maxFileSize: 500000000,
            quality: '480p',
            codec: 'H264',
          } : {};

          console.log('[RECORDING] recordAsync options:', JSON.stringify(options));
          console.log('[RECORDING] Calling cameraRef.current.recordAsync()');
          
          const recordingPromise = cameraRef.current.recordAsync(options);
          console.log('[RECORDING] recordAsync promise created, waiting...');

          if (maxDurationSeconds && maxDurationSeconds > 0) {
            console.log('[RECORDING] Setting max duration timeout:', maxDurationSeconds, 's');
            maxDurationTimerRef.current = setTimeout(async () => {
              console.log('[RECORDING] Max duration timeout fired');
              if (cameraRef.current && isRecordingRef.current) {
                try {
                  await cameraRef.current.stopRecording();
                  console.log('[RECORDING] stopRecording called from timeout');
                } catch (e) {
                  console.error('[RECORDING] Error stopping on timeout:', e);
                }
              }
            }, maxDurationSeconds * 1000);
          }

          recordingPromise
            .then(async (video: any) => {
              console.log('[RECORDING] ✅ recordAsync RESOLVED');
              console.log('[RECORDING] video result:', JSON.stringify(video, null, 2));

              if (maxDurationTimerRef.current) {
                clearTimeout(maxDurationTimerRef.current);
                maxDurationTimerRef.current = null;
              }

              isRecordingRef.current = false;
              setIsRecording(false);
              setRecordingError(null);

              const uri = (video as { uri?: string }).uri ?? '';
              let duration = (video as { duration?: number }).duration ?? 0;

              console.log('[RECORDING] uri:', uri?.substring(0, 60));
              console.log('[RECORDING] duration from result:', duration);
              
              
              let fileSize = 0;
              if (uri) {
                try {
                  const fileInfo = await FileSystem.getInfoAsync(uri);
                  fileSize = (fileInfo as any).size || 0;
                  console.log('[FILE] exists:', fileInfo.exists, '| size:', (fileSize / (1024 * 1024)).toFixed(2), 'MB');
                  
                  if (!fileInfo.exists) {
                    console.error('[FILE] ❌ File does not exist:', uri);
                    setRecordingError('Video file not saved');
                    Alert.alert("Error", "Video file was not saved.");
                    void onFinished(null);
                    return;
                  }
                  
                  if (fileSize === 0) {
                    console.error('[FILE] ❌ File is empty (0 bytes)');
                    setRecordingError('Video file is empty');
                    Alert.alert("Error", "Video file is empty.");
                    void onFinished(null);
                    return;
                  }
                } catch (fileCheckError) {
                  console.warn('[FILE] Could not check file:', fileCheckError);
                }
              }

              
              if (!duration || duration <= 0) {
                duration = Math.max(1, (Date.now() - recordingStartTimeRef.current) / 1000);
                console.log('[RECORDING] ⚠️ Duration was 0, calculated:', duration);
              }

              if (!uri) {
                console.error('[RECORDING] ❌ No URI in result');
                setRecordingError('Video URI missing');
                Alert.alert("Error", "No video URI returned.");
                void onFinished(null);
              } else {
                const clip: CameraClip = {
                  id: recordingId,
                  uri,
                  duration,
                  type: 'video',
                  source: 'camera',
                  speed: speed ?? 1,
                };
                console.log('[CLIP] ✅ Created:', {
                  id: clip.id,
                  duration,
                  fileSize: (fileSize / (1024 * 1024)).toFixed(2),
                  uri: uri.substring(0, 60)
                });
                console.log('[CALLBACK] Calling onFinished with clip');
                void onFinished(clip);
              }
            })
            .catch((err: any) => {
              console.error('[RECORDING] ❌ recordAsync ERROR:', err);
              console.error('[RECORDING] Error message:', err?.message);
              console.error('[RECORDING] Error code:', err?.code);

              if (maxDurationTimerRef.current) clearTimeout(maxDurationTimerRef.current);
              isRecordingRef.current = false;
              setIsRecording(false);
              const errorMsg = err?.message || "Failed to save video";
              setRecordingError(errorMsg);
              Alert.alert("Recording Error", errorMsg);
              void onFinished(null);
            });
        } catch (error: any) {
          console.error('[RECORDING] ❌ Exception in delayStartRecording:', error);

          isRecordingRef.current = false;
          setIsRecording(false);
          const errorMsg = error?.message || "Could not start recording";
          setRecordingError(errorMsg);
          Alert.alert("Camera Error", errorMsg);
          void onFinished(null);
        }
      };

      setTimeout(delayStartRecording, 150);
    },
    [mode]
  );
 
  const stopRecording = useCallback(async (): Promise<void> => {
    console.log('[STOP] stopRecording called');
    console.log('[STOP] camera ref exists:', !!cameraRef.current);
    console.log('[STOP] isRecordingRef.current:', isRecordingRef.current);
    
    if (!cameraRef.current || !isRecordingRef.current) {
      console.warn('[STOP] Guard failed - cannot stop');
      return;
    }

    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }

    try {
      console.log('[STOP] Calling cameraRef.current.stopRecording()');
      await cameraRef.current.stopRecording();
      console.log('[STOP] ✅ stopRecording succeeded');
    } catch (error: any) {
      console.error('[STOP] ❌ stopRecording error:', error);
      console.error('[STOP] Error message:', error?.message);
      const errorMsg = error?.message || "Failed to stop recording";
      setRecordingError(errorMsg);
      Alert.alert("Stop Error", errorMsg);
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  }, []);
 
  return { cameraRef, isRecording, recordingError, takePhoto, startRecording, stopRecording };
};
