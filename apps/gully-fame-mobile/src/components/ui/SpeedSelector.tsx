import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SpeedSelectorProps {
  speed: number; 
  onSpeedChange: (newSpeed: number) => void;
  disabled?: boolean; 
}

const SPEED_OPTIONS = [0.5, 1.0, 1.5, 2.0];

const SpeedSelector: React.FC<SpeedSelectorProps> = ({ speed, onSpeedChange, disabled }) => {
  
  if (disabled) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Playback Speed:</Text>
      <View style={styles.optionsContainer}>
        {SPEED_OPTIONS.map((option) => {
          
          const isActive = (speed || 1.0) === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.button, isActive && styles.activeButton]}
              onPress={() => onSpeedChange(option)}
            >
              <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
                {option === 1.0 ? 'Normal' : `${option}x`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, marginHorizontal: 16, marginBottom: 10 },
  label: { color: '#ffffff', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { flex: 1, backgroundColor: '#262626', paddingVertical: 8, marginHorizontal: 4, borderRadius: 6, alignItems: 'center' },
  activeButton: { backgroundColor: '#ec9a15' },
  buttonText: { color: '#ffffff', fontWeight: '600', fontSize: 12 },
  activeButtonText: { color: '#000000' },
});

export default SpeedSelector;