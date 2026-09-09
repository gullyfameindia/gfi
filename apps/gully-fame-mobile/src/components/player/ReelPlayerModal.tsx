





import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Reel } from "@/api/services/reelsService";
import { Ionicons } from "@expo/vector-icons";

export interface ReelPlayerModalProps {
  visible: boolean;
  reels: Reel[];
  startIndex?: number;
  onClose: () => void;
  onVideoChange?: (reel: Reel, index: number) => void;
}

const { width, height } = Dimensions.get("window");

const ReelPlayerModal: React.FC<ReelPlayerModalProps> = ({
  visible,
  reels,
  startIndex = 0,
  onClose,
  onVideoChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentReel = reels[currentIndex];

  
  const player = useVideoPlayer(currentReel?.videoUrl || '', (player) => {
    player.loop = false;
  });

  
  useEffect(() => {
    if (player) {
      const subscription = player.subscribe((status) => {
        setDuration(status.durationMillis || 0);
        setPosition(status.positionMillis || 0);
        setIsLoading(!status.isLoaded);

        
        if (status.didJustFinish && currentIndex < reels.length - 1) {
          playNextVideo();
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, [player, currentIndex, reels.length]);

  
  useEffect(() => {
    if (!showControls || !visible) return;

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showControls, visible]);

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
    resetControlsTimeout();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      onVideoChange?.(reels[currentIndex - 1], currentIndex - 1);
      setIsPlaying(true);
      setPosition(0);
    }
    resetControlsTimeout();
  };

  const playNextVideo = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      onVideoChange?.(reels[currentIndex + 1], currentIndex + 1);
      setIsPlaying(true);
      setPosition(0);
    }
  };

  const handleNext = () => {
    playNextVideo();
    resetControlsTimeout();
  };

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    setShowControls(true);
  };

  const handleProgressChange = (newPosition: number) => {
    player.seekTo(newPosition);
    setPosition(newPosition);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
    resetControlsTimeout();
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  if (!currentReel) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden={true} />
      <SafeAreaView style={styles.container}>
        {}
        <TouchableOpacity
          style={styles.videoContainer}
          onPress={toggleControls}
          activeOpacity={1}
        >
          <VideoView
            player={player}
            style={styles.video}
            contentFit="contain"
          />

          {}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#EC9A15" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}

          {}
          {showControls && (
            <View style={styles.controlsOverlay}>
              {}
              <View style={styles.topBar}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={28} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.videoTitle} numberOfLines={1}>
                  {currentReel.title || "GullyReel"}
                </Text>
                <View style={styles.spacer} />
              </View>

              {}
              <View style={styles.centerControls}>
                <TouchableOpacity
                  onPress={handlePrevious}
                  disabled={currentIndex === 0}
                  style={[
                    styles.controlButton,
                    currentIndex === 0 && styles.controlButtonDisabled,
                  ]}
                >
                  <Ionicons
                    name="play-skip-back"
                    size={36}
                    color={currentIndex === 0 ? "#666" : "#EC9A15"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePlayPause}
                  style={styles.controlButton}
                >
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={44}
                    color="#EC9A15"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleNext}
                  disabled={currentIndex === reels.length - 1}
                  style={[
                    styles.controlButton,
                    currentIndex === reels.length - 1 &&
                      styles.controlButtonDisabled,
                  ]}
                >
                  <Ionicons
                    name="play-skip-forward"
                    size={36}
                    color={
                      currentIndex === reels.length - 1 ? "#666" : "#EC9A15"
                    }
                  />
                </TouchableOpacity>
              </View>

              {}
              <View style={styles.bottomBar}>
                {}
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${progressPercentage}%` },
                    ]}
                  />
                </View>

                {}
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatTime(position)}</Text>
                  <Text style={styles.timeText}>
                    {formatTime(duration - position)}
                  </Text>
                </View>

                {}
                <View style={styles.videoCounter}>
                  <Text style={styles.videoCounterText}>
                    {currentIndex + 1} / {reels.length}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  loadingText: {
    color: "#EC9A15",
    marginTop: 12,
    fontSize: 14,
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  closeButton: {
    padding: 8,
  },
  videoTitle: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  spacer: {
    width: 44,
  },
  centerControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  controlButton: {
    padding: 12,
  },
  controlButtonDisabled: {
    opacity: 0.4,
  },
  bottomBar: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 1.5,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: 3,
    backgroundColor: "#EC9A15",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeText: {
    color: "#EC9A15",
    fontSize: 12,
    fontWeight: "600",
  },
  videoCounter: {
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "rgba(236, 154, 21, 0.1)",
  },
  videoCounterText: {
    color: "#EC9A15",
    fontSize: 11,
    fontWeight: "600",
  },
});

export default ReelPlayerModal;
