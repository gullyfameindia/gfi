import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import PreviewScreen from './screens/PreviewScreen';
import type { CameraClipArray, CameraModuleScreenName } from './types/camera.types';

/**
 * Root entry point for the self-contained camera module.
 *
 * This component owns ONLY navigation and data passed to Preview:
 * - Home → Camera → Preview
 *
 * Camera-specific UI state (mode, flash, clips) lives inside `CameraScreen`.
 * PreviewScreen receives a snapshot of clips when the user presses Next.
 */
export interface CameraModuleProps {
  onExport?: (result: any) => void;
  onCancel?: () => void;
  initialMode?: 'camera' | 'gallery' | 'home';
  competitionId?: string;
  competitionName?: string;
  entryFee?: string;
}

const CameraModule: React.FC<CameraModuleProps> = ({
  onExport,
  onCancel,
  initialMode = 'Camera',
  competitionId,
  competitionName,
  entryFee,
}) => {
  const initialScreen: CameraModuleScreenName = 
    initialMode === 'home' ? 'Home' : 'Camera';
  const [screen, setScreen] = useState<CameraModuleScreenName>(initialScreen);
  const [previewClips, setPreviewClips] = useState<CameraClipArray>([]);
  const [cameraClips, setCameraClips] = useState<CameraClipArray>([]);

  const handleOpenCamera = useCallback(() => {
    setCameraClips([]);
    setScreen('Camera');
  }, []);

  const handleBackToHome = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      setScreen('Home');
      setCameraClips([]);
      setPreviewClips([]);
    }
  }, [onCancel]);

  const handleNextFromCamera = useCallback((clips: CameraClipArray) => {
    console.log('🎥 CameraModule: handleNextFromCamera called with', clips?.length ?? 0, 'clips');
    setCameraClips(clips);
    setPreviewClips(clips);
    setScreen('Preview');
  }, []);

  const handleAddClipFromPreview = useCallback((source: 'camera' | 'gallery') => {
    if (source === 'camera') {
      setScreen('Camera');
    }
  }, []);

  const handleBackFromPreview = useCallback(() => {
    setScreen('Camera');
  }, []);

  const handleClipUpdateFromPreview = useCallback((clips: CameraClipArray) => {
    setPreviewClips(clips);
    setCameraClips(clips);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {screen === 'Home' && <HomeScreen onOpenCamera={handleOpenCamera} />}
      {screen === 'Camera' && (
        <CameraScreen
          onBack={handleBackToHome}
          onNext={handleNextFromCamera}
          initialClips={cameraClips}
        />
      )}
      {screen === 'Preview' && (
        <PreviewScreen
          clips={previewClips}
          onBack={handleBackFromPreview}
          onClipUpdate={handleClipUpdateFromPreview}
          onAddClip={handleAddClipFromPreview}
        />
      )}
    </View>
  );
};

export default CameraModule;


