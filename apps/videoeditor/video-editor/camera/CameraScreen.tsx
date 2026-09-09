

import React, { useState, useCallback } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera'; 
import HDSelector from '@/camera-module/components/HDSelector';







const CameraScreen: React.FC = () => {
  
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const [config, setConfig] = useState({
    resolution: '1080p', 
    fps: 30,
    hdr: false
  });

  const handleRequest = useCallback(async () => {
    await requestCameraPermission();
    await requestMicPermission();
  }, [requestCameraPermission, requestMicPermission]);

  
  if (!cameraPermission || !micPermission) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color="#ffffff" size="large" />
        <Text style={styles.message}>Checking camera permissions…</Text>
      </SafeAreaView>
    );
  }

  
  if (!cameraPermission.granted || !micPermission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.message}>
          This feature needs access to your camera and microphone to record video.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRequest}
        >
          <Text style={styles.primaryButtonText}>
            Grant permission
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  
  return (
    <SafeAreaView style={styles.container}>
      {}
      <View style={styles.previewArea}>
        <CameraView
          style={styles.camera}
          facing="back"
          flash="off"
          
          videoQuality={config.resolution === '4k' ? '2160p' : '1080p'} 
        />
      </View>

      {}
      <View style={styles.controlsArea}>
        <HDSelector
          resolution={config.resolution as any}
          frameRate={config.fps as any}
          colorMode={config.hdr ? 'hdr' : 'sdr'}
          onResolutionChange={(res) => setConfig(prev => ({ ...prev, resolution: res }))}
          onFrameRateChange={(fps) => setConfig(prev => ({ ...prev, fps }))}
          onColorModeChange={(mode) => setConfig(prev => ({ ...prev, hdr: mode === 'hdr' }))}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', 
    backgroundColor: '#000',
  },
  previewArea: {
    flex: 1, 
    width: '100%',
    backgroundColor: '#000',
  },
  controlsArea: {
    height: '30%', 
    width: '100%',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: '#050509',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  message: {
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#e5e7eb',
    fontSize: 14,
  },
  primaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#3b82f6',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default CameraScreen;