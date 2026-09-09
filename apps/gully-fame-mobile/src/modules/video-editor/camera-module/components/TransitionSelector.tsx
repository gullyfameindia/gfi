import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type {
  Transition,
  TransitionPreset,
  TransitionSelectorModalProps,
} from "../types/transitions.types";
import { TRANSITION_PRESETS } from "../types/transitions.types";

const TransitionSelector: React.FC<TransitionSelectorModalProps> = ({
  visible,
  onSelect,
  onCancel,
  selectedTransition,
}) => {
  const [selectedDuration, setSelectedDuration] = useState(300);

  // Group presets by category
  const groupedPresets = useMemo(() => {
    const groups: Record<string, TransitionPreset[]> = {};
    TRANSITION_PRESETS.forEach((preset) => {
      const category = preset.category || "Other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(preset);
    });
    return groups;
  }, []);

  const categories = useMemo(() => Object.keys(groupedPresets), [groupedPresets]);

  const handleSelectTransition = useCallback(
    (preset: TransitionPreset) => {
      const transition: Transition = {
        id: preset.id,
        type: preset.type,
        duration: selectedDuration,
        direction: preset.direction,
        intensity: preset.intensity,
        easing: "ease-in-out",
      };
      onSelect(transition);
    },
    [selectedDuration, onSelect]
  );

  const renderTransitionItem = useCallback(
    ({ item }: { item: TransitionPreset }) => {
      const isSelected = selectedTransition?.type === item.type;

      return (
        <TouchableOpacity
          style={[styles.transitionItem, isSelected && styles.transitionItemSelected]}
          onPress={() => handleSelectTransition(item)}
          activeOpacity={0.7}
        >
          <View style={styles.transitionPreview}>
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
              {item.type === "fade" && (
                <Path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                  fill="rgba(167, 139, 250, 0.3)"
                  stroke="#a78bfa"
                  strokeWidth="1"
                />
              )}
              {item.type === "slide" && (
                <>
                  <Path d="M2 12h10" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                  <Path
                    d="M12 12h10"
                    stroke="rgba(167, 139, 250, 0.3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </>
              )}
              {item.type === "zoom" && (
                <>
                  <Path
                    d="M12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6z"
                    stroke="#a78bfa"
                    strokeWidth="1.5"
                  />
                  <Path
                    d="M12 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"
                    fill="rgba(167, 139, 250, 0.2)"
                  />
                </>
              )}
              {item.type === "dissolve" && (
                <>
                  <Path
                    d="M4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8z"
                    fill="rgba(167, 139, 250, 0.2)"
                    stroke="#a78bfa"
                    strokeWidth="1"
                  />
                  <Path
                    d="M12 8v8M8 12h8"
                    stroke="#a78bfa"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </>
              )}
              {item.type === "wipe" && (
                <>
                  <Path d="M2 12h20" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="3" />
                  <Path d="M2 12h10" stroke="#a78bfa" strokeWidth="3" />
                </>
              )}
              {item.type === "push" && (
                <>
                  <Path d="M2 12h10" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                  <Path
                    d="M14 12h8"
                    stroke="rgba(167, 139, 250, 0.3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <Path d="M16 10v4" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </Svg>
          </View>

          <Text style={styles.transitionName}>{item.name}</Text>

          {isSelected && (
            <View style={styles.selectedBadge}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
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
    [selectedTransition, handleSelectTransition]
  );

  const renderCategory = useCallback(
    ({ item: category }: { item: string }) => (
      <View key={category} style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <FlatList
          data={groupedPresets[category]}
          keyExtractor={(item) => item.id}
          renderItem={renderTransitionItem}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={false}
        />
      </View>
    ),
    [groupedPresets, renderTransitionItem]
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
          <Text style={styles.headerTitle}>Transitions</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Duration Control */}
        <View style={styles.durationContainer}>
          <Text style={styles.durationLabel}>Duration</Text>
          <View style={styles.durationSlider}>
            {[200, 300, 400, 500, 600].map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationOption,
                  selectedDuration === duration && styles.durationOptionActive,
                ]}
                onPress={() => setSelectedDuration(duration)}
              >
                <Text
                  style={[
                    styles.durationOptionText,
                    selectedDuration === duration && styles.durationOptionTextActive,
                  ]}
                >
                  {duration}ms
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transitions Grid */}
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          renderItem={renderCategory}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  durationContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  durationLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  durationSlider: {
    flexDirection: "row",
    gap: 8,
  },
  durationOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  durationOptionActive: {
    backgroundColor: "#a78bfa",
    borderColor: "#a78bfa",
  },
  durationOptionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
  },
  durationOptionTextActive: {
    color: "#ffffff",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  transitionItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  transitionItemSelected: {
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderColor: "#a78bfa",
  },
  transitionPreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  transitionName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
  },
  selectedBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#a78bfa",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TransitionSelector;
