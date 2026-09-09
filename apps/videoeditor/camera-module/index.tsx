import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import PreviewScreen from './screens/PreviewScreen';
import type { CameraClipArray, CameraModuleScreenName } from './types/camera.types';










const CameraModule: React.FC = () => {
  const [screen, setScreen] = useState<CameraModuleScreenName>('Home');
  const [previewClips, setPreviewClips] = useState<CameraClipArray>([]);
  const [cameraClips, setCameraClips] = useState<CameraClipArray>([]);

  const handleOpenCamera = useCallback(() => {
    setCameraClips([]);
    setScreen('Camera');
  }, []);

  const handleBackToHome = useCallback(() => {
    setScreen('Home');
    setCameraClips([]);
    setPreviewClips([]);
  }, []);

  const handleNextFromCamera = useCallback((clips: CameraClipArray) => {
    console.log('🎥 CameraModule: handleNextFromCamera called with', clips?.length ?? 0, 'clips');
    console.log('🎥 CameraModule: Raw clips array:', JSON.stringify(clips, null, 2));
    if (clips && clips.length > 0) {
      console.log('📹 CameraModule: First clip:', JSON.stringify(clips[0], null, 2));
    }
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


