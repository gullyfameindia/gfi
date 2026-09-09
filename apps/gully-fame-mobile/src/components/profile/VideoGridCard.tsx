





import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Reel } from "@/api/services/reelsService";

export interface VideoGridCardProps {
  reel: Reel;
  size: number; 
  onPress: (reel: Reel) => void;
  showDuration?: boolean;
  showTitle?: boolean;
}

const VideoGridCard: React.FC<VideoGridCardProps> = ({
  reel,
  size,
  onPress,
  showDuration = true,
  showTitle = false,
}) => {
  const [thumbnailLoading, setThumbnailLoading] = useState(true);
  const [thumbnailError, setThumbnailError] = useState(false);

  const containerStyle = {
    width: size,
    height: size,
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

  
  useEffect(() => {
    const thumbnailUrl = getThumbnailUri();
    console.log(`[VideoGridCard] Mounted reel ${reel._id || reel.id}:`, {
      title: reel.title,
      hasThumbnail: !!reel.thumbnail,
      hasVideoUrl: !!reel.videoUrl,
      hasCoverImage: !!reel.coverImage,
      usingThumbnail: thumbnailUrl,
      thumbnailTruncated: thumbnailUrl ? thumbnailUrl.substring(0, 80) : "N/A",
    });
  }, [reel._id, reel.id, reel.thumbnail, reel.videoUrl, reel.coverImage, reel.title]);

  const handleImageLoad = () => {
    setThumbnailLoading(false);
    setThumbnailError(false);
    console.log(`[VideoGridCard] Successfully loaded image for reel ${reel._id || reel.id}`);
  };

  const handleImageError = () => {
    setThumbnailLoading(false);
    setThumbnailError(true);
    console.warn(`[VideoGridCard] Failed to load thumbnail for reel ${reel._id || reel.id}: ${getThumbnailUri()}`);
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => onPress(reel)}
      activeOpacity={0.8}
    >
      {}
      {getThumbnailUri() && !thumbnailError ? (
        <>
          <Image
            source={{ uri: getThumbnailUri() }}
            style={[styles.thumbnail, containerStyle]}
            onLoad={handleImageLoad}
            onError={handleImageError}
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
      <View style={[styles.playButtonContainer, containerStyle]}>
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>

      {}
      {showDuration && (
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{getDuration()}</Text>
        </View>
      )}

      {}
      {showTitle && reel.title && (
        <View style={styles.titleOverlay}>
          <Text style={styles.titleText} numberOfLines={1}>
            {reel.title}
          </Text>
        </View>
      )}

      {}
      {reel.videoCount && reel.videoCount > 1 && (
        <View style={styles.videoCountBadge}>
          <Text style={styles.videoCountText}>{reel.videoCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "#2d2420",
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
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
  videoCountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#EC9A15",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
  },
  videoCountText: {
    color: "#1a1410",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default VideoGridCard;
