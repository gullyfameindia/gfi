import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import type { Resolution, FrameRate, ColorMode } from "../types/camera.types";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  resolution: Resolution;
  frameRate: FrameRate;
  colorMode: ColorMode;
  onResolutionChange: (resolution: Resolution) => void;
  onFrameRateChange: (frameRate: FrameRate) => void;
  onColorModeChange: (colorMode: ColorMode) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  resolution,
  frameRate,
  colorMode,
  onResolutionChange,
  onFrameRateChange,
  onColorModeChange,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.closeButton} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Resolution Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resolution</Text>
            <View style={styles.optionsRow}>
              {(["HD", "4K"] as const).map((res) => (
                <TouchableOpacity
                  key={res}
                  style={[styles.optionButton, resolution === res && styles.optionButtonActive]}
                  onPress={() => onResolutionChange(res)}
                >
                  <Text style={[styles.optionText, resolution === res && styles.optionTextActive]}>
                    {res}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Frame Rate Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frame rate (limited to 30)</Text>
            <View style={styles.optionsRow}>
              {([24, 30, 60] as const).map((fps) => (
                <TouchableOpacity
                  key={fps}
                  style={[
                    styles.optionButton,
                    frameRate === fps && styles.optionButtonActive,
                    fps === 60 && styles.optionButtonDisabled,
                  ]}
                  onPress={() => fps !== 60 && onFrameRateChange(fps)}
                  disabled={fps === 60}
                >
                  <Text
                    style={[
                      styles.optionText,
                      frameRate === fps && styles.optionTextActive,
                      fps === 60 && styles.optionTextDisabled,
                    ]}
                  >
                    {fps}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Mode Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color (limited to SDR)</Text>
            <View style={styles.optionsRow}>
              {(["SDR", "HDR"] as const).map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.optionButton,
                    colorMode === color && styles.optionButtonActive,
                    color === "HDR" && styles.optionButtonDisabled,
                  ]}
                  onPress={() => color !== "HDR" && onColorModeChange(color)}
                  disabled={color === "HDR"}
                >
                  <Text
                    style={[
                      styles.optionText,
                      colorMode === color && styles.optionTextActive,
                      color === "HDR" && styles.optionTextDisabled,
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Current Settings</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Resolution:</Text>
              <Text style={styles.infoValue}>{resolution}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Frame Rate:</Text>
              <Text style={styles.infoValue}>{frameRate} fps</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Color Mode:</Text>
              <Text style={styles.infoValue}>{colorMode}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
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
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    opacity: 0.8,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  optionButton: {
    flex: 1,
    minWidth: "30%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
  },
  optionButtonActive: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  optionButtonDisabled: {
    opacity: 0.4,
  },
  optionText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontWeight: "600",
  },
  optionTextActive: {
    color: "#000000",
  },
  optionTextDisabled: {
    color: "rgba(255, 255, 255, 0.4)",
  },
  infoSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  infoTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  infoLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
  },
  infoValue: {
    color: "#ec9a15",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default SettingsModal;
