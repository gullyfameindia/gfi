import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { cameraStyles } from '../styles/cameraStyles';

interface HomeScreenProps {
  onOpenCamera: () => void;
}

/**
 * Entry screen with a centered "Upload" button that opens the camera.
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenCamera }) => {
  return (
    <SafeAreaView style={cameraStyles.homeContainer}>
      <Text style={cameraStyles.homeTitle}>Camera Module</Text>
      <Text style={cameraStyles.homeSubtitle}>
        Capture a photo or video, then preview it before continuing.
      </Text>
      <TouchableOpacity
        style={cameraStyles.uploadButton}
        onPress={onOpenCamera}
        activeOpacity={0.8}
      >
        <Text style={cameraStyles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;


