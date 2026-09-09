





import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { Reel } from "@/api/services/reelsService";
import VideoGridCard from "./VideoGridCard";

export interface ProfileVideoGridProps {
  reels: Reel[];
  loading?: boolean;
  error?: string;
  onVideoPress: (reel: Reel, index: number) => void;
  showTitles?: boolean;
  columns?: number;
}

const { width } = Dimensions.get("window");

const ProfileVideoGrid: React.FC<ProfileVideoGridProps> = ({
  reels,
  loading = false,
  error,
  onVideoPress,
  showTitles = false,
  columns = 2,
}) => {
  const [gridData, setGridData] = useState<Reel[]>([]);

  useEffect(() => {
    setGridData(reels);
  }, [reels]);

  
  const padding = 14; 
  const gap = 4;
  const cardSize = (width - padding * 2 - gap * (columns - 1)) / columns;

  const renderVideoCard = ({ item, index }: { item: Reel; index: number }) => (
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
        onPress={() => onVideoPress(item, index)}
        showDuration={true}
        showTitle={showTitles}
      />
    </View>
  );

  const renderGridContent = () => {
    
    if (loading) {
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
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.errorSubtext}>Unable to load videos</Text>
        </View>
      );
    }

    
    if (gridData.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>🎬</Text>
          <Text style={styles.emptyTitle}>No Videos Yet</Text>
          <Text style={styles.emptySubtext}>
            Upload your first GullyReel to get started!
          </Text>
        </View>
      );
    }

    
    return (
      <FlatList
        data={gridData}
        renderItem={renderVideoCard}
        keyExtractor={(item) => item._id || item.id || Math.random().toString()}
        numColumns={columns}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContent}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderGridContent()}
    </View>
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
});

export default ProfileVideoGrid;
