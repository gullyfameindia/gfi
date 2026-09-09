import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import type { Caption } from "../../types/voiceOverlay.types";

interface CaptionsButtonProps {
  onPress?: () => void;
  onCaptionAdd?: (caption: Caption) => void;
  captions?: Caption[];
}

const CaptionsButton: React.FC<CaptionsButtonProps> = ({
  onPress,
  onCaptionAdd,
  captions = [],
}) => {
  const [showModal, setShowModal] = useState(false);
  const [captionText, setCaptionText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<"default" | "bold" | "italic" | "outline">(
    "default"
  );
  const [selectedPosition, setSelectedPosition] = useState<"top" | "center" | "bottom">("bottom");

  const handleAddCaption = () => {
    if (!captionText.trim()) return;

    const newCaption: Caption = {
      id: `caption-${Date.now()}`,
      text: captionText,
      startTime: 0,
      endTime: 5,
      style: selectedStyle,
      position: selectedPosition,
    };

    onCaptionAdd?.(newCaption);
    setCaptionText("");
    setSelectedStyle("default");
    setSelectedPosition("bottom");
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
            d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
            fill="#ffffff"
          />
        </Svg>
        <Text style={styles.buttonText}>Captions</Text>
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
            <Text style={styles.modalTitle}>Add Captions</Text>
            <View style={styles.closeButton} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Caption Text Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Caption Text</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter caption text..."
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                value={captionText}
                onChangeText={setCaptionText}
                multiline
                maxLength={200}
              />
              <Text style={styles.charCount}>{captionText.length}/200</Text>
            </View>

            {/* Style Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Style</Text>
              <View style={styles.optionsRow}>
                {(["default", "bold", "italic", "outline"] as const).map((style) => (
                  <TouchableOpacity
                    key={style}
                    style={[
                      styles.styleButton,
                      selectedStyle === style && styles.styleButtonActive,
                    ]}
                    onPress={() => setSelectedStyle(style)}
                  >
                    <Text
                      style={[
                        styles.styleButtonText,
                        selectedStyle === style && styles.styleButtonTextActive,
                        style === "bold" && { fontWeight: "700" },
                        style === "italic" && { fontStyle: "italic" },
                      ]}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Position Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Position</Text>
              <View style={styles.optionsRow}>
                {(["top", "center", "bottom"] as const).map((pos) => (
                  <TouchableOpacity
                    key={pos}
                    style={[
                      styles.positionButton,
                      selectedPosition === pos && styles.positionButtonActive,
                    ]}
                    onPress={() => setSelectedPosition(pos)}
                  >
                    <Text
                      style={[
                        styles.positionButtonText,
                        selectedPosition === pos && styles.positionButtonTextActive,
                      ]}
                    >
                      {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.sectionLabel}>Preview</Text>
              <View style={styles.previewBox}>
                <View
                  style={[
                    styles.previewContent,
                    selectedPosition === "top" && styles.previewTop,
                    selectedPosition === "center" && styles.previewCenter,
                    selectedPosition === "bottom" && styles.previewBottom,
                  ]}
                >
                  <Text
                    style={[
                      styles.previewText,
                      selectedStyle === "bold" && { fontWeight: "700" },
                      selectedStyle === "italic" && { fontStyle: "italic" },
                      selectedStyle === "outline" && styles.previewOutline,
                    ]}
                  >
                    {captionText || "Caption preview"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              style={[styles.addButton, !captionText.trim() && styles.addButtonDisabled]}
              onPress={handleAddCaption}
              disabled={!captionText.trim()}
            >
              <Text style={styles.addButtonText}>Add Caption</Text>
            </TouchableOpacity>

            {/* Existing Captions */}
            {captions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Existing Captions ({captions.length})</Text>
                <FlatList
                  data={captions}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.captionItem}>
                      <Text style={styles.captionItemText}>{item.text}</Text>
                      <Text style={styles.captionItemMeta}>
                        {item.position} • {item.style}
                      </Text>
                    </View>
                  )}
                />
              </View>
            )}
          </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  charCount: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  optionsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  styleButton: {
    flex: 1,
    minWidth: "45%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
  },
  styleButtonActive: {
    backgroundColor: "#ec9a15",
    borderColor: "#ec9a15",
  },
  styleButtonText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontWeight: "600",
  },
  styleButtonTextActive: {
    color: "#000000",
  },
  positionButton: {
    flex: 1,
    minWidth: "30%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
  },
  positionButtonActive: {
    backgroundColor: "#ec9a15",
    borderColor: "#ec9a15",
  },
  positionButtonText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontWeight: "600",
  },
  positionButtonTextActive: {
    color: "#000000",
  },
  previewSection: {
    marginBottom: 24,
  },
  previewBox: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  previewContent: {
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  previewTop: {
    justifyContent: "flex-start",
    paddingTop: 16,
  },
  previewCenter: {
    justifyContent: "center",
  },
  previewBottom: {
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  previewText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  previewOutline: {
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#ec9a15",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
  },
  captionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  captionItemText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  captionItemMeta: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
  },
});

export default CaptionsButton;
