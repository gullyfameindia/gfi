

import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { LeaderboardStyles as styles } from "@/components/TopTenLeaderboard/styles";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNav from "@components/layout/BottomNav";
import {
  BackIcon,
  CommunityIcon,
  HomeIcon,
  ReelIcon,
  UserIconSVG,
} from "@/icons";
import Svg, { Path, Rect, G } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

const tabs = [
  { name: "Home", icon: HomeIcon, label: "" },
  { name: "Reel", icon: ReelIcon, label: "GullyReel" },
  { name: "Upload", icon: null, label: "UPLOAD" },
  { name: "Community", icon: CommunityIcon, label: "" },
  { name: "MyFame", icon: UserIconSVG, label: "" },
];

const leaderboardData = [
  {
    rank: 1,
    name: "Bryan Wolf",
    firstName: "Bryan",
    lastName: "Wolf",
    points: 43,
    isTop: true,
    userId: "performer1",
    role: "participants",
    profileImage: require("@assets/images/user2.png"),
    bio: "Born to perform. Built by the streets.",
  },
  {
    rank: 2,
    name: "Meghan Jes...",
    firstName: "Meghan",
    lastName: "Jes",
    points: 40,
    isTop: true,
    userId: "performer2",
    role: "participants",
    profileImage: require("@assets/images/user1.png"),
    bio: "Dancing through life, one beat at a time.",
  },
  {
    rank: 3,
    name: "Alex Turner",
    firstName: "Alex",
    lastName: "Turner",
    points: 39,
    isTop: true,
    userId: "performer3",
    role: "participants",
    profileImage: require("@assets/images/user2.png"),
    bio: "Music is my language, performance is my art.",
  },
  {
    rank: 4,
    name: "Marsha Fisher",
    firstName: "Marsha",
    lastName: "Fisher",
    points: 36,
    userId: "performer4",
    role: "participants",
    profileImage: require("@assets/images/user1.png"),
    bio: "Chasing dreams, one performance at a time.",
  },
  {
    rank: 5,
    name: "Juanita Cormier",
    firstName: "Juanita",
    lastName: "Cormier",
    points: 35,
    userId: "performer5",
    role: "participants",
    profileImage: require("@assets/images/user2.png"),
    bio: "Living life through music and dance.",
  },
  {
    rank: 6,
    name: "You",
    points: 34,
    isYou: true,
  },
  {
    rank: 7,
    name: "Sarah Johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    points: 33,
    userId: "fan1",
    role: "fan",
    profileImage: require("@assets/images/user1.png"),
    bio: "Love watching amazing performances!",
  },
  {
    rank: 8,
    name: "Mike Chen",
    firstName: "Mike",
    lastName: "Chen",
    points: 32,
    userId: "fan2",
    role: "fan",
    profileImage: require("@assets/images/user2.png"),
    bio: "Big fan of street performers and artists!",
  },
  {
    rank: 9,
    name: "Tamara Schmidt",
    firstName: "Tamara",
    lastName: "Schmidt",
    points: 31,
    userId: "performer6",
    role: "participants",
    profileImage: require("@assets/images/user1.png"),
    bio: "Performing is my passion.",
  },
  {
    rank: 10,
    name: "Ricardo Veum",
    firstName: "Ricardo",
    lastName: "Veum",
    points: 30,
    userId: "performer7",
    role: "participants",
    profileImage: require("@assets/images/user2.png"),
    bio: "Making moves, making music.",
  },
];

export default function MyFameScreen() {
  const [activeTab, setActiveTab] = useState("Home");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkLoginStatus = async () => {
      try {
        const [isLoggedIn, token] = await Promise.all([
          AsyncStorage.getItem("isLoggedIn"),
          AsyncStorage.getItem("authToken"),
        ]);

        if (isMounted) {
          if (isLoggedIn !== "true" && !token) {
            router.replace("/auth/signin" as any);
            return;
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        if (isMounted) {
          try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
              router.replace("/auth/signin" as any);
            } else {
              setIsLoading(false);
            }
          } catch (fallbackError) {
            router.replace("/auth/signin" as any);
          }
        }
      }
    };

    checkLoginStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabPress = (tabName: string) => {
    if (tabName === "Home") {
      router.push("/(main)" as any);
    } else if (tabName === "Community") {
      router.push("/(main)/community" as any);
    } else {
      setActiveTab(tabName);
    }
  };

  const topThree = leaderboardData.filter((item) => item.isTop);
  const restOfList = leaderboardData.filter((item) => !item.isTop);

  if (isLoading) {
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackIcon color="white" size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Leaderboard</Text>
        
        {}
        <TouchableOpacity
          onPress={() => router.push("/(main)/invite-friend" as any)}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="gift-outline" size={26} color="#EC9A15" />
        </TouchableOpacity>
      </View>

      {}
      <Text style={styles.subtitle}>
        🔥 Who&apos;s ruling the gullies right now?
      </Text>

      {}
      <View style={styles.podiumContainer}>
        <View style={styles.topThreeContainer}>
          {}
          <TouchableOpacity
            style={styles.podiumItem}
            onPress={() =>
              router.push({
                pathname: "/(main)/profile/[id]",
                params: {
                  id: topThree[1].userId,
                  userId: topThree[1].userId,
                  firstName: topThree[1].firstName,
                  lastName: topThree[1].lastName,
                  role: topThree[1].role,
                  bio: topThree[1].bio,
                },
              } as any)
            }
            activeOpacity={0.8}
          >
            <View style={styles.avatarContainer}>
              <Image source={topThree[1].profileImage} style={styles.avatar} />
              <LinearGradient
                colors={["#C0C0C0", "#A8A8A8"]}
                style={[styles.rankBadgeCircle, styles.rankBadge2]}
              >
                <Text style={styles.rankBadgeText}>2</Text>
              </LinearGradient>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>
              {topThree[1].name}
            </Text>
            <View style={styles.pointsRow}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="#C0C0C0"
                />
              </Svg>
              <Text style={styles.podiumPoints}>{topThree[1].points}</Text>
            </View>
          </TouchableOpacity>

          {}
          <TouchableOpacity
            style={[styles.podiumItem, styles.podiumFirst]}
            onPress={() =>
              router.push({
                pathname: "/(main)/profile/[id]",
                params: {
                  id: topThree[0].userId,
                  userId: topThree[0].userId,
                  firstName: topThree[0].firstName,
                  lastName: topThree[0].lastName,
                  role: topThree[0].role,
                  bio: topThree[0].bio,
                },
              } as any)
            }
            activeOpacity={0.8}
          >
            <View style={styles.avatarContainer}>
              <Svg
                width={35}
                height={35}
                viewBox="0 0 24 24"
                fill="none"
                style={styles.crownIcon}
              >
                <Path
                  d="M12 2l3 6 6-2-3 10H6L3 6l6 2 3-6z"
                  fill="#FFD700"
                  stroke="#FFA500"
                  strokeWidth={1.5}
                />
              </Svg>
              <Image
                source={topThree[0].profileImage}
                style={styles.avatarLarge}
              />
              <LinearGradient
                colors={["#FFD700", "#FFA500"]}
                style={[styles.rankBadgeCircle, styles.rankBadge1]}
              >
                <Text style={[styles.rankBadgeText, styles.rankBadgeText1]}>
                  1
                </Text>
              </LinearGradient>
            </View>
            <Text
              style={[styles.podiumName, styles.podiumName1]}
              numberOfLines={1}
            >
              {topThree[0].name}
            </Text>
            <View style={styles.pointsRow}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="#FFD700"
                />
              </Svg>
              <Text style={[styles.podiumPoints, styles.podiumPoints1]}>
                {topThree[0].points}
              </Text>
            </View>
          </TouchableOpacity>

          {}
          <TouchableOpacity
            style={styles.podiumItem}
            onPress={() =>
              router.push({
                pathname: "/(main)/profile/[id]",
                params: {
                  id: topThree[2].userId,
                  userId: topThree[2].userId,
                  firstName: topThree[2].firstName,
                  lastName: topThree[2].lastName,
                  role: topThree[2].role,
                  bio: topThree[2].bio,
                },
              } as any)
            }
            activeOpacity={0.8}
          >
            <View style={styles.avatarContainer}>
              <Image source={topThree[2].profileImage} style={styles.avatar} />
              <LinearGradient
                colors={["#CD7F32", "#8B4513"]}
                style={[styles.rankBadgeCircle, styles.rankBadge3]}
              >
                <Text style={styles.rankBadgeText}>3</Text>
              </LinearGradient>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>
              {topThree[2].name}
            </Text>
            <View style={styles.pointsRow}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="#CD7F32"
                />
              </Svg>
              <Text style={styles.podiumPoints}>{topThree[2].points}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {}
      <View style={styles.leaderboardSection}>
        <View style={styles.leaderboardListContainer}>
          <ScrollView
            contentContainerStyle={styles.leaderboardContent}
            showsVerticalScrollIndicator={false}
          >
            {restOfList.map((item, index) => (
              <TouchableOpacity
                key={item.rank}
                style={[
                  styles.leaderboardItem,
                  item.isYou && styles.leaderboardItemYou,
                  index !== restOfList.length - 1 &&
                    styles.leaderboardItemBorder,
                ]}
                onPress={async () => {
                  if (item.isYou) {
                    router.push({
                      pathname: "/(main)/profile/[id]",
                      params: { id: "me" },
                    } as any);
                  } else if (item.userId) {
                    router.push({
                      pathname: "/(main)/profile/[id]",
                      params: {
                        id: item.userId,
                        userId: item.userId,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        role: item.role,
                        bio: item.bio,
                      },
                    } as any);
                  }
                }}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.rankBadgeContainer,
                    item.isYou && styles.rankBadgeYou,
                  ]}
                >
                  <Text
                    style={[
                      styles.rankNumber,
                      item.isYou && styles.rankNumberYou,
                    ]}
                  >
                    {item.rank}
                  </Text>
                </View>

                <View style={styles.leaderboardAvatarWrapper}>
                  <Image
                    source={
                      item.profileImage || require("@assets/images/user2.png")
                    }
                    style={styles.leaderboardAvatarImage}
                  />
                  {item.isYou && (
                    <View style={styles.yourBadge}>
                      <Text style={styles.yourBadgeText}>YOU</Text>
                    </View>
                  )}
                </View>

                <View style={styles.leaderboardInfo}>
                  <Text
                    style={[
                      styles.leaderboardName,
                      item.isYou && styles.leaderboardNameYou,
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View style={styles.pointsRowList}>
                    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        fill={item.isYou ? "#000" : "#EC9A15"}
                      />
                    </Svg>
                    <Text
                      style={[
                        styles.leaderboardPoints,
                        item.isYou && styles.leaderboardPointsYou,
                      ]}
                    >
                      {item.points} pts
                    </Text>
                  </View>
                </View>

                {item.isYou && (
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M9 18l6-6-6-6"
                      stroke="#000"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        onOpenDrawer={() => {}}
      />
    </View>
  );
}