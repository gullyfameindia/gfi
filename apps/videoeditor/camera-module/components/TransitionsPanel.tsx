import React, { useCallback } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { ClipTransition } from "../types/transitions.types";

interface TransitionsPanelProps {
  transitions: ClipTransition[];
  onDeleteTransition: (transitionId: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

/**
 * Panel for displaying and managing transitions
 */
const TransitionsPanel: React.FC<TransitionsPanelProps> = ({
  transitions,
  onDeleteTransition,
  isExpanded = true,
  onToggleExpand,
}) => {
  const handleDeleteTransition = useCallback(
    (transitionId: string) => {
      onDeleteTransition(transitionId);
    },
    [onDeleteTransition]
  );

  if (transitions.length === 0) {
    return null;
  }

  const getTransitionIcon = (type: string) => {
    switch (type) {
      case "fade":
        return "◐";
      case "slide":
        return "→";
      case "zoom":
        return "⊙";
      case "dissolve":
        return "◎";
      case "wipe":
        return "⊳";
      case "push":
        return "⇒";
      default:
        return "✦";
    }
  };

  const renderTransitionItem = useCallback(
    ({ item }: { item: ClipTransition }) => (
      <View style={styles.transitionItem}>
        <View style={styles.transitionContent}>
          <View style={styles.transitionIcon}>
            <Text style={styles.transitionIconText}>{getTransitionIcon(item.transition.type)}</Text>
          </View>

          <View style={styles.transitionInfo}>
            <Text style={styles.transitionName}>
              {item.transition.type.charAt(0).toUpperCase() + item.transition.type.slice(1)}
            </Text>
            <View style={styles.transitionMeta}>
              <Text style={styles.transitionDuration}>{item.transition.duration}ms</Text>
              <Text style={styles.transitionPosition}>
                {item.position === "start" ? "Start" : "End"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleDeleteTransition(item.id)}
          style={styles.deleteButton}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              fill="#ff6b6b"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    ),
    [handleDeleteTransition]
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={onToggleExpand} activeOpacity={0.7}>
        <View style={styles.headerContent}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 12h6m6 0h6M9 6h6m-6 12h6"
              stroke="#a78bfa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.headerTitle}>Transitions</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{transitions.length}</Text>
          </View>
        </View>

        <Svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          style={[styles.chevron, !isExpanded && styles.chevronRotated]}
        >
          <Path
            d="M19 14l-7-7-7 7"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <FlatList
            data={transitions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransitionItem}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#a78bfa",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
  },
  chevron: {
    marginLeft: 8,
  },
  chevronRotated: {
    transform: [{ rotate: "180deg" }],
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  transitionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  transitionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  transitionIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  transitionIconText: {
    fontSize: 16,
    color: "#a78bfa",
  },
  transitionInfo: {
    flex: 1,
  },
  transitionName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  transitionMeta: {
    flexDirection: "row",
    gap: 8,
  },
  transitionDuration: {
    fontSize: 11,
    color: "#a78bfa",
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  transitionPosition: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
  },
  deleteButton: {
    padding: 6,
  },
});

export default TransitionsPanel;
