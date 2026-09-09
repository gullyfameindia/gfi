import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import PreviewScreen from './screens/PreviewScreen';
import CameraErrorBoundary from './components/CameraErrorBoundary';
import type { CameraClipArray, CameraModuleScreenName } from './types/camera.types';










const CameraModule: React.FC = () => {
  const [screen, setScreen] = useState<CameraModuleScreenName>('Home');
  const [previewClips, setPreviewClips] = useState<CameraClipArray>([]);
  const [cameraClips, setCameraClips] = useState<CameraClipArray>([]);

  const handleOpenCamera = useCallback(() => {
    console.log('🎥 CameraModule: Opening camera screen');
    setCameraClips([]);
    setScreen('Camera');
  }, []);

  const handleBackToHome = useCallback(() => {
    console.log('🎥 CameraModule: Returning to home screen');
    setScreen('Home');
    setCameraClips([]);
    setPreviewClips([]);
  }, []);

  const handleNextFromCamera = useCallback((clips: CameraClipArray) => {
    console.log('🎬 [VERIFICATION] CameraModule: handleNextFromCamera called');
    console.log('  clips.length:', clips?.length ?? 0);
    console.log('  clips array:', JSON.stringify(clips?.map(c => ({
      id: c.id,
      duration: c.duration,
      uri: c.uri?.substring(0, 50),
      type: c.type
    })) ?? []));
    
    if (clips && clips.length > 0) {
      console.log('✅ [VERIFICATION] Clips valid - setting camera & preview clips');
    } else {
      console.log('⚠️ [VERIFICATION FAILED] Invalid clips array');
      return;
    }
    
    setCameraClips(clips);
    setPreviewClips(clips);
    console.log('✅ [VERIFICATION] Navigation: setting screen to Preview');
    setScreen('Preview');
  }, []);

  const handleAddClipFromPreview = useCallback((source: 'camera' | 'gallery') => {
    console.log('🎥 CameraModule: handleAddClipFromPreview called, source:', source);
    if (source === 'camera') {
      
      
      setScreen('Camera');
    }
    
  }, []);

  const handleBackFromPreview = useCallback(() => {
    console.log('🎥 CameraModule: Returning from preview to camera');
    
    
    setScreen('Camera');
  }, []);

  const handleClipUpdateFromPreview = useCallback((clips: CameraClipArray) => {
    console.log('🎥 CameraModule: handleClipUpdateFromPreview called with', clips.length, 'clips');
    setPreviewClips(clips);
    setCameraClips(clips);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {screen === 'Home' && <HomeScreen onOpenCamera={handleOpenCamera} />}
      {screen === 'Camera' && (
        <CameraErrorBoundary onReset={handleBackToHome}>
          <CameraScreen
            onBack={handleBackToHome}
            onNext={handleNextFromCamera}
            initialClips={cameraClips}
          />
        </CameraErrorBoundary>
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


