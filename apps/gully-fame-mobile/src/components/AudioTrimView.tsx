


import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import type { Music } from './MusicLibraryModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface AudioTrimData {
  trackId: string;
  startOffset: number; 
  duration: number;    
  title: string;
  artist: string;
}

interface AudioTrimViewProps {
  music: Music;
  videoDuration: number; 
  onConfirm: (trimData: AudioTrimData) => void;
  onCancel: () => void;
}

export const AudioTrimView: React.FC<AudioTrimViewProps> = ({
  music,
  videoDuration,
  onConfirm,
  onCancel,
}) => {
  const [startOffset, setStartOffset] = useState(0);
  const trackDurationSeconds = music.duration;
  const maxOffset = Math.max(0, trackDurationSeconds - videoDuration);
  
  
  const trimWindowWidth = Math.min(videoDuration, trackDurationSeconds) / trackDurationSeconds;
  const trackBarWidth = SCREEN_WIDTH - 32; 
  
  const handleLeftDrag = (offset: number) => {
    let newStart = startOffset + offset;
    newStart = Math.max(0, Math.min(newStart, maxOffset));
    setStartOffset(newStart);
  };

  const handleRightDrag = (offset: number) => {
    let newStart = startOffset + offset;
    newStart = Math.max(0, Math.min(newStart, maxOffset));
    setStartOffset(newStart);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    onConfirm({
      trackId: music.id,
      startOffset,
      duration: Math.min(videoDuration, trackDurationSeconds - startOffset),
      title: music.title,
      artist: music.artist,
    });
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <Text style={styles.title}>Trim Audio</Text>
        <TouchableOpacity onPress={onCancel}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.trackInfo}>
        <View style={styles.albumArt}>
          <Text style={styles.albumIcon}>🎵</Text>
        </View>
        <View style={styles.trackDetails}>
          <Text style={styles.trackTitle} numberOfLines={1}>{music.title}</Text>
          <Text style={styles.trackArtist} numberOfLines={1}>{music.artist}</Text>
          <Text style={styles.trackDuration}>{formatTime(music.duration)}</Text>
        </View>
      </View>

      {}
      <View style={styles.timelineSection}>
        <Text style={styles.timelineLabel}>Drag to select region</Text>
        
        {}
        <View style={styles.fullTrackBar}>
          <View
            style={[
              styles.trimWindow,
              {
                left: `${(startOffset / trackDurationSeconds) * 100}%`,
                width: `${trimWindowWidth * 100}%`,
              },
            ]}
          >
            {}
            <TouchableOpacity
              style={styles.trimHandle}
              onLongPress={() => handleLeftDrag(-0.5)}
              activeOpacity={0.7}
            >
              <View style={styles.handleBar} />
            </TouchableOpacity>
            
            {}
            <View style={styles.trimContent}>
              <Text style={styles.trimLabel}>
                {formatTime(startOffset)} → {formatTime(startOffset + Math.min(videoDuration, trackDurationSeconds - startOffset))}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.trimHandle}
              onLongPress={() => handleRightDrag(0.5)}
              activeOpacity={0.7}
            >
              <View style={styles.handleBar} />
            </TouchableOpacity>
          </View>
        </View>

        {}
        <View style={styles.timeDisplay}>
          <Text style={styles.timeStart}>{formatTime(startOffset)}</Text>
          <Text style={styles.timeDuration}>
            {formatTime(Math.min(videoDuration, trackDurationSeconds - startOffset))}
          </Text>
          <Text style={styles.timeEnd}>{formatTime(trackDurationSeconds)}</Text>
        </View>
      </View>

      {}
      <View style={styles.presets}>
        <TouchableOpacity
          style={styles.presetButton}
          onPress={() => setStartOffset(0)}
        >
          <Text style={styles.presetText}>From Start</Text>
        </TouchableOpacity>
        {maxOffset > 0 && (
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => setStartOffset(maxOffset)}
          >
            <Text style={styles.presetText}>To End</Text>
          </TouchableOpacity>
        )}
      </View>

      {}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ec9a15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  albumIcon: {
    fontSize: 32,
  },
  trackDetails: {
    flex: 1,
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
  trackDuration: {
    color: '#666',
    fontSize: 11,
    marginTop: 4,
  },
  timelineSection: {
    flex: 1,
    justifyContent: 'center',
  },
  timelineLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 12,
  },
  fullTrackBar: {
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  trimWindow: {
    height: '100%',
    backgroundColor: 'rgba(236, 154, 21, 0.2)',
    borderWidth: 2,
    borderColor: '#ec9a15',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  trimContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trimLabel: {
    color: '#ec9a15',
    fontSize: 12,
    fontWeight: '600',
  },
  trimHandle: {
    width: 8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ec9a15',
    borderRadius: 2,
  },
  handleBar: {
    width: 3,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 1.5,
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  timeStart: {
    color: '#999',
    fontSize: 11,
  },
  timeDuration: {
    color: '#ec9a15',
    fontSize: 11,
    fontWeight: '600',
  },
  timeEnd: {
    color: '#999',
    fontSize: 11,
  },
  presets: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  presetText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#ec9a15',
  },
  confirmText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AudioTrimView;
