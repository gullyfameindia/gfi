import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ZoomButtonsProps {
  zoom: number; // Current zoom level (1-4)
  onZoomChange: (zoom: number) => void;
  disabled?: boolean;
}

/**
 * Discrete zoom buttons (1x, 2x, 3x, 4x)
 * Displayed as a horizontal row below the camera preview
 * Matches the first screenshot design
 */
const ZoomButtons: React.FC<ZoomButtonsProps> = ({ zoom, onZoomChange, disabled = false }) => {
  const zoomLevels = [1, 2, 3, 4];

  return (
    <View style={styles.container}>
      {zoomLevels.map((level) => (
        <TouchableOpacity
          key={level}
          style={[
            styles.button,
            zoom === level && styles.buttonActive,
            disabled && styles.buttonDisabled,
          ]}
          onPress={() => !disabled && onZoomChange(level)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.buttonText,
              zoom === level && styles.buttonTextActive,
            ]}
          >
            {level}x
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(5, 5, 9, 0.8)',
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#ffffff',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
});

export default ZoomButtons;
