import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  Alert,
  Animated,
  Clipboard,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { ChatMessageAPIData, chatService } from "@api/services/chatService";
import { socketChatService } from "@api/services/socketChatService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackIcon, MicIcon, SendIcon } from "@/icons";
import { chatScreenStyles as styles } from "@/styles/chatScreenStyles";
import Message from "@/components/ChatMessage/ChatMessage";
// Get initial dimensions
const getDimensions = () => Dimensions.get("window");
const SCREEN_WIDTH = Dimensions.get("window").width;
const allChatsForForward = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: require("@assets/images/user1.png"),
    isOnline: true,
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: require("@assets/images/user2.png"),
    isOnline: false,
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar: require("@assets/images/user1.png"),
    isOnline: true,
  },
];
// Reaction emojis
const REACTION_EMOJIS = ["❤️", "😂", "😮", "😢", "🙏", "🔥"];
export default function ChatDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const chatUserId = id as string;
  const [dimensions, setDimensions] = useState(getDimensions());
  const [message, setMessage] = useState("");
  const [androidKeyboardSpacer, setAndroidKeyboardSpacer] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showForwardScreen, setShowForwardScreen] = useState(false);
  const [forwardingMessages, setForwardingMessages] = useState<any[]>([]);
  const [selectedForwardChats, setSelectedForwardChats] = useState<number[]>(
    [],
  );
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(
    new Set(),
  );
  const [messageReactions, setMessageReactions] = useState<{
    [key: string]: string[];
  }>({});
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const actionBarPosition = useRef<Animated.ValueXY>(
    new Animated.ValueXY({ x: 0, y: 0 }),
  ).current;
  const actionBarOpacity = useRef(new Animated.Value(0)).current;
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // API State
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessageAPIData[]>([]);
  const [chatUserName, setChatUserName] = useState(name || "User");
  const [chatUserAvatar, setChatUserAvatar] = useState(
    require("@assets/images/user1.png"),
  );
  const [isOnline, setIsOnline] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  useEffect(() => {
    if (Platform.OS === "ios") return;
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setAndroidKeyboardSpacer(e.endCoordinates.height + 10);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setAndroidKeyboardSpacer(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // Fetch current user ID and chat user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        setCurrentUserId(userId);

        // Fetch chat user profile if we have chatUserId
        if (chatUserId && chatUserId !== "new") {
          try {
            // Try to get user profile - if there's a getUserById endpoint, use it
            // For now, we'll use the name from params or fallback
            if (name) {
              setChatUserName(name);
            }
            // TODO: Add getUserById API call if available to get avatar and other details
          } catch (error) {
            console.error("Error fetching chat user profile:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching current user ID:", error);
      }
    };
    fetchUserData();
  }, [chatUserId, name]);

  // Fetch chat details from API
  useEffect(() => {
    const fetchChatDetails = async () => {
      if (!chatUserId || chatUserId === "new") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(
          "[ChatDetailScreen] Fetching chat details for:",
          chatUserId,
        );

        const response = await chatService.getChatDetails(chatUserId, 1, 50);

        if (response.success && response.data) {
          setMessages(response.data.messages);
          console.log("Set messages correctly", response.data.messages);
        } else {
          console.error(
            "[ChatDetailScreen] Failed to fetch chat:",
            response.message,
          );
          // Show error state (no mock fallback)
          Alert.alert(
            "Error Loading Chat",
            response.message || "Failed to load conversation. Please try again.",
            [{ text: "OK", onPress: () => router.back() }]
          );
          setMessages([]);
        }
      } catch (error: any) {
        console.error("[ChatDetailScreen] Error fetching chat:", error);
        Alert.alert(
          "Error",
          "Failed to load chat. Please try again.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchChatDetails();
    }
  }, [chatUserId, currentUserId]);

  // Connect websocket on screen open
  useEffect(() => {
    const connectSocket = async () => {
      if (!chatUserId || chatUserId === "new" || !currentUserId) return;

      try {
        console.log("[ChatDetailScreen] Connecting socket...");
        await socketChatService.connect(chatUserId, {
          onMessageReceived: (newMessage: ChatMessageAPIData) => {
            console.log("[ChatDetailScreen] Real-time message received:", newMessage._id);
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.find((m) => m._id === newMessage._id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
          },
          onMessageDelivered: (messageId: string) => {
            console.log("[ChatDetailScreen] Message delivered:", messageId);
            // Update message status if needed
          },
          onMessageDeleted: (messageId: string) => {
            console.log("[ChatDetailScreen] Message deleted:", messageId);
            setMessages((prev) => prev.filter((m) => m._id !== messageId));
          },
          onConnected: () => {
            console.log("[ChatDetailScreen] Socket connected");
            setSocketConnected(true);
            setSocketError(null);
            // Mark conversation as read when socket connects
            socketChatService.markConversationRead(chatUserId);
          },
          onDisconnected: () => {
            console.log("[ChatDetailScreen] Socket disconnected");
            setSocketConnected(false);
          },
          onError: (error: string) => {
            console.error("[ChatDetailScreen] Socket error:", error);
            setSocketError(error);
          },
        });
      } catch (error: any) {
        console.error("[ChatDetailScreen] Socket connection failed:", error.message);
        setSocketError(error.message);
      }
    };

    connectSocket();

    // Disconnect on unmount
    return () => {
      console.log("[ChatDetailScreen] Disconnecting socket on unmount");
      socketChatService.disconnect();
    };
  }, [chatUserId, currentUserId]);
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !chatUserId || chatUserId === "new" || sending) {
      return;
    }
    try {
      setSending(true);
      const messageText = message.trim();
      setMessage(""); // Clear input immediately for better UX

      console.log("[ChatDetailScreen] Sending message to:", chatUserId);

      // Try socket first if connected
      if (socketChatService.isConnected()) {
        console.log("[ChatDetailScreen] Sending via socket");
        const socketResult = await socketChatService.sendMessage(
          chatUserId,
          chatUserId,
          messageText
        );

        if (socketResult.success) {
          console.log("[ChatDetailScreen] Message sent via socket");
          // Message will appear via socket event listener
          return;
        } else {
          console.warn("[ChatDetailScreen] Socket send failed, falling back to REST");
        }
      }

      // Fallback to REST API
      console.log("[ChatDetailScreen] Sending via REST API");
      const response = await chatService.sendChat(chatUserId, messageText);

      if (response.success) {
        // Add message to local state immediately
        if (!currentUserId) return;
        const newMessage: ChatMessageAPIData = {
          _id: Date.now().toString(), // Temporary ID
          message: messageText,
          receiver_id: chatUserId,
          sender_id: currentUserId,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);
      } else {
        if (!currentUserId) return;
        const newMessage: ChatMessageAPIData = {
          _id: Date.now().toString(), // Temporary ID
          message: messageText,
          receiver_id: chatUserId,
          sender_id: currentUserId,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMessage]);
        console.warn("Couldn't send message to backend, updating UI");
        setMessage(messageText); // Restore message on error
      }
    } catch (error: any) {
      console.error("[ChatDetailScreen] Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
      setMessage(message.trim()); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleMicPress = () => {
    Alert.alert("Voice Recording", "Voice recording feature coming soon!");
  };

  // Handle message long press - show action bar above bubble
  const handleMessageLongPress = useCallback(
    (msg: any, event: any) => {
      if (isMultiSelectMode) return;

      // Clear any existing timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }

      setSelectedMessage(msg);

      // Calculate position for action bar above the bubble
      if (event && event.nativeEvent) {
        const { pageY } = event.nativeEvent;
        actionBarPosition.setValue({ x: SCREEN_WIDTH / 2, y: pageY - 60 });
      }

      // Animate action bar in
      Animated.parallel([
        Animated.timing(actionBarOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [isMultiSelectMode, actionBarPosition, actionBarOpacity],
  );

  // Handle message press (for multi-select)
  const handleMessagePress = useCallback(
    (msgId: string) => {
      if (isMultiSelectMode) {
        setSelectedMessages((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(msgId)) {
            newSet.delete(msgId);
          } else {
            newSet.add(msgId);
          }
          return newSet;
        });
      }
    },
    [isMultiSelectMode],
  );

  // Hide action bar
  const hideActionBar = useCallback(() => {
    Animated.timing(actionBarOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedMessage(null);
    });
  }, [actionBarOpacity]);

  // Copy message
  const handleCopyMessage = useCallback(() => {
    if (selectedMessage) {
      Clipboard.setString(selectedMessage.text);
      hideActionBar();
      // Show toast (simplified - you can use a toast library)
      Alert.alert("Copied", "Message copied to clipboard");
    }
  }, [selectedMessage, hideActionBar]);

  // Forward message(s)
  const handleForwardMessage = useCallback(() => {
    if (isMultiSelectMode && selectedMessages.size > 0) {
      // Forward multiple messages
      const messagesToForward = messages.filter((m: any) =>
        selectedMessages.has(m._id),
      );
      setForwardingMessages(messagesToForward);
    } else if (selectedMessage) {
      // Forward single message
      setForwardingMessages([selectedMessage]);
    }
    hideActionBar();
    setShowForwardScreen(true);
    setIsMultiSelectMode(false);
    setSelectedMessages(new Set());
  }, [
    isMultiSelectMode,
    selectedMessages,
    selectedMessage,
    hideActionBar,
    messages,
  ]);

  // Delete message(s)
  const handleDeleteMessage = useCallback(() => {
    if (isMultiSelectMode && selectedMessages.size > 0) {
      Alert.alert(
        "Delete Messages",
        `Delete ${selectedMessages.size} message(s)?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                // Delete each message via API
                const deletePromises = Array.from(selectedMessages).map((msgId) =>
                  chatService.deleteMessage(msgId)
                );
                await Promise.all(deletePromises);

                setMessages((prev) =>
                  prev.filter((msg) => !selectedMessages.has(msg._id)),
                );

                setIsMultiSelectMode(false);
                setSelectedMessages(new Set());
                hideActionBar();
              } catch (error: any) {
                Alert.alert("Error", "Failed to delete messages");
              }
            },
          },
        ],
      );
    } else if (selectedMessage) {
      Alert.alert("Delete Message", "Delete this message?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete message via API
              await chatService.deleteMessage(selectedMessage._id);
              setMessages((prev) =>
                prev.filter((msg) => msg._id !== selectedMessage._id),
              );
              hideActionBar();
            } catch (error: any) {
              Alert.alert("Error", "Failed to delete message");
            }
          },
        },
      ]);
    }
  }, [isMultiSelectMode, selectedMessages, selectedMessage, hideActionBar]);

  // React to message
  const handleReactToMessage = useCallback(
    (emoji: string) => {
      if (selectedMessage) {
        setMessageReactions((prev) => {
          const msgId = selectedMessage._id;
          const currentReactions = prev[msgId] || [];
          if (currentReactions.includes(emoji)) {
            return {
              ...prev,
              [msgId]: currentReactions.filter((e) => e !== emoji),
            };
          } else {
            return { ...prev, [msgId]: [...currentReactions, emoji] };
          }
        });
        hideActionBar();
      }
    },
    [selectedMessage, hideActionBar],
  );

  // Enter multi-select mode
  const handleSelectMessage = useCallback(() => {
    if (selectedMessage) {
      setIsMultiSelectMode(true);
      setSelectedMessages(new Set([selectedMessage._id]));
      hideActionBar();
    }
  }, [selectedMessage, hideActionBar]);

  // Send forwarded messages
  const handleSendForwardedMessages = useCallback(() => {
    if (selectedForwardChats.length === 0) {
      Alert.alert(
        "Select Chats",
        "Please select at least one chat to forward to",
      );
      return;
    }

    // Forward messages to selected chats
    Alert.alert(
      "Forwarded",
      `Message forwarded to ${selectedForwardChats.length} chat(s)`,
    );
    setShowForwardScreen(false);
    setSelectedForwardChats([]);
    setForwardingMessages([]);
  }, [selectedForwardChats]);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 10) + 10, paddingBottom: 12 },
        ]}
      >
        {isMultiSelectMode ? (
          <>
            <TouchableOpacity
              onPress={() => {
                setIsMultiSelectMode(false);
                setSelectedMessages(new Set());
              }}
            >
              <Text style={styles.headerCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {selectedMessages.size} selected
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleDeleteMessage}
                style={styles.headerActionButton}
              >
                <Text style={styles.headerActionText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleForwardMessage}
                style={styles.headerActionButton}
              >
                <Text style={styles.headerActionText}>Forward</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <BackIcon />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Image source={chatUserAvatar} style={styles.headerAvatar} />
              <View style={styles.headerInfo}>
                <Text style={styles.headerName}>{chatUserName}</Text>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.onlineDot,
                      { backgroundColor: isOnline ? "#4CAF50" : "#72777A" },
                    ]}
                  />
                  <Text style={styles.statusText}>
                    {isOnline ? "Always active" : "Offline"}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowMenu(true)}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="5" r="1.5" fill="#72777A" />
                <Circle cx="12" cy="12" r="1.5" fill="#72777A" />
                <Circle cx="12" cy="19" r="1.5" fill="#72777A" />
              </Svg>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Messages List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EC9A15" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={hideActionBar}
          >
            {messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No messages yet. Start the conversation!
                </Text>
              </View>
            ) : (
              messages.map((msg) => (
                <Message
                  key={msg._id}
                  chatUserAvatar={chatUserAvatar}
                  isHighlighted={
                    selectedMessage?._id === msg._id && !isMultiSelectMode
                  }
                  isMultiSelectMode={isMultiSelectMode}
                  isSelected={
                    isMultiSelectMode && selectedMessages.has(msg._id)
                  }
                  isSent={msg.sender_id === currentUserId}
                  message={msg}
                  onLongPress={handleMessageLongPress}
                  onPress={handleMessagePress}
                  reactions={messageReactions[msg._id] || []}
                ></Message>
              ))
            )}
          </ScrollView>
          {selectedMessage && !isMultiSelectMode && (
            <Animated.View
              style={[
                styles.actionBar,
                {
                  position: "absolute",
                  zIndex: 1000,
                  opacity: actionBarOpacity,
                  transform: [
                    {
                      translateX: actionBarPosition.x.interpolate({
                        inputRange: [0, SCREEN_WIDTH],
                        outputRange: [-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2],
                      }),
                    },
                    { translateY: actionBarPosition.y },
                  ],
                },
              ]}
              pointerEvents="box-none"
            >
              <View style={styles.actionBarContent}>
                {/* Copy */}
                <TouchableOpacity
                  style={styles.actionBarButton}
                  onPress={handleCopyMessage}
                >
                  <Text style={styles.actionBarButtonText}>Copy</Text>
                </TouchableOpacity>
                {/* Forward */}
                <TouchableOpacity
                  style={styles.actionBarButton}
                  onPress={handleForwardMessage}
                >
                  <Text style={styles.actionBarButtonText}>Forward</Text>
                </TouchableOpacity>
                {/* Delete */}
                <TouchableOpacity
                  style={styles.actionBarButton}
                  onPress={handleDeleteMessage}
                >
                  <Text
                    style={[
                      styles.actionBarButtonText,
                      styles.actionBarButtonDanger,
                    ]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
                {/* React */}
                <TouchableOpacity
                  style={styles.actionBarButton}
                  onPress={() => {}}
                >
                  <Text style={styles.actionBarButtonText}>React</Text>
                </TouchableOpacity>
                {/* Select */}
                <TouchableOpacity
                  style={styles.actionBarButton}
                  onPress={handleSelectMessage}
                >
                  <Text style={styles.actionBarButtonText}>Select</Text>
                </TouchableOpacity>
              </View>

              {/* Reaction emoji row */}
              <View style={styles.reactionRow}>
                {REACTION_EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={styles.reactionEmoji}
                    onPress={() => handleReactToMessage(emoji)}
                  >
                    <Text style={styles.reactionEmojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* INVISIBLE DISMISS OVERLAY */}
          {selectedMessage && !isMultiSelectMode && (
            <TouchableOpacity
              style={StyleSheet.absoluteFillObject}
              activeOpacity={1}
              onPress={hideActionBar}
            />
          )}
        </View>
      )}

      {/* Input */}
      <View
        style={[
          styles.inputContainer,
          {
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#72777A"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
            <MicIcon />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message.trim() || sending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!message.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <SendIcon />
          )}
        </TouchableOpacity>
      </View>
      {Platform.OS === "android" && (
        <View style={{ height: androidKeyboardSpacer }}></View>
      )}
      {/* Forward Screen Modal */}
      <Modal
        visible={showForwardScreen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowForwardScreen(false);
          setSelectedForwardChats([]);
        }}
      >
        <View style={styles.forwardScreenContainer}>
          <View
            style={[
              styles.forwardScreenHeader,
              { paddingTop: Math.max(insets.top, 10) + 10 },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                setShowForwardScreen(false);
                setSelectedForwardChats([]);
              }}
            >
              <BackIcon color="#000" />
            </TouchableOpacity>
            <Text style={styles.forwardScreenTitle}>Forward to</Text>
            <View style={{ width: 24 }} />
          </View>

          <FlatList
            data={allChatsForForward}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.forwardChatItem}
                onPress={() => {
                  setSelectedForwardChats((prev) => {
                    const newSet = [...prev];
                    const index = newSet.indexOf(item.id);
                    if (index > -1) {
                      newSet.splice(index, 1);
                    } else {
                      newSet.push(item.id);
                    }
                    return newSet;
                  });
                }}
              >
                <Image source={item.avatar} style={styles.forwardChatAvatar} />
                <Text style={styles.forwardChatName}>{item.name}</Text>
                {selectedForwardChats.includes(item.id) && (
                  <View style={styles.forwardChatCheck}>
                    <Text style={styles.forwardChatCheckText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            style={styles.forwardChatList}
          />

          {selectedForwardChats.length > 0 && (
            <View
              style={[
                styles.forwardBottomBar,
                { paddingBottom: Math.max(insets.bottom, 10) },
              ]}
            >
              <TouchableOpacity
                style={styles.forwardSendButton}
                onPress={handleSendForwardedMessages}
              >
                <Text style={styles.forwardSendButtonText}>
                  Send ({selectedForwardChats.length})
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      {/* Header Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                Alert.alert("Delete Chat", "Are you sure?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => router.back(),
                  },
                ]);
              }}
            >
              <Text style={[styles.menuItemText, styles.menuItemDanger]}>
                Delete Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                Alert.alert("Report", "Report this chat?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Report", style: "destructive", onPress: () => {} },
                ]);
              }}
            >
              <Text style={[styles.menuItemText, styles.menuItemDanger]}>
                Report
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}
