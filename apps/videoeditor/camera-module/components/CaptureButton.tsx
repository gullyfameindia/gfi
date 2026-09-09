import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { cameraStyles } from '../styles/cameraStyles';
import { CameraModeEnum } from '../utils/mediaTypes';

interface CaptureButtonProps {
  mode: CameraModeEnum;
  isRecording: boolean;
  disabled?: boolean;
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}




const CaptureButton: React.FC<CaptureButtonProps> = ({
  mode,
  isRecording,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
}) => {
  const label =
    mode === CameraModeEnum.Photo
      ? 'Capture'
      : isRecording
      ? 'Stop'
      : 'Record';


  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      style={cameraStyles.captureButtonOuter}
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <View
        style={[
          cameraStyles.captureButtonInner,
          mode === CameraModeEnum.Video &&
            isRecording &&
            cameraStyles.captureButtonInnerRecording,
        ]}
      >
        {}
        <View
          style={[
            cameraStyles.captureButtonInnerCircle,
            mode === CameraModeEnum.Video &&
              isRecording &&
              cameraStyles.captureButtonInnerCircleRecording,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CaptureButton;
