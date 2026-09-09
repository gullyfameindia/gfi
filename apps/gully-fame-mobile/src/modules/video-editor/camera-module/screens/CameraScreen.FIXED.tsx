import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { CameraView as ExpoCameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import BackArrow from '../components/BackArrow';
import CameraSwitchButton from '../components/CameraSwitchButton';
import CaptureButton from '../components/CaptureButton';
import ClipList from '../components/ClipList';
import ClipPlayerOverlay from '../components/ClipPlayerOverlay';
import FlashToggle from '../components/FlashToggle';
import GalleryButton from '../components/GalleryButton';
import HDSelector, { type ColorMode, type FrameRate, type Resolution } from '../components/HDSelector';
import ModeToggle from '../components/ModeToggle';
import SpeedSelector, { type SpeedMultiplier } from '../components/SpeedSelector';
import TimerSelector, { type TimerDuration } from '../components/TimerSelector';
import ZoomButtons from '../components/ZoomButtons';
import { useCamera } from '../hooks/useCamera';
import { usePermissions } from '../hooks/usePermissions';
import { cameraStyles } from '../styles/cameraStyles';
import type { CameraClip, CameraClipArray } from '../types/camera.types';
import { CameraModeEnum, FlashModeEnum } from '../utils/mediaTypes';

interface CameraScreenProps {
  onBack: () => void;
  onNext: (clips: CameraClipArray) => void;
  initialClips?: CameraClipArray;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ onBack, onNext, initialClips = [] }) => {
  
  const [mode, setMode] = useState<CameraModeEnum>(CameraModeEnum.Video);
  const [flash, setFlash] = useState<FlashModeEnum>(FlashModeEnum.Off);
  const [clips, setClips] = useState<CameraClipArray>(initialClips || []);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeClip, setActiveClip] = useState<CameraClip | null>(null);
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(15);
  const [speed, setSpeed] = useState<SpeedMultiplier>(1);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const [zoom, setZoom] = useState(1);
  const [resolution, setResolution] = useState<Resolution>('hd');
  const [frameRate, setFrameRate] = useState<FrameRate>(30);
  const [colorMode, setColorMode] = useState<ColorMode>('sdr');

  
  const recordingStartTimeRef = useRef<number | null>(null);
  const recordingTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  
  const { hasPermission, isRequesting, requestPermissions } = usePermissions();
  const { cameraRef, isRecording, recordingError, takePhoto, startRecording, stopRecording } = useCamera(mode, flash);

  

  
  useEffect(() => {
    if (initialClips && initialClips.length > 0) {
      setClips(initialClips);
    }
  }, [initialClips]);

  
  useEffect(() => {
    console.log('🎬 [DEBUG] isRecording:', isRecording, '| clips count:', clips.length);
  }, [isRecording, clips.length]);

  
  useEffect(() => {
    console.log('⏱️ [DEBUG] Timer effect triggered - isRecording:', isRecording);

    if (isRecording) {
      console.log('⏱️ [DEBUG] Starting timer interval');
      recordingStartTimeRef.current = Date.now();

      recordingTimerIntervalRef.current = setInterval(() => {
        if (recordingStartTimeRef.current) {
          const elapsed = (Date.now() - recordingStartTimeRef.current) / 1000;
          const seconds = Math.floor(elapsed);
          setRecordingSeconds(seconds);
          console.log('⏱️ [DEBUG] Timer update:', seconds, 'seconds');
        }
      }, 100);
    } else {
      console.log('⏱️ [DEBUG] Stopping timer interval');
      if (recordingTimerIntervalRef.current) {
        clearInterval(recordingTimerIntervalRef.current);
        recordingTimerIntervalRef.current = null;
      }
      setRecordingSeconds(0);
    }

    return () => {
      if (recordingTimerIntervalRef.current) {
        clearInterval(recordingTimerIntervalRef.current);
      }
    };
  }, [isRecording]);

  

  const formatTimer = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAddClip = useCallback((clip: CameraClip | null) => {
    if (!clip) {
      console.log('⚠️ handleAddClip: clip is null');
      return;
    }

    console.log('📸 handleAddClip called:');
    console.log('  - id:', clip.id);
    console.log('  - uri:', clip.uri?.substring(0, 40), '...');
    console.log('  - duration:', clip.duration);
    console.log('  - type:', clip.type);

    setClips((prev) => {
      const updated = [...prev, clip];
      console.log('✅ Clips state updated - new count:', updated.length);
      return updated;
    });

    
    setActiveClip(clip);
    console.log('🎬 Preview modal opened for clip:', clip.id);
  }, []);

  const handleCapturePress = useCallback(async () => {
    console.log('🎯 handleCapturePress - mode:', mode, '| isRecording:', isRecording);

    if (mode === CameraModeEnum.Video) {
      if (isRecording) {
        console.log('⏹️ Stopping recording...');
        await stopRecording();
      } else {
        console.log('🔴 Starting recording...');
        recordingStartTimeRef.current = Date.now();
        await startRecording(handleAddClip, timerDuration, speed);
      }
    } else {
      console.log('📷 Taking photo...');
      const photo = await takePhoto();
      if (photo) {
        handleAddClip(photo);
      }
    }
  }, [mode, isRecording, stopRecording, startRecording, handleAddClip, timerDuration, speed, takePhoto]);

  const handleNextPress = useCallback(() => {
    console.log('➡️ handleNextPress - clips count:', clips.length);
    if (clips.length > 0) {
      console.log('✅ Calling onNext with', clips.length, 'clips');
      onNext(clips);
    } else {
      console.log('⚠️ No clips to send');
    }
  }, [clips, onNext]);

  const handleSwitchCamera = useCallback(() => {
    console.log('🔄 Switching camera');
    setCameraFacing((prev) => (prev === 'front' ? 'back' : 'front'));
    setZoom(1);
  }, []);

  

  const totalRecordedTime = useMemo(() => {
    return clips.reduce((acc, c) => acc + (c.duration || 0), 0) + (isRecording ? recordingSeconds : 0);
  }, [clips, isRecording, recordingSeconds]);

  const progressPercent = useMemo(() => {
    const max = timerDuration || 15;
    return Math.min(100, (totalRecordedTime / max) * 100);
  }, [totalRecordedTime, timerDuration]);

  

  if (!hasPermission) {
    return (
      <SafeAreaView style={cameraStyles.permissionContainer}>
        <Text style={cameraStyles.permissionText}>Camera and Microphone access required.</Text>
        <TouchableOpacity style={cameraStyles.permissionButton} onPress={requestPermissions} disabled={isRequesting}>
          <Text style={cameraStyles.permissionButtonText}>Grant permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={cameraStyles.cameraContainer}>
      <View style={cameraStyles.cameraPreview}>
        {}
        <ExpoCameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={cameraFacing}
          flash={flash === FlashModeEnum.On ? 'on' : 'off'}
          mode={mode === CameraModeEnum.Video ? 'video' : 'picture'}
        />

        {}
        <View style={styles.progressBar}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>

        {}
        {recordingError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {recordingError}</Text>
          </View>
        )}

        {}
        {isRecording && (
          <View style={styles.timerBadge}>
            <View style={styles.redDot} />
            <Text style={styles.timerText}>{formatTimer(recordingSeconds)}</Text>
          </View>
        )}

        {}
        <View style={cameraStyles.topBar}>
          <TouchableOpacity style={cameraStyles.backButton} onPress={onBack}>
            <BackArrow />
          </TouchableOpacity>
          <ModeToggle mode={mode} onChangeMode={setMode} />
        </View>

        {}
        <View style={cameraStyles.flashOverlay}>
          <FlashToggle
            flash={flash}
            onToggle={() => setFlash(f => f === FlashModeEnum.On ? FlashModeEnum.Off : FlashModeEnum.On)}
          />
        </View>

        <View style={cameraStyles.timerSelectorOverlay}>
          <TimerSelector duration={timerDuration} onDurationChange={setTimerDuration} disabled={mode === CameraModeEnum.Photo} />
        </View>

        <View style={cameraStyles.speedSelectorOverlay}>
          <SpeedSelector speed={speed} onSpeedChange={setSpeed} disabled={mode === CameraModeEnum.Photo} />
        </View>
      </View>

      {}
      <View style={cameraStyles.bottomBar}>
        {}
        <View style={cameraStyles.bottomControlsRow}>
          <View style={styles.sideControl}>
            <GalleryButton
              onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.All,
                  quality: 1,
                });
                if (!result.canceled && result.assets[0]) {
                  const asset = result.assets[0];
                  const clip: CameraClip = {
                    id: `gallery-${Date.now()}`,
                    uri: asset.uri,
                    duration: asset.duration || 3,
                    type: asset.type === 'video' ? 'video' : 'photo',
                    source: 'gallery',
                  };
                  setClips((prev) => [...prev, clip]);
                }
              }}
            />
          </View>

          <View style={styles.centerControl}>
            <CaptureButton
              mode={mode}
              isRecording={isRecording}
              onPress={handleCapturePress}
              disabled={!hasPermission}
            />
          </View>

          <View style={styles.sideControlRight}>
            <CameraSwitchButton onPress={handleSwitchCamera} />
          </View>
        </View>

        {}
        {clips.length > 0 && !isRecording && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress} activeOpacity={0.8}>
            <Text style={styles.nextText}>Next ⟩</Text>
          </TouchableOpacity>
        )}

        {}
        <ClipList
          clips={clips}
          onDeleteClip={(id) => setClips((c) => c.filter((x) => x.id !== id))}
          onPressClip={setActiveClip}
        />
      </View>

      {}
      {activeClip && <ClipPlayerOverlay clip={activeClip} onClose={() => setActiveClip(null)} />}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  progressBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    zIndex: 100,
    elevation: 100,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF0050',
  },
  errorBanner: {
    position: 'absolute',
    top: 20,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(255, 60, 60, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    zIndex: 100,
    elevation: 100,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  timerBadge: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 100,
    elevation: 100,
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0050',
    marginRight: 8,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sideControl: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerControl: {
    flex: 1,
    alignItems: 'center',
  },
  sideControlRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 26,
    zIndex: 100,
    elevation: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
  nextText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default CameraScreen;
