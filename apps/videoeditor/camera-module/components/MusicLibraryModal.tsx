import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import type { Music, MusicPickerModalProps } from "../types/music.types";

/**
 * Sample music library data
 * In production, this would come from an API
 */
const SAMPLE_MUSIC_LIBRARY: Music[] = [
  {
    id: "music-1",
    title: "Upbeat Energy",
    artist: "Stock Music",
    duration: 120,
    genre: "Electronic",
    mood: "Energetic",
    audioUrl: "https://example.com/music1.mp3",
    isLicensed: true,
    category: "Trending",
  },
  {
    id: "music-2",
    title: "Chill Vibes",
    artist: "Stock Music",
    duration: 180,
    genre: "Lo-Fi",
    mood: "Relaxing",
    audioUrl: "https://example.com/music2.mp3",
    isLicensed: true,
    category: "Trending",
  },
  {
    id: "music-3",
    title: "Summer Breeze",
    artist: "Stock Music",
    duration: 150,
    genre: "Pop",
    mood: "Happy",
    audioUrl: "https://example.com/music3.mp3",
    isLicensed: true,
    category: "Popular",
  },
  {
    id: "music-4",
    title: "Cinematic Drama",
    artist: "Stock Music",
    duration: 200,
    genre: "Orchestral",
    mood: "Dramatic",
    audioUrl: "https://example.com/music4.mp3",
    isLicensed: true,
    category: "Cinematic",
  },
  {
    id: "music-5",
    title: "Dance Floor",
    artist: "Stock Music",
    duration: 160,
    genre: "Dance",
    mood: "Energetic",
    audioUrl: "https://example.com/music5.mp3",
    isLicensed: true,
    category: "Dance",
  },
  {
    id: "music-6",
    title: "Indie Folk",
    artist: "Stock Music",
    duration: 190,
    genre: "Folk",
    mood: "Calm",
    audioUrl: "https://example.com/music6.mp3",
    isLicensed: true,
    category: "Popular",
  },
];

const MusicLibraryModal: React.FC<MusicPickerModalProps> = ({
  visible,
  onSelect,
  onCancel,
  selectedMusic,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(SAMPLE_MUSIC_LIBRARY.map((m) => m.category).filter(Boolean));
    return Array.from(cats);
  }, []);

  // Filter music based on search and category
  const filteredMusic = useMemo(() => {
    return SAMPLE_MUSIC_LIBRARY.filter((music) => {
      const matchesSearch =
        music.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        music.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        music.genre?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || music.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectMusic = useCallback(
    (music: Music) => {
      onSelect(music);
    },
    [onSelect]
  );

  const renderMusicItem = useCallback(
    ({ item }: { item: Music }) => {
      const isSelected = selectedMusic?.id === item.id;

      return (
        <TouchableOpacity
          style={[styles.musicItem, isSelected && styles.musicItemSelected]}
          onPress={() => handleSelectMusic(item)}
          activeOpacity={0.7}
        >
          <View style={styles.musicItemContent}>
            <View style={styles.musicIcon}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm12-3c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zM9 9l12-2"
                  stroke="#a78bfa"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            <View style={styles.musicInfo}>
              <Text style={styles.musicTitle}>{item.title}</Text>
              <Text style={styles.musicArtist}>{item.artist}</Text>
              <View style={styles.musicMeta}>
                <Text style={styles.musicGenre}>{item.genre}</Text>
                <Text style={styles.musicDuration}>
                  {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, "0")}
                </Text>
              </View>
            </View>
          </View>

          {isSelected && (
            <View style={styles.checkmark}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 6L9 17l-5-5"
                  stroke="#a78bfa"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [selectedMusic, handleSelectMusic]
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6l12 12"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Music Library</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
            <Path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke="#a78bfa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Search music..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryChip, selectedCategory === item && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(selectedCategory === item ? null : item)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === item && styles.categoryChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryContainer}
          showsHorizontalScrollIndicator={false}
        />

        {/* Music List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#a78bfa" />
          </View>
        ) : filteredMusic.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm12-3c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zM9 9l12-2"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.emptyText}>No music found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredMusic}
            keyExtractor={(item) => item.id}
            renderItem={renderMusicItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  categoryChipActive: {
    backgroundColor: "#a78bfa",
    borderColor: "#a78bfa",
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
  },
  categoryChipTextActive: {
    color: "#ffffff",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  musicItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  musicItemSelected: {
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderColor: "#a78bfa",
  },
  musicItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  musicIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  musicInfo: {
    flex: 1,
  },
  musicTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  musicArtist: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },
  musicMeta: {
    flexDirection: "row",
    gap: 8,
  },
  musicGenre: {
    fontSize: 11,
    color: "#a78bfa",
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  musicDuration: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
  },
  checkmark: {
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
  },
});

export default MusicLibraryModal;
