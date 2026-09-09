import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  PanResponder,
} from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import type { Cutout } from "../../types/voiceOverlay.types";

interface CutoutButtonProps {
  onPress?: () => void;
  onCutoutAdd?: (cutout: Cutout) => void;
}

// 🎛️ Reusable Custom Slider utilizing native PanResponder for fluid sliding matrix
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
    console.log(`🎛️ Cutout Slider: pageX=${pageX}, trackX=${trackLayout.x}, touchX=${touchX}, percentage=${percentage.toFixed(2)}, value=${calculatedValue.toFixed(1)}`);
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
        <View style={[styles.customFill, { width: `${percentage}%` }]} />
        <View style={[styles.customThumb, { left: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const CutoutButton: React.FC<CutoutButtonProps> = ({ onPress, onCutoutAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [cutoutType, setCutoutType] = useState<"circle" | "rectangle" | "custom">("circle");
  const [size, setSize] = useState(50);
  const [opacity, setOpacity] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleAddCutout = () => {
    const newCutout: Cutout = {
      id: `cutout-${Date.now()}`,
      type: cutoutType,
      x: 0.5,
      y: 0.5,
      width: size,
      height: size,
      rotation,
      opacity,
    };

    onCutoutAdd?.(newCutout);
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
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75-3.54c-.3-.38-.94-.42-1.3-.09-.36.33-.39.94-.07 1.3l2.72 3.5-2.72 3.5c-.32.36-.29.97.07 1.3.18.17.44.26.68.26.23 0 .45-.09.62-.26l2.75-3.54 2.75 3.54c.17.17.39.26.62.26.24 0 .5-.09.68-.26.36-.33.39-.94.07-1.3L13.96 9.5l2.72-3.5c.32-.36.29-.97-.07-1.3-.36-.33-.99-.29-1.3.09l-2.75 3.54z"
            fill="#ffffff"
          />
        </Svg>
        <Text style={styles.buttonText}>Cutout</Text>
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
            <Text style={styles.modalTitle}>Cutout</Text>
            <View style={styles.closeButton} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Type Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Cutout Type</Text>
              <View style={styles.typeRow}>
                {(["circle", "rectangle", "custom"] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeButton, cutoutType === type && styles.typeButtonActive]}
                    onPress={() => setCutoutType(type)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        cutoutType === type && styles.typeButtonTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.sectionLabel}>Preview</Text>
              <View style={styles.previewBox}>
                <Svg width="100%" height="100%" viewBox="0 0 200 200">
                  {/* Background */}
                  <Rect width="200" height="200" fill="rgba(255, 255, 255, 0.1)" />

                  {/* Cutout */}
                  {cutoutType === "circle" && (
                    <Circle
                      cx="100"
                      cy="100"
                      r={size}
                      fill="rgba(236, 154, 21, 0.3)"
                      stroke="#ec9a15"
                      strokeWidth="2"
                    />
                  )}
                  {cutoutType === "rectangle" && (
                    <Rect
                      x={100 - size}
                      y={100 - size}
                      width={size * 2}
                      height={size * 2}
                      fill="rgba(236, 154, 21, 0.3)"
                      stroke="#ec9a15"
                      strokeWidth="2"
                    />
                  )}
                </Svg>
              </View>
            </View>

            {/* Size Control - Converted */}
            <View style={styles.section}>
              <View style={styles.controlHeader}>
                <Text style={styles.sectionLabel}>Size</Text>
                <Text style={styles.controlValue}>{size.toFixed(0)}%</Text>
              </View>
              <CustomSlider
                minimumValue={10}
                maximumValue={100}
                value={size}
                onValueChange={setSize}
              />
            </View>

            {/* Rotation Control - Converted */}
            <View style={styles.section}>
              <View style={styles.controlHeader}>
                <Text style={styles.sectionLabel}>Rotation</Text>
                <Text style={styles.controlValue}>{rotation.toFixed(0)}°</Text>
              </View>
              <CustomSlider
                minimumValue={0}
                maximumValue={360}
                value={rotation}
                onValueChange={setRotation}
              />
            </View>

            {/* Opacity Control - Converted */}
            <View style={styles.section}>
              <View style={styles.controlHeader}>
                <Text style={styles.sectionLabel}>Opacity</Text>
                <Text style={styles.controlValue}>{(opacity * 100).toFixed(0)}%</Text>
              </View>
              <CustomSlider
                minimumValue={0}
                maximumValue={1}
                value={opacity}
                onValueChange={setOpacity}
              />
            </View>

            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddCutout}>
              <Text style={styles.addButtonText}>Add Cutout</Text>
            </TouchableOpacity>

            {/* Info */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 Cutouts create interesting visual effects by masking parts of your video.
              </Text>
            </View>
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
  typeRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#ec9a15",
    borderColor: "#ec9a15",
  },
  typeButtonText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontWeight: "600",
  },
  typeButtonTextActive: {
    color: "#000000",
  },
  previewSection: {
    marginBottom: 24,
  },
  previewBox: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    height: 200,
    overflow: "hidden",
  },
  controlHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  controlValue: {
    color: "#ec9a15",
    fontSize: 14,
    fontWeight: "700",
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#ec9a15",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  addButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
  },
  infoBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(236, 154, 21, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.3)",
  },
  infoText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    lineHeight: 18,
  },
  /* 🎛️ NEW NATIVE RESPONSIVE SLIDER PACKET */
  sliderContainer: {
    height: 40,
    justifyContent: "center",
    width: "100%",
  },
  customTrack: {
    height: 6,
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
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ec9a15",
    top: -6,
    marginLeft: -9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
});

export default CutoutButton;