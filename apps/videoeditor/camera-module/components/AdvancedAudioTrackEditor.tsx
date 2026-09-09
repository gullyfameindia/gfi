import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import AudioWaveformDisplay from './AudioWaveformDisplay';
import type { AudioTrackWithEffects, AudioEffectType } from '../types/audioEffects.types';

interface AdvancedAudioTrackEditorProps {
  track: AudioTrackWithEffects;
  onUpdate: (track: AudioTrackWithEffects) => void;
  onDelete: () => void;
  maxDuration: number;
  onSelectEffect?: (effectType: 'voice' | 'enhancement') => void;
}

const AdvancedAudioTrackEditor: React.FC<AdvancedAudioTrackEditorProps> = ({
  track,
  onUpdate,
  onDelete,
  maxDuration,
  onSelectEffect,
}) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [showEffectsModal, setShowEffectsModal] = useState(false);
  const [cropStart, setCropStart] = useState(track.cropStart || 0);
  const [cropEnd, setCropEnd] = useState(track.cropEnd || (track.duration || 0));
  const [isDraggingCropStart, setIsDraggingCropStart] = useState(false);
  const [isDraggingCropEnd, setIsDraggingCropEnd] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${String(secs).padStart(5, '0')}`;
  };

  const handleVolumeChange = useCallback(
    (delta: number) => {
      const newVolume = Math.max(0, Math.min(1, track.volume + delta));
      onUpdate({ ...track, volume: newVolume });
    },
    [track, onUpdate]
  );

  const handleToggleMute = useCallback(() => {
    onUpdate({ ...track, isMuted: !track.isMuted });
  }, [track, onUpdate]);

  const handleApplyCrop = useCallback(() => {
    if (cropStart >= cropEnd) {
      Alert.alert('Error', 'Crop start must be before crop end');
      return;
    }
    onUpdate({
      ...track,
      cropStart,
      cropEnd,
    });
    setShowCropModal(false);
  }, [cropStart, cropEnd, track, onUpdate]);

  const handleFadeInChange = useCallback(
    (value: number) => {
      onUpdate({ ...track, fadeIn: value });
    },
    [track, onUpdate]
  );

  const handleFadeOutChange = useCallback(
    (value: number) => {
      onUpdate({ ...track, fadeOut: value });
    },
    [track, onUpdate]
  );

  const getTrackTypeIcon = () => {
    switch (track.type) {
      case 'music':
        return '🎵';
      case 'voiceover':
        return '🎙️';
      case 'sound-effect':
        return '🔊';
      case 'tts':
        return '🤖';
      default:
        return '🎧';
    }
  };

  const getEffectDisplay = () => {
    if (track.audioEffect && track.audioEffect !== 'none') {
      return track.audioEffect.charAt(0).toUpperCase() + track.audioEffect.slice(1);
    }
    return 'No effect';
  };

  return (
    <View style={styles.container}>
      {/* Track Header */}
      <View style={styles.header}>
        <View style={styles.trackInfo}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{getTrackTypeIcon()}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.trackType}>{track.type.toUpperCase()}</Text>
            <Text style={styles.trackTime}>
              {formatTime(track.startTime)} - {formatTime(track.endTime)}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Waveform Visualization */}
      <View style={styles.waveformContainer}>
        <AudioWaveformDisplay
          audioId={track.id}
          duration={track.duration}
          color={getTrackColor(track.type)}
          height={50}
          cropStart={track.cropStart}
          cropEnd={track.cropEnd}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Volume Control */}
        <View style={styles.controlRow}>
          <View style={styles.controlLabel}>
            <Text style={styles.controlIcon}>🔊</Text>
            <Text style={styles.controlName}>Volume</Text>
          </View>
          <View style={styles.volumeControl}>
            <TouchableOpacity
              onPress={() => handleVolumeChange(-0.1)}
              style={styles.controlButton}
            >
              <Text style={styles.buttonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.volumeBar}>
              <View style={[styles.volumeFill, { width: `${track.volume * 100}%` }]} />
            </View>
            <TouchableOpacity
              onPress={() => handleVolumeChange(0.1)}
              style={styles.controlButton}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.volumeValue}>{Math.round(track.volume * 100)}%</Text>
        </View>

        {/* Mute Toggle */}
        <View style={styles.controlRow}>
          <TouchableOpacity
            onPress={handleToggleMute}
            style={[styles.mutButton, track.isMuted && styles.mutButtonActive]}
          >
            <Text style={styles.mutIcon}>{track.isMuted ? '🔇' : '🔊'}</Text>
            <Text style={styles.mutLabel}>{track.isMuted ? 'Muted' : 'Unmuted'}</Text>
          </TouchableOpacity>
        </View>

        {/* Crop Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowCropModal(true)}
        >
          <Text style={styles.actionIcon}>✂️</Text>
          <Text style={styles.actionLabel}>Crop</Text>
          {track.cropStart || track.cropEnd ? (
            <Text style={styles.actionValue}>
              {formatTime(track.cropStart || 0)} - {formatTime(track.cropEnd || track.duration)}
            </Text>
          ) : null}
        </TouchableOpacity>

        {/* Fade Controls */}
        <View style={styles.fadeRow}>
          <View style={styles.fadeItem}>
            <Text style={styles.fadeLabel}>Fade In</Text>
            <View style={styles.fadeSlider}>
              <TouchableOpacity
                onPress={() => handleFadeInChange(Math.max(0, (track.fadeIn || 0) - 0.1))}
                style={styles.fadeButton}
              >
                <Text style={styles.fadeButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.fadeValue}>{((track.fadeIn || 0) * 10).toFixed(1)}s</Text>
              <TouchableOpacity
                onPress={() => handleFadeInChange(Math.min(5, (track.fadeIn || 0) + 0.1))}
                style={styles.fadeButton}
              >
                <Text style={styles.fadeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fadeItem}>
            <Text style={styles.fadeLabel}>Fade Out</Text>
            <View style={styles.fadeSlider}>
              <TouchableOpacity
                onPress={() => handleFadeOutChange(Math.max(0, (track.fadeOut || 0) - 0.1))}
                style={styles.fadeButton}
              >
                <Text style={styles.fadeButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.fadeValue}>{((track.fadeOut || 0) * 10).toFixed(1)}s</Text>
              <TouchableOpacity
                onPress={() => handleFadeOutChange(Math.min(5, (track.fadeOut || 0) + 0.1))}
                style={styles.fadeButton}
              >
                <Text style={styles.fadeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Effects Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowEffectsModal(true)}
        >
          <Text style={styles.actionIcon}>⚡</Text>
          <Text style={styles.actionLabel}>Effects</Text>
          <Text style={styles.actionValue}>{getEffectDisplay()}</Text>
        </TouchableOpacity>
      </View>

      {/* Crop Modal */}
      <Modal visible={showCropModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCropModal(false)}>
              <Text style={styles.modalButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Crop Audio</Text>
            <TouchableOpacity onPress={handleApplyCrop}>
              <Text style={[styles.modalButton, { color: '#3b82f6' }]}>Apply</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.cropSection}>
              <Text style={styles.cropLabel}>Start Time</Text>
              <View style={styles.timeInputContainer}>
                <TouchableOpacity
                  onPress={() => setCropStart(Math.max(0, cropStart - 0.5))}
                  style={styles.timeButton}
                >
                  <Text style={styles.timeButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.timeDisplay}>{formatTime(cropStart)}</Text>
                <TouchableOpacity
                  onPress={() => setCropStart(Math.min(cropEnd - 0.1, cropStart + 0.5))}
                  style={styles.timeButton}
                >
                  <Text style={styles.timeButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.cropSection}>
              <Text style={styles.cropLabel}>End Time</Text>
              <View style={styles.timeInputContainer}>
                <TouchableOpacity
                  onPress={() => setCropEnd(Math.max(cropStart + 0.1, cropEnd - 0.5))}
                  style={styles.timeButton}
                >
                  <Text style={styles.timeButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.timeDisplay}>{formatTime(cropEnd)}</Text>
                <TouchableOpacity
                  onPress={() => setCropEnd(Math.min(track.duration, cropEnd + 0.5))}
                  style={styles.timeButton}
                >
                  <Text style={styles.timeButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.cropPreview}>
              <Text style={styles.cropInfoLabel}>Duration:</Text>
              <Text style={styles.cropInfoValue}>{formatTime(cropEnd - cropStart)}</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

function getTrackColor(type: string): string {
  switch (type) {
    case 'music':
      return '#a78bfa';
    case 'voiceover':
      return '#f87171';
    case 'sound-effect':
      return '#60a5fa';
    case 'tts':
      return '#fbbf24';
    default:
      return '#3b82f6';
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  details: {
    flex: 1,
  },
  trackType: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  trackTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 18,
  },
  waveformContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  controls: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 80,
  },
  controlIcon: {
    fontSize: 16,
  },
  controlName: {
    fontSize: 12,
    color: '#d1d5db',
    fontWeight: '600',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#f3f4f6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  volumeBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#4b5563',
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  volumeValue: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  mutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  mutButtonActive: {
    borderColor: '#ff6b6b',
    backgroundColor: '#7f1d1d',
  },
  mutIcon: {
    fontSize: 16,
  },
  mutLabel: {
    fontSize: 12,
    color: '#d1d5db',
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  actionIcon: {
    fontSize: 16,
  },
  actionLabel: {
    fontSize: 12,
    color: '#d1d5db',
    fontWeight: '600',
    flex: 1,
  },
  actionValue: {
    fontSize: 11,
    color: '#9ca3af',
  },
  fadeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fadeItem: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  fadeLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 6,
    fontWeight: '600',
  },
  fadeSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fadeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fadeButtonText: {
    color: '#f3f4f6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fadeValue: {
    fontSize: 10,
    color: '#d1d5db',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f3f4f6',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  cropSection: {
    marginBottom: 24,
  },
  cropLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 8,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonText: {
    color: '#f3f4f6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeDisplay: {
    flex: 1,
    fontSize: 14,
    color: '#f3f4f6',
    fontWeight: '600',
    textAlign: 'center',
  },
  cropPreview: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cropInfoLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  cropInfoValue: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '700',
  },
});

export default AdvancedAudioTrackEditor;
