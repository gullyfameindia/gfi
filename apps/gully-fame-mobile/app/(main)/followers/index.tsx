// Created by Kiro - Followers/Following Screen
// Displays followers and following lists with follow/unfollow functionality
// Real-time updates when users follow/unfollow

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  SafeAreaView,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { followService, User } from "../../../src/api/services/followService";
import { followUpdateEmitter } from "../../../src/utils/followEmitter";

interface FollowersScreenProps {
  route?: any;
  navigation?: any;
}

// ✅ CREATED BY KIRO - Followers Screen Component
const FollowersScreen: React.FC<FollowersScreenProps> = ({ route, navigation }) => {
  const userId = route?.params?.userId || "";
  const initialTab = route?.params?.tab || "followers"; // "followers" or "following"

  const [activeTab, setActiveTab] = useState<"followers" | "following">(initialTab);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [followingStates, setFollowingStates] = useState<{ [key: string]: boolean }>({});

  // ✅ CREATED BY KIRO - Load followers and following on mount and screen focus
  useFocusEffect(
    useCallback(() => {
      loadFollowersAndFollowing();
    }, [userId])
  );

  // ✅ CREATED BY KIRO - Listen for real-time follow updates
  useEffect(() => {
    const unsubscribe = followUpdateEmitter.on((event) => {
      console.log(`[FollowersScreen] Real-time update: ${event.type} - ${event.userId}`);
      
      // Refresh data when follow/unfollow happens
      loadFollowersAndFollowing();
    });

    return () => unsubscribe();
  }, [userId]);

  // ✅ CREATED BY KIRO - Load followers and following lists
  const loadFollowersAndFollowing = async () => {
    try {
      setLoading(true);

      // Don't proceed if userId is empty
      if (!userId) {
        console.warn("[FollowersScreen] userId is empty, skipping API call");
        setLoading(false);
        return;
      }

      // Load followers
      const followersResponse = await followService.getFollowers(userId, {
        page: 1,
        limit: 100, // Increased limit for better pagination
      });

      if (followersResponse.success && followersResponse.data) {
        setFollowers(followersResponse.data.items);
        console.log(`[FollowersScreen] Followers loaded: ${followersResponse.data.items.length}`);
      }

      // Load following
      const followingResponse = await followService.getFollowing(userId, {
        page: 1,
        limit: 100,
      });

      if (followingResponse.success && followingResponse.data) {
        setFollowing(followingResponse.data.items);

        // Initialize following states from the following list
        const states: { [key: string]: boolean } = {};
        followingResponse.data.items.forEach((user) => {
          if (user && user._id) {
            states[user._id] = true;
          }
        });
        setFollowingStates(states);
        console.log(`[FollowersScreen] Following loaded: ${followingResponse.data.items.length}`);
      }

      console.log("[FollowersScreen] Data loaded successfully");
    } catch (error) {
      console.error("[FollowersScreen] Error loading data:", error);
      Alert.alert("Error", "Failed to load followers and following");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CREATED BY KIRO - Handle follow user
  const handleFollowUser = async (targetUserId: string) => {
    try {
      const response = await followService.followUser(targetUserId);

      if (response.success) {
        setFollowingStates((prev) => ({
          ...prev,
          [targetUserId]: true,
        }));
        
        // Emit real-time update
        followUpdateEmitter.emit({ type: "follow", userId: targetUserId });
        console.log("[FollowersScreen] User followed successfully");
      } else {
        Alert.alert("Error", response.message || "Failed to follow user");
      }
    } catch (error) {
      console.error("[FollowersScreen] Follow error:", error);
      Alert.alert("Error", "Failed to follow user");
    }
  };

  // ✅ CREATED BY KIRO - Handle unfollow user
  const handleUnfollowUser = async (targetUserId: string) => {
    try {
      const response = await followService.unfollowUser(targetUserId);

      if (response.success) {
        setFollowingStates((prev) => ({
          ...prev,
          [targetUserId]: false,
        }));
        
        // Emit real-time update
        followUpdateEmitter.emit({ type: "unfollow", userId: targetUserId });
        console.log("[FollowersScreen] User unfollowed successfully");
      } else {
        Alert.alert("Error", response.message || "Failed to unfollow user");
      }
    } catch (error) {
      console.error("[FollowersScreen] Unfollow error:", error);
      Alert.alert("Error", "Failed to unfollow user");
    }
  };

  // ✅ CREATED BY KIRO - Handle refresh
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadFollowersAndFollowing();
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ CREATED BY KIRO - Render user item
  const renderUserItem = (user: User) => {
    // Safety check for user and _id
    if (!user || !user._id) {
      return null;
    }

    // Get the real-time following state from followingStates
    const isFollowing = followingStates[user._id] || false;
    console.log(`[FollowersScreen] renderUserItem: ${user.name} - Following: ${isFollowing}`);

    return (
      <View key={user._id} style={styles.userItem}>
        {user.avatar && <Image source={{ uri: user.avatar }} style={styles.userAvatar} />}

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          {user.username && <Text style={styles.userUsername}>@{user.username}</Text>}
          {user.bio && (
            <Text style={styles.userBio} numberOfLines={1}>
              {user.bio}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.actionButton, isFollowing && styles.actionButtonUnfollow]}
          onPress={() => {
            console.log(`[FollowersScreen] Button clicked for ${user.name}. Current state: ${isFollowing}`);
            if (isFollowing) {
              console.log(`[FollowersScreen] Unfollowing ${user.name}`);
              handleUnfollowUser(user._id);
            } else {
              console.log(`[FollowersScreen] Following ${user.name}`);
              handleFollowUser(user._id);
            }
          }}
        >
          <Text style={[styles.actionButtonText, isFollowing && styles.actionButtonTextUnfollow]}>
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ✅ CREATED BY KIRO - Render empty state
  const renderEmptyState = (message: string) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>👥</Text>
      <Text style={styles.emptyTitle}>{message}</Text>
    </View>
  );

  // ✅ CREATED BY KIRO - Render loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const displayList = activeTab === "followers" ? followers : following;
  const emptyMessage = activeTab === "followers" ? "No followers yet" : "Not following anyone yet";

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button - Top */}
      <View style={[styles.backButtonContainer, Platform.OS === "android" && { paddingTop: 10 }]}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Title - Centered */}
      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}>{activeTab === "followers" ? "Followers" : "Following"}</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "followers" && styles.tabActive]}
          onPress={() => setActiveTab("followers")}
        >
          <Text style={[styles.tabText, activeTab === "followers" && styles.tabTextActive]}>
            Followers ({followers.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "following" && styles.tabActive]}
          onPress={() => setActiveTab("following")}
        >
          <Text style={[styles.tabText, activeTab === "following" && styles.tabTextActive]}>
            Following ({following.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {displayList.length === 0 ? (
        renderEmptyState(emptyMessage)
      ) : (
        <FlatList
          data={displayList}
          renderItem={({ item }) => renderUserItem(item)}
          keyExtractor={(item) => item?._id || Math.random().toString()}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  backButtonContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  titleContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  tabNavigation: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: "#007AFF",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#E0E0E0",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  userUsername: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  userBio: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  actionButtonUnfollow: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  actionButtonTextUnfollow: {
    color: "#007AFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
});

export default FollowersScreen;
