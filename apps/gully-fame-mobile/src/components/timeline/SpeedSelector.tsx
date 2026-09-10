import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SpeedSelectorProps {
  currentSpeed: number;
  onSpeedChange: (newSpeed: number) => void;
  disabled: boolean;
}

const SPEED_OPTIONS = [0.5, 1.0, 1.5, 2.0];

const SpeedSelector: React.FC<SpeedSelectorProps> = ({ currentSpeed, onSpeedChange, disabled }) => {
  if (disabled) {
    return (
      <View style={[styles.container, styles.disabled]}>
        <Text style={styles.disabledText}>Select a video clip to adjust speed</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Playback Speed:</Text>
      <View style={styles.optionsContainer}>
        {SPEED_OPTIONS.map((speed) => {
          const isActive = currentSpeed === speed;
          return (
            <TouchableOpacity
              key={speed}
              style={[styles.button, isActive && styles.activeButton]}
              onPress={() => onSpeedChange(speed)}
            >
              <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
                {speed === 1.0 ? 'Normal' : `${speed}x`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#121212', borderRadius: 8, margin: 10 },
  disabled: { alignItems: 'center', justifyContent: 'center', opacity: 0.5 },
  disabledText: { color: '#aaaaaa', fontSize: 13 },
  label: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { flex: 1, backgroundColor: '#262626', paddingVertical: 10, marginHorizontal: 4, borderRadius: 6, alignItems: 'center' },
  activeButton: { backgroundColor: '#ec9a15' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
  activeButtonText: { color: '#000000' },
});

export default SpeedSelector;