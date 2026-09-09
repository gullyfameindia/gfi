





import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Reel } from "@/api/services/reelsService";
import EnhancedVideoGridCard from "./EnhancedVideoGridCard";
import Toast, { ToastType } from "../Toast";
import { SkeletonGrid } from "../SkeletonLoader";
import { Ionicons } from "@expo/vector-icons";


import { useVideoDelete } from "@/hooks/useVideoDelete";
import { useVideoEdit } from "@/hooks/useVideoEdit";
import { useVideoLike } from "@/hooks/useVideoLike";
import { useVideoStats } from "@/hooks/useVideoStats";
import { useVideoPrivacy } from "@/hooks/useVideoPrivacy";
import { useVideoReorder } from "@/hooks/useVideoReorder";
import { useDiagnostics } from "@/hooks/useDiagnostics";

const { width } = Dimensions.get("window");

export interface EnhancedProfileVideoGridProps {
  reels: Reel[];
  loading?: boolean;
  error?: string;
  onVideoPress: (reel: Reel, index: number) => void;
  onRefresh?: () => Promise<void>;
  userId?: string;
  showDebug?: boolean;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

interface EditModalState {
  visible: boolean;
  reel: Reel | null;
  title: string;
  description: string;
}

const EnhancedProfileVideoGrid: React.FC<EnhancedProfileVideoGridProps> = ({
  reels,
  loading = false,
  error,
  onVideoPress,
  onRefresh,
  userId = "",
  showDebug = __DEV__,
}) => {
  
  const [displayReels, setDisplayReels] = useState(reels);
  const [toastState, setToastState] = useState<ToastState>({
    visible: false,
    message: "",
    type: "info",
  });
  const [editModal, setEditModal] = useState<EditModalState>({
    visible: false,
    reel: null,
    title: "",
    description: "",
  });
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);

  
  const deleteHook = useVideoDelete({
    showNotification: (msg, type) => showToast(msg, type),
  });

  const editHook = useVideoEdit({
    showNotification: (msg, type) => showToast(msg, type),
  });

  const likeHook = useVideoLike({
    showNotification: (msg, type) => showToast(msg, type),
    onHeartAnimation: (videoId) => {
      console.log("[Grid] Heart animation for:", videoId);
    },
  });

  const statsHook = useVideoStats({
    cacheTimeout: 5 * 60 * 1000, 
  });

  const privacyHook = useVideoPrivacy({
    showNotification: (msg, type) => showToast(msg, type),
  });

  const reorderHook = useVideoReorder({
    showNotification: (msg, type) => showToast(msg, type),
  });

  const diagnosticsHook = useDiagnostics({
    enabled: showDebug,
    userId,
  });

  
  const showToast = useCallback((message: string, type: ToastType = "info") => {
    console.log(`[Toast] ${type.toUpperCase()}: ${message}`);
    setToastState({
      visible: true,
      message,
      type,
    });
  }, []);

  
  useEffect(() => {
    reels.forEach((reel) => {
      const id = reel._id || reel.id;
      if (id) {
        
        likeHook.setInitialLikes(id, reel.isLiked || false, reel.likes || 0);
        
        privacyHook.setInitialVisibility(
          id,
          (reel.visibility as any) || "public"
        );
        
        statsHook.fetchStats(id);
      }
    });
  }, [reels]);

  
  useEffect(() => {
    setDisplayReels(reels);
  }, [reels]);

  
  const padding = 14;
  const gap = 4;
  const columns = 2;
  const cardSize = (width - padding * 2 - gap * (columns - 1)) / columns;

  
  const handleDeleteVideo = useCallback(
    async (reel: Reel) => {
      const id = reel._id || reel.id;
      if (!id) return;

      Alert.alert(
        "Delete Video",
        "Are you sure you want to delete this video?",
        [
          { text: "Cancel", onPress: () => {} },
          {
            text: "Delete",
            onPress: async () => {
              const success = await deleteHook.deleteVideo(id, () => {
                setDisplayReels((prev) =>
                  prev.filter((r) => (r._id || r.id) !== id)
                );
              });

              if (!success) {
                setDisplayReels(reels); 
              }
            },
            style: "destructive",
          },
        ]
      );
    },
    [deleteHook, reels]
  );

  
  const handleEditVideo = useCallback((reel: Reel) => {
    setEditModal({
      visible: true,
      reel,
      title: reel.title || "",
      description: reel.description || "",
    });
  }, []);

  
  const handleSaveEdit = useCallback(async () => {
    if (!editModal.reel) return;

    const id = editModal.reel._id || editModal.reel.id;
    if (!id) return;

    const success = await editHook.updateVideo(id, {
      title: editModal.title,
      description: editModal.description,
    });

    if (success) {
      setEditModal({ visible: false, reel: null, title: "", description: "" });
      showToast("Video updated successfully", "success");
    }
  }, [editModal, editHook, showToast]);

  
  const handleLikeVideo = useCallback((reel: Reel) => {
    const id = reel._id || reel.id;
    if (!id) return;

    const currentCount = likeHook.getLikeCount(id);
    likeHook.toggleLike(id, currentCount);
  }, [likeHook]);

  
  const handleShareVideo = useCallback((reel: Reel) => {
    showToast("Share feature coming soon", "info");
  }, [showToast]);

  
  const handleStartReorder = useCallback(() => {
    reorderHook.startReorderMode();
    showToast("Long-press videos to reorder", "info");
  }, [reorderHook, showToast]);

  const handleExitReorder = useCallback(() => {
    reorderHook.exitReorderMode();
  }, [reorderHook]);

  const handleSaveReorder = useCallback(async () => {
    const success = await reorderHook.saveReorder();
    if (success) {
      handleExitReorder();
    }
  }, [reorderHook, handleExitReorder]);

  
  const renderVideoCard = ({ item, index }: { item: Reel; index: number }) => {
    const id = item._id || item.id;
    if (!id) return null;

    return (
      <View
        style={{
          width: cardSize,
          marginRight: index % columns !== columns - 1 ? gap : 0,
          marginBottom: gap,
        }}
      >
        <EnhancedVideoGridCard
          reel={item}
          size={cardSize}
          onPress={(reel) => onVideoPress(reel, index)}
          onDelete={handleDeleteVideo}
          onEdit={handleEditVideo}
          onShare={handleShareVideo}
          onLike={handleLikeVideo}
          isLiked={likeHook.isLiked(id)}
          showDuration={true}
          inReorderMode={reorderHook.reorderMode}
          isSelected={false}
        />
      </View>
    );
  };

  
  const renderContent = () => {
    if (loading) {
      return <SkeletonGrid count={6} size={cardSize} columns={columns} />;
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRefresh}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (displayReels.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="film" size={56} color="#EC9A15" />
          <Text style={styles.emptyTitle}>No Videos</Text>
          <Text style={styles.emptySubtext}>
            Upload your first video to get started
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={displayReels}
        renderItem={renderVideoCard}
        keyExtractor={(item) => item._id || item.id || Math.random().toString()}
        numColumns={columns}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContent}
        onEndReachedThreshold={0.5}
      />
    );
  };

  return (
    <>
      <View style={styles.container}>
        {}
        <View style={styles.header}>
          <Text style={styles.title}>My Videos</Text>
          <TouchableOpacity
            onPress={
              reorderHook.reorderMode
                ? handleExitReorder
                : handleStartReorder
            }
            style={[
              styles.reorderButton,
              reorderHook.reorderMode && styles.reorderButtonActive,
            ]}
          >
            <Ionicons
              name={reorderHook.reorderMode ? "close" : "swap-vertical"}
              size={18}
              color={reorderHook.reorderMode ? "#ff6b6b" : "#EC9A15"}
            />
            <Text
              style={[
                styles.reorderButtonText,
                reorderHook.reorderMode && styles.reorderButtonTextActive,
              ]}
            >
              {reorderHook.reorderMode ? "Cancel" : "Reorder"}
            </Text>
          </TouchableOpacity>
        </View>

        {}
        {renderContent()}

        {}
        {reorderHook.reorderMode && (
          <TouchableOpacity
            style={styles.saveReorderButton}
            onPress={handleSaveReorder}
          >
            <Ionicons name="checkmark" size={20} color="#1a1410" />
            <Text style={styles.saveReorderButtonText}>Save Order</Text>
          </TouchableOpacity>
        )}
      </View>

      {}
      <Toast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        duration={3000}
        onDismiss={() =>
          setToastState({ ...toastState, visible: false })
        }
      />

      {}
      <Modal
        visible={editModal.visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() =>
          setEditModal({ visible: false, reel: null, title: "", description: "" })
        }
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Video</Text>
              <TouchableOpacity
                onPress={() =>
                  setEditModal({
                    visible: false,
                    reel: null,
                    title: "",
                    description: "",
                  })
                }
              >
                <Ionicons name="close" size={24} color="#EC9A15" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {}
              <Text style={styles.label}>Title</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>{editModal.title}</Text>
              </View>

              {}
              <Text style={styles.label}>Description</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>{editModal.description}</Text>
              </View>
            </ScrollView>

            {}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  setEditModal({
                    visible: false,
                    reel: null,
                    title: "",
                    description: "",
                  })
                }
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
              >
                {editHook.updating ? (
                  <ActivityIndicator size="small" color="#1a1410" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1410",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2d2420",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  reorderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "rgba(236, 154, 21, 0.1)",
  },
  reorderButtonActive: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
  reorderButtonText: {
    color: "#EC9A15",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  reorderButtonTextActive: {
    color: "#ff6b6b",
  },
  gridContent: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
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
    color: "#1a1410",
    fontSize: 14,
    fontWeight: "600",
  },
  saveReorderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: "#EC9A15",
    borderRadius: 8,
  },
  saveReorderButtonText: {
    color: "#1a1410",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#2d2420",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1410",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  modalBody: {
    padding: 16,
  },
  label: {
    color: "#EC9A15",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1410",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  inputText: {
    color: "#ffffff",
    fontSize: 14,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#1a1410",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#1a1410",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#EC9A15",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#EC9A15",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#1a1410",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default React.memo(EnhancedProfileVideoGrid);
