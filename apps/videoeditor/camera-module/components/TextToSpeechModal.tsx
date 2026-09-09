import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { synthesizeTextToSpeech } from '../utils/audioProcessing';
import type { TextToSpeechConfig } from '../types/audioEffects.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Voice {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

const VOICES: Voice[] = [
  { id: 'alex', name: 'Alex', emoji: '👨', description: 'Natural male voice' },
  { id: 'billie', name: 'Billie', emoji: '👩', description: 'Natural female voice' },
  { id: 'bold', name: 'Bold', emoji: '💪', description: 'Strong, confident' },
  { id: 'bubbly', name: 'Bubbly', emoji: '😄', description: 'Cheerful, upbeat' },
  { id: 'calm', name: 'Calm', emoji: '🧘', description: 'Relaxed, smooth' },
];

interface TextToSpeechModalProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (config: TextToSpeechConfig) => void;
  startTime: number;
}

const TextToSpeechModal: React.FC<TextToSpeechModalProps> = ({
  visible,
  onClose,
  onGenerate,
  startTime,
}) => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string>('alex');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter text');
      return;
    }

    setIsProcessing(true);
    try {
      // Create TTS configuration
      const ttsConfig: TextToSpeechConfig = {
        id: `tts_${Date.now()}`,
        text: text.trim(),
        voice: selectedVoice as any,
        language: 'en',
        pitch,
        rate,
        startTime,
        volume: 1,
        duration: (text.length / 5) + (pitch * rate), // Estimate duration
        audioEffect: 'none',
      };

      // Generate audio
      const audioUri = await synthesizeTextToSpeech(ttsConfig);
      
      // Update config with generated audio URI
      ttsConfig.audioUri = audioUri;

      // Call onGenerate callback
      onGenerate(ttsConfig);

      // Reset form
      setText('');
      setSelectedVoice('alex');
      setPitch(1);
      setRate(1);
      
      onClose();
    } catch (error) {
      console.error('TTS Generation Error:', error);
      Alert.alert('Error', `Failed to generate speech: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  }, [text, selectedVoice, pitch, rate, startTime, onGenerate, onClose]);

  const renderVoiceOption = ({ item }: { item: Voice }) => (
    <TouchableOpacity
      style={[
        styles.voiceCard,
        selectedVoice === item.id && styles.voiceCardSelected,
      ]}
      onPress={() => setSelectedVoice(item.id)}
      disabled={isProcessing}
    >
      <Text style={styles.voiceEmoji}>{item.emoji}</Text>
      <Text style={styles.voiceName}>{item.name}</Text>
      <Text style={styles.voiceDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} disabled={isProcessing}>
              <MaterialCommunityIcons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Text to Speech</Text>
            <TouchableOpacity
              onPress={handleGenerate}
              disabled={isProcessing || !text.trim()}
              style={[styles.generateButton, isProcessing && styles.generateButtonDisabled]}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="play-circle" size={20} color="#fff" />
                  <Text style={styles.generateButtonText}>Generate</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Text Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 Enter Text</Text>
              <TextInput
                style={styles.textInput}
                placeholder="What should the AI voice say?"
                placeholderTextColor="#6b7280"
                value={text}
                onChangeText={setText}
                multiline
                maxLength={500}
                editable={!isProcessing}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>
                {text.length} / 500 characters
              </Text>
            </View>

            {/* Voice Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎤 Select Voice</Text>
              <FlatList
                data={VOICES}
                renderItem={renderVoiceOption}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                numColumns={2}
                columnWrapperStyle={styles.voiceGrid}
              />
            </View>

            {/* Pitch Control */}
            <View style={styles.section}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sectionTitle}>🎵 Pitch</Text>
                <Text style={styles.sliderValue}>{pitch.toFixed(2)}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={2}
                step={0.1}
                value={pitch}
                onValueChange={setPitch}
                disabled={isProcessing}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Lower</Text>
                <Text style={styles.sliderLabel}>Normal</Text>
                <Text style={styles.sliderLabel}>Higher</Text>
              </View>
            </View>

            {/* Rate Control */}
            <View style={styles.section}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sectionTitle}>⏱️ Speed</Text>
                <Text style={styles.sliderValue}>{rate.toFixed(2)}x</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={2}
                step={0.1}
                value={rate}
                onValueChange={setRate}
                disabled={isProcessing}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Slower</Text>
                <Text style={styles.sliderLabel}>Normal</Text>
                <Text style={styles.sliderLabel}>Faster</Text>
              </View>
            </View>

            {/* Preview Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👂 Preview</Text>
              <View style={styles.previewCard}>
                <MaterialCommunityIcons name="information" size={20} color="#6366f1" />
                <Text style={styles.previewText}>
                  Generated audio will be added to your timeline starting at {startTime.toFixed(1)}s
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'right',
  },
  voiceGrid: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  voiceCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: '#4b5563',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#4f46e5',
  },
  voiceEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  voiceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  voiceDescription: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  previewCard: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  previewText: {
    flex: 1,
    fontSize: 13,
    color: '#d1d5db',
    lineHeight: 20,
  },
});

export default TextToSpeechModal;
