import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Svg, { Path } from 'react-native-svg';
import type { AudioTrackWithMetadata } from '@/hooks/useAudioLibrary';

interface AudioMixerProps {
  tracks: AudioTrackWithMetadata[];
  masterVolume: number;
  onMasterVolumeChange: (volume: number) => void;
  onTrackVolumeChange: (trackId: string, volume: number) => void;
  onTrackRemove: (trackId: string) => void;
  onMute?: (trackId: string, muted: boolean) => void;
  onSolo?: (trackId: string, solo: boolean) => void;
}

export const AudioMixer: React.FC<AudioMixerProps> = ({
  tracks,
  masterVolume,
  onMasterVolumeChange,
  onTrackVolumeChange,
  onTrackRemove,
  onMute,
  onSolo,
}) => {
  const [mutedTracks, setMutedTracks] = useState<Set<string>>(new Set());
  const [soloTrack, setSoloTrack] = useState<string | null>(null);

  const handleMuteToggle = (trackId: string) => {
    const newMutedTracks = new Set(mutedTracks);
    if (newMutedTracks.has(trackId)) {
      newMutedTracks.delete(trackId);
    } else {
      newMutedTracks.add(trackId);
    }
    setMutedTracks(newMutedTracks);
    onMute?.(trackId, newMutedTracks.has(trackId));
  };

  const handleSoloToggle = (trackId: string) => {
    if (soloTrack === trackId) {
      setSoloTrack(null);
      onSolo?.(trackId, false);
    } else {
      setSoloTrack(trackId);
      onSolo?.(trackId, true);
    }
  };

  const getTrackVolume = (track: AudioTrackWithMetadata) => {
    if (soloTrack && soloTrack !== track.id) return 0;
    if (mutedTracks.has(track.id)) return 0;
    return (track.volume || 1) * masterVolume;
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.masterSection}>
        <View style={styles.masterHeader}>
          <Text style={styles.masterTitle}>Master Volume</Text>
          <Text style={styles.masterValue}>
            {Math.round(masterVolume * 100)}%
          </Text>
        </View>

        <View style={styles.masterSliderContainer}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 9v6a2 2 0 002 2h4l5 5v-16l-5 5H5a2 2 0 00-2 2z"
              stroke="#ec9a15"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Slider
            style={styles.masterSlider}
            minimumValue={0}
            maximumValue={1}
            value={masterVolume}
            onValueChange={onMasterVolumeChange}
            minimumTrackTintColor="#ec9a15"
            maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
            thumbTintColor="#ec9a15"
          />
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 9v6a2 2 0 002 2h4l5 5v-16l-5 5H5a2 2 0 00-2 2zm14-4v12m-3-3v6m-3-6v6"
              stroke="#ec9a15"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </View>

      {}
      <View style={styles.divider} />

      {}
      <ScrollView
        style={styles.tracksContainer}
        contentContainerStyle={styles.tracksContent}
        showsVerticalScrollIndicator={false}
      >
        {tracks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tracks to mix</Text>
          </View>
        ) : (
          tracks.map((track) => {
            const isMuted = mutedTracks.has(track.id);
            const isSolo = soloTrack === track.id;
            const effectiveVolume = getTrackVolume(track);

            return (
              <View key={track.id} style={styles.trackMixer}>
                <View style={styles.trackHeader}>
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackName} numberOfLines={1}>
                      {track.title}
                    </Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>
                      {track.artist || 'Unknown'}
                    </Text>
                  </View>
                  <Text style={styles.trackVolume}>
                    {Math.round(effectiveVolume * 100)}%
                  </Text>
                </View>

                {}
                <View style={styles.fader}>
                  <Slider
                    style={styles.trackSlider}
                    minimumValue={0}
                    maximumValue={1}
                    value={track.volume || 1}
                    onValueChange={(value) => onTrackVolumeChange(track.id, value)}
                    minimumTrackTintColor="#ec9a15"
                    maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                    thumbTintColor="#ec9a15"
                    disabled={isMuted}
                  />
                </View>

                {}
                <View style={styles.controls}>
                  {}
                  <TouchableOpacity
                    style={[styles.controlButton, isMuted && styles.controlButtonActive]}
                    onPress={() => handleMuteToggle(track.id)}
                  >
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      {isMuted ? (
                        <Path
                          d="M3 9v6a2 2 0 002 2h4l5 5v-16l-5 5H5a2 2 0 00-2 2zm17.46 3.46l1.41-1.41M20.87 9.13l1.41-1.41"
                          stroke={isMuted ? '#ff4444' : '#999'}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      ) : (
                        <Path
                          d="M3 9v6a2 2 0 002 2h4l5 5v-16l-5 5H5a2 2 0 00-2 2z"
                          stroke="#999"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </Svg>
                    <Text style={styles.controlLabel}>{isMuted ? 'M' : 'M'}</Text>
                  </TouchableOpacity>

                  {}
                  <TouchableOpacity
                    style={[styles.controlButton, isSolo && styles.controlButtonActive]}
                    onPress={() => handleSoloToggle(track.id)}
                  >
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
                        stroke={isSolo ? '#ec9a15' : '#999'}
                        strokeWidth="1"
                        fill={isSolo ? '#ec9a15' : 'none'}
                      />
                    </Svg>
                    <Text style={styles.controlLabel}>S</Text>
                  </TouchableOpacity>

                  {}
                  <View style={styles.panContainer}>
                    <Text style={styles.panLabel}>Pan</Text>
                    <View style={styles.panIndicator} />
                  </View>

                  {}
                  <TouchableOpacity
                    style={[styles.controlButton, styles.deleteButton]}
                    onPress={() => {
                      Alert.alert('Remove Track', 'Remove this track from the mix?', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Remove',
                          style: 'destructive',
                          onPress: () => onTrackRemove(track.id),
                        },
                      ]);
                    }}
                  >
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="#ff4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {}
      <View style={styles.infoFooter}>
        <Text style={styles.infoText}>
          💡 Drag sliders to adjust track volumes. Use M to mute, S for solo.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  masterSection: {
    backgroundColor: 'rgba(236, 154, 21, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(236, 154, 21, 0.2)',
    padding: 16,
  },
  masterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  masterTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  masterValue: {
    color: '#ec9a15',
    fontSize: 14,
    fontWeight: '700',
  },
  masterSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  masterSlider: {
    flex: 1,
    height: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tracksContainer: {
    flex: 1,
  },
  tracksContent: {
    padding: 12,
    gap: 12,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  trackMixer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  trackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  trackArtist: {
    color: '#999',
    fontSize: 11,
    marginTop: 2,
  },
  trackVolume: {
    color: '#ec9a15',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  fader: {
    marginBottom: 12,
  },
  trackSlider: {
    height: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(236, 154, 21, 0.2)',
    borderColor: '#ec9a15',
  },
  controlLabel: {
    color: '#999',
    fontSize: 10,
    fontWeight: '600',
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  panContainer: {
    width: 40,
    alignItems: 'center',
  },
  panLabel: {
    color: '#999',
    fontSize: 10,
    marginBottom: 4,
  },
  panIndicator: {
    width: 20,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1.5,
  },
  infoFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  infoText: {
    color: '#999',
    fontSize: 11,
  },
});

export default AudioMixer;
