import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { CameraView as ExpoCameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CameraScreenProps {
  onBack: () => void;
  onNext: (clips: CameraClipArray) => void;
  initialClips?: CameraClipArray;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ onBack, onNext, initialClips = [] }) => {
  const [mode, setMode] = useState<CameraModeEnum>(CameraModeEnum.Video);
  const [flash, setFlash] = useState<FlashModeEnum>(FlashModeEnum.Off);
  const [clips, setClips] = useState<CameraClipArray>(initialClips);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeClip, setActiveClip] = useState<CameraClip | null>(null);
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(15);
  const [speed, setSpeed] = useState<SpeedMultiplier>(1);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const [zoom, setZoom] = useState(1);
  const [resolution, setResolution] = useState<Resolution>('hd');
  const [frameRate, setFrameRate] = useState<FrameRate>(30);
  const [colorMode, setColorMode] = useState<ColorMode>('sdr');
  const [isCameraReady, setIsCameraReady] = useState(false);

  const recordingStartTimeRef = useRef<number | null>(null);
  const recordingTimerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { hasPermission, isRequesting, requestPermissions } = usePermissions();
  const { cameraRef, isRecording, recordingError, takePhoto, startRecording, stopRecording } = useCamera(mode, flash);

  
  useEffect(() => {
    console.log('🎬 [DEBUG] isRecording changed:', isRecording, 'clips length:', clips.length);
  }, [isRecording, clips.length]);

  useEffect(() => {
    if (initialClips) setClips(initialClips);
  }, [initialClips]);

  
  useEffect(() => {
    console.log('⏱️ [DEBUG] Timer effect - isRecording:', isRecording);
    if (isRecording) {
      recordingStartTimeRef.current = Date.now();
      recordingTimerIntervalRef.current = setInterval(() => {
        if (recordingStartTimeRef.current) {
          const elapsed = (Date.now() - recordingStartTimeRef.current) / 1000;
          setRecordingSeconds(Math.floor(elapsed));
          console.log('⏱️ [DEBUG] Timer tick:', Math.floor(elapsed), 'seconds');
        }
      }, 100);
    } else {
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

  const handleSwitchCamera = useCallback(() => {
    setCameraFacing(prev => (prev === 'front' ? 'back' : 'front'));
    setZoom(1);
  }, []);

  const handleAddClip = useCallback((clip: CameraClip | null) => {
    if (!clip) {
      console.log('⚠️ handleAddClip: clip is null, returning');
      return;
    }
    
    console.log('📸 handleAddClip: Adding clip to state');
    console.log('  clip.id:', clip.id);
    console.log('  clip.uri:', clip.uri?.substring(0, 50), '...');
    console.log('  clip.duration:', clip.duration);
    console.log('  clip.type:', clip.type);
    
    setClips(prev => {
      const updated = [...prev, clip];
      console.log('✅ Clips updated. New length:', updated.length);
      console.log('📊 All clips:', JSON.stringify(updated.map(c => ({ id: c.id, duration: c.duration })), null, 2));
      return updated;
    });
    
    
    console.log('🎬 Opening preview for clip:', clip.id);
    setActiveClip(clip);
  }, []);

  const handleCapturePress = useCallback(async () => {
    console.log('🎬 handleCapturePress called - mode:', mode, 'isRecording:', isRecording);
    if (mode === CameraModeEnum.Video) {
      if (isRecording) {
        console.log('⏹️ Recording active, stopping...');
        await stopRecording();
      } else {
        console.log('🔴 No recording, starting new recording...');
        recordingStartTimeRef.current = Date.now();
        await startRecording(handleAddClip, timerDuration, speed);
      }
    } else {
      console.log('📷 Photo mode - taking photo');
      const photo = await takePhoto();
      if (photo) {
        console.log('✅ Photo taken, adding to clips');
        handleAddClip(photo);
      }
    }
  }, [mode, isRecording, stopRecording, startRecording, handleAddClip, timerDuration, speed, takePhoto]);

  const handleNextPress = useCallback(() => {
    console.log('➡️ handleNextPress: clips.length =', clips.length);
    if (clips.length > 0) {
      console.log('✅ NextPress: Calling onNext with', clips.length, 'clips');
      onNext(clips);
    } else {
      console.log('⚠️ NextPress: No clips to send');
    }
  }, [clips, onNext]);

  const formatTimer = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
        <ExpoCameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={cameraFacing}
          flash={flash === FlashModeEnum.On ? 'on' : 'off'}
          mode={mode === CameraModeEnum.Video ? 'video' : 'picture'}
        />

        {}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>

        {}
        {recordingError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {recordingError}</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.errorDismiss}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {}
        {isRecording && (
          <View style={styles.recordingTimerBadge}>
            <View style={styles.redDot} />
            <Text style={styles.recordingTimerText}>{formatTimer(recordingSeconds)}</Text>
          </View>
        )}

        <View style={cameraStyles.topBar}>
          <TouchableOpacity style={cameraStyles.backButton} onPress={onBack}>
            <BackArrow />
          </TouchableOpacity>
          <ModeToggle mode={mode} onChangeMode={(newMode) => {
             setMode(newMode);
          }} />
        </View>

        <View style={cameraStyles.flashOverlay}>
          <FlashToggle flash={flash} onToggle={() => setFlash(f => f === FlashModeEnum.On ? FlashModeEnum.Off : FlashModeEnum.On)} />
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
        <View style={cameraStyles.bottomControlsRow}>
          <View style={styles.sideControl}>
            <GalleryButton onPress={async () => {
              const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 1 });
              if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                setClips(prev => [...prev, { id: `gallery-${Date.now()}`, uri: asset.uri, duration: asset.duration || 3, type: asset.type === 'video' ? 'video' : 'photo', source: 'gallery' }]);
              }
            }} />
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
          <TouchableOpacity style={styles.instagramNextButton} onPress={handleNextPress} activeOpacity={0.7}>
            <Text style={styles.instagramNextText}>Next ⟩</Text>
          </TouchableOpacity>
        )}

        <ClipList clips={clips} onDeleteClip={(id) => setClips(c => c.filter(x => x.id !== id))} onPressClip={setActiveClip} />
      </View>

      {}
      {activeClip && <ClipPlayerOverlay clip={activeClip} onClose={() => setActiveClip(null)} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    zIndex: 99,
    elevation: 99,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF0050',
  },
  errorBanner: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 87, 87, 0.95)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 99,
    elevation: 99,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  errorDismiss: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  recordingTimerBadge: {
    position: 'absolute',
    top: 75,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 99,
    elevation: 99,
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0050',
    marginRight: 8,
  },
  recordingTimerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sideControl: { 
    flex: 1, 
    alignItems: 'flex-start' 
  },
  centerControl: { 
    flex: 1, 
    alignItems: 'center' 
  },
  sideControlRight: { 
    flex: 1, 
    alignItems: 'flex-end', 
    justifyContent: 'center' 
  },
  instagramNextButton: {
    position: 'absolute',
    bottom: 40,
    right: 25,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 99,
    elevation: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  instagramNextText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CameraScreen;