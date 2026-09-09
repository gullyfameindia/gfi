import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AudioLibraryModal } from './AudioLibraryModal';
import { AudioPlayer } from './AudioPlayer';
import type { AudioTrackWithMetadata } from '@/hooks/useAudioLibrary';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AudioTabPanelProps {
  selectedTracks: AudioTrackWithMetadata[];
  onAddTrack: (track: any) => void;
  onRemoveTrack: (trackId: string) => void;
  onUpdateTrack: (trackId: string, updates: Partial<AudioTrackWithMetadata>) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const AudioTabPanel: React.FC<AudioTabPanelProps> = ({
  selectedTracks,
  onAddTrack,
  onRemoveTrack,
  onUpdateTrack,
  isLoading = false,
  error = null,
}) => {
  const [showAudioLibrary, setShowAudioLibrary] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handleSelectTrack = (track: any) => {
    onAddTrack(track);
    setShowAudioLibrary(false);
  };

  const renderTrackItem = ({ item }: { item: AudioTrackWithMetadata }) => (
    <View style={styles.trackItemContainer}>
      <View style={styles.trackHeader}>
        <View style={styles.trackTitleGroup}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist || 'Unknown Artist'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert('Remove Track', 'Are you sure you want to remove this track?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Remove',
                style: 'destructive',
                onPress: () => onRemoveTrack(item.id),
              },
            ]);
          }}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 6L6 18M6 6l12 12"
              stroke="#ff4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <AudioPlayer
        track={item}
        isPlaying={playingTrackId === item.id}
        onPlayPause={(playing) => setPlayingTrackId(playing ? item.id : null)}
        onVolumeChange={(volume) => onUpdateTrack(item.id, { volume })}
        currentTime={playingTrackId === item.id ? currentTime : 0}
        onTimeChange={(time) => setCurrentTime(time)}
      />
    </View>
  );

  return (
    <>
      <AudioLibraryModal
        visible={showAudioLibrary}
        onSelect={handleSelectTrack}
        onCancel={() => setShowAudioLibrary(false)}
      />

      <View style={styles.container}>
        {}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Audio Tracks</Text>
            <Text style={styles.subtitle}>
              {selectedTracks.length} track{selectedTracks.length !== 1 ? 's' : ''} added
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAudioLibrary(true)}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M12 5v14m7-7H5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            </Svg>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {}
        {selectedTracks.length === 0 && !isLoading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyTitle}>No Audio Tracks</Text>
            <Text style={styles.emptyText}>Add background music or sound tracks to your video</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setShowAudioLibrary(true)}
            >
              <Text style={styles.emptyButtonText}>Browse Library</Text>
            </TouchableOpacity>
          </View>
        )}

        {}
        {selectedTracks.length > 0 && (
          <View style={styles.tracksList}>
            {selectedTracks.map((item) => (
              <View key={item.id}>
                {renderTrackItem({ item })}
              </View>
            ))}
          </View>
        )}

        {}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>💡 Tip</Text>
            <Text style={styles.infoText}>Add multiple tracks and adjust their volumes to create a layered audio mix</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>⏱️ Timing</Text>
            <Text style={styles.infoText}>Set start times to sync audio with your video clips</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ec9a15',
  },
  addButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  errorText: {
    color: '#ff6666',
    fontSize: 12,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ec9a15',
  },
  emptyButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  tracksList: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  trackItemContainer: {
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
    marginBottom: 12,
  },
  trackTitleGroup: {
    flex: 1,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  trackArtist: {
    color: '#999',
    fontSize: 11,
    marginTop: 2,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  infoContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  infoItem: {
    backgroundColor: 'rgba(236, 154, 21, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(236, 154, 21, 0.2)',
  },
  infoLabel: {
    color: '#ec9a15',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    color: '#ccc',
    fontSize: 11,
  },
});

export default AudioTabPanel;
