// Own Profile - Fan
// This screen is for when a fan views their own profile

import { useRouter } from "expo-router";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Linking,
} from "react-native";
import BottomNav from "@components/layout/BottomNav";

import { fanSelfProfileScreenStyles as styles } from "@/styles/fanSelfProfileScreenStyles";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { authService } from "@api/services/authService";
import { useOwnProfile } from "@/components/profile/shared/profileHooks";
import {
  LevelUpSection,
  StatsSection,
  UserInfoSection,
} from "@/components/profile/shared/ProfileComponents";
import { useFollowStats } from "@/hooks/useFollowStats";
import { useUserReels } from "@/hooks/useUserReels";
import {
  UserIconSVG,
  HomeIconSVG,
  ReelIconSVG,
  SearchIconSVG,
  BackIcon,
  CrossIcon,
} from "@/icons";
import UpgradeFanToParticipantModal from "@/components/modals/UpgradeFanToParticipantModal/UpgradeFanToParticipantModal";
import ProfileBurgerMenuModal from "@/components/modals/ProfileBurgerMenuModal/ProfileBurgerMenuModal";
const InstagramIconSVG = ({ width = 26, height = 26, color = "#fff" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2.163c3.204 0 3.584.012 4.85.067 3.249.148 4.771 1.691 4.919 4.919.055 1.266.067 1.646.067 4.851s-.012 3.584-.067 4.85c-.148 3.228-1.67 4.771-4.919 4.919-1.266.055-1.646.067-4.85.067s-3.584-.012-4.85-.067c-3.249-.148-4.771-1.691-4.919-4.919-.055-1.266-.067-1.646-.067-4.851s.012-3.584.067-4.85c.148-3.228 1.67-4.771 4.919-4.919 1.266-.055 1.646-.067 4.85-.067zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 1.76-6.982 6.982-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.2 5.222 2.624 6.782 6.982 6.982 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c4.358-.2 6.78-1.76 6.982-6.982.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.2-5.222-2.624-6.782-6.982-6.982-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </Svg>
);
const formatHandle = (input: string) => {
  if (!input) return "";
  // Strip URLs
  let clean = input.replace(
    /(https?:\/\/)?(www\.)?(instagram\.com|x\.com|twitter\.com)\/?/g,
    "",
  );
  // Strip existing @ symbols and trailing slashes
  clean = clean.replace(/^@/, "").replace(/\/$/, "");
  return `@${clean}`;
};
const XIconSVG = ({ width = 26, height = 26, color = "#fff" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.076H5.059z" />
  </Svg>
);
const { width, height } = Dimensions.get("window");
// Tabs for fans (with Upload)
const fanTabs = [
  { name: "Home", icon: HomeIconSVG, label: "" },
  { name: "Reel", icon: ReelIconSVG, label: "GullyReel" },
  { name: "Upload", icon: null, label: "UPLOAD" },
  { name: "Search", icon: SearchIconSVG, label: "Search" },
  { name: "MyFame", icon: UserIconSVG, label: "" },
];
// Liked Reels and Saved data
const likedReels = [
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

const saved = [
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

export default function OwnFanProfile() {
  const { profileData, setProfileData, isLoading, reloadProfile } =
    useOwnProfile();
  const [activeTab, setActiveTab] = useState("MyFame");
  const [selectedTab, setSelectedTab] = useState("Saved");
  const [tempInsta, setTempInsta] = useState(profileData.instagramLink || "");
  const [tempX, setTempX] = useState(profileData.xLink || "");
  const [menuVisible, setMenuVisible] = useState(false);
  const [editBioVisible, setEditBioVisible] = useState(false);
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const [tempBio, setTempBio] = useState("");
  const [tempThreeWords, setTempThreeWords] = useState(["", "", ""]);
  const [levelUpModalVisible, setLevelUpModalVisible] = useState(false);
  const router = useRouter();

  // ✅ CREATED BY KIRO - Get follow stats with real-time updates
  const { stats: followStats } = useFollowStats(profileData.id || "");

  // ✅ CREATED BY KIRO - Get user reels dynamically
  const { reels: userReels, loading: reelsLoading, refetch: refetchReels } = useUserReels(profileData.id || "");

  // Reload data when screen comes into focus - only if needed
  useFocusEffect(
    React.useCallback(() => {
      // Always refetch reels when screen comes into focus to catch newly posted reels
      if (profileData.id || profileData._id) {
        refetchReels();
      }
      
      // Only reload profile if we don't have basic data
      if (!profileData.firstName && !profileData.lastName) {
        reloadProfile();
      }
    }, [profileData.id, profileData._id, profileData.firstName, profileData.lastName, reloadProfile, refetchReels]),
  );

  const handleBackPress = () => {
    router.replace("/(main)" as any);
  };

  // ✅ CREATED BY KIRO - Navigate to followers list
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

  // ✅ CREATED BY KIRO - Navigate to following list
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

  const handleEditBio = () => {
    setTempBio(profileData.bio || "");
    // Parse three words or use defaults
    const threeWordsStr = profileData.threeWords || "";
    if (threeWordsStr) {
      const words = threeWordsStr
        .split("|")
        .map((w) => w.trim())
        .filter((w) => w);
      setTempThreeWords([words[0] || "", words[1] || "", words[2] || ""]);
    } else {
      // Use default values
      setTempThreeWords(["🎵 MusicLover", "💃 DanceFreak", "✨ VibeCreator"]);
    }
    setEditBioVisible(true);
  };

  const handleSaveBio = async () => {
    const threeWordsFormatted = tempThreeWords
      .filter((w) => w.trim())
      .join(" | ");

    // 1. Update Local UI State (FIXED: mapped to instagramLink instead of instagram)
    setProfileData((prev) => ({
      ...prev,
      bio: tempBio,
      threeWords: threeWordsFormatted || undefined,
      instagramLink: tempInsta,
      xLink: tempX,
    }));

    try {
      await AsyncStorage.multiSet([
        ["userBio", tempBio],
        ["userThreeWords", threeWordsFormatted],
        ["userInstagram", tempInsta],
        ["userXLink", tempX],
      ]);

      // Ensure this matches what your backend API expects!
      const updateData: any = {
        bio: tempBio,
        instagramLink: tempInsta,
        xLink: tempX,
      };

      if (threeWordsFormatted) {
        updateData.threeWords = threeWordsFormatted;
      }

      const updateResult = await authService.updateProfile(updateData);
      if (updateResult.success && __DEV__)
        console.log("✅ Bio and socials updated");
    } catch (error) {
      console.error("Error saving profile data:", error);
    }

    setEditBioVisible(false);
  };

  const handleCancelEdit = () => {
    setTempBio(profileData.bio || "");
    setTempThreeWords(["", "", ""]);
    setEditBioVisible(false);
  };

  if (
    isLoading &&
    !profileData.firstName &&
    !profileData.lastName &&
    !profileData.profileImage
  ) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <StatusBar barStyle="light-content" />
      </View>
    );
  }

  const handleUpgradeClick = () => {
    setUpgradeModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button and Menu */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <BackIcon color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
          >
            <View style={styles.hamburgerIcon}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Fan Profile - Circle Frame Profile Section */}
        <View style={styles.gamifiedAvatarContainer}>
          <LinearGradient
            colors={["#E3E4E5", "#9CA3AF", "#4B5563"]} // Silver/Steel gradient
            style={styles.avatarGradientRing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image
              source={
                profileData.profileImage
                  ? { uri: profileData.profileImage }
                  : require("@assets/images/user1.png")
              }
              style={styles.gamifiedProfileImage}
            />
          </LinearGradient>

          <View
            style={[
              styles.rankBadgeContainer,
              {
                backgroundColor: "#4B5563",
                borderColor: "#E3E4E5",
              },
            ]}
          >
            <Text style={[styles.rankBadgeText, { color: "#fff" }]}>FAN</Text>
          </View>
        </View>

        {/* User Info */}
        <UserInfoSection
          profileData={profileData}
          onEditBio={handleEditBio}
          showEditButton={true}
          threeWords={profileData.threeWords}
          userNameMarginTop={height * 0.001}
          handleUpgradeClick={handleUpgradeClick}
        />

        {/* Social Links Tags */}
        <View style={styles.socialLinksContainer}>
          {/* Fallback to catch both naming conventions from backend/frontend */}
          {profileData.instagramLink && (
            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={() => {
                const raw = profileData.instagramLink;
                const cleanHandle = formatHandle(raw).replace("@", "");
                Linking.openURL(`https://instagram.com/${cleanHandle}`);
              }}
            >
              <InstagramIconSVG color="#fff" />
            </TouchableOpacity>
          )}

          {profileData.xLink && (
            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={() => {
                const cleanHandle = formatHandle(profileData.xLink).replace(
                  "@",
                  "",
                );
                Linking.openURL(`https://x.com/${cleanHandle}`);
              }}
            >
              <XIconSVG color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Content Container */}
        <LinearGradient
          colors={["rgba(41, 33, 24, 0.2)", "#3C2610"]}
          locations={[0.0, 0.4]}
          style={styles.contentContainer}
        >
          {/* Stats Section */}
          <StatsSection
            photos={userReels.length}
            followers={followStats.followers}
            following={followStats.following}
            onFollowersPress={handleFollowersPress}
            onFollowingPress={handleFollowingPress}
          />

          {/* Level-Up Section */}
          <LevelUpSection
            onPress={() => setLevelUpModalVisible(true)}
            levelPercentage={profileData.levelPercentage}
          />

          {/* Liked Reels/Saved Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === "Liked Reels" && styles.tabActive,
              ]}
              onPress={() => setSelectedTab("Liked Reels")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "Liked Reels" && styles.activeTabText,
                ]}
              >
                Liked Reels
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "Saved" && styles.tabActive]}
              onPress={() => setSelectedTab("Saved")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "Saved" && styles.activeTabText,
                ]}
              >
                Saved
              </Text>
            </TouchableOpacity>
          </View>

          {/* Grid Content - 2 columns layout */}
          <View style={styles.gridContainer}>
            {(selectedTab === "Liked Reels" ? likedReels : saved).map(
              (item, index) => {
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
                    onPress={() => {
                      // Open reel/post viewer - for now just show alert, can be enhanced later
                      // TODO: Implement reel viewer similar to search/home pages
                      console.log(
                        `Opening ${selectedTab === "Liked Reels" ? "reel" : "saved post"} ${item.id}`,
                      );
                    }}
                  >
                    <Image source={item.image} style={styles.gridImage} />
                  </TouchableOpacity>
                );
              },
            )}
          </View>
        </LinearGradient>
      </ScrollView>

      {/* Level-Up Popup Modal */}
      <Modal
        visible={levelUpModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLevelUpModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLevelUpModalVisible(false)}
        >
          <View style={styles.levelUpModalContainer}>
            <View style={styles.levelUpModalContent}>
              <Text style={styles.levelUpModalTitle}>How to Level Up</Text>

              <View style={styles.levelUpRulesContainer}>
                <View style={styles.levelUpRuleItem}>
                  <Text style={styles.levelUpRuleText}>
                    Unlock 1st star → after 3 competitions
                  </Text>
                </View>
                <View style={styles.levelUpRuleItem}>
                  <Text style={styles.levelUpRuleText}>
                    Unlock 2nd star → after 5 competitions
                  </Text>
                </View>
                <View style={styles.levelUpRuleItem}>
                  <Text style={styles.levelUpRuleText}>
                    Unlock 3rd star → after 10 competitions
                  </Text>
                </View>
                <View style={styles.levelUpRuleItem}>
                  <Text style={styles.levelUpRuleText}>
                    Unlock 4th star → after 20 competitions
                  </Text>
                </View>
                <View style={styles.levelUpRuleItem}>
                  <Text style={styles.levelUpRuleText}>
                    Unlock 5th star → after 30 competitions
                  </Text>
                </View>
              </View>

              <Text style={styles.levelUpModalNote}>
                If your fans upgrade your profile to Participant, your level-up
                progress will increase.
              </Text>

              <TouchableOpacity
                style={styles.levelUpModalCloseButton}
                onPress={() => setLevelUpModalVisible(false)}
              >
                <Text style={styles.levelUpModalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Hamburger Menu Modal */}
      <ProfileBurgerMenuModal
        isVisible={menuVisible}
        profileData={profileData}
        onClose={() => setMenuVisible(false)}
      ></ProfileBurgerMenuModal>
      <UpgradeFanToParticipantModal
        isVisible={upgradeModalVisible}
        onClose={() => setUpgradeModalVisible(false)}
        onUpgradeSuccess={() => setUpgradeModalVisible(false)}
      ></UpgradeFanToParticipantModal>
      {/* Edit Bio Modal */}
      <Modal
        visible={editBioVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.editBioOverlay}>
          <View style={styles.editBioContainer}>
            <View style={styles.editBioHeader}>
              <Text style={styles.editBioTitle}>Edit Bio & Three Words</Text>
              <TouchableOpacity onPress={handleCancelEdit}>
                <CrossIcon></CrossIcon>
              </TouchableOpacity>
            </View>

            <Text style={styles.editLabel}>Bio</Text>
            <TextInput
              style={styles.editBioInput}
              value={tempBio}
              onChangeText={setTempBio}
              placeholder="Write something about yourself..."
              placeholderTextColor="#999"
              multiline
              maxLength={150}
              autoFocus
            />
            <Text style={styles.bioCharCount}>{tempBio.length}/150</Text>

            <Text style={[styles.editLabel, { marginTop: 20 }]}>
              Describe yourself in three words
            </Text>
            <View style={styles.threeWordsEditContainer}>
              <TextInput
                style={styles.threeWordsEditInput}
                placeholder="1st word"
                placeholderTextColor="#999"
                value={tempThreeWords[0]}
                onChangeText={(text) => {
                  const newWords = [...tempThreeWords];
                  newWords[0] = text;
                  setTempThreeWords(newWords);
                }}
              />
              <Text style={styles.threeWordsEditSeparator}>|</Text>
              <TextInput
                style={styles.threeWordsEditInput}
                placeholder="2nd word"
                placeholderTextColor="#999"
                value={tempThreeWords[1]}
                onChangeText={(text) => {
                  const newWords = [...tempThreeWords];
                  newWords[1] = text;
                  setTempThreeWords(newWords);
                }}
              />
              <Text style={styles.threeWordsEditSeparator}>|</Text>
              <TextInput
                style={styles.threeWordsEditInput}
                placeholder="3rd word"
                placeholderTextColor="#999"
                value={tempThreeWords[2]}
                onChangeText={(text) => {
                  const newWords = [...tempThreeWords];
                  newWords[2] = text;
                  setTempThreeWords(newWords);
                }}
              />
            </View>
            <Text style={[styles.editLabel, { marginTop: 20 }]}>
              Social Links
            </Text>
            <View style={{ gap: 10 }}>
              <View style={styles.socialInputContainer}>
                <View style={{ marginRight: 8 }}>
                  <InstagramIconSVG width={26} height={26} color="#EC9A15" />
                </View>
                <TextInput
                  style={styles.socialInput}
                  placeholder="Instagram handle"
                  placeholderTextColor="#999"
                  value={tempInsta}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setTempInsta}
                />
              </View>
              <View style={styles.socialInputContainer}>
                <View style={{ marginRight: 8 }}>
                  <XIconSVG color="#EC9A15" />
                </View>
                <TextInput
                  style={styles.socialInput}
                  placeholder="X (Twitter) handle"
                  placeholderTextColor="#999"
                  value={tempX}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setTempX}
                />
              </View>
            </View>
            <View style={styles.editBioButtons}>
              <TouchableOpacity
                style={[styles.editBioButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.editBioButton, styles.saveButton]}
                onPress={handleSaveBio}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={fanTabs}
        onOpenDrawer={() => {}}
      />
    </View>
  );
}
