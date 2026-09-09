import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cameraStyles } from '../styles/cameraStyles';
import { FlashModeEnum } from '../utils/mediaTypes';

interface FlashToggleProps {
  flash: FlashModeEnum;
  onToggle: () => void;
}

const FlashToggle: React.FC<FlashToggleProps> = ({ flash, onToggle }) => {
  const isFlashOn = flash === FlashModeEnum.On;

  return (
    <TouchableOpacity
      style={cameraStyles.flashToggleButton}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={isFlashOn ? 'Flash On' : 'Flash Off'}
    >
      <Ionicons
        name={isFlashOn ? 'flash' : 'flash-off'}
        size={24}
        color="#fff"
      />
    </TouchableOpacity>
  );
};

export default FlashToggle;
