import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
  FlatList,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import type { SoundEffect } from "../../types/voiceOverlay.types";

interface SoundFXButtonProps {
  onPress?: () => void;
  onSoundSelect?: (sound: SoundEffect) => void;
}

const SOUND_EFFECTS: SoundEffect[] = [
  {
    id: "sfx-1",
    name: "Pop",
    uri: "file:///sound_effects/pop.mp3",
    duration: 0.5,
    category: "impact",
  },
  {
    id: "sfx-2",
    name: "Whoosh",
    uri: "file:///sound_effects/whoosh.mp3",
    duration: 0.8,
    category: "transition",
  },
  {
    id: "sfx-3",
    name: "Click",
    uri: "file:///sound_effects/click.mp3",
    duration: 0.3,
    category: "impact",
  },
  {
    id: "sfx-4",
    name: "Ding",
    uri: "file:///sound_effects/ding.mp3",
    duration: 0.6,
    category: "impact",
  },
  {
    id: "sfx-5",
    name: "Ambient Wind",
    uri: "file:///sound_effects/wind.mp3",
    duration: 5,
    category: "ambient",
  },
  {
    id: "sfx-6",
    name: "Transition Swoosh",
    uri: "file:///sound_effects/swoosh.mp3",
    duration: 1,
    category: "transition",
  },
];

const SoundFXButton: React.FC<SoundFXButtonProps> = ({ onPress, onSoundSelect }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "impact" | "transition" | "ambient"
  >("all");

  const filteredSounds =
    selectedCategory === "all"
      ? SOUND_EFFECTS
      : SOUND_EFFECTS.filter((s) => s.category === selectedCategory);

  const handleSelectSound = (sound: SoundEffect) => {
    onSoundSelect?.(sound);
    setShowModal(false);
    onPress?.();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
            fill="#ffffff"
          />
        </Svg>
        <Text style={styles.buttonText}>Sound FX</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
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
            <Text style={styles.modalTitle}>Sound Effects</Text>
            <View style={styles.closeButton} />
          </View>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContent}
          >
            {(["all", "impact", "transition", "ambient"] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat && styles.categoryTextActive,
                  ]}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sound List */}
          <FlatList
            data={filteredSounds}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.soundItem} onPress={() => handleSelectSound(item)}>
                <View style={styles.soundIcon}>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                      fill="#ec9a15"
                    />
                  </Svg>
                </View>
                <View style={styles.soundInfo}>
                  <Text style={styles.soundName}>{item.name}</Text>
                  <Text style={styles.soundDuration}>{item.duration.toFixed(1)}s</Text>
                </View>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    fill="rgba(255, 255, 255, 0.3)"
                  />
                </Svg>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    gap: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  categoryScroll: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  categoryContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  categoryButtonActive: {
    backgroundColor: "#ec9a15",
    borderColor: "#ec9a15",
  },
  categoryText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#000000",
  },
  listContent: {
    padding: 12,
  },
  soundItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  soundIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(236, 154, 21, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  soundInfo: {
    flex: 1,
  },
  soundName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  soundDuration: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
  },
});

export default SoundFXButton;
