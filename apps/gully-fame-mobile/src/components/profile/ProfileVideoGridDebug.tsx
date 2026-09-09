





import React, { useState, useEffect, useDebugValue } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Reel } from "@/api/services/reelsService";
import VideoGridCard from "./VideoGridCard";

const DEBUG = true; 

export interface ProfileVideoGridDebugProps {
  reels: Reel[];
  loading?: boolean;
  error?: string;
  onVideoPress: (reel: Reel, index: number) => void;
  showTitles?: boolean;
  columns?: number;
  userId?: string; 
}

const { width } = Dimensions.get("window");

const ProfileVideoGridDebug: React.FC<ProfileVideoGridDebugProps> = ({
  reels,
  loading = false,
  error,
  onVideoPress,
  showTitles = false,
  columns = 2,
  userId = "unknown",
}) => {
  const [gridData, setGridData] = useState<Reel[]>([]);
  const [debugVisible, setDebugVisible] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const fullMessage = `[${timestamp}] ${message}`;
    if (DEBUG) {
      console.log(fullMessage);
      setDebugLogs((prev) => [...prev.slice(-50), fullMessage]); 
    }
  };

  useEffect(() => {
    addLog(`[ProfileVideoGrid] Component mounted - userId: ${userId}`);
    addLog(`[ProfileVideoGrid] Initial props: loading=${loading}, reels.length=${reels.length}, error=${error}`);
  }, [userId]);

  useEffect(() => {
    addLog(`[ProfileVideoGrid] useEffect triggered - reels changed`);
    addLog(`[ProfileVideoGrid] Received reels count: ${reels.length}`);

    if (reels.length > 0) {
      reels.forEach((reel, idx) => {
        addLog(
          `[ProfileVideoGrid] Reel ${idx}: ID=${reel._id || reel.id}, ` +
            `Title=${reel.title || "N/A"}, ` +
            `Thumbnail=${reel.thumbnail ? "✓" : "✗"}, ` +
            `VideoUrl=${reel.videoUrl ? "✓" : "✗"}`
        );
      });
    } else {
      addLog(`[ProfileVideoGrid] ⚠️ No reels received`);
    }

    setGridData(reels);
  }, [reels]);

  
  const padding = 14;
  const gap = 4;
  const cardSize = (width - padding * 2 - gap * (columns - 1)) / columns;

  const renderVideoCard = ({ item, index }: { item: Reel; index: number }) => {
    const logData = {
      index,
      id: item._id || item.id,
      title: item.title,
      hasThumbnail: !!item.thumbnail,
      hasVideoUrl: !!item.videoUrl,
    };

    addLog(`[FlatList] Rendering item ${index}: ${JSON.stringify(logData)}`);

    return (
      <View
        style={{
          width: cardSize,
          marginRight: index % columns !== columns - 1 ? gap : 0,
          marginBottom: gap,
        }}
      >
        <VideoGridCard
          reel={item}
          size={cardSize}
          onPress={() => {
            addLog(`[VideoGridCard] Tapped: ${item._id || item.id}`);
            onVideoPress(item, index);
          }}
          showDuration={true}
          showTitle={showTitles}
        />
      </View>
    );
  };

  const renderGridContent = () => {
    addLog(
      `[renderGridContent] State: loading=${loading}, error=${!!error}, gridData.length=${gridData.length}`
    );

    
    if (loading) {
      addLog(`[renderGridContent] Showing loading spinner`);
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#EC9A15" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      );
    }

    
    if (error) {
      addLog(`[renderGridContent] Showing error: ${error}`);
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.errorSubtext}>Unable to load videos</Text>
          {DEBUG && (
            <TouchableOpacity
              onPress={() => setDebugVisible(true)}
              style={styles.debugButton}
            >
              <Text style={styles.debugButtonText}>View Debug Logs</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    
    if (gridData.length === 0) {
      addLog(`[renderGridContent] Showing empty state`);
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>🎬</Text>
          <Text style={styles.emptyTitle}>No Videos Yet</Text>
          <Text style={styles.emptySubtext}>
            Upload your first GullyReel to get started!
          </Text>
          {DEBUG && (
            <TouchableOpacity
              onPress={() => setDebugVisible(true)}
              style={styles.debugButton}
            >
              <Text style={styles.debugButtonText}>View Debug Logs</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    
    addLog(`[renderGridContent] Rendering FlatList with ${gridData.length} items`);
    return (
      <>
        <FlatList
          data={gridData}
          renderItem={renderVideoCard}
          keyExtractor={(item, index) => {
            const key = item._id || item.id || `fallback-${index}`;
            addLog(`[keyExtractor] Generated key: ${key}`);
            return key;
          }}
          numColumns={columns}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContent}
          onEndReached={() => addLog(`[FlatList] End reached`)}
          ListHeaderComponent={
            DEBUG ? (
              <TouchableOpacity
                onPress={() => setDebugVisible(true)}
                style={styles.debugButton}
              >
                <Text style={styles.debugButtonText}>Debug Logs ({debugLogs.length})</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>{renderGridContent()}</View>

      {}
      {DEBUG && (
        <Modal
          visible={debugVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDebugVisible(false)}
        >
          <View style={styles.debugModal}>
            <View style={styles.debugHeader}>
              <Text style={styles.debugTitle}>Debug Logs</Text>
              <TouchableOpacity onPress={() => setDebugVisible(false)}>
                <Text style={styles.debugClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.debugContent}>
              <Text style={styles.debugInfo}>
                Reels: {gridData.length} | Loading: {loading ? "Yes" : "No"} |
                Error: {error ? "Yes" : "No"}
              </Text>

              {debugLogs.map((log, idx) => (
                <Text key={idx} style={styles.debugLog}>
                  {log}
                </Text>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setDebugLogs([])}
              style={styles.debugClearButton}
            >
              <Text style={styles.debugClearText}>Clear Logs</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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
  loadingText: {
    color: "#EC9A15",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  emptyIcon: {
    fontSize: 56,
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
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorSubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
  debugButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#EC9A15",
    borderRadius: 6,
  },
  debugButtonText: {
    color: "#1a1410",
    fontSize: 12,
    fontWeight: "600",
  },
  debugModal: {
    flex: 1,
    backgroundColor: "#1a1410",
    paddingTop: 50,
  },
  debugHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EC9A15",
  },
  debugTitle: {
    color: "#EC9A15",
    fontSize: 18,
    fontWeight: "bold",
  },
  debugClose: {
    color: "#EC9A15",
    fontSize: 24,
  },
  debugContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  debugInfo: {
    color: "#EC9A15",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    backgroundColor: "#2d2420",
    padding: 8,
    borderRadius: 4,
  },
  debugLog: {
    color: "#cccccc",
    fontSize: 10,
    fontFamily: "Courier New",
    marginBottom: 4,
    paddingHorizontal: 8,
    lineHeight: 16,
  },
  debugClearButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 10,
    backgroundColor: "#EC9A15",
    borderRadius: 6,
    alignItems: "center",
  },
  debugClearText: {
    color: "#1a1410",
    fontWeight: "600",
  },
});

export default ProfileVideoGridDebug;
