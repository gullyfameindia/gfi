




import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Reel } from "@/api/services/reelsService";
import { Ionicons } from "@expo/vector-icons";
import InstagramStyleVideoPlayer from "./InstagramStyleVideoPlayer";

const { width } = Dimensions.get("window");

interface InstagramStyleVideoGridProps {
  reels: Reel[];
  loading?: boolean;
  error?: string;
  userId?: string;
  onRefresh?: () => Promise<void>;
  onVideoDelete?: (videoId: string) => Promise<void>;
  onVideoEdit?: (video: Reel, title: string, description: string) => Promise<void>;
  onVideoLike?: (videoId: string) => Promise<void>;
}

interface VideoGridItem extends Reel {
  _index?: number;
}

const InstagramStyleVideoGrid: React.FC<InstagramStyleVideoGridProps> = ({
  reels,
  loading = false,
  error,
  userId = "",
  onRefresh,
  onVideoDelete,
  onVideoEdit,
  onVideoLike,
}) => {
  const [playerVisible, setPlayerVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Reel | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [videoCounts, setVideoCounts] = useState<Record<string, { likes: number; views: number }>>({});

  
  const columns = 3;
  const gap = 2;
  const cardSize = (width - gap * (columns - 1)) / columns;

  
  useEffect(() => {
    const liked = new Set<string>();
    const counts: Record<string, { likes: number; views: number }> = {};

    reels.forEach((reel) => {
      const id = reel._id || reel.id || "";
      if (reel.isLiked) liked.add(id);
      counts[id] = {
        likes: reel.likes || 0,
        views: reel.views || 0,
      };
    });

    setLikedVideos(liked);
    setVideoCounts(counts);
  }, [reels]);

  
  const handleVideoPress = useCallback(
    (reel: Reel, index: number) => {
      setSelectedVideo(reel);
      setSelectedIndex(index);
      setPlayerVisible(true);
    },
    []
  );

  
  const handleLike = useCallback(
    async (video: Reel) => {
      const id = video._id || video.id || "";
      if (!id || !onVideoLike) return;

      try {
        const newLikedState = !likedVideos.has(id);
        const newCount = videoCounts[id]?.likes || 0;

        
        const newLiked = new Set(likedVideos);
        if (newLikedState) {
          newLiked.add(id);
        } else {
          newLiked.delete(id);
        }
        setLikedVideos(newLiked);

        
        setVideoCounts((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            likes: newLikedState ? newCount + 1 : Math.max(0, newCount - 1),
          },
        }));

        
        await onVideoLike(id);
      } catch (err) {
        console.error("[VideoGrid] Like failed:", err);
        
        setLikedVideos((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return newSet;
        });
      }
    },
    [likedVideos, videoCounts, onVideoLike]
  );

  
  const handleDelete = useCallback(
    (videoId: string) => {
      Alert.alert("Delete Video", "Are you sure you want to delete this video?", [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              if (onVideoDelete) {
                await onVideoDelete(videoId);
              }
              setPlayerVisible(false);
            } catch (err) {
              Alert.alert("Error", "Failed to delete video");
            }
          },
          style: "destructive",
        },
      ]);
    },
    [onVideoDelete]
  );

  
  const handleShare = useCallback((video: Reel) => {
    Alert.alert("Share", "Share feature coming soon!");
  }, []);

  
  const handleViewIncrement = useCallback(
    (videoId: string) => {
      setVideoCounts((prev) => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          views: (prev[videoId]?.views || 0) + 1,
        },
      }));
    },
    []
  );

  
  const renderGridItem = ({ item, index }: { item: VideoGridItem; index: number }) => {
    const id = item._id || item.id || "";
    const thumbnailUrl = item.thumbnail || item.videoUrl || item.url || "";
    const isLiked = likedVideos.has(id);
    const likes = videoCounts[id]?.likes || item.likes || 0;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleVideoPress(item, index)}
        style={{
          width: cardSize,
          aspectRatio: 1,
          marginRight: index % columns !== columns - 1 ? gap : 0,
          marginBottom: gap,
        }}
      >
        {}
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.thumbnail}
          onError={() => {
            console.warn(`[VideoGrid] Failed to load thumbnail for ${id}`);
          }}
        />

        {}
        <View style={styles.overlayContainer}>
          <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.8)" />
        </View>

        {}
        <View style={styles.infoBadge}>
          <View style={styles.infoItem}>
            <Ionicons name="play" size={10} color="#fff" />
            <Text style={styles.infoText}>
              {item.views || 0 > 999 ? Math.round((item.views || 0) / 1000) + "K" : item.views || 0}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={10}
              color={isLiked ? "#ff6b6b" : "#fff"}
            />
            <Text style={styles.infoText}>{likes > 999 ? Math.round(likes / 1000) + "K" : likes}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  
  if (loading && reels.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#EC9A15" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (reels.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="film-outline" size={56} color="#EC9A15" />
        <Text style={styles.emptyTitle}>No Videos Yet</Text>
        <Text style={styles.emptySubtext}>Upload your first video to get started</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={reels}
        renderItem={renderGridItem}
        keyExtractor={(item) => item._id || item.id || Math.random().toString()}
        numColumns={columns}
        scrollEnabled={true}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.columnWrapper}
      />

      {}
      <InstagramStyleVideoPlayer
        visible={playerVisible}
        video={selectedVideo}
        onClose={() => setPlayerVisible(false)}
        onDelete={handleDelete}
        onLike={handleLike}
        onShare={handleShare}
        isLiked={selectedVideo ? likedVideos.has(selectedVideo._id || selectedVideo.id || "") : false}
        likeCount={
          selectedVideo ? videoCounts[selectedVideo._id || selectedVideo.id || ""]?.likes || 0 : 0
        }
        onViewsUpdate={handleViewIncrement}
      />
    </>
  );
};

const styles = StyleSheet.create({
  gridContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  columnWrapper: {
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 0,
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  infoBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  infoText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    color: "#999",
    fontSize: 14,
    marginTop: 12,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#EC9A15",
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default React.memo(InstagramStyleVideoGrid);
