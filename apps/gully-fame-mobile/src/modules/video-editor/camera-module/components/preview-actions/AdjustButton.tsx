import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  PanResponder,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import type { AdjustSettings } from "../../types/voiceOverlay.types";

interface AdjustButtonProps {
  onPress?: () => void;
  onAdjustChange?: (settings: AdjustSettings) => void;
  currentSettings?: AdjustSettings;
}

// Custom Slider Component utilizing native PanResponder for fluid sliding
interface CustomSliderProps {
  minimumValue: number;
  maximumValue: number;
  value: number;
  onValueChange: (value: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  minimumValue,
  maximumValue,
  value,
  onValueChange,
}) => {
  const [trackLayout, setTrackLayout] = useState({ x: 0, width: 0 });

  const updateValue = (pageX: number) => {
    if (trackLayout.width <= 0) return;

    let touchX = pageX - trackLayout.x;
    let percentage = Math.max(0, Math.min(1, touchX / trackLayout.width));
    let calculatedValue = minimumValue + percentage * (maximumValue - minimumValue);
    console.log(`🎛️ Adjust Slider: pageX=${pageX}, trackX=${trackLayout.x}, touchX=${touchX}, percentage=${percentage.toFixed(2)}, value=${calculatedValue.toFixed(1)}`);
    onValueChange(calculatedValue);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateValue(evt.nativeEvent.pageX);
      },
      onPanResponderMove: (evt) => {
        updateValue(evt.nativeEvent.pageX);
      },
    })
  ).current;

  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View
      {...panResponder.panHandlers}
      style={styles.sliderContainer}
      onLayout={(e) => {
        setTrackLayout({
          x: e.nativeEvent.layout.x,
          width: e.nativeEvent.layout.width,
        });
      }}
    >
      <View style={styles.customTrack}>
        {/* Filled active zone color track */}
        <View style={[styles.customFill, { width: `${percentage}%` }]} />
        {/* Circular Pointer Thumb */}
        <View style={[styles.customThumb, { left: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const DEFAULT_SETTINGS: AdjustSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  temperature: 0,
  tint: 0,
  sharpness: 0,
  blur: 0,
};

const AdjustButton: React.FC<AdjustButtonProps> = ({
  onPress,
  onAdjustChange,
  currentSettings = DEFAULT_SETTINGS,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState<AdjustSettings>(currentSettings);

  const handleSettingChange = (key: keyof AdjustSettings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onAdjustChange?.(newSettings);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    onAdjustChange?.(DEFAULT_SETTINGS);
  };

  const adjustments = [
    { key: "brightness" as const, label: "Brightness", min: -100, max: 100 },
    { key: "contrast" as const, label: "Contrast", min: -100, max: 100 },
    { key: "saturation" as const, label: "Saturation", min: -100, max: 100 },
    { key: "hue" as const, label: "Hue", min: -180, max: 180 },
    { key: "temperature" as const, label: "Temperature", min: -50, max: 50 },
    { key: "tint" as const, label: "Tint", min: -50, max: 50 },
    { key: "sharpness" as const, label: "Sharpness", min: -100, max: 100 },
    { key: "blur" as const, label: "Blur", min: 0, max: 100 },
  ];

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 8c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm0 9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
            fill="#ffffff"
          />
        </Svg>
        <Text style={styles.buttonText}>Adjust</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        {/* 🛠️ FIX 1: Main overlay container transparent kiya */}
        <View style={styles.modalOverlay}>
          
          {/* Transparent area clicking will close layout safely */}
          <TouchableOpacity 
            style={styles.transparentBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowModal(false)} 
          />

          {/* 🛠️ FIX 2: Dynamic Bottom Sheet Panel Wrapper */}
          <View style={styles.bottomSheetContainer}>
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
              <Text style={styles.modalTitle}>Adjust</Text>
              <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Adjustments List */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {adjustments.map((adj) => (
                <View key={adj.key} style={styles.adjustmentRow}>
                  <View style={styles.adjustmentHeader}>
                    <Text style={styles.adjustmentLabel}>{adj.label}</Text>
                    <Text style={styles.adjustmentValue}>{settings[adj.key].toFixed(0)}</Text>
                  </View>
                  <CustomSlider
                    minimumValue={adj.min}
                    maximumValue={adj.max}
                    value={settings[adj.key]}
                    onValueChange={(value) => handleSettingChange(adj.key, value)}
                  />
                </View>
              ))}
              {/* Extra spacing packet at the bottom */}
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
        </View>
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
  /* 🎛️ MODAL TO OVERLAY SHEET CONVERSION STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Translucent view factor
    justifyContent: "flex-end", // Sliders strictly bottom zone push
  },
  transparentBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheetContainer: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "46%", // Occupies only 46% height matrix, keeping top video fully visible
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 68, 68, 0.15)",
    borderRadius: 6,
  },
  resetButtonText: {
    color: "#ff4444",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  adjustmentRow: {
    marginBottom: 16,
  },
  adjustmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  adjustmentLabel: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  adjustmentValue: {
    color: "#ec9a15",
    fontSize: 13,
    fontWeight: "700",
    minWidth: 40,
    textAlign: "right",
  },
  /* 🎛️ CUSTOM SLIDER STYLES PACKET */
  sliderContainer: {
    height: 34,
    justifyContent: "center",
    width: "100%",
  },
  customTrack: {
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    position: "relative",
    width: "100%",
  },
  customFill: {
    height: "100%",
    backgroundColor: "#ec9a15",
    borderRadius: 3,
    position: "absolute",
    left: 0,
    top: 0,
  },
  customThumb: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ec9a15",
    top: -5,
    marginLeft: -8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
});

export default AdjustButton;