

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";


const initialDownloads = [
  {
    id: "1",
    title: "Insane Gully Rap Battle Finale",
    duration: "02:45",
    size: "14.2 MB",
    author: "@gully_rapper",
    thumbnail: "https://picsum.photos/seed/rap1/120/120",
  },
  {
    id: "2",
    title: "Street Popping & Locking Semi-Finals",
    duration: "01:30",
    size: "8.5 MB",
    author: "@dance_mechanics",
    thumbnail: "https://picsum.photos/seed/dance2/120/120",
  },
  {
    id: "3",
    title: "Fastest Beatboxing Tutorial in Hindi",
    duration: "04:15",
    size: "22.1 MB",
    author: "@beatbox_guru",
    thumbnail: "https://picsum.photos/seed/beat3/120/120",
  },
];

export default function DownloadsScreen() {
  const [downloads, setDownloads] = useState(initialDownloads);

  const handleDeleteDownload = (id: string, title: string) => {
    Alert.alert(
      "Delete Download",
      `Kya aap "${title}" ko offline downloads se hatana chahte hain?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setDownloads(downloads.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C2610" />

      {}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Downloads</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {downloads.length > 0 ? (
          <View style={styles.listContainer}>
            <Text style={styles.storageText}>
              💾 {downloads.length} Videos Offline Saved ({downloads.reduce((acc, item) => acc + parseFloat(item.size), 0).toFixed(1)} MB Used)
            </Text>

            {downloads.map((item) => (
              <View key={item.id} style={styles.downloadCard}>
                {}
                <View style={styles.thumbnailContainer}>
                  <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                </View>

                {}
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.videoAuthor}>{item.author}</Text>
                  <Text style={styles.videoSize}>{item.size}</Text>
                </View>

                {}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={styles.playButton} activeOpacity={0.7}>
                    <Ionicons name="play" size={20} color="#fff" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.deleteButton} 
                    onPress={() => handleDeleteDownload(item.id, item.title)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="delete-outline" size={22} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="download-outline" size={48} color="#EC9A15" />
            </View>
            <Text style={styles.emptyStateTitle}>No Offline Videos</Text>
            <Text style={styles.emptyStateDesc}>
              Aapke paas abhi koi downloaded video nahi hai. Videos dekhte waqt download icon par tap karke unhe bina internet ke yahan dekh sakte hain.
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C2610",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  storageText: {
    color: "#EC9A15",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 16,
    backgroundColor: "rgba(236, 154, 21, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  listContainer: {
    gap: 14,
  },
  downloadCard: {
    flexDirection: "row",
    backgroundColor: "#252525",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.1)",
  },
  thumbnailContainer: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 14,
    backgroundColor: "#1A1A1A",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  durationBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  videoInfo: {
    flex: 1,
    marginRight: 8,
  },
  videoTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 18,
  },
  videoAuthor: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 4,
  },
  videoSize: {
    color: "#666",
    fontSize: 11,
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EC9A15",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(236, 154, 21, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.3)",
  },
  emptyStateTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyStateDesc: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
});