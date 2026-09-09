import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VoiceEffect {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'effect' | 'enhancement';
}

const VOICE_EFFECTS: VoiceEffect[] = [
  // Voice Effects
  { id: 'none', name: 'None', description: 'Original voice', icon: 'close-circle-outline', category: 'effect' },
  { id: 'helium', name: 'Helium', description: 'High pitched voice', icon: 'balloon', category: 'effect' },
  { id: 'low', name: 'Low', description: 'Deep voice tone', icon: 'volume-low', category: 'effect' },
  { id: 'toy_speaker', name: 'Toy Speaker', description: 'Compressed, robotic', icon: 'speaker', category: 'effect' },
  { id: 'microphone', name: 'Microphone', description: 'Mic simulation', icon: 'microphone', category: 'effect' },
  { id: 'android', name: 'Android', description: 'Robotic effect', icon: 'robot', category: 'effect' },
  // Voice Enhancements
  { id: 'clarity', name: 'Clarity', description: 'Enhance clarity', icon: 'volume-high', category: 'enhancement' },
  { id: 'echo', name: 'Echo', description: 'Add echo effect', icon: 'repeat', category: 'enhancement' },
  { id: 'reverb', name: 'Reverb', description: 'Spacious sound', icon: 'volume-vibrate', category: 'enhancement' },
  { id: 'chorus', name: 'Chorus', description: 'Layered effect', icon: 'layers', category: 'enhancement' },
  { id: 'compression', name: 'Compression', description: 'Normalize dynamics', icon: 'compress', category: 'enhancement' },
];

interface VoiceEffectsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectEffect: (effectId: string) => void;
  onSelectEnhancement: (enhancementIds: string[]) => void;
  selectedEffect?: string;
  selectedEnhancements?: string[];
}

const VoiceEffectsModal: React.FC<VoiceEffectsModalProps> = ({
  visible,
  onClose,
  onSelectEffect,
  onSelectEnhancement,
  selectedEffect = 'none',
  selectedEnhancements = [],
}) => {
  const [activeTab, setActiveTab] = useState<'effect' | 'enhancement'>('effect');
  const [tempEffect, setTempEffect] = useState(selectedEffect);
  const [tempEnhancements, setTempEnhancements] = useState(selectedEnhancements);

  const toggleEnhancement = useCallback(
    (id: string) => {
      setTempEnhancements((prev) =>
        prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
      );
    },
    []
  );

  const handleSave = useCallback(() => {
    onSelectEffect(tempEffect);
    onSelectEnhancement(tempEnhancements);
    onClose();
  }, [tempEffect, tempEnhancements, onSelectEffect, onSelectEnhancement, onClose]);

  const effectsData = VOICE_EFFECTS.filter((e) => e.category === activeTab);

  const renderEffect = useCallback(
    ({ item }: { item: VoiceEffect }) => (
      <TouchableOpacity
        style={[
          styles.effectCard,
          activeTab === 'effect' && tempEffect === item.id && styles.effectCardActive,
          activeTab === 'enhancement' && tempEnhancements.includes(item.id) && styles.effectCardActive,
        ]}
        onPress={() =>
          activeTab === 'effect'
            ? setTempEffect(item.id)
            : toggleEnhancement(item.id)
        }
      >
        <View style={styles.effectIconContainer}>
          <MaterialCommunityIcons name={item.icon as any} size={32} color="#3b82f6" />
        </View>
        <Text style={styles.effectName}>{item.name}</Text>
        <Text style={styles.effectDescription}>{item.description}</Text>
        {activeTab === 'effect' && tempEffect === item.id && (
          <View style={styles.checkmark}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
          </View>
        )}
        {activeTab === 'enhancement' && tempEnhancements.includes(item.id) && (
          <View style={styles.checkmark}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
          </View>
        )}
      </TouchableOpacity>
    ),
    [activeTab, tempEffect, tempEnhancements, toggleEnhancement]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Voice Effects</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'effect' && styles.tabActive]}
            onPress={() => setActiveTab('effect')}
          >
            <Text style={[styles.tabText, activeTab === 'effect' && styles.tabTextActive]}>
              Voice Effects
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'enhancement' && styles.tabActive]}
            onPress={() => setActiveTab('enhancement')}
          >
            <Text style={[styles.tabText, activeTab === 'enhancement' && styles.tabTextActive]}>
              Enhancements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Effects Grid */}
        <FlatList
          data={effectsData}
          renderItem={renderEffect}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    backgroundColor: '#1f2937',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  gridContainer: {
    padding: 12,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  effectCard: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
    minHeight: 140,
  },
  effectCardActive: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  effectIconContainer: {
    marginBottom: 8,
  },
  effectName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  effectDescription: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default VoiceEffectsModal;
