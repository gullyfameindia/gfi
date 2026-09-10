// Created by Kiro
// Reel Detail Screen - Display single reel with video player, comments, and interactions
// ✅ UPDATED BY KIRO - Added CommentsScreen navigation integration

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  FlatList,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
// ✅ UPDATED BY KIRO - Import CommentsScreen for navigation
import CommentsScreen from "./CommentsScreen";

interface Reel {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  creatorId: string;
  creatorName: string;
  creatorImage?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  text: string;
  likes: number;
  createdAt: string;
}

export default function ReelDetailScreen({ route, navigation }: any) {
  const reel = route?.params?.reel as Reel;

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reel?.likes || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchReelData();
  }, []);

  // Fetch reel data and comments
  const fetchReelData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock comments data
      setComments([
        {
          id: "1",
          userId: "user1",
          userName: "John Doe",
          userImage: undefined,
          text: "Amazing reel! Love it 🔥",
          likes: 12,
          createdAt: "2 hours ago",
        },
        {
          id: "2",
          userId: "user2",
          userName: "Jane Smith",
          userImage: undefined,
          text: "This is so cool!",
          likes: 8,
          createdAt: "1 hour ago",
        },
        {
          id: "3",
          userId: "user3",
          userName: "Mike Johnson",
          userImage: undefined,
          text: "Great content 👍",
          likes: 5,
          createdAt: "30 minutes ago",
        },
      ]);
    } catch (error) {
      console.error("Error fetching reel data:", error);
      Alert.alert("Error", "Failed to load reel");
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReelData();
    setRefreshing(false);
  };

  // Handle like
  const handleLike = async () => {
    try {
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      // API call would go here
    } catch (error) {
      console.error("Error liking reel:", error);
      Alert.alert("Error", "Failed to like reel");
    }
  };

  // Handle share
  const handleShare = () => {
    Alert.alert("Share", "Share this reel with your friends", [
      { text: "Cancel", style: "cancel" },
      { text: "Share", onPress: () => Alert.alert("Success", "Reel shared!") },
    ]);
  };

  // Handle submit comment
  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    try {
      setSubmittingComment(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newComment: Comment = {
        id: Date.now().toString(),
        userId: "currentUser",
        userName: "You",
        userImage: undefined,
        text: commentText,
        likes: 0,
        createdAt: "just now",
      };

      setComments([newComment, ...comments]);
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      Alert.alert("Error", "Failed to submit comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Render comment item
  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      {item.userImage ? (
        <Image source={{ uri: item.userImage }} style={styles.commentUserImage} />
      ) : (
        <View style={styles.commentUserImagePlaceholder}>
          <Ionicons name="person" size={16} color="#007AFF" />
        </View>
      )}

      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>{item.userName}</Text>
          <Text style={styles.commentTime}>{item.createdAt}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentActionButton}>
            <Ionicons name="heart-outline" size={14} color="#999" />
            <Text style={styles.commentActionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentActionButton}>
            <Text style={styles.commentActionText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading && !reel) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading reel...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!reel) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Reel not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Video Player Section */}
        {reel.thumbnail && (
          <View style={styles.videoContainer}>
            <Image source={{ uri: reel.thumbnail }} style={styles.videoThumbnail} />
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={48} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Reel Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.reelTitle}>{reel.title}</Text>
          <Text style={styles.reelDescription}>{reel.description}</Text>

          {/* Creator Info */}
          <View style={styles.creatorContainer}>
            {reel.creatorImage ? (
              <Image source={{ uri: reel.creatorImage }} style={styles.creatorImage} />
            ) : (
              <View style={styles.creatorImagePlaceholder}>
                <Ionicons name="person" size={20} color="#007AFF" />
              </View>
            )}
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>{reel.creatorName}</Text>
              <Text style={styles.createdAt}>{new Date(reel.createdAt).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Interaction Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={18} color="#d32f2f" />
              <Text style={styles.statText}>{likeCount} likes</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={18} color="#007AFF" />
              <Text style={styles.statText}>{comments.length} comments</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="share-social" size={18} color="#FFB800" />
              <Text style={styles.statText}>{reel.shares} shares</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, liked && styles.actionButtonActive]}
              onPress={handleLike}
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={24}
                color={liked ? "#d32f2f" : "#999"}
              />
              <Text style={styles.actionButtonLabel}>Like</Text>
            </TouchableOpacity>

            {/* ✅ UPDATED BY KIRO - OLD CODE (COMMENTED) - Previous comment button without navigation
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={24} color="#999" />
              <Text style={styles.actionButtonLabel}>Comment</Text>
            </TouchableOpacity>
            */}

            {/* ✅ UPDATED BY KIRO - NEW CODE - Comment button now navigates to CommentsScreen with reelId */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("CommentsScreen", { reelId: reel.id })}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#999" />
              <Text style={styles.actionButtonLabel}>Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={24} color="#999" />
              <Text style={styles.actionButtonLabel}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsSectionTitle}>Comments</Text>

          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
              editable={!submittingComment}
            />
            <TouchableOpacity
              style={styles.submitCommentButton}
              onPress={handleSubmitComment}
              disabled={submittingComment}
            >
              {submittingComment ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Ionicons name="send" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {comments.length > 0 ? (
            <FlatList
              data={comments}
              renderItem={renderCommentItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noCommentsContainer}>
              <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
              <Text style={styles.noCommentsText}>No comments yet</Text>
            </View>
          )}
        </View>

        {/* Footer Spacing */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
  },
  videoContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  reelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  reelDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  creatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  creatorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  creatorImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  createdAt: {
    fontSize: 12,
    color: "#999",
  },
  followButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    gap: 6,
  },
  actionButtonActive: {
    backgroundColor: "#ffe0e0",
  },
  actionButtonLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  commentsSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  commentsSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000",
    maxHeight: 100,
  },
  submitCommentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentUserImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentUserImagePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },
  commentTime: {
    fontSize: 11,
    color: "#999",
  },
  commentText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
    marginBottom: 6,
  },
  commentActions: {
    flexDirection: "row",
    gap: 12,
  },
  commentActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commentActionText: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  noCommentsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noCommentsText: {
    fontSize: 14,
    color: "#999",
    marginTop: 12,
  },
  footerSpacing: {
    height: 20,
  },
});
