import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import { MusicTrack, listAudio, getSavedAudio, toggleSaveAudio } from "@api/services/musicLibraryService";
import { SearchIcon, MusicIcon, SaveIcon } from "@/icons";
import { styles } from "./styles";

export type AudioTabType = "for_you" | "trending" | "popular" | "saved";

interface MusicPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectTrack: (track: MusicTrack) => void;
  selectedTrackId?: string;
}

const TABS: { id: AudioTabType; label: string; sort?: "trending" | "newest" | "popular" }[] = [
  { id: "for_you", label: "For you", sort: "trending" },
  { id: "trending", label: "Trending", sort: "trending" },
  { id: "popular", label: "Popular", sort: "popular" },
  { id: "saved", label: "Saved" },
];

export function MusicPickerModal({
  isVisible,
  onClose,
  onSelectTrack,
  selectedTrackId,
}: MusicPickerModalProps) {
  const [activeTab, setActiveTab] = useState<AudioTabType>("for_you");
  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [featuredTrack, setFeaturedTrack] = useState<MusicTrack | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [savedTrackIds, setSavedTrackIds] = useState<Set<string>>(new Set());
  const scrollViewRef = useRef<ScrollView>(null);

  
  useEffect(() => {
    if (!isVisible) return;
    
    console.log(`[MusicPicker] 🎬 Modal opened/tab changed, activeTab=${activeTab}`);
    loadTracks(activeTab, 1);
  }, [activeTab, isVisible]);

  const loadTracks = async (tab: AudioTabType, pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`[MusicPicker] ⏳ Loading ${tab} tab, page ${pageNum}`);
      
      let response;
      if (tab === "saved") {
        console.log(`[MusicPicker] 📡 Calling getSavedAudio(${pageNum}, 20)`);
        response = await getSavedAudio(pageNum, 20);
        
        if (response.success && response.data?.tracks) {
          const ids = new Set<string>(response.data.tracks.map(t => t._id));
          setSavedTrackIds(ids);
        }
      } else {
        const sortMap: Record<string, "trending" | "newest" | "popular"> = {
          for_you: "trending",
          trending: "trending",
          popular: "popular",
          saved: "trending",
        };
        const sort = sortMap[tab];
        console.log(`[MusicPicker] 📡 Calling listAudio(sort=${sort}, page=${pageNum}, limit=20)`);
        response = await listAudio(sort || "trending", pageNum, 20);
      }

      console.log(`[MusicPicker] 📦 Response received:`, {
        success: response.success,
        tracksCount: response.data?.tracks?.length,
        total: response.data?.total,
        message: response.message,
      });

      if (response.success && response.data?.tracks) {
        const newTracks = response.data.tracks;
        console.log(`[MusicPicker] ✅ Got ${newTracks.length} tracks`);
        console.log(`[MusicPicker] 🎵 First track:`, newTracks[0] ? { title: newTracks[0].title, artist: newTracks[0].artist } : "none");
        
        
        if (pageNum === 1 && newTracks.length > 0) {
          setFeaturedTrack(newTracks[0]);
          setTracks(newTracks.slice(1)); 
        } else if (pageNum === 1) {
          setTracks(newTracks);
          setFeaturedTrack(null);
        } else {
          setTracks(prev => [...prev, ...newTracks]);
        }

        
        const total = response.data.total || 0;
        const loaded = pageNum * 20;
        setHasMore(loaded < total);
      } else {
        const errorMsg = response.message || "Failed to load tracks";
        console.warn(`[MusicPicker] ⚠️ ${errorMsg}`);
        setError(errorMsg);
        if (pageNum === 1) {
          setTracks([]);
          setFeaturedTrack(null);
        }
        setHasMore(false);
      }
    } catch (error: any) {
      const errorMsg = error.message || "Unknown error";
      console.error(`[MusicPicker] ❌ Error loading tracks:`, errorMsg);
      setError(errorMsg);
      if (pageNum === 1) {
        setTracks([]);
        setFeaturedTrack(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTracks(activeTab, nextPage);
    }
  };

  const handleTabChange = (tab: AudioTabType) => {
    console.log(`[MusicPicker] 🔄 Tab changed from ${activeTab} to ${tab}`);
    setActiveTab(tab);
    setPage(1);
    setSearchQuery("");
    setError(null);
    setTracks([]);
    setFeaturedTrack(null);
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  const handleToggleSave = async (track: MusicTrack) => {
    try {
      const result = await toggleSaveAudio(track._id);
      if (result.success) {
        const newSavedIds = new Set(savedTrackIds);
        if (result.data?.isSaved) {
          newSavedIds.add(track._id);
        } else {
          newSavedIds.delete(track._id);
        }
        setSavedTrackIds(newSavedIds);
        console.log(`[MusicPicker] Track ${track._id} saved: ${result.data?.isSaved}`);
      }
    } catch (error) {
      console.error("[MusicPicker] Error toggling save:", error);
      Alert.alert("Error", "Failed to save track");
    }
  };

  const handleSelectTrack = (track: MusicTrack) => {
    console.log("[MusicPicker] Selected track:", track.title);
    onSelectTrack(track);
    onClose();
  };

  const renderFeaturedBanner = () => {
    if (!featuredTrack) return null;

    return (
      <TouchableOpacity
        style={styles.featuredBanner}
        onPress={() => handleSelectTrack(featuredTrack)}
      >
        {featuredTrack.coverImage && (
          <Image
            source={{ uri: featuredTrack.coverImage }}
            style={styles.featuredCoverImage}
          />
        )}
        <View style={styles.featuredOverlay}>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {featuredTrack.title}
          </Text>
          <Text style={styles.featuredArtist} numberOfLines={1}>
            {featuredTrack.artist || "Unknown Artist"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTrackItem = ({ item }: { item: MusicTrack }) => {
    const isSaved = savedTrackIds.has(item._id);
    const isSelected = selectedTrackId === item._id;

    return (
      <TouchableOpacity
        style={[styles.trackItem, isSelected && styles.trackItemSelected]}
        onPress={() => handleSelectTrack(item)}
      >
        {}
        <View style={styles.trackThumbnail}>
          {item.coverImage ? (
            <Image
              source={{ uri: item.coverImage }}
              style={styles.trackCoverImage}
            />
          ) : (
            <View style={styles.trackPlaceholder}>
              <MusicIcon size={24} color="#999" />
            </View>
          )}
        </View>

        {}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.trackMeta}>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {item.artist || "Unknown"}
            </Text>
            {item.usageCount !== undefined && (
              <Text style={styles.trackUsage}>
                • {item.usageCount} reels
              </Text>
            )}
          </View>
        </View>

        {}
        <View style={styles.trackActions}>
          <Text style={styles.trackDuration}>
            {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, "0")}
          </Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleToggleSave(item)}
          >
            <SaveIcon size={20} filled={isSaved} color={isSaved ? "#FF006E" : "#999"} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={isVisible} transparent={false} animationType="slide">
      <View style={styles.container}>
        {}
        <View style={styles.header}>
          {}
          <View style={styles.searchBar}>
            <SearchIcon size={18} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>

          {}
          <TouchableOpacity style={styles.importButton} onPress={() => console.log("[MusicPicker] Import pressed")}>
            <MusicIcon size={18} color="#fff" />
          </TouchableOpacity>

          {}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        {}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabContainer}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => handleTabChange(tab.id)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {}
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {loading && page === 1 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF006E" />
              <Text style={{ color: "#999", marginTop: 12 }}>Loading tracks...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Error: {error}</Text>
              <TouchableOpacity
                style={{
                  marginTop: 16,
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  backgroundColor: "#FF006E",
                  borderRadius: 8,
                }}
                onPress={() => loadTracks(activeTab, 1)}
              >
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {}
              {page === 1 && renderFeaturedBanner()}

              {}
              <FlatList
                data={tracks}
                renderItem={renderTrackItem}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No tracks found</Text>
                  </View>
                }
                ListFooterComponent={
                  loading && page > 1 ? (
                    <View style={styles.loadingFooter}>
                      <ActivityIndicator size="small" color="#FF006E" />
                    </View>
                  ) : null
                }
              />
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default MusicPickerModal;
