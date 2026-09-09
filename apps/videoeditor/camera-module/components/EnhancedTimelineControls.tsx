import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import ScriptEditorModal from './ScriptEditorModal';
import VoiceEffectsModal from './VoiceEffectsModal';
import TextToSpeechModal from './TextToSpeechModal';
import TimelineAudioPanel from './TimelineAudioPanel';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TimelineControlsProps {
  currentTime: number;
  duration: number;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  isPlaying: boolean;
}

interface AudioTrack {
  id: string;
  name: string;
  type: 'music' | 'voiceover' | 'sound_effect' | 'tts';
  duration: number;
  volume: number;
  isMuted: boolean;
  canCrop: boolean;
  canFade: boolean;
}

const EnhancedTimelineControls: React.FC<TimelineControlsProps> = ({
  currentTime,
  duration,
  onTimeChange,
  onPlayPause,
  isPlaying,
}) => {
  const [showScriptEditor, setShowScriptEditor] = useState(false);
  const [showVoiceEffects, setShowVoiceEffects] = useState(false);
  const [showTextToSpeech, setShowTextToSpeech] = useState(false);
  const [showAudioPanel, setShowAudioPanel] = useState(false);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  }, []);

  const handleAddAudio = useCallback((text: string, voice: string, pitch: number, rate: number) => {
    const newTrack: AudioTrack = {
      id: `audio_${Date.now()}`,
      name: `TTS - ${voice}`,
      type: 'tts',
      duration: Math.ceil(text.length / 5) * (2 - rate), // Estimate based on text and rate
      volume: 80,
      isMuted: false,
      canCrop: true,
      canFade: true,
    };
    setAudioTracks([...audioTracks, newTrack]);
  }, [audioTracks]);

  const handleUpdateTracks = useCallback((tracks: AudioTrack[]) => {
    setAudioTracks(tracks);
  }, []);

  return (
    <View style={styles.container}>
      {/* Timeline Slider */}
      <View style={styles.timelineSection}>
        <View style={styles.timeDisplay}>
          <Text style={styles.timeLabel}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeSeparator}>/</Text>
          <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
        </View>

        <Slider
          style={styles.timelineSlider}
          minimumValue={0}
          maximumValue={duration || 1}
          value={currentTime}
          onValueChange={onTimeChange}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#374151"
        />

        <View style={styles.timelineMarkers}>
          {Array.from({ length: Math.ceil(duration / 5) }).map((_, i) => (
            <View key={i} style={styles.marker}>
              <Text style={styles.markerText}>{i * 5}s</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Control Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.controlsScroll}
        contentContainerStyle={styles.controlsContainer}
      >
        {/* Play/Pause */}
        <TouchableOpacity
          style={[styles.controlButton, styles.playButton]}
          onPress={onPlayPause}
        >
          <MaterialCommunityIcons
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={24}
            color="#fff"
          />
          <Text style={styles.controlButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>

        {/* Script Editor */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowScriptEditor(true)}
        >
          <MaterialCommunityIcons name="pencil-outline" size={24} color="#fbbf24" />
          <Text style={styles.controlButtonText}>Script</Text>
        </TouchableOpacity>

        {/* Text to Speech */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowTextToSpeech(true)}
        >
          <MaterialCommunityIcons name="text-to-speech" size={24} color="#f87171" />
          <Text style={styles.controlButtonText}>TTS</Text>
        </TouchableOpacity>

        {/* Voice Effects */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowVoiceEffects(true)}
        >
          <MaterialCommunityIcons name="waveform" size={24} color="#a78bfa" />
          <Text style={styles.controlButtonText}>Effects</Text>
        </TouchableOpacity>

        {/* Audio Panel */}
        <TouchableOpacity
          style={[styles.controlButton, audioTracks.length > 0 && styles.controlButtonActive]}
          onPress={() => setShowAudioPanel(true)}
        >
          <MaterialCommunityIcons name="music" size={24} color="#60a5fa" />
          <Text style={styles.controlButtonText}>Audio</Text>
          {audioTracks.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{audioTracks.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Duplicate Clip */}
        <TouchableOpacity style={styles.controlButton}>
          <MaterialCommunityIcons name="content-duplicate" size={24} color="#10b981" />
          <Text style={styles.controlButtonText}>Duplicate</Text>
        </TouchableOpacity>

        {/* Delete Clip */}
        <TouchableOpacity style={styles.controlButton}>
          <MaterialCommunityIcons name="trash-can-outline" size={24} color="#ef4444" />
          <Text style={styles.controlButtonText}>Delete</Text>
        </TouchableOpacity>

        {/* Crop */}
        <TouchableOpacity style={styles.controlButton}>
          <MaterialCommunityIcons name="content-cut" size={24} color="#06b6d4" />
          <Text style={styles.controlButtonText}>Crop</Text>
        </TouchableOpacity>

        {/* Slip (Move) */}
        <TouchableOpacity style={styles.controlButton}>
          <MaterialCommunityIcons name="arrow-all" size={24} color="#8b5cf6" />
          <Text style={styles.controlButtonText}>Slip</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      <ScriptEditorModal
        visible={showScriptEditor}
        onClose={() => setShowScriptEditor(false)}
        onSave={(script) => {
          console.log('Script saved:', script);
        }}
      />

      <VoiceEffectsModal
        visible={showVoiceEffects}
        onClose={() => setShowVoiceEffects(false)}
        onSelectEffect={(effect) => {
          console.log('Effect selected:', effect);
        }}
        onSelectEnhancement={(enhancements) => {
          console.log('Enhancements selected:', enhancements);
        }}
      />

      <TextToSpeechModal
        visible={showTextToSpeech}
        onClose={() => setShowTextToSpeech(false)}
        onGenerate={handleAddAudio}
        startTime={currentTime}
      />

      {/* Audio Panel Modal */}
      {showAudioPanel && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Audio Tracks</Text>
              <TouchableOpacity onPress={() => setShowAudioPanel(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <TimelineAudioPanel
              tracks={audioTracks}
              onUpdateTracks={handleUpdateTracks}
              maxDuration={duration}
              onAddTrack={() => setShowTextToSpeech(true)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  timelineSection: {
    marginBottom: 12,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
  timeSeparator: {
    fontSize: 13,
    color: '#6b7280',
    marginHorizontal: 4,
  },
  timelineSlider: {
    width: '100%',
    height: 36,
  },
  timelineMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  marker: {
    alignItems: 'center',
  },
  markerText: {
    fontSize: 9,
    color: '#6b7280',
  },
  controlsScroll: {
    maxHeight: 90,
  },
  controlsContainer: {
    gap: 8,
    paddingHorizontal: 4,
  },
  controlButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1f2937',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    minWidth: 70,
  },
  controlButtonActive: {
    borderColor: '#60a5fa',
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
  },
  playButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  controlButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#d1d5db',
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.8,
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
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default EnhancedTimelineControls;
