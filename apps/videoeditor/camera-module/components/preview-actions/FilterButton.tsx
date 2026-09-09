import React, { useState, useEffect } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { listFilters } from "../../../src/api/filterService";
import type { FilterConfig } from "../../../src/types/filterTypes";
import FilterThumbnail from "./FilterThumbnail";

interface Props {
  mediaUri?: string;
  onFilterApply: (filter: FilterConfig) => void;
}

export default function FilterButton({ mediaUri, onFilterApply }: Props) {
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("Original");

  
  useEffect(() => {
    if (visible && filters.length === 0) {
      loadFilters();
    }
  }, [visible]);

  const loadFilters = async () => {
    setLoading(true);
    const fetchedFilters = await listFilters();
    setFilters(fetchedFilters);
    setLoading(false);
  };

  const handleSelect = (filter: FilterConfig) => {
    setSelected(filter.name);
    onFilterApply(filter);
    setVisible(false);
  };

  
  const screenWidth = Dimensions.get('window').width;
  const panelPadding = 40; 
  const itemSpacing = 12; 
  const columnsPerView = 4.5; 
  const rows = 3; 
  
  
  const availableWidth = screenWidth - panelPadding;
  const itemWidth = (availableWidth - (columnsPerView * itemSpacing)) / columnsPerView;
  
  
  const totalColumns = Math.ceil(filters.length / rows);
  const totalWidth = (totalColumns * itemWidth) + ((totalColumns + 1) * itemSpacing);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.button} activeOpacity={0.7}>
        <View style={styles.iconContainer}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <Text style={styles.label}>Filter</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.panel}>
            <Text style={styles.title}>Choose Filter</Text>

            {loading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#ec9a15" />
                <Text style={{ color: "#fff", marginTop: 12 }}>Loading filters...</Text>
              </View>
            ) : filters.length === 0 ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#888" }}>No filters available</Text>
              </View>
            ) : (
              <>
                <View style={styles.scrollContainer}>
                  <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={false}
                    decelerationRate="fast"
                    contentContainerStyle={[
                      styles.filtersContainer,
                      { width: totalWidth }
                    ]}
                  >
                    {Array.from({ length: Math.ceil(filters.length / rows) }).map((_, colIndex) => (
                      <View 
                        key={colIndex} 
                        style={[
                          styles.column,
                          { 
                            width: itemWidth,
                            marginRight: colIndex < Math.ceil(filters.length / rows) - 1 ? itemSpacing : 0,
                          }
                        ]}
                      >
                        {Array.from({ length: rows }).map((_, rowIndex) => {
                          const index = colIndex * rows + rowIndex;
                          const filter = filters[index];
                          return filter ? (
                            <TouchableOpacity
                              key={filter.name}
                              onPress={() => handleSelect(filter)}
                              style={[
                                styles.item,
                                selected === filter.name && styles.active,
                                { marginBottom: rowIndex < rows - 1 ? 12 : 0 },
                              ]}
                            >
                              {mediaUri ? (
                                <FilterThumbnail
                                  source={{ uri: mediaUri }}
                                  filter={filter}
                                  style={[styles.thumb, { width: itemWidth - 8, height: itemWidth - 8 }] as any}
                                  resizeMode="cover"
                                />
                              ) : (
                                <View style={[styles.thumb, styles.placeholderThumb, { width: itemWidth - 8, height: itemWidth - 8 }]} />
                              )}
                              <Text style={styles.name} numberOfLines={1}>{filter.name}</Text>
                            </TouchableOpacity>
                          ) : (
                            <View key={`empty-${rowIndex}`} style={{ marginBottom: rowIndex < rows - 1 ? 12 : 0 }} />
                          );
                        })}
                      </View>
                    ))}
                  </ScrollView>
                </View>

                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Text style={styles.close}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    gap: 6,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  panel: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  scrollContainer: {
    height: 300, 
  },
  filtersContainer: {
    paddingVertical: 8,
    flexDirection: "row",
    paddingLeft: 4,
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
  item: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  active: {
    borderColor: "#ec9a15",
    borderWidth: 3,
    borderRadius: 12,
  },
  thumb: {
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
  },
  placeholderThumb: {
    backgroundColor: "#2a2a2a",
  },
  name: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "500",
    marginTop: 6,
    opacity: 0.7,
    textAlign: "center",
    width: "100%",
    paddingHorizontal: 4,
  },
  close: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
});
