import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  CloseIcon,
  ArrowDownIcon,
  PauseIcon,
  PlayIcon,
  UndoIcon,
  RedoIcon,
  SoundOnIcon,
  SoundOffIcon,
  MusicIcon,
  TextIcon,
  OverlayIcon,
  FilterIcon,
  SoundFXIcon,
  CutoutIcon,
  StickerIcon,
} from "@/icons";
import Svg, { Path } from "react-native-svg";
import { useAudioLibrary } from "@/hooks/useAudioLibrary";
import { MusicLibraryModal } from "@/components/MusicLibraryModal";
import { AudioTrimView } from "@/components/AudioTrimView";
import type { AudioTrimData } from "@/components/AudioTrimView";

const { width, height } = Dimensions.get("window");

export default function EditScreen() {
  const params = useLocalSearchParams();
  const [clips, setClips] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [masterVolume, setMasterVolume] = useState(1);
  const [showAudioMixer, setShowAudioMixer] = useState(false);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [showTrimView, setShowTrimView] = useState(false);
  const [selectedMusicForTrim, setSelectedMusicForTrim] = useState<any>(null);
  const [videoDuration, setVideoDuration] = useState(1);

  // Calculate video duration from clips
  useEffect(() => {
    if (clips.length > 0 && clips[0]?.uri) {
      // Assume clip is at least 1 second (for demo); in real app fetch actual duration
      setVideoDuration(1);
    }
  }, [clips]);

  useEffect(() => {
    if (params.clips) {
      try {
        const parsedClips = JSON.parse(params.clips as string);
        setClips(parsedClips);
      } catch (e) {
        // Try as comma-separated string
        const clipStrings = String(params.clips).split(",");
        setClips(clipStrings.map((uri, index) => ({ id: index, uri })));
      }
    }
  }, [params.clips]);

  const handleExport = () => {
    const competitionId = params.competitionId
      ? String(params.competitionId)
      : null;
    const competitionName = params.competitionName
      ? String(params.competitionName)
      : null;
    const entryFee = params.entryFee ? String(params.entryFee) : null;

    // Include trim data if music was selected
    const musicData = selectedMusicForTrim && selectedMusicForTrim.trimData
      ? {
          trackId: selectedMusicForTrim.id,
          startOffset: selectedMusicForTrim.trimData.startOffset,
          duration: selectedMusicForTrim.trimData.duration,
          title: selectedMusicForTrim.title,
          artist: selectedMusicForTrim.artist,
        }
      : null;

    router.push({
      pathname: "/(main)/upload/post",
      params: {
        clips: JSON.stringify(clips),
        ...(competitionId && { competitionId }),
        ...(competitionName && { competitionName }),
        ...(entryFee && { entryFee }),
        ...(musicData && { musicData: JSON.stringify(musicData) }),
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          pointerEvents={selectedTool ? "none" : "auto"}
          scrollEnabled={!selectedTool}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <CloseIcon size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.projectTitleContainer}>
              <Text style={styles.projectTitle}>New project</Text>
              <ArrowDownIcon size={16} color="#fff" />
            </View>

            <View style={styles.topRightContainer}>
              <Text style={styles.hdText}>HD</Text>
              <TouchableOpacity
                style={styles.exportButton}
                onPress={handleExport}
              >
                <Text style={styles.exportButtonText}>Export</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Video Preview */}
          <View style={styles.previewContainer}>
            <View style={styles.videoPreview}>
              {clips.length > 0 && clips[0]?.uri ? (
                <Image
                  source={{ uri: clips[0].uri }}
                  style={styles.videoImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderVideo}>
                  <Text style={styles.placeholderText}>Video Preview</Text>
                </View>
              )}

              {/* Collapse/Expand Arrow */}
              <TouchableOpacity
                style={styles.collapseButton}
                onPress={() => {}}
              >
                <ArrowDownIcon size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Timeline Section */}
          <View style={styles.timelineSection}>
            <View style={styles.playhead} />
            <View style={styles.timelineControls}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => setIsPlaying(!isPlaying)}
                activeOpacity={0.8}
              >
                {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
              </TouchableOpacity>
              <View style={styles.timeIndicator}>
                <Text style={styles.timeText}>00:00</Text>
                <Text style={styles.timeSeparator}> / </Text>
                <Text style={styles.timeText}>00:01</Text>
                <Text style={styles.durationText}> 1s</Text>
              </View>
              <View style={styles.undoRedoContainer}>
                <TouchableOpacity
                  style={styles.controlButton}
                  activeOpacity={0.8}
                >
                  <UndoIcon size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  activeOpacity={0.8}
                >
                  <RedoIcon size={20} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Clip Timeline */}
            <View style={styles.clipTimelineContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.clipTimeline}
                contentContainerStyle={styles.clipTimelineContent}
              >
                {clips.map((clip) => (
                  <View key={clip.id || clip} style={styles.clipThumbnail}>
                    {clip.uri ? (
                      <Image
                        source={{ uri: clip.uri }}
                        style={styles.thumbnailImage}
                        resizeMode="cover"
                      />
                    ) : typeof clip === "string" ? (
                      <Image
                        source={{ uri: clip }}
                        style={styles.thumbnailImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.thumbnailPlaceholder} />
                    )}
                    <TouchableOpacity
                      style={styles.clipDeleteButton}
                      onPress={() => {
                        Alert.alert(
                          "Delete Clip",
                          "Are you sure you want to delete this clip?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => {
                                const newClips = clips.filter(
                                  (c) => (c.id || c) !== (clip.id || clip),
                                );
                                setClips(newClips);
                              },
                            },
                          ],
                        );
                      }}
                      activeOpacity={0.8}
                    >
                      <CloseIcon size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addClipButton}
                  onPress={() => Alert.alert("Add Clip", "Select video clip")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addClipButtonText}>+</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Editing Tools Bottom Toolbar */}
      <View style={styles.toolbar} pointerEvents="box-none">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolbarContent}
          pointerEvents="auto"
        >
          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "audio" && styles.toolButtonActive,
            ]}
            onPress={() => {
              setShowMusicPicker(true);
              setSelectedTool("audio");
            }}
          >
            <View style={styles.toolIconContainer}>
              <MusicIcon size={20} />
            </View>
            <Text style={styles.toolLabel}>Audio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "text" && styles.toolButtonActive,
            ]}
            onPress={() =>
              setSelectedTool(selectedTool === "text" ? null : "text")
            }
          >
            <View style={styles.toolIconContainer}>
              <TextIcon size={20} />
            </View>
            <Text style={styles.toolLabel}>Text</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "voice" && styles.toolButtonActive,
            ]}
            onPress={() =>
              setSelectedTool(selectedTool === "voice" ? null : "voice")
            }
          >
            <View style={styles.toolIconContainer}>
              <Text style={styles.toolIcon}>🎤</Text>
            </View>
            <Text style={styles.toolLabel}>Voice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "overlay" && styles.toolButtonActive,
            ]}
            onPress={() =>
              setSelectedTool(selectedTool === "overlay" ? null : "overlay")
            }
          >
            <View style={styles.toolIconContainer}>
              <OverlayIcon size={20} />
            </View>
            <Text style={styles.toolLabel}>Overlay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "filter" && styles.toolButtonActive,
            ]}
            onPress={() =>
              setSelectedTool(selectedTool === "filter" ? null : "filter")
            }
          >
            <View style={styles.toolIconContainer}>
              <FilterIcon size={20} />
            </View>
            <Text style={styles.toolLabel}>Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "soundfx" && styles.toolButtonActive,
            ]}
            onPress={() =>
              setSelectedTool(selectedTool === "soundfx" ? null : "soundfx")
            }
          >
            <View style={styles.toolIconContainer}>
              <SoundFXIcon size={20} />
            </View>
            <Text style={styles.toolLabel}>Sound FX</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "cutout" && styles.toolButtonActive,
            ]}
            onPress={() =>
              setSelectedTool(selectedTool === "cutout" ? null : "cutout")
            }
          >
            <View style={styles.toolIconContainer}>
              <CutoutIcon size={20} />
            </View>
            <Text style={styles.toolLabel}>Cutout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "sticker" && styles.toolButtonActive,
            ]}
            onPress={() =>
              setSelectedTool(selectedTool === "sticker" ? null : "sticker")
            }
          >
            <View style={styles.toolIconContainer}>
              <StickerIcon size={20} />
            </View>
            <Text style={styles.toolLabel}>Stickers</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Audio Panel - Shows when Audio tool is selected */}
      {selectedTool === "audio" && !showTrimView && (
        <View style={styles.audioPanelOverlay} pointerEvents="box-none">
          <ScrollView
            style={styles.audioPanelContent}
            contentContainerStyle={styles.audioPanelScroll}
            pointerEvents="auto"
          >
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Audio Track</Text>
              <TouchableOpacity onPress={() => setSelectedTool(null)}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </Svg>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.addTrackButton}
              onPress={() => setShowMusicPicker(true)}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M12 5v14m7-7H5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
              </Svg>
              <Text style={styles.addTrackText}>Add Music</Text>
            </TouchableOpacity>

            {selectedMusicForTrim && (
              <View style={styles.selectedTrackCard}>
                <View style={styles.selectedAlbumArt}>
                  <Text style={styles.selectedAlbumIcon}>🎵</Text>
                </View>
                <View style={styles.selectedTrackInfo}>
                  <Text style={styles.selectedTrackTitle}>{selectedMusicForTrim.title}</Text>
                  <Text style={styles.selectedTrackArtist}>{selectedMusicForTrim.artist}</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Trim View */}
      {showTrimView && selectedMusicForTrim && (
        <AudioTrimView
          music={selectedMusicForTrim}
          videoDuration={videoDuration}
          onConfirm={(trimData: AudioTrimData) => {
            console.log('[EditScreen] Audio trimmed:', trimData);
            // Store trim data for export
            setSelectedMusicForTrim({
              ...selectedMusicForTrim,
              trimData,
            });
            setShowTrimView(false);
          }}
          onCancel={() => setShowTrimView(false)}
        />
      )}

      {/* Music Picker Modal */}
      <MusicLibraryModal
        visible={showMusicPicker}
        onSelect={(music) => {
          console.log('[EditScreen] Music selected:', music);
          setSelectedMusicForTrim(music);
          setShowMusicPicker(false);
          setShowTrimView(true);
        }}
        onCancel={() => setShowMusicPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 12 : 8,
    paddingBottom: 12,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  projectTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginLeft: 12,
  },
  projectTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  topRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  hdText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  exportButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
  },
  exportButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  previewContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 8,
  },
  videoPreview: {
    width: "100%",
    height: height * 0.4,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    position: "relative",
  },
  videoImage: {
    width: "100%",
    height: "100%",
  },
  placeholderVideo: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
  collapseButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  timelineSection: {
    paddingVertical: Platform.OS === "ios" ? 15 : 12,
    position: "relative",
    paddingHorizontal: 0,
  },
  timelineControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    position: "relative",
    zIndex: 2,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EC9A15",
    justifyContent: "center",
    alignItems: "center",
  },
  timeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  timeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  timeSeparator: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
    marginHorizontal: 4,
  },
  durationText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  undoRedoContainer: {
    flexDirection: "row",
    gap: 15,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  clipTimelineContainer: {
    position: "relative",
    marginBottom: 8,
    paddingHorizontal: 20,
    marginTop: 16,
    zIndex: 2,
  },
  clipTimeline: {
    maxHeight: 80,
  },
  clipTimelineContent: {
    paddingHorizontal: 0,
    alignItems: "center",
    gap: 8,
  },
  clipThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
    marginRight: 8,
  },
  clipDeleteButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff0000",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 5,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  playhead: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#fff",
    zIndex: 1,
    marginLeft: -1,
  },
  addClipButton: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
    marginLeft: 8,
  },
  addClipButtonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingBottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    zIndex: 50,
  },
  toolbarContent: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 24,
  },
  toolButton: {
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
    minWidth: 50,
    paddingVertical: 0,
  },
  toolButtonActive: {
    opacity: 1,
  },
  toolIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  toolIcon: {
    fontSize: 20,
  },
  toolLabel: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 2,
  },
  audioPanel: {
    position: "absolute",
    bottom: 140,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 100,
  },
  audioPanelOverlay: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    maxHeight: height * 0.55,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 51,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 15,
  },
  audioPanelContent: {
    flex: 1,
    maxHeight: height * 0.55,
  },
  audioPanelScroll: {
    paddingBottom: 20,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  panelTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  addTrackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#ec9a15",
  },
  addTrackText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedTrackCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.3)",
  },
  selectedAlbumArt: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#ec9a15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedAlbumIcon: {
    fontSize: 24,
  },
  selectedTrackInfo: {
    flex: 1,
  },
  selectedTrackTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  selectedTrackArtist: {
    color: "#999",
    fontSize: 11,
    marginTop: 2,
  },
});
