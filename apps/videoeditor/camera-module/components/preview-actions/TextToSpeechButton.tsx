import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextToSpeechModal from '../TextToSpeechModal';
import type { TextToSpeechConfig } from '../../types/audioEffects.types';

interface TextToSpeechButtonProps {
  onPress?: () => void;
  onTTSGenerate?: (config: TextToSpeechConfig) => void;
  startTime?: number;
}

const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({
  onPress,
  onTTSGenerate,
  startTime = 0,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
    onPress?.();
  };

  const handleGenerate = (config: TextToSpeechConfig) => {
    if (onTTSGenerate) {
      onTTSGenerate(config);
      Alert.alert('✅ Success', `Text-to-speech audio generated: "${config.text}"`);
    } else {
      Alert.alert('📢 TTS', `Generated: "${config.text}"`);
    }
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <MaterialCommunityIcons name="microphone-message" size={24} color="#6366f1" />
      </TouchableOpacity>

      <TextToSpeechModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGenerate={handleGenerate}
        startTime={startTime}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4b5563',
  },
});

export default TextToSpeechButton;
