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
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { BackIcon } from "@/icons";
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
  type Notification,
} from "@/api/services/notificationIntegrationService";

// Get initial dimensions
const getDimensions = () => Dimensions.get("window");

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<"Today" | "Past">("Today");
  const [dimensions, setDimensions] = useState(getDimensions());
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  // Listen for dimension changes (orientation, split screen, etc.)
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Fetch notifications on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications(100, 0, false);
      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        Alert.alert("Error", response.message || "Failed to load notifications");
      }

      // Also fetch unread count
      const countResponse = await getUnreadNotificationCount();
      if (countResponse.success) {
        setUnreadCount(countResponse.data?.count || 0);
      }
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setMarking(notificationId);
      const response = await markNotificationAsRead(notificationId);
      if (response.success) {
        // Remove from list and update unread count
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        
        // Update unread count
        const countResponse = await getUnreadNotificationCount();
        if (countResponse.success) {
          setUnreadCount(countResponse.data?.count || 0);
        }

        // Navigate based on notification type
        navigateFromNotification(
          notifications.find((n) => n.id === notificationId)
        );
      }
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      Alert.alert("Error", "Failed to process notification");
    } finally {
      setMarking(null);
    }
  };

  const navigateFromNotification = (notification: Notification | undefined) => {
    if (!notification) return;

    const { type, data } = notification;

    switch (type) {
      case "comment":
        if (data?.reelId) {
          router.push(`/(main)/reel/${data.reelId}`);
        }
        break;
      case "like":
        if (data?.reelId) {
          router.push(`/(main)/reel/${data.reelId}`);
        }
        break;
      case "follow":
        if (data?.userId) {
          router.push(`/(main)/profile/${data.userId}`);
        }
        break;
      case "competition":
        if (data?.competitionId) {
          router.push(`/(main)/competition/${data.competitionId}`);
        }
        break;
      case "tip":
        if (data?.reelId) {
          router.push(`/(main)/reel/${data.reelId}`);
        }
        break;
      case "system":
        // System notifications don't navigate
        break;
      default:
        break;
    }
  };

  // Animate slide when tab changes
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeTab === "Today" ? 0 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [activeTab]);

  // Filter notifications by date (Today vs Past)
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const currentNotifications = notifications.filter((n) => {
    const notifDate = new Date(n.createdAt);
    const notifStart = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());
    
    if (activeTab === "Today") {
      return notifStart.getTime() === todayStart.getTime();
    } else {
      return notifStart.getTime() < todayStart.getTime();
    }
  });

  // Responsive scaling functions based on current dimensions
  const scale = (size: number) => (dimensions.width / 375) * size;
  const scaleVertical = (size: number) => (dimensions.height / 812) * size;
  const getFontSize = (size: number) => {
    const scaled = scale(size);
    return Math.max(scaled, size * 0.8);
  };

  // Responsive styles based on screen size
  const isSmallScreen = dimensions.width < 375;
  const tabMargin = isSmallScreen ? scale(20) : scale(50);

  // Create responsive styles - Reduced sizes
  const responsiveStyles = {
    headerContainer: {
      ...styles.headerContainer,
      paddingTop: Math.max(insets.top, scale(20)),
      paddingBottom: scaleVertical(20),
      borderBottomLeftRadius: scale(30),
      borderBottomRightRadius: scale(30),
    },
    header: {
      ...styles.header,
      paddingHorizontal: scale(12),
      paddingTop: Platform.OS === "ios" ? scaleVertical(8) : scaleVertical(12),
      paddingBottom: scaleVertical(12),
      gap: scale(12),
    },
    headerButton: {
      ...styles.headerButton,
      width: scale(32),
      height: scale(32),
      minWidth: scale(32),
      minHeight: scale(32),
    },
    headerTitle: {
      ...styles.headerTitle,
      fontSize: getFontSize(22),
    },
    tabsContainer: {
      ...styles.tabsContainer,
      marginHorizontal: tabMargin,
      paddingHorizontal: scale(6),
      gap: scale(8),
      borderRadius: scale(12),
      marginTop: scaleVertical(8),
      marginBottom: scaleVertical(8),
    },
    tab: {
      ...styles.tab,
      paddingVertical: scaleVertical(10),
      paddingHorizontal: scale(6),
      borderRadius: scale(12),
      minHeight: scale(36),
    },
    tabText: {
      ...styles.tabText,
      fontSize: getFontSize(13),
    },
    scrollContent: {
      ...styles.scrollContent,
      paddingHorizontal: scale(12),
      paddingTop: scaleVertical(16),
      paddingBottom: scaleVertical(30),
    },
    sectionHeading: {
      ...styles.sectionHeading,
      fontSize: getFontSize(18),
      marginBottom: scaleVertical(12),
    },
    notificationsList: {
      ...styles.notificationsList,
      gap: scaleVertical(10),
    },
    notificationCard: {
      ...styles.notificationCard,
      borderRadius: scale(12),
      padding: scale(12),
      minHeight: scale(65),
    },
    bellIconContainer: {
      ...styles.bellIconContainer,
      marginRight: scale(10),
      borderRadius: scale(8),
      width: scale(45),
      height: scale(45),
      minWidth: scale(45),
      minHeight: scale(45),
    },
    bellBadge: {
      ...styles.bellBadge,
      top: scale(-5),
      right: scale(-5),
      borderRadius: scale(8),
      minWidth: scale(16),
      height: scale(16),
      paddingHorizontal: scale(3),
    },
    bellBadgeText: {
      ...styles.bellBadgeText,
      fontSize: getFontSize(7),
    },
    notificationContent: {
      ...styles.notificationContent,
      paddingRight: scale(3),
    },
    notificationTitle: {
      ...styles.notificationTitle,
      fontSize: getFontSize(16),
      marginBottom: scaleVertical(1),
    },
    notificationDescription: {
      ...styles.notificationDescription,
      fontSize: getFontSize(12),
      lineHeight: scale(16),
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C2610" />

      {/* Header with curved bottom */}
      <View style={responsiveStyles.headerContainer}>
        <View style={responsiveStyles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={responsiveStyles.headerButton}
          >
            <BackIcon color="#EC9A15" />
          </TouchableOpacity>
          <Text
            style={responsiveStyles.headerTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Notifications
          </Text>
          <View style={responsiveStyles.headerButton} />
        </View>

        {/* Tabs */}
        <View style={responsiveStyles.tabsContainer}>
          {/* Animated sliding background */}
          <Animated.View
            style={[
              styles.slidingIndicator,
              {
                top: 0,
                left: scale(6),
                borderRadius: scale(12),
                height: "100%",
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        0,
                        (dimensions.width -
                          tabMargin * 2 -
                          scale(6) * 2 -
                          scale(8)) /
                          2 +
                          scale(8),
                      ],
                    }),
                  },
                ],
                width:
                  (dimensions.width - tabMargin * 2 - scale(6) * 2 - scale(8)) /
                  2,
              },
            ]}
          />
          <TouchableOpacity
            style={responsiveStyles.tab}
            onPress={() => setActiveTab("Today")}
          >
            <Text
              style={[
                responsiveStyles.tabText,
                activeTab === "Today" && styles.tabTextActive,
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={responsiveStyles.tab}
            onPress={() => setActiveTab("Past")}
          >
            <Text
              style={[
                responsiveStyles.tabText,
                activeTab === "Past" && styles.tabTextActive,
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={responsiveStyles.scrollContent}
      >
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 40 }}>
            <ActivityIndicator size="large" color="#EC9A15" />
          </View>
        ) : currentNotifications.length === 0 ? (
          <View style={{ paddingTop: 40, alignItems: "center" }}>
            <Text style={{ color: "#999", fontSize: 16 }}>
              No {activeTab === "Today" ? "today" : "past"} notifications
            </Text>
          </View>
        ) : (
          <>
            <Text style={responsiveStyles.sectionHeading}>
              {activeTab === "Today" ? "Earlier Today" : "Past Notifications"}
            </Text>
            <View style={responsiveStyles.notificationsList}>
              {currentNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    responsiveStyles.notificationCard,
                    !notification.read && styles.notificationCardHighlighted,
                  ]}
                  activeOpacity={0.7}
                  disabled={marking === notification.id}
                  onPress={() => handleMarkAsRead(notification.id)}
                >
                  <View style={responsiveStyles.bellIconContainer}>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                        stroke="#000"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                    {unreadCount > 0 && (
                      <View style={responsiveStyles.bellBadge}>
                        <Text style={responsiveStyles.bellBadgeText}>
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={responsiveStyles.notificationContent}>
                    <Text
                      style={[
                        responsiveStyles.notificationTitle,
                        notification.read && { opacity: 0.6 },
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {notification.title}
                      {marking === notification.id && " ..."}
                    </Text>
                    <Text
                      style={[
                        responsiveStyles.notificationDescription,
                        notification.read && { opacity: 0.5 },
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {notification.message}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={{ height: scaleVertical(40) }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    backgroundColor: "#3C2610",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    textAlign: "left",
    fontFamily: Platform.select({
      ios: "Rubik_700Bold",
      android: "Rubik_700Bold",
      default: "Rubik_700Bold",
    }),
    flex: 1,
    flexShrink: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(234,176,75,38)",
  },
  tab: {
    flex: 1,
    borderWidth: 0,
    borderColor: "#3C2610",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  slidingIndicator: {
    position: "absolute",
    backgroundColor: "#EC9A15",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 0,
  },
  tabActive: {
    backgroundColor: "transparent",
  },
  tabText: {
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Rubik_500Medium",
      android: "Rubik_500Medium",
      default: "Rubik_500Medium",
    }),
    textAlign: "center",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Rubik_700Bold",
      android: "Rubik_700Bold",
      default: "Rubik_700Bold",
    }),
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    // Responsive values set in component
  },
  sectionHeading: {
    color: "#000000",
    fontFamily: Platform.select({
      ios: "Rubik_700Bold",
      android: "Rubik_700Bold",
      default: "Rubik_700Bold",
    }),
  },
  notificationsList: {
    // Gap set in component
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#EFEFEF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "flex-start",
  },
  notificationCardHighlighted: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  bellIconContainer: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  bellBadge: {
    position: "absolute",
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    zIndex: 1,
  },
  bellBadgeText: {
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "Rubik_700Bold",
      android: "Rubik_700Bold",
      default: "Rubik_700Bold",
    }),
    textAlign: "center",
  },
  notificationContent: {
    flex: 1,
    flexShrink: 1,
  },
  notificationTitle: {
    color: "#000000",
    fontFamily: Platform.select({
      ios: "Rubik_700Bold",
      android: "Rubik_700Bold",
      default: "Rubik_700Bold",
    }),
    flexShrink: 1,
  },
  notificationDescription: {
    color: "#828282",
    fontFamily: Platform.select({
      ios: "Rubik_400Regular",
      android: "Rubik_400Regular",
      default: "Rubik_400Regular",
    }),
    flexShrink: 1,
  },
});
