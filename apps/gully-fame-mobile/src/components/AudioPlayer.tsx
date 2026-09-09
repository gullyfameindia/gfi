import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { useAudioPlayer, AVPlaybackStatus } from 'expo-audio';
import Svg, { Path, Circle } from 'react-native-svg';
import type { AudioTrackWithMetadata } from '@/hooks/useAudioLibrary';

interface AudioPlayerProps {
  track: AudioTrackWithMetadata;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  onVolumeChange: (volume: number) => void;
  currentTime?: number;
  onTimeChange?: (time: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  track,
  isPlaying,
  onPlayPause,
  onVolumeChange,
  currentTime = 0,
  onTimeChange,
}) => {
  const [duration, setDuration] = useState(track.duration || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);

  
  const player = useAudioPlayer(track.audioUrl || '');

  
  useEffect(() => {
    if (player) {
      player.loop = false;
      player.volume = track.volume || 1;
      
      
      const subscription = player.subscribe((newStatus) => {
        setStatus(newStatus);
        if (newStatus.isLoaded) {
          setDuration(newStatus.durationMillis ? newStatus.durationMillis / 1000 : 0);
          const currentTimeSeconds = (newStatus.positionMillis || 0) / 1000;
          if (onTimeChange && Math.abs(currentTimeSeconds - currentTime) > 0.5) {
            onTimeChange(currentTimeSeconds);
          }

          
          if (newStatus.didJustFinish && !newStatus.isLooping) {
            onPlayPause(false);
          }
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, [player, currentTime, onTimeChange]);

  
  useEffect(() => {
    if (player) {
      if (isPlaying) {
        player.play().catch(() => {
          console.warn('[AudioPlayer] Failed to play');
        });
      } else {
        player.pause().catch(() => {
          console.warn('[AudioPlayer] Failed to pause');
        });
      }
    }
  }, [isPlaying, player]);

  
  useEffect(() => {
    if (player && status?.isLoaded && Math.abs((status.positionMillis || 0) / 1000 - currentTime) > 0.5) {
      player.seekTo(currentTime).catch(() => {
        console.warn('[AudioPlayer] Failed to seek');
      });
    }
  }, [currentTime, player, status?.isLoaded]);

  const handleVolumeChange = (volume: number) => {
    onVolumeChange(volume);
    if (player) {
      player.volume = volume;
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {track.artist || 'Unknown Artist'}
          </Text>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {loading && <ActivityIndicator color="#ec9a15" size="small" />}

      {!loading && (
        <>
          {}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => onPlayPause(!isPlaying)}
            >
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="#ec9a15">
                {isPlaying ? (
                  <>
                    <Path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </>
                ) : (
                  <Path d="M8 5v14l11-7z" />
                )}
              </Svg>
            </TouchableOpacity>

            <View style={styles.timelineContainer}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration || 1}
                value={currentTime}
                onValueChange={onTimeChange}
                minimumTrackTintColor="#ec9a15"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                thumbTintColor="#ec9a15"
              />
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {}
          <View style={styles.volumeControl}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 9v6a2 2 0 002 2h4l5 5v-16l-5 5H5a2 2 0 00-2 2z"
                stroke="#999"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              value={track.volume || 1}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="#ec9a15"
              maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              thumbTintColor="#ec9a15"
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    marginBottom: 12,
  },
  trackInfo: {
    marginBottom: 8,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  trackArtist: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(236, 154, 21, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slider: {
    flex: 1,
    height: 4,
  },
  timeText: {
    color: '#999',
    fontSize: 11,
    minWidth: 30,
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  volumeSlider: {
    flex: 1,
    height: 4,
  },
});

export default AudioPlayer;
