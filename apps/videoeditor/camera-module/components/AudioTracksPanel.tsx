import React, { useCallback } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { AudioTrack } from "../types/music.types";
import AudioTrackEditor from "./AudioTrackEditor";

interface AudioTracksPanelProps {
  tracks: AudioTrack[];
  onUpdateTrack: (trackId: string, updates: Partial<AudioTrack>) => void;
  onDeleteTrack: (trackId: string) => void;
  maxDuration: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

/**
 * Panel for displaying and managing audio tracks
 */
const AudioTracksPanel: React.FC<AudioTracksPanelProps> = ({
  tracks,
  onUpdateTrack,
  onDeleteTrack,
  maxDuration,
  isExpanded = true,
  onToggleExpand,
}) => {
  const handleUpdateTrack = useCallback(
    (track: AudioTrack) => {
      onUpdateTrack(track.id, track);
    },
    [onUpdateTrack]
  );

  const handleDeleteTrack = useCallback(
    (trackId: string) => {
      onDeleteTrack(trackId);
    },
    [onDeleteTrack]
  );

  if (tracks.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={onToggleExpand} activeOpacity={0.7}>
        <View style={styles.headerContent}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm12-3c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zM9 9l12-2"
              stroke="#a78bfa"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.headerTitle}>Audio Tracks</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{tracks.length}</Text>
          </View>
        </View>

        <Svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          style={[styles.chevron, !isExpanded && styles.chevronRotated]}
        >
          <Path
            d="M19 14l-7-7-7 7"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <FlatList
            data={tracks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AudioTrackEditor
                track={item}
                onUpdate={handleUpdateTrack}
                onDelete={() => handleDeleteTrack(item.id)}
                maxDuration={maxDuration}
              />
            )}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#a78bfa",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
  },
  chevron: {
    marginLeft: 8,
  },
  chevronRotated: {
    transform: [{ rotate: "180deg" }],
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default AudioTracksPanel;
