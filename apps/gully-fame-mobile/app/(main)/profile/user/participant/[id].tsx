


import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useRef } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  Alert,
  Platform,
  Linking,
} from "react-native";
import BottomNav from "@components/layout/BottomNav";
import { BackIcon } from "@/icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, G } from "react-native-svg";
import { useOtherUserProfile } from "@/components/profile/shared/profileHooks";
import { StatsSection, UserInfoSection } from "@/components/profile/shared/ProfileComponents";
import { useFollowStats } from "@/hooks/useFollowStats";
import {
  UserIconSVG,
  HomeIconSVG,
  ReelIconSVG,
  SearchIconSVG,
  FacebookIcon,
} from "@/icons";
import { TipPopup } from "@components/tip/TipComponents";

const { width, height } = Dimensions.get("window");


const participantTabs = [
  { name: "Home", icon: HomeIconSVG, label: "" },
  { name: "Reel", icon: ReelIconSVG, label: "GullyReel" },
  { name: "Upload", icon: null, label: "UPLOAD" },
  { name: "Search", icon: SearchIconSVG, label: "" },
  { name: "MyFame", icon: UserIconSVG, label: "" },
];


const videos = [
  { id: 1, image: require("@assets/images/music.png"), width: 1, height: 1 },
  {
    id: 2,
    image: require("@assets/images/trending1.png"),
    width: 1,
    height: 2,
  },
  {
    id: 3,
    image: require("@assets/images/trending2.png"),
    width: 2,
    height: 1,
  },
  {
    id: 4,
    image: require("@assets/images/trending3.png"),
    width: 1,
    height: 1,
  },
  {
    id: 5,
    image: require("@assets/images/trending_reel1.png"),
    width: 1,
    height: 2,
  },
  {
    id: 6,
    image: require("@assets/images/trending_reel2.png"),
    width: 2,
    height: 1,
  },
];

const photos = [
  { id: 1, image: require("@assets/images/art.png"), width: 1, height: 1 },
  {
    id: 2,
    image: require("@assets/images/trending1.png"),
    width: 2,
    height: 1,
  },
  {
    id: 3,
    image: require("@assets/images/trending2.png"),
    width: 1,
    height: 2,
  },
  {
    id: 4,
    image: require("@assets/images/trending3.png"),
    width: 1,
    height: 1,
  },
];


const ShareIcon = ({ color = "#fff", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G>
      <Path
        d="M9.61109 12.4L10.8183 18.5355C11.0462 19.6939 12.6026 19.9244 13.1565 18.8818L19.0211 7.84263C19.248 7.41555 19.2006 6.94354 18.9737 6.58417M9.61109 12.4L5.22642 8.15534C4.41653 7.37131 4.97155 6 6.09877 6H17.9135C18.3758 6 18.7568 6.24061 18.9737 6.58417M9.61109 12.4L18.9737 6.58417M19.0555 6.53333L18.9737 6.58417"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

export default function UserParticipantProfile() {
  const params = useLocalSearchParams();
  const { profileData } = useOtherUserProfile();
  const [activeTab, setActiveTab] = useState("MyFame");
  const [selectedTab, setSelectedTab] = useState("Photos");
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [currentTipUserId, setCurrentTipUserId] = useState<string | null>(null);
  const shareSlideAnim = useRef(new Animated.Value(height)).current;
  const shareScrollViewRef = useRef<ScrollView>(null);
  const [showMoreShareOptions, setShowMoreShareOptions] = useState(false);

  
  const { stats: followStats } = useFollowStats(profileData.id || "");

  const handleBackPress = () => {
    router.back();
  };

  
  const handleFollowersPress = () => {
    const currentUserId = profileData.id || profileData._id || "";
    if (!currentUserId) {
      Alert.alert("Error", "User ID not available");
      return;
    }
    router.push({
      pathname: "/(main)/followers",
      params: { userId: currentUserId, tab: "followers" },
    } as any);
  };

  
  const handleFollowingPress = () => {
    const currentUserId = profileData.id || profileData._id || "";
    if (!currentUserId) {
      Alert.alert("Error", "User ID not available");
      return;
    }
    router.push({
      pathname: "/(main)/followers",
      params: { userId: currentUserId, tab: "following" },
    } as any);
  };

  const handleShare = async (platform: string) => {
    const profileLink = `https://gullyfame.com/profile/${params.userId || params.id}`;
    const profileText = `Check out ${profileData.firstName || "this"} profile on Gully Fame! ${profileLink}`;

    try {
      switch (platform) {
        case "copy":
          try {
            if (Platform.OS === "web") {
              await navigator.clipboard.writeText(profileLink);
              Alert.alert("Copied!", "Link copied to clipboard");
            } else {
              Alert.alert("Copy Link", profileLink, [{ text: "OK" }]);
            }
          } catch {
            Alert.alert("Copy Link", profileLink);
          }
          break;
        case "whatsapp":
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(profileText)}`;
          const canOpen = await Linking.canOpenURL(whatsappUrl);
          if (canOpen) {
            await Linking.openURL(whatsappUrl);
          } else {
            Alert.alert(
              "WhatsApp not installed",
              "Please install WhatsApp to share",
            );
          }
          break;
        case "instagram":
          const instagramUrl = `instagram://share`;
          const canOpenInsta = await Linking.canOpenURL(instagramUrl);
          if (canOpenInsta) {
            await Linking.openURL(instagramUrl);
          } else {
            Alert.alert(
              "Instagram not installed",
              "Please install Instagram to share",
            );
          }
          break;
        case "snapchat":
          const snapchatUrl = `snapchat://`;
          const canOpenSnap = await Linking.canOpenURL(snapchatUrl);
          if (canOpenSnap) {
            await Linking.openURL(snapchatUrl);
          } else {
            Alert.alert(
              "Snapchat not installed",
              "Please install Snapchat to share",
            );
          }
          break;
        case "facebook":
          const facebookUrl = `fb://share?text=${encodeURIComponent(profileText)}`;
          const canOpenFB = await Linking.canOpenURL(facebookUrl);
          if (canOpenFB) {
            await Linking.openURL(facebookUrl);
          } else {
            const fbWebUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileLink)}`;
            await Linking.openURL(fbWebUrl);
          }
          break;
        case "twitter":
          const twitterUrl = `twitter://post?message=${encodeURIComponent(profileText)}`;
          const canOpenTwitter = await Linking.canOpenURL(twitterUrl);
          if (canOpenTwitter) {
            await Linking.openURL(twitterUrl);
          } else {
            const twitterWebUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(profileText)}`;
            await Linking.openURL(twitterWebUrl);
          }
          break;
      }
      
      Animated.timing(shareSlideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShareModalVisible(false);
        setShowMoreShareOptions(false);
      });
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Unable to share. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <BackIcon color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              shareSlideAnim.setValue(height);
              setShareModalVisible(true);
              Animated.spring(shareSlideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
              }).start();
            }}
            style={styles.shareButton}
          >
            <ShareIcon color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.starContainer}>
          <View style={styles.starShape}>
            {profileData.profileImage ? (
              <Image
                source={{ uri: profileData.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={require("@assets/images/user1.png")}
                style={styles.profileImage}
              />
            )}
            <Image
              source={require("@assets/images/Starprofile.png")}
              style={styles.starImage}
            />
          </View>
        </View>

        {}
        <UserInfoSection
          profileData={profileData}
          role="other"
          showEditButton={false}
        />

        {}
        <LinearGradient
          colors={["rgba(41, 33, 24, 0.2)", "#3C2610"]}
          locations={[0.0, 0.4]}
          style={styles.contentContainer}
        >
          {}
          <StatsSection />

          {}
          <View style={styles.levelDisplayContainer}>
            <View style={styles.levelDisplayGradientWrapper}>
              <LinearGradient
                colors={["#EDD6AF", "#F0BA5D", "#EC9A15"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.levelDisplayGradient}
              >
                <Text style={styles.levelDisplayText}>Level: Beginner</Text>
              </LinearGradient>
            </View>
          </View>

          {}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => {
                const userName =
                  profileData.firstName && profileData.lastName
                    ? `${profileData.firstName} ${profileData.lastName}`
                    : profileData.firstName || profileData.lastName || "User";
                router.push({
                  pathname: "/(main)/chat/[id]",
                  params: {
                    id: params.userId || params.id || "new",
                    name: userName,
                  },
                } as any);
              }}
            >
              <Text style={styles.outlineButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tipButton}
              onPress={() => {
                const userId = String(params.userId || params.id || "");
                if (userId && userId !== "me") {
                  setCurrentTipUserId(userId);
                  setTipModalVisible(true);
                }
              }}
            >
              <Text style={styles.tipButtonText}>Support</Text>
            </TouchableOpacity>
          </View>

          {}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "Videos" && styles.tabActive]}
              onPress={() => setSelectedTab("Videos")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "Videos" && styles.activeTabText,
                ]}
              >
                Videos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "Photos" && styles.tabActive]}
              onPress={() => setSelectedTab("Photos")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "Photos" && styles.activeTabText,
                ]}
              >
                Photos
              </Text>
            </TouchableOpacity>
          </View>

          {}
          <View style={styles.gridContainer}>
            {(selectedTab === "Videos" ? videos : photos).map((item, index) => {
              const baseSize = (width - 28 - 4) / 2;
              const itemStyle = {
                width: baseSize,
                height: baseSize,
                marginRight: index % 2 === 0 ? 4 : 0,
                marginBottom: 4,
              };
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.gridItem, itemStyle]}
                >
                  <Image source={item.image} style={styles.gridImage} />
                </TouchableOpacity>
              );
            })}
          </View>
        </LinearGradient>
      </ScrollView>

      {}
      <Modal
        visible={shareModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => {
          Animated.timing(shareSlideAnim, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShareModalVisible(false);
            setShowMoreShareOptions(false);
          });
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            Animated.timing(shareSlideAnim, {
              toValue: height,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setShareModalVisible(false);
              setShowMoreShareOptions(false);
            });
          }}
        >
          <Animated.View
            style={[
              styles.shareModal,
              {
                transform: [{ translateY: shareSlideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.handleBar} />
              <View style={styles.shareHeader}>
                <Text style={styles.shareHeaderTitle}>Share Profile</Text>
                <TouchableOpacity
                  onPress={() => {
                    Animated.timing(shareSlideAnim, {
                      toValue: height,
                      duration: 300,
                      useNativeDriver: true,
                    }).start(() => {
                      setShareModalVisible(false);
                      setShowMoreShareOptions(false);
                    });
                  }}
                >
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.shareOptionsSection}>
                <ScrollView
                  ref={shareScrollViewRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.shareOptionsList}
                >
                  <TouchableOpacity
                    style={styles.shareOption}
                    onPress={() => handleShare("copy")}
                  >
                    <View
                      style={[
                        styles.shareOptionIconCircle,
                        { backgroundColor: "#fff" },
                      ]}
                    >
                      <Image
                        source={require("@assets/ShareIcon/copy.png")}
                        style={styles.shareIconImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.shareOptionName} numberOfLines={1}>
                      Copy Link
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.shareOption}
                    onPress={() => handleShare("whatsapp")}
                  >
                    <View
                      style={[
                        styles.shareOptionIconCircle,
                        { backgroundColor: "#25D36620" },
                      ]}
                    >
                      <Image
                        source={require("@assets/ShareIcon/whatsapp.png")}
                        style={styles.shareIconImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.shareOptionName} numberOfLines={1}>
                      WhatsApp
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.shareOption}
                    onPress={() => handleShare("instagram")}
                  >
                    <View
                      style={[
                        styles.shareOptionIconCircle,
                        { backgroundColor: "#E4405F20" },
                      ]}
                    >
                      <Image
                        source={require("@assets/ShareIcon/instagram.png")}
                        style={styles.shareIconImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.shareOptionName} numberOfLines={1}>
                      Instagram
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.shareOption}
                    onPress={() => handleShare("facebook")}
                  >
                    <View
                      style={[
                        styles.shareOptionIconCircle,
                        { backgroundColor: "#1877F2" },
                      ]}
                    >
                      <FacebookIcon size={24} />
                    </View>
                    <Text style={styles.shareOptionName} numberOfLines={1}>
                      Facebook
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.shareOption}
                    onPress={() => handleShare("twitter")}
                  >
                    <View
                      style={[
                        styles.shareOptionIconCircle,
                        { backgroundColor: "#1DA1F220" },
                      ]}
                    >
                      <Image
                        source={require("@assets/ShareIcon/twitter.png")}
                        style={styles.shareIconImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.shareOptionName} numberOfLines={1}>
                      Twitter
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.shareOption}
                    onPress={() => handleShare("snapchat")}
                  >
                    <View
                      style={[
                        styles.shareOptionIconCircle,
                        { backgroundColor: "#FFEC0620" },
                      ]}
                    >
                      <Image
                        source={require("@assets/ShareIcon/snapchat.png")}
                        style={styles.shareIconImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.shareOptionName} numberOfLines={1}>
                      Snapchat
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {}
      {currentTipUserId !== null && (
        <TipPopup
          visible={tipModalVisible}
          onClose={() => {
            setTipModalVisible(false);
            setCurrentTipUserId(null);
          }}
          reelId={parseInt(currentTipUserId) || 0}
          onTipSuccess={(amount) => {
            
            Alert.alert("Success", `Tip of ${amount} sent successfully!`);
            setTipModalVisible(false);
            setCurrentTipUserId(null);
          }}
        />
      )}

      {}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={participantTabs}
        onOpenDrawer={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C2610",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  menuButton: {
    width: 40,
    height: 40,
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  starContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: 40,
  },
  starShape: {
    width: width * 1,
    height: width * 0.9,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  starImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
    zIndex: 10,
  },
  profileImage: {
    width: width * 0.5,
    height: width * 0.5,
    marginTop: -height * 0.012,
  },
  contentContainer: {
    backgroundColor: "rgba(41, 33, 24, 1)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: "#000",
    borderWidth: 1,
    paddingTop: 20,
    marginTop: -10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  outlineButton: {
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.07,
    borderRadius: width * 0.02,
    borderWidth: 2,
    borderColor: "#EC9A15",
  },
  outlineButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.042,
  },
  tipButton: {
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.07,
    borderRadius: width * 0.02,
    backgroundColor: "#EC9A15",
  },
  tipButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.042,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: height * 0.025,
    paddingHorizontal: width * 0.125,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#EC9A15",
  },
  tab: {
    flex: 1,
    paddingVertical: height * 0.012,
    alignItems: "center",
  },
  tabText: {
    fontSize: width * 0.04,
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#EC9A15",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    gap: 4,
  },
  gridItem: {
    borderRadius: 4,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  levelUpModalContainer: {
    width: "90%",
    maxWidth: 400,
  },
  levelUpModalContent: {
    backgroundColor: "#3C2610",
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: "#EC9A15",
  },
  levelUpModalTitle: {
    color: "#EC9A15",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  levelUpRulesContainer: {
    marginBottom: 20,
  },
  levelUpRuleItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(236, 154, 21, 0.2)",
  },
  levelUpRuleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  levelUpModalNote: {
    color: "#EC9A15",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  levelUpModalCloseButton: {
    backgroundColor: "#EC9A15",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  levelUpModalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  
  levelDisplayContainer: {
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 20,
  },
  levelDisplayGradientWrapper: {
    borderRadius: 30,
    height: 50,
    width: "100%",
    overflow: "hidden",
    position: "relative",
    shadowColor: "#EC9A15",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  levelDisplayGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  levelDisplayText: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  
  shareModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: height * 0.6,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#666",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  shareHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  shareHeaderTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "300",
  },
  shareOptionsSection: {
    paddingVertical: 10,
  },
  shareOptionsList: {
    paddingHorizontal: 20,
  },
  shareOption: {
    alignItems: "center",
    marginRight: 20,
    width: 70,
  },
  shareOptionIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  shareOptionName: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  shareIconImage: {
    width: 24,
    height: 24,
  },
});
