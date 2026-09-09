import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { AudioTrack } from "../types/music.types";

interface AudioTrackEditorProps {
  track: AudioTrack;
  onUpdate: (track: AudioTrack) => void;
  onDelete: () => void;
  maxDuration: number;
}

/**
 * Audio track editor component for managing audio tracks
 */
const AudioTrackEditor: React.FC<AudioTrackEditorProps> = ({
  track,
  onUpdate,
  onDelete,
  maxDuration,
}) => {
  const [showVolumeControl, setShowVolumeControl] = useState(false);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.trackInfo}>
          <View style={styles.trackIcon}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm12-3c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zM9 9l12-2"
                stroke="#a78bfa"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <View style={styles.trackDetails}>
            <Text style={styles.trackType}>{track.type.toUpperCase()}</Text>
            <Text style={styles.trackTime}>
              {formatTime(track.startTime)} - {formatTime(track.endTime)}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              fill="#ff6b6b"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        {/* Volume Control */}
        <View style={styles.controlGroup}>
          <TouchableOpacity
            style={[styles.controlButton, track.isMuted && styles.controlButtonMuted]}
            onPress={handleToggleMute}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              {track.isMuted ? (
                <Path
                  d="M16.6915026,16.4744748 L3.50612381,3.28515504 M3.5,7 L3.5,17 C3.5,17.8284271 4.17157288,18.5 5,18.5 L11,18.5 C12.6568542,18.5 14,17.1568542 14,15.5 L14,13"
                  stroke="#ff6b6b"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <Path
                  d="M3 9v6c0 .55.45 1 1 1h4l5 5v-16l-5 5H4c-.55 0-1 .45-1 1zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM15.5 3.5v2.21c2.89 1.86 4.5 5 4.5 8.29s-1.61 6.43-4.5 8.29v2.21c5.07-3.41 8-8.97 8-10.5s-2.93-7.09-8-10.5z"
                  fill="#a78bfa"
                />
              )}
            </Svg>
          </TouchableOpacity>

          <View style={styles.volumeDisplay}>
            <Text style={styles.volumeLabel}>Volume</Text>
            <View style={styles.volumeBar}>
              <View style={[styles.volumeFill, { width: `${track.volume * 100}%` }]} />
            </View>
            <Text style={styles.volumeValue}>{Math.round(track.volume * 100)}%</Text>
          </View>

          <View style={styles.volumeButtons}>
            <TouchableOpacity style={styles.volumeButton} onPress={() => handleVolumeChange(-0.1)}>
              <Text style={styles.volumeButtonText}>−</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.volumeButton} onPress={() => handleVolumeChange(0.1)}>
              <Text style={styles.volumeButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fade Controls */}
        <View style={styles.controlGroup}>
          <Text style={styles.controlLabel}>Fade</Text>
          <View style={styles.fadeControls}>
            <View style={styles.fadeOption}>
              <Text style={styles.fadeLabel}>In</Text>
              <Text style={styles.fadeValue}>{track.fadeIn ? `${track.fadeIn}s` : "None"}</Text>
            </View>
            <View style={styles.fadeOption}>
              <Text style={styles.fadeLabel}>Out</Text>
              <Text style={styles.fadeValue}>{track.fadeOut ? `${track.fadeOut}s` : "None"}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  trackInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  trackIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  trackDetails: {
    flex: 1,
  },
  trackType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#a78bfa",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  trackTime: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
  },
  deleteButton: {
    padding: 8,
  },
  controls: {
    gap: 12,
  },
  controlGroup: {
    gap: 8,
  },
  controlLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonMuted: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
  },
  volumeDisplay: {
    gap: 6,
  },
  volumeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
  },
  volumeBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  volumeFill: {
    height: "100%",
    backgroundColor: "#a78bfa",
    borderRadius: 2,
  },
  volumeValue: {
    fontSize: 11,
    color: "#a78bfa",
    fontWeight: "600",
  },
  volumeButtons: {
    flexDirection: "row",
    gap: 8,
  },
  volumeButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    alignItems: "center",
  },
  volumeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a78bfa",
  },
  fadeControls: {
    flexDirection: "row",
    gap: 12,
  },
  fadeOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  fadeLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 2,
  },
  fadeValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#a78bfa",
  },
});

export default AudioTrackEditor;
