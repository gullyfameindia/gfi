import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { getPrivacyPolicy } from "@/api/services/cmsService";
import { BackIcon } from "@/icons";

export default function PrivacyScreen() {
  const [policyContent, setPolicyContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        const result = await getPrivacyPolicy();
        if (result.success && result.data) {
          const content =
            result.data.privacyPolicy || result.data.content || "";
          setPolicyContent(content);
        }
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C2610" />

      {}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.policyText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            suscipit nisi in urna varius, vitae porta orci condimentum. Integer
            dictum, neque id gravida aliquet, lorem lacus tempus ex, eu gravida
            tortor erat at odio. Aenean et ullamcorper tortor.
          </Text>
          <Text style={styles.policyText}>
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae; Vivamus a tortor in magna euismod blandit.
            Curabitur consequat, nisl at gravida laoreet, justo turpis tempor
            augue, vel tincidunt ligula lorem eget urna.
          </Text>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Profile Visibility</Text>
            <Text style={styles.settingDescription}>
              Control who can see your profile
            </Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Public</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Competition Visibility</Text>
            <Text style={styles.settingDescription}>
              Show your participation in competitions
            </Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Enabled</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Data Collection</Text>
            <Text style={styles.settingDescription}>
              Allow data collection for app improvement
            </Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Enabled</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Privacy Policy</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EC9A15" />
            </View>
          ) : (
            <Text style={styles.policyText}>
              {policyContent || "No privacy policy available."}
            </Text>
          )}
        </View>
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
    paddingBottom: 30,
  },
  contentCard: {
    backgroundColor: "#252525",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    color: "#EC9A15",
    fontSize: 20,
    marginBottom: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  settingItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingLabel: {
    color: "#fff",
    fontSize: 17,
    marginBottom: 6,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  settingDescription: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  toggleContainer: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(236, 154, 21, 0.25)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.3)",
  },
  toggleText: {
    color: "#EC9A15",
    fontSize: 13,
    fontWeight: "600",
  },
  policyText: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
