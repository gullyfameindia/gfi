import React from "react";
import { View } from "react-native";
import CameraModule from "../../camera-module";













const VideoEditorModule: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <CameraModule />
    </View>
  );
};

export default VideoEditorModule;
