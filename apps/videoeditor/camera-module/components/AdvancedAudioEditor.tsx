import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import type { AudioTrackWithEffects, AudioEffectType, AudioMixSettings } from '../types/audioEffects.types';
import { extractWaveformData } from '../utils/audioProcessing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AUDIO_EFFECTS: { id: AudioEffectType; name: string; icon: string }[] = [
  { id: 'none', name: 'None', icon: '⊘' },
  { id: 'helium', name: 'Helium', icon: '🎈' },
  { id: 'low', name: 'Low', icon: '🔉' },
  { id: 'toy_speaker', name: 'Toy', icon: '🤖' },
  { id: 'microphone', name: 'Mic', icon: '🎤' },
  { id: 'android', name: 'Robot', icon: '🦾' },
];

interface AdvancedAudioEditorProps {
  tracks: AudioTrackWithEffects[];
  onUpdateTracks: (tracks: AudioTrackWithEffects[]) => void;
  onUpdateMixSettings: (settings: AudioMixSettings) => void;
  masterVolume?: number;
  onClose: () => void;
}

interface SelectedTrackState {
  trackId: string | null;
  waveformData: any;
}

const AdvancedAudioEditor: React.FC<AdvancedAudioEditorProps> = ({
  tracks,
  onUpdateTracks,
  onUpdateMixSettings,
  masterVolume = 1,
  onClose,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<Record<string, any>>({});
  const [mixSettings, setMixSettings] = useState<AudioMixSettings>({
    masterVolume,
    musicVolume: 1,
    voiceVolume: 1,
    soundEffectVolume: 1,
    autoNormalize: false,
    loudnessTarget: -20,
  });

  const selectedTrackData = useMemo(() => {
    return tracks.find(t => t.id === selectedTrack);
  }, [tracks, selectedTrack]);

  const loadWaveform = useCallback(async (trackId: string) => {
    try {
      const track = tracks.find(t => t.id === trackId);
      if (!track || waveformData[trackId]) return;

      const data = await extractWaveformData(track.uri, track.duration);
      if (data) {
        setWaveformData(prev => ({ ...prev, [trackId]: data }));
      }
    } catch (error) {
      console.error('Waveform loading error:', error);
    }
  }, [tracks, waveformData]);

  const updateTrackProperty = useCallback((trackId: string, updates: Partial<AudioTrackWithEffects>) => {
    const updatedTracks = tracks.map(track =>
      track.id === trackId ? { ...track, ...updates } : track
    );
    onUpdateTracks(updatedTracks);
  }, [tracks, onUpdateTracks]);

  const handleDeleteTrack = useCallback((trackId: string) => {
    Alert.alert('Delete Track', 'Are you sure you want to delete this audio track?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedTracks = tracks.filter(t => t.id !== trackId);
          onUpdateTracks(updatedTracks);
          if (selectedTrack === trackId) {
            setSelectedTrack(null);
          }
        },
      },
    ]);
  }, [tracks, selectedTrack, onUpdateTracks]);

  const handleMixSettingsChange = useCallback((updates: Partial<AudioMixSettings>) => {
    const newSettings = { ...mixSettings, ...updates };
    setMixSettings(newSettings);
    onUpdateMixSettings(newSettings);
  }, [mixSettings, onUpdateMixSettings]);

  const renderTrackCard = ({ item }: { item: AudioTrackWithEffects }) => (
    <TouchableOpacity
      style={[
        styles.trackCard,
        selectedTrack === item.id && styles.trackCardSelected,
      ]}
      onPress={() => {
        setSelectedTrack(item.id);
        loadWaveform(item.id);
      }}
    >
      <View style={styles.trackCardContent}>
        <View style={styles.trackInfo}>
          <MaterialCommunityIcons
            name={
              item.type === 'music'
                ? 'music'
                : item.type === 'voiceover'
                ? 'microphone'
                : 'volume-high'
            }
            size={24}
            color={item.isMuted ? '#9ca3af' : '#6366f1'}
          />
          <View style={styles.trackDetails}>
            <Text style={styles.trackType}>{item.type.toUpperCase()}</Text>
            <Text style={styles.trackDuration}>
              {item.duration.toFixed(2)}s
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteTrack(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="trash-can" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎙️ Advanced Audio Editor</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialCommunityIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Master Volume Control */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 Master Volume</Text>
          <View style={styles.volumeControl}>
            <MaterialCommunityIcons name="volume-low" size={24} color="#6366f1" />
            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              step={0.05}
              value={mixSettings.masterVolume}
              onValueChange={value => handleMixSettingsChange({ masterVolume: value })}
            />
            <MaterialCommunityIcons name="volume-high" size={24} color="#6366f1" />
            <Text style={styles.volumeValue}>{Math.round(mixSettings.masterVolume * 100)}%</Text>
          </View>
        </View>

        {/* Per-Channel Volume Control */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎚️ Channel Levels</Text>

          {/* Music Volume */}
          <View style={styles.channelControl}>
            <View style={styles.channelHeader}>
              <View style={styles.channelLabel}>
                <MaterialCommunityIcons name="music" size={20} color="#ec4899" />
                <Text style={styles.channelName}>Music</Text>
              </View>
              <Text style={styles.channelValue}>{Math.round(mixSettings.musicVolume * 100)}%</Text>
            </View>
            <Slider
              style={styles.channelSlider}
              minimumValue={0}
              maximumValue={1}
              step={0.05}
              value={mixSettings.musicVolume}
              onValueChange={value => handleMixSettingsChange({ musicVolume: value })}
            />
          </View>

          {/* Voice Volume */}
          <View style={styles.channelControl}>
            <View style={styles.channelHeader}>
              <View style={styles.channelLabel}>
                <MaterialCommunityIcons name="microphone" size={20} color="#f59e0b" />
                <Text style={styles.channelName}>Voice</Text>
              </View>
              <Text style={styles.channelValue}>{Math.round(mixSettings.voiceVolume * 100)}%</Text>
            </View>
            <Slider
              style={styles.channelSlider}
              minimumValue={0}
              maximumValue={1}
              step={0.05}
              value={mixSettings.voiceVolume}
              onValueChange={value => handleMixSettingsChange({ voiceVolume: value })}
            />
          </View>

          {/* Sound Effect Volume */}
          <View style={styles.channelControl}>
            <View style={styles.channelHeader}>
              <View style={styles.channelLabel}>
                <MaterialCommunityIcons name="volume-high" size={20} color="#10b981" />
                <Text style={styles.channelName}>Sound FX</Text>
              </View>
              <Text style={styles.channelValue}>{Math.round(mixSettings.soundEffectVolume * 100)}%</Text>
            </View>
            <Slider
              style={styles.channelSlider}
              minimumValue={0}
              maximumValue={1}
              step={0.05}
              value={mixSettings.soundEffectVolume}
              onValueChange={value => handleMixSettingsChange({ soundEffectVolume: value })}
            />
          </View>
        </View>

        {/* Audio Tracks List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎵 Audio Tracks ({tracks.length})</Text>
          {tracks.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="music-box-multiple" size={48} color="#6b7280" />
              <Text style={styles.emptyStateText}>No audio tracks added yet</Text>
            </View>
          ) : (
            <FlatList
              data={tracks}
              renderItem={renderTrackCard}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>

        {/* Track Details Editor */}
        {selectedTrackData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ Track Settings</Text>

            {/* Volume */}
            <View style={styles.trackSetting}>
              <Text style={styles.trackSettingLabel}>Volume</Text>
              <View style={styles.settingRow}>
                <Slider
                  style={styles.settingSlider}
                  minimumValue={0}
                  maximumValue={1}
                  step={0.05}
                  value={selectedTrackData.volume}
                  onValueChange={value => updateTrackProperty(selectedTrackData.id, { volume: value })}
                />
                <Text style={styles.settingValue}>{Math.round(selectedTrackData.volume * 100)}%</Text>
              </View>
            </View>

            {/* Mute Toggle */}
            <TouchableOpacity
              style={styles.trackSetting}
              onPress={() => updateTrackProperty(selectedTrackData.id, { isMuted: !selectedTrackData.isMuted })}
            >
              <Text style={styles.trackSettingLabel}>
                {selectedTrackData.isMuted ? '🔇 Unmute' : '🔊 Mute'}
              </Text>
            </TouchableOpacity>

            {/* Audio Effect */}
            <View style={styles.trackSetting}>
              <Text style={styles.trackSettingLabel}>Audio Effect</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.effectsScroll}
              >
                {AUDIO_EFFECTS.map(effect => (
                  <TouchableOpacity
                    key={effect.id}
                    style={[
                      styles.effectButton,
                      (selectedTrackData.audioEffect || 'none') === effect.id && styles.effectButtonActive,
                    ]}
                    onPress={() => updateTrackProperty(selectedTrackData.id, { audioEffect: effect.id })}
                  >
                    <Text style={styles.effectIcon}>{effect.icon}</Text>
                    <Text style={styles.effectName}>{effect.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* EQ Settings */}
            <View style={styles.trackSetting}>
              <Text style={styles.trackSettingLabel}>🎵 Equalizer</Text>

              {/* Bass */}
              <View style={styles.eqControl}>
                <Text style={styles.eqLabel}>Bass</Text>
                <Slider
                  style={styles.eqSlider}
                  minimumValue={-12}
                  maximumValue={12}
                  step={1}
                  value={selectedTrackData.bassGain || 0}
                  onValueChange={value => updateTrackProperty(selectedTrackData.id, { bassGain: value })}
                />
                <Text style={styles.eqValue}>{selectedTrackData.bassGain || 0}dB</Text>
              </View>

              {/* Midtone */}
              <View style={styles.eqControl}>
                <Text style={styles.eqLabel}>Midtone</Text>
                <Slider
                  style={styles.eqSlider}
                  minimumValue={-12}
                  maximumValue={12}
                  step={1}
                  value={selectedTrackData.midtoneGain || 0}
                  onValueChange={value => updateTrackProperty(selectedTrackData.id, { midtoneGain: value })}
                />
                <Text style={styles.eqValue}>{selectedTrackData.midtoneGain || 0}dB</Text>
              </View>

              {/* Treble */}
              <View style={styles.eqControl}>
                <Text style={styles.eqLabel}>Treble</Text>
                <Slider
                  style={styles.eqSlider}
                  minimumValue={-12}
                  maximumValue={12}
                  step={1}
                  value={selectedTrackData.trebleGain || 0}
                  onValueChange={value => updateTrackProperty(selectedTrackData.id, { trebleGain: value })}
                />
                <Text style={styles.eqValue}>{selectedTrackData.trebleGain || 0}dB</Text>
              </View>
            </View>

            {/* Fade Effects */}
            <View style={styles.trackSetting}>
              <Text style={styles.trackSettingLabel}>⏱️ Fade Effects</Text>

              {/* Fade In */}
              <View style={styles.fadeControl}>
                <Text style={styles.fadeLabel}>Fade In (seconds)</Text>
                <Slider
                  style={styles.fadeSlider}
                  minimumValue={0}
                  maximumValue={5}
                  step={0.1}
                  value={selectedTrackData.fadeIn || 0}
                  onValueChange={value => updateTrackProperty(selectedTrackData.id, { fadeIn: value })}
                />
                <Text style={styles.fadeValue}>{(selectedTrackData.fadeIn || 0).toFixed(1)}s</Text>
              </View>

              {/* Fade Out */}
              <View style={styles.fadeControl}>
                <Text style={styles.fadeLabel}>Fade Out (seconds)</Text>
                <Slider
                  style={styles.fadeSlider}
                  minimumValue={0}
                  maximumValue={5}
                  step={0.1}
                  value={selectedTrackData.fadeOut || 0}
                  onValueChange={value => updateTrackProperty(selectedTrackData.id, { fadeOut: value })}
                />
                <Text style={styles.fadeValue}>{(selectedTrackData.fadeOut || 0).toFixed(1)}s</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
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
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
  },
  volumeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    minWidth: 40,
    textAlign: 'right',
  },
  channelControl: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  channelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  channelLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  channelName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  channelValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d1d5db',
  },
  channelSlider: {
    width: '100%',
    height: 40,
  },
  trackCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  trackCardSelected: {
    borderColor: '#6366f1',
  },
  trackCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  trackDetails: {
    flex: 1,
  },
  trackType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  trackDuration: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  separator: {
    height: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  trackSetting: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  trackSettingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingSlider: {
    flex: 1,
    height: 40,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    minWidth: 40,
    textAlign: 'right',
  },
  effectsScroll: {
    marginVertical: 8,
  },
  effectButton: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#4b5563',
  },
  effectButtonActive: {
    borderColor: '#6366f1',
    backgroundColor: '#4f46e5',
  },
  effectIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  effectName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#d1d5db',
  },
  eqControl: {
    marginBottom: 16,
  },
  eqLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 6,
  },
  eqSlider: {
    width: '100%',
    height: 30,
  },
  eqValue: {
    fontSize: 12,
    color: '#6366f1',
    marginTop: 4,
    textAlign: 'right',
  },
  fadeControl: {
    marginBottom: 12,
  },
  fadeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 6,
  },
  fadeSlider: {
    width: '100%',
    height: 30,
  },
  fadeValue: {
    fontSize: 12,
    color: '#6366f1',
    marginTop: 4,
    textAlign: 'right',
  },
});

export default AdvancedAudioEditor;
