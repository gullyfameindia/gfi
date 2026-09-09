import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { cameraStyles } from '../styles/cameraStyles';
import { CameraModeEnum } from '../utils/mediaTypes';

interface ModeToggleProps {
  mode: CameraModeEnum;
  onChangeMode: (mode: CameraModeEnum) => void;
}

/**
 * Photo / Video mode switch.
 */
const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onChangeMode }) => {
  const setPhoto = () => onChangeMode(CameraModeEnum.Photo);
  const setVideo = () => onChangeMode(CameraModeEnum.Video);

  return (
    <View style={cameraStyles.modeToggle}>
      <TouchableOpacity
        style={[
          cameraStyles.modeToggleOption,
          mode === CameraModeEnum.Photo && cameraStyles.modeToggleOptionActive,
        ]}
        onPress={setPhoto}
      >
        <Text
          style={[
            cameraStyles.modeToggleText,
            mode === CameraModeEnum.Photo && cameraStyles.modeToggleTextActive,
          ]}
        >
          Photo
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          cameraStyles.modeToggleOption,
          mode === CameraModeEnum.Video && cameraStyles.modeToggleOptionActive,
        ]}
        onPress={setVideo}
      >
        <Text
          style={[
            cameraStyles.modeToggleText,
            mode === CameraModeEnum.Video && cameraStyles.modeToggleTextActive,
          ]}
        >
          Video
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModeToggle;


