import React from "react";
import { View } from "react-native";
import CameraModule from "../../camera-module";

/**
 * Root entry point for the video editor module.
 *
 * This module exposes the full camera module with all features:
 * - Home screen
 * - Camera capture with all editing tools
 * - Preview and editing
 * - Export pipeline
 *
 * Consumers can import it as:
 *   import { VideoEditorModule } from '@video-editor';
 */
const VideoEditorModule: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <CameraModule />
    </View>
  );
};

export default VideoEditorModule;
