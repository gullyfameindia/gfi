import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AdvancedAudioTrackEditor from './AdvancedAudioTrackEditor';
import AudioEffectsModal from './AudioEffectsModal';
import type { AudioTrackWithEffects, AudioEffectType } from '../types/audioEffects.types';

interface EnhancedAudioTracksPanelProps {
  visible: boolean;
  onClose: () => void;
  audioTracks: AudioTrackWithEffects[];
  onUpdateTracks: (tracks: AudioTrackWithEffects[]) => void;
  maxDuration: number;
  onAddTrack?: () => void;
}

const EnhancedAudioTracksPanel: React.FC<EnhancedAudioTracksPanelProps> = ({
  visible,
  onClose,
  audioTracks,
  onUpdateTracks,
  maxDuration,
  onAddTrack,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [showEffectsModal, setShowEffectsModal] = useState(false);
  const [effectsType, setEffectsType] = useState<'voice' | 'enhancement'>('voice');

  const handleUpdateTrack = (updatedTrack: AudioTrackWithEffects) => {
    const newTracks = audioTracks.map((track) =>
      track.id === updatedTrack.id ? updatedTrack : track
    );
    onUpdateTracks(newTracks);
  };

  const handleDeleteTrack = (trackId: string) => {
    Alert.alert('Delete Track', 'Are you sure you want to delete this audio track?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: () => {
          const newTracks = audioTracks.filter((track) => track.id !== trackId);
          onUpdateTracks(newTracks);
          setSelectedTrackId(null);
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSelectEffect = (effectType: 'voice' | 'enhancement') => {
    setEffectsType(effectType);
    setShowEffectsModal(true);
  };

  const handleEffectSelected = (effect: AudioEffectType) => {
    if (selectedTrackId) {
      const track = audioTracks.find((t) => t.id === selectedTrackId);
      if (track) {
        handleUpdateTrack({ ...track, audioEffect: effect });
      }
    }
    setShowEffectsModal(false);
  };

  const getTotalAudioDuration = () => {
    if (audioTracks.length === 0) return 0;
    const maxEndTime = Math.max(...audioTracks.map((t) => t.endTime));
    return maxEndTime;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Done</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Audio Mixer</Text>
          <TouchableOpacity onPress={onAddTrack} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Audio Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tracks</Text>
            <Text style={styles.statValue}>{audioTracks.length}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{getTotalAudioDuration().toFixed(2)}s</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Max Duration</Text>
            <Text style={styles.statValue}>{maxDuration.toFixed(2)}s</Text>
          </View>
        </View>

        {/* Audio Tracks List */}
        <ScrollView style={styles.tracksContainer} showsVerticalScrollIndicator={false}>
          {audioTracks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎵</Text>
              <Text style={styles.emptyTitle}>No audio tracks</Text>
              <Text style={styles.emptyMessage}>Add audio tracks to enhance your video</Text>
            </View>
          ) : (
            audioTracks.map((track) => (
              <View key={track.id} style={styles.trackWrapper}>
                <AdvancedAudioTrackEditor
                  track={track}
                  onUpdate={handleUpdateTrack}
                  onDelete={() => handleDeleteTrack(track.id)}
                  maxDuration={maxDuration}
                  onSelectEffect={handleSelectEffect}
                />
              </View>
            ))
          )}
        </ScrollView>

        {/* Master Volume Control */}
        {audioTracks.length > 0 && (
          <View style={styles.masterControl}>
            <View style={styles.masterHeader}>
              <Text style={styles.masterLabel}>Master Volume</Text>
              <Text style={styles.masterValue}>100%</Text>
            </View>
            <View style={styles.masterSlider}>
              <View style={styles.masterSliderTrack}>
                <View style={styles.masterSliderFill} />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>

      {/* Effects Modal */}
      <AudioEffectsModal
        visible={showEffectsModal}
        onClose={() => setShowEffectsModal(false)}
        onSelectEffect={handleEffectSelected}
      />
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
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#374151',
    marginHorizontal: 12,
  },
  tracksContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  trackWrapper: {
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 4,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#9ca3af',
  },
  masterControl: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    backgroundColor: '#111827',
  },
  masterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  masterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d1d5db',
  },
  masterValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  masterSlider: {
    marginTop: 8,
  },
  masterSliderTrack: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  masterSliderFill: {
    height: '100%',
    width: '100%',
    backgroundColor: '#3b82f6',
  },
});

export default EnhancedAudioTracksPanel;
