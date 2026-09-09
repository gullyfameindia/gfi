




import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
  Animated,
  Text,
  ActionSheetIOS,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Reel } from "@/api/services/reelsService";

let Video: any = null;
let AVPlaybackStatus: any = null;
try {
  const expoAv = require("expo-av");
  Video = expoAv.Video;
  AVPlaybackStatus = expoAv.AVPlaybackStatus;
} catch (e) {
  console.warn("[InstagramStyleVideoPlayer] expo-av not available (requires dev build, not Expo Go):", (e as any)?.message);
}

const { width, height } = Dimensions.get("window");

interface InstagramStyleVideoPlayerProps {
  visible: boolean;
  video: Reel | null;
  onClose: () => void;
  onDelete?: (videoId: string) => void;
  onEdit?: (video: Reel) => void;
  onShare?: (video: Reel) => void;
  onLike?: (video: Reel) => void;
  isLiked?: boolean;
  likeCount?: number;
  onViewsUpdate?: (videoId: string) => void;
}

const InstagramStyleVideoPlayer: React.FC<InstagramStyleVideoPlayerProps> = ({
  visible,
  video,
  onClose,
  onDelete,
  onEdit,
  onShare,
  onLike,
  isLiked = false,
  likeCount = 0,
  onViewsUpdate,
}) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showLike, setShowLike] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLikedLocal, setIsLikedLocal] = useState(isLiked);
  const [likeCountLocal, setLikeCountLocal] = useState(likeCount);
  const [showControls, setShowControls] = useState(true);
  const likeAnimValue = useRef(new Animated.Value(0)).current;
  const controlsTimeout = useRef<NodeJS.Timeout>();

  const videoUrl = video?.videoUrl || video?.url || "";

  
  useEffect(() => {
    if (showControls) {
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [showControls]);

  
  useEffect(() => {
    if (visible && video && onViewsUpdate) {
      onViewsUpdate(video._id || video.id || "");
    }
  }, [visible, video, onViewsUpdate]);

  
  const lastTap = useRef(0);
  const handleVideoTap = (event: GestureResponderEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
      
      if (!isLikedLocal && onLike && video) {
        setIsLikedLocal(true);
        setLikeCountLocal((prev) => prev + 1);
        onLike(video);

        
        Animated.sequence([
          Animated.timing(likeAnimValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(likeAnimValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        setShowLike(true);
        setTimeout(() => setShowLike(false), 1500);
      }
      lastTap.current = 0;
    } else {
      
      setShowControls(!showControls);
      lastTap.current = now;
    }
  };

  
  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  
  const handleVideoStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };

  
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  
  const showActionMenu = () => {
    if (!video) return;

    const options = ["Cancel", "Delete", "Edit", "Share"];
    const destructiveButtonIndex = 1;

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex: 0,
        title: "Video Options",
      },
      (buttonIndex) => {
        if (buttonIndex === 1 && onDelete) {
          Alert.alert("Delete Video", "Are you sure?", [
            { text: "Cancel" },
            {
              text: "Delete",
              onPress: () => {
                onDelete(video._id || video.id || "");
                onClose();
              },
              style: "destructive",
            },
          ]);
        } else if (buttonIndex === 2 && onEdit) {
          onEdit(video);
        } else if (buttonIndex === 3 && onShare) {
          onShare(video);
        }
      }
    );
  };

  
  const scaleAnim = likeAnimValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.2, 1],
  });

  const opacityAnim = likeAnimValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {}
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, justifyContent: "center" }}
          onPress={handleVideoTap}
        >
          {videoUrl ? (
            <Video
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={{ width, height }}
              resizeMode="contain"
              shouldPlay={true}
              isLooping={false}
              onPlaybackStatusUpdate={handleVideoStatus}
              progressUpdateIntervalMillis={200}
            />
          ) : (
            <View
              style={{
                width,
                height,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
              <Text style={{ color: "#999", marginTop: 16 }}>
                No video available
              </Text>
            </View>
          )}

          {}
          {showLike && (
            <Animated.View
              style={{
                position: "absolute",
                alignSelf: "center",
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              }}
            >
              <Ionicons name="heart" size={80} color="#ff6b6b" />
            </Animated.View>
          )}
        </TouchableOpacity>

        {}
        {showControls && videoUrl && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 40,
              pointerEvents: "none",
            }}
          >
            {}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              {}
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: "auto",
                }}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>

              {}
              <TouchableOpacity
                onPress={showActionMenu}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: "auto",
                }}
              >
                <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {}
            <View style={{ gap: 16, pointerEvents: "auto" }}>
              {}
              <View>
                <View
                  style={{
                    height: 3,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    borderRadius: 1.5,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: 3,
                      backgroundColor: "#EC9A15",
                      width: duration > 0 ? (currentTime / duration) * 100 + "%" : 0,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 4,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 10 }}>
                    {formatTime(currentTime)}
                  </Text>
                  <Text style={{ color: "#999", fontSize: 10 }}>
                    {formatTime(duration)}
                  </Text>
                </View>
              </View>

              {}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                {}
                <TouchableOpacity
                  onPress={handlePlayPause}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "rgba(236,154,21,0.9)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={28}
                    color="#000"
                  />
                </TouchableOpacity>

                {}
                <TouchableOpacity
                  onPress={() => {
                    if (onLike && video) {
                      setIsLikedLocal(!isLikedLocal);
                      setLikeCountLocal((prev) =>
                        isLikedLocal ? prev - 1 : prev + 1
                      );
                      onLike(video);
                    }
                  }}
                  style={{ alignItems: "center", gap: 4 }}
                >
                  <Ionicons
                    name={isLikedLocal ? "heart" : "heart-outline"}
                    size={32}
                    color={isLikedLocal ? "#ff6b6b" : "#fff"}
                  />
                  <Text style={{ color: "#fff", fontSize: 10 }}>
                    {likeCountLocal}
                  </Text>
                </TouchableOpacity>

                {}
                <TouchableOpacity
                  onPress={() => {
                    if (onShare && video) {
                      onShare(video);
                    }
                  }}
                  style={{ alignItems: "center", gap: 4 }}
                >
                  <Ionicons name="share-social" size={32} color="#fff" />
                  <Text style={{ color: "#fff", fontSize: 10 }}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default React.memo(InstagramStyleVideoPlayer);
