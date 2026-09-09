import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { TextOverlay } from "../types/textOverlay.types";

interface TextOverlayProps {
  overlay: TextOverlay;
  containerWidth: number;
  containerHeight: number;
  currentTime?: number; // For video: current playback time
  isEditing?: boolean;
  onPress?: () => void;
  onDone?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * Renders a single text overlay on the preview with Done/Edit/Delete buttons
 */
const TextOverlayComponent: React.FC<TextOverlayProps> = ({
  overlay,
  containerWidth,
  containerHeight,
  currentTime = 0,
  isEditing = false,
  onPress,
  onDone,
  onEdit,
  onDelete,
}) => {
  // Check if text should be visible (for video timing)
  const isVisible =
    overlay.startTime === undefined ||
    overlay.endTime === undefined ||
    (currentTime >= overlay.startTime && currentTime <= overlay.endTime);

  if (!isVisible) {
    return null;
  }

  // Calculate absolute position from relative (0-1) coordinates
  const absoluteX = overlay.x * containerWidth;
  const absoluteY = overlay.y * containerHeight;

  // Build text style
  const textStyle: ViewStyle = {
    position: "absolute",
    left: absoluteX,
    top: absoluteY,
    opacity: overlay.opacity,
    transform: [{ rotate: `${overlay.rotation || 0}deg` }],
  };

  const textContentStyle = {
    fontSize: overlay.fontSize,
    fontWeight: overlay.fontWeight,
    color: overlay.color,
    textAlign: overlay.textAlign,
    ...(overlay.strokeColor && overlay.strokeWidth
      ? {
          textShadowColor: overlay.strokeColor,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: overlay.strokeWidth,
        }
      : {}),
  };

  return (
    <View style={[styles.container, textStyle]}>
      {/* Action Buttons (Show when editing) */}
      {isEditing && (
        <View style={styles.actionButtons}>
          {/* Done Button */}
          <TouchableOpacity style={styles.doneButton} onPress={onDone} activeOpacity={0.7}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 6L9 17l-5-5"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.buttonLabel}>Done</Text>
          </TouchableOpacity>

          {/* Edit Button */}
          <TouchableOpacity style={styles.editButton} onPress={onEdit} activeOpacity={0.7}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                stroke="#a78bfa"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="#a78bfa"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.buttonLabel}>Edit</Text>
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete} activeOpacity={0.7}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                fill="#ff6b6b"
              />
            </Svg>
            <Text style={styles.buttonLabel}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Text Content */}
      <TouchableOpacity
        style={[styles.textWrapper, isEditing && styles.editing]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        {overlay.backgroundColor && (
          <View style={[styles.background, { backgroundColor: overlay.backgroundColor }]} />
        )}
        <Text style={[styles.text, textContentStyle]} numberOfLines={0}>
          {overlay.text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 40,
    minHeight: 30,
  },
  textWrapper: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
  },
  text: {
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  editing: {
    borderWidth: 1.5,
    borderColor: "#a78bfa",
    borderRadius: 4,
    borderStyle: "dashed",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  actionButtons: {
    position: "absolute",
    top: -45,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  doneButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(167, 139, 250, 0.3)",
    borderWidth: 1,
    borderColor: "#a78bfa",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.5)",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderWidth: 1,
    borderColor: "#ff6b6b",
  },
  buttonLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default TextOverlayComponent;
