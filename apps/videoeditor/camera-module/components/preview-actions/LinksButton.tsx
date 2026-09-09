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
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import type { Link } from "../../types/voiceOverlay.types";

interface LinksButtonProps {
  onPress?: () => void;
  onLinkAdd?: (link: Link) => void;
  links?: Link[];
}

const LinksButton: React.FC<LinksButtonProps> = ({ onPress, onLinkAdd, links = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddLink = () => {
    if (!url.trim() || !text.trim()) {
      Alert.alert("Error", "Please enter both URL and link text");
      return;
    }

    if (!isValidUrl(url)) {
      Alert.alert("Error", "Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    const newLink: Link = {
      id: `link-${Date.now()}`,
      url,
      text,
      startTime: 0,
      endTime: 5,
      position: { x: 0.5, y: 0.5 },
    };

    onLinkAdd?.(newLink);
    setUrl("");
    setText("");
    Alert.alert("Success", "Link added to video");
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
            d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
            fill="#ffffff"
          />
        </Svg>
        <Text style={styles.buttonText}>Links</Text>
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
            <Text style={styles.modalTitle}>Add Links</Text>
            <View style={styles.closeButton} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* URL Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>URL</Text>
              <TextInput
                style={styles.textInput}
                placeholder="https://example.com"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                value={url}
                onChangeText={setUrl}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            {/* Link Text Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Link Text</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Click here"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                value={text}
                onChangeText={setText}
                maxLength={50}
              />
              <Text style={styles.charCount}>{text.length}/50</Text>
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>How it works:</Text>
              <Text style={styles.infoText}>
                • Links appear as clickable buttons on your video{"\n"}• Viewers can tap to open the
                URL{"\n"}• Perfect for CTAs, social media, and more
              </Text>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              style={[styles.addButton, (!url.trim() || !text.trim()) && styles.addButtonDisabled]}
              onPress={handleAddLink}
              disabled={!url.trim() || !text.trim()}
            >
              <Text style={styles.addButtonText}>Add Link</Text>
            </TouchableOpacity>

            {/* Existing Links */}
            {links.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Links ({links.length})</Text>
                <FlatList
                  data={links}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.linkItem}>
                      <View style={styles.linkIcon}>
                        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
                            fill="#ec9a15"
                          />
                        </Svg>
                      </View>
                      <View style={styles.linkInfo}>
                        <Text style={styles.linkText}>{item.text}</Text>
                        <Text style={styles.linkUrl} numberOfLines={1}>
                          {item.url}
                        </Text>
                      </View>
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
    marginBottom: 8,
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
  },
  charCount: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  infoBox: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(236, 154, 21, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.3)",
    marginBottom: 24,
  },
  infoTitle: {
    color: "#ec9a15",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  infoText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    lineHeight: 16,
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
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(236, 154, 21, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  linkInfo: {
    flex: 1,
  },
  linkText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  linkUrl: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
  },
});

export default LinksButton;
