





import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  PanResponder,
  GestureResponderEvent,
  AccessibilityInfo,
} from "react-native";
import { Reel } from "@/api/services/reelsService";
import { Ionicons } from "@expo/vector-icons";

export interface EnhancedVideoGridCardProps {
  reel: Reel;
  size: number;
  onPress: (reel: Reel) => void;
  onLongPress?: (reel: Reel) => void;
  onDelete?: (reel: Reel) => void;
  onEdit?: (reel: Reel) => void;
  onShare?: (reel: Reel) => void;
  onLike?: (reel: Reel) => void;
  isLiked?: boolean;
  showDuration?: boolean;
  showTitle?: boolean;
  inReorderMode?: boolean;
  isSelected?: boolean;
}

const EnhancedVideoGridCard: React.FC<EnhancedVideoGridCardProps> = ({
  reel,
  size,
  onPress,
  onLongPress,
  onDelete,
  onEdit,
  onShare,
  onLike,
  isLiked = false,
  showDuration = true,
  showTitle = false,
  inReorderMode = false,
  isSelected = false,
}) => {
  const [thumbnailLoading, setThumbnailLoading] = useState(true);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);

  
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const selectionScale = useRef(new Animated.Value(1)).current;

  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !inReorderMode,
      onMoveShouldSetPanResponder: () => !inReorderMode,
      onPanResponderMove: (evt, { dx }) => {
        
        const maxSwipe = size * 0.4;
        swipeAnim.setValue(Math.min(dx, maxSwipe) * -1);
      },
      onPanResponderRelease: (evt, { dx }) => {
        const threshold = size * 0.2;
        const shouldReveal = Math.abs(dx) > threshold;

        if (shouldReveal && dx < 0) {
          setShowActions(true);
          Animated.spring(swipeAnim, {
            toValue: size * 0.3,
            useNativeDriver: true,
          }).start();
        } else {
          setShowActions(false);
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  
  const handleLongPress = () => {
    if (inReorderMode) {
      console.log("[EnhancedVideoGridCard] Long press triggered for reorder");
      setLongPressActive(true);
      Animated.sequence([
        Animated.spring(selectionScale, {
          toValue: 1.05,
          useNativeDriver: true,
        }),
        Animated.spring(selectionScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
      onLongPress?.(reel);
    }
  };

  
  const triggerHeartAnimation = () => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = () => {
    triggerHeartAnimation();
    onLike?.(reel);
  };

  const getDuration = (): string => {
    if (!reel.duration) return "0:00";
    const seconds = Math.floor(reel.duration);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getThumbnailUri = (): string => {
    if (reel.thumbnail) return reel.thumbnail;
    if (reel.coverImage) return reel.coverImage;
    if (reel.videoUrl) return reel.videoUrl;
    return "";
  };

  const containerStyle = {
    width: size,
    height: size,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        {
          transform: [{ scale: selectionScale }],
          opacity: inReorderMode ? (isSelected ? 1 : 0.6) : 1,
        },
      ]}
      accessible={true}
      accessibilityLabel={`Video: ${reel.title || "Untitled"}`}
      accessibilityHint="Double tap to view video"
    >
      {}
      <View style={[styles.cardContent, containerStyle]}>
        {}
        {getThumbnailUri() && !thumbnailError ? (
          <>
            <Image
              source={{ uri: getThumbnailUri() }}
              style={[styles.thumbnail, containerStyle]}
              onLoad={() => {
                setThumbnailLoading(false);
                setThumbnailError(false);
              }}
              onError={() => {
                setThumbnailLoading(false);
                setThumbnailError(true);
              }}
              resizeMode="cover"
            />
            {thumbnailLoading && (
              <View style={[styles.loadingOverlay, containerStyle]}>
                <ActivityIndicator size="small" color="#EC9A15" />
              </View>
            )}
          </>
        ) : (
          <View
            style={[
              styles.fallbackBackground,
              containerStyle,
              { backgroundColor: "#2d2420" },
            ]}
          >
            <Text style={styles.fallbackText}>No Thumbnail</Text>
          </View>
        )}

        {}
        <View style={[styles.overlay, containerStyle]} />

        {}
        {!inReorderMode && (
          <TouchableOpacity
            style={[styles.playButtonContainer, containerStyle]}
            onPress={() => onPress(reel)}
            activeOpacity={0.8}
          >
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </TouchableOpacity>
        )}

        {}
        {inReorderMode && isSelected && (
          <View style={[styles.reorderBadge, containerStyle]}>
            <Ionicons name="checkmark-circle" size={40} color="#EC9A15" />
          </View>
        )}

        {}
        {showDuration && !inReorderMode && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{getDuration()}</Text>
          </View>
        )}

        {}
        {!inReorderMode && (
          <Animated.View
            style={[
              styles.likeHeartContainer,
              {
                transform: [{ scale: heartScale }],
              },
            ]}
          >
            <TouchableOpacity onPress={handleLike}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={20}
                color={isLiked ? "#ff6b6b" : "#EC9A15"}
              />
            </TouchableOpacity>
          </Animated.View>
        )}

        {}
        {showTitle && reel.title && !inReorderMode && (
          <View style={styles.titleOverlay}>
            <Text style={styles.titleText} numberOfLines={1}>
              {reel.title}
            </Text>
          </View>
        )}
      </View>

      {}
      {!inReorderMode && (
        <Animated.View
          style={[
            styles.actionsContainer,
            containerStyle,
            {
              transform: [{ translateX: swipeAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {}
          <View style={styles.actionButtonsRow}>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setShowActions(false);
                  swipeAnim.setValue(0);
                  onEdit(reel);
                }}
              >
                <Ionicons name="pencil" size={18} color="#EC9A15" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
            )}

            {onShare && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setShowActions(false);
                  swipeAnim.setValue(0);
                  onShare(reel);
                }}
              >
                <Ionicons name="share-social" size={18} color="#EC9A15" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => {
                  setShowActions(false);
                  swipeAnim.setValue(0);
                  onDelete(reel);
                }}
              >
                <Ionicons name="trash" size={18} color="#ff6b6b" />
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}

      {}
      <TouchableOpacity
        style={[styles.touchArea, containerStyle]}
        onPress={() => {
          if (showActions) {
            setShowActions(false);
            Animated.spring(swipeAnim, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          } else {
            onPress(reel);
          }
        }}
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.9}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#2d2420",
  },
  cardContent: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  thumbnail: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackBackground: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  fallbackText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  playButtonContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(236, 154, 21, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginLeft: 3,
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: "#EC9A15",
    fontSize: 11,
    fontWeight: "600",
  },
  likeHeartContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 20,
  },
  titleOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  titleText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "500",
  },
  reorderBadge: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1a1410",
    zIndex: 5,
  },
  actionButtonsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  deleteButton: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
  actionButtonText: {
    color: "#EC9A15",
    fontSize: 9,
    marginTop: 2,
    fontWeight: "600",
  },
  deleteButtonText: {
    color: "#ff6b6b",
  },
  touchArea: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 15,
  },
});

export default React.memo(EnhancedVideoGridCard);
