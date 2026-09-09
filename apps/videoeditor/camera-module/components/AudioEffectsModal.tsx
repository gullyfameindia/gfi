import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import type { AudioEffectType, VoiceEnhancementType } from '../types/audioEffects.types';

interface AudioEffectsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectEffect: (effect: AudioEffectType) => void;
  selectedEffect?: AudioEffectType;
}

const AUDIO_EFFECTS = [
  {
    id: 'none' as AudioEffectType,
    name: 'None',
    icon: '⊘',
    description: 'No effect',
  },
  {
    id: 'helium' as AudioEffectType,
    name: 'Helium',
    icon: '🎈',
    description: 'High pitch voice',
  },
  {
    id: 'low' as AudioEffectType,
    name: 'Low',
    icon: '📉',
    description: 'Deep voice',
  },
  {
    id: 'toy_speaker' as AudioEffectType,
    name: 'Toy speaker',
    icon: '🎜',
    description: 'Toy-like sound',
  },
  {
    id: 'microphone' as AudioEffectType,
    name: 'Microphone',
    icon: '🎤',
    description: 'Microphone effect',
  },
  {
    id: 'android' as AudioEffectType,
    name: 'Android',
    icon: '🤖',
    description: 'Robotic voice',
  },
];

const VOICE_ENHANCEMENTS = [
  {
    id: 'clarity' as VoiceEnhancementType,
    name: 'Clarity',
    icon: '✨',
    description: 'Enhance voice clarity',
  },
  {
    id: 'echo' as VoiceEnhancementType,
    name: 'Echo',
    icon: '📢',
    description: 'Add echo effect',
  },
  {
    id: 'reverb' as VoiceEnhancementType,
    name: 'Reverb',
    icon: '🏔️',
    description: 'Reverb effect',
  },
  {
    id: 'chorus' as VoiceEnhancementType,
    name: 'Chorus',
    icon: '🎵',
    description: 'Chorus effect',
  },
  {
    id: 'compression' as VoiceEnhancementType,
    name: 'Compression',
    icon: '📊',
    description: 'Dynamic compression',
  },
];

const AudioEffectsModal: React.FC<AudioEffectsModalProps> = ({
  visible,
  onClose,
  onSelectEffect,
  selectedEffect = 'none',
}) => {
  const [selectedEnhancements, setSelectedEnhancements] = useState<VoiceEnhancementType[]>([]);
  const [activeTab, setActiveTab] = useState<'effects' | 'enhancements'>('effects');

  const toggleEnhancement = (enhancement: VoiceEnhancementType) => {
    setSelectedEnhancements((prev) =>
      prev.includes(enhancement)
        ? prev.filter((e) => e !== enhancement)
        : [...prev, enhancement]
    );
  };

  const handleSelectEffect = (effect: AudioEffectType) => {
    onSelectEffect(effect);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Done</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Audio Effects</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'effects' && styles.tabActive]}
            onPress={() => setActiveTab('effects')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'effects' && styles.tabTextActive,
              ]}
            >
              Voice
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'enhancements' && styles.tabActive]}
            onPress={() => setActiveTab('enhancements')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'enhancements' && styles.tabTextActive,
              ]}
            >
              Singing
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'effects' ? (
            // Effects Grid
            <View style={styles.grid}>
              {AUDIO_EFFECTS.map((effect) => (
                <TouchableOpacity
                  key={effect.id}
                  style={[
                    styles.effectCard,
                    selectedEffect === effect.id && styles.effectCardSelected,
                  ]}
                  onPress={() => handleSelectEffect(effect.id)}
                >
                  <View style={styles.effectIconContainer}>
                    <Text style={styles.effectIcon}>{effect.icon}</Text>
                  </View>
                  <Text style={styles.effectName}>{effect.name}</Text>
                  <Text style={styles.effectDescription}>{effect.description}</Text>
                  {selectedEffect === effect.id && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            // Enhancements List
            <View style={styles.enhancementsList}>
              {VOICE_ENHANCEMENTS.map((enhancement) => (
                <TouchableOpacity
                  key={enhancement.id}
                  style={[
                    styles.enhancementItem,
                    selectedEnhancements.includes(enhancement.id) &&
                      styles.enhancementItemSelected,
                  ]}
                  onPress={() => toggleEnhancement(enhancement.id)}
                >
                  <View style={styles.enhancementLeft}>
                    <Text style={styles.enhancementIcon}>{enhancement.icon}</Text>
                    <View style={styles.enhancementTextContainer}>
                      <Text style={styles.enhancementName}>{enhancement.name}</Text>
                      <Text style={styles.enhancementDesc}>{enhancement.description}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      selectedEnhancements.includes(enhancement.id) &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {selectedEnhancements.includes(enhancement.id) && (
                      <Text style={styles.checkboxTick}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f3f4f6',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    backgroundColor: '#111827',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#3b82f6',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  effectCard: {
    width: '32%',
    aspectRatio: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  effectCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a8a',
  },
  effectIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  effectIcon: {
    fontSize: 24,
  },
  effectName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 4,
    textAlign: 'center',
  },
  effectDescription: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  enhancementsList: {
    gap: 8,
  },
  enhancementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 4,
  },
  enhancementItemSelected: {
    backgroundColor: '#1e3a8a',
    borderColor: '#3b82f6',
  },
  enhancementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  enhancementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  enhancementTextContainer: {
    flex: 1,
  },
  enhancementName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 2,
  },
  enhancementDesc: {
    fontSize: 12,
    color: '#9ca3af',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4b5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AudioEffectsModal;
