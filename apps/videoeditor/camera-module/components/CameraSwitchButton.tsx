import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { cameraStyles } from '../styles/cameraStyles';

interface CameraSwitchButtonProps {
  onPress: () => void;
}

/**
 * Camera switch button (front/back toggle) with custom SVG icon.
 * Positioned to the right of the capture button.
 */
const CameraSwitchButton: React.FC<CameraSwitchButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={cameraStyles.cameraSwitchButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Switch camera"
      activeOpacity={0.8}
    >
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M11 19H4a2 2 0 01-2-2V7a2 2 0 012-2h5"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M13 5h7a2 2 0 012 2v10a2 2 0 01-2 2h-5"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="12" cy="12" r="3" stroke="#ffffff" strokeWidth="2" />
        <Path
          d="M18 22l-3-3 3-3"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M6 2l3 3-3 3"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default CameraSwitchButton;

