import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Modal,
  Animated,
  Platform,
  Linking,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BackIcon,
  ShareIcon,
  FacebookIcon,
  ClockIcon,
  MedalIcon,
} from "@/icons";
import TopPerformer from "@/components/home/TopDancers/TopPerformer";
import TopTenLeaderboard from "@/components/TopTenLeaderboard/TopTenLeaderboard";
import { apiClient } from "@/api";
import { liveCompetitionStyles as styles } from "@/styles/liveCompetitionStyles";
import { useUserRole } from "@/contexts/UserRoleContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");









const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const formatDateShort = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatPrizeBreakdown = (
  prizeAmount: number,
  winnerSlots: number = 1,
): Array<{ position: string; amount: string }> => {
  const slots = winnerSlots || 1;
  const perSlot = Math.floor(prizeAmount / slots);
  const breakdown = [];

  for (let i = 0; i < slots && i < 3; i++) {
    const position = i === 0 ? "1st" : i === 1 ? "2nd" : "3rd";
    const amount = i === 0 ? perSlot + (prizeAmount % slots) : perSlot;
    breakdown.push({ position, amount: formatCurrency(amount) });
  }

  return breakdown;
};

const getTimeRemaining = (endDate: string): string => {
  if (!endDate) return "";
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `${hours} hr${hours > 1 ? "s" : ""}`;

  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes} min${minutes > 1 ? "s" : ""}`;
};



const competitionDataMock = {
  id: "1",
  _id: "1",
  title: "Delhi Dance-Off 2025",
  description: "Showcase your best solo Hip-Hop moves!",
  rules:
    "Video must be 30-60 seconds long\nOriginal choreography required\nNo offensive content or language",
  status: "LIVE",
  startDate: "2024-10-01",
  endDate: "2026-3-20",
  prizeAmount: 14000,
  prizePool: 14000,
  entryFee: 0,
  category: "Hip-Hop Freestyle",
  categoryId: "cat1",
  is_current_user_entered: false,
  winnerSlots: 2,
  bannerImage: require("@assets/images/trending1.png"),
  sponsorId: "sp1",
  sponsorName: "GF",
  sponsorLogo: undefined,
  participants: 180,
  registered: 180,
  viewers: 12500,
  totalEntries: 180,
  isActive: true,
  isDeleted: false,
  winners: undefined,
  createdAt: "2024-09-15",
  updatedAt: "2024-10-01",
  leaderboard: [
    {
      rank: 1,
      name: "Marsha Fisher",
      votes: 1200,
      defaultProfilePicture: require("@assets/images/user1.png"),
      id: "marsha1",
      isCurrentUser: false,
      role: "participants",
    },
    {
      rank: 2,
      name: "Juanita Cormier",
      votes: 980,
      defaultProfilePicture: require("@assets/images/user2.png"),
      id: "juanita1",
      isCurrentUser: false,
      role: "participants",
    },
    {
      rank: 3,
      name: "Tamara Schmidt",
      votes: 850,
      defaultProfilePicture: require("@assets/images/user1.png"),
      id: "tamara12",
      isCurrentUser: false,
      role: "participants",
    },
    {
      rank: 4,
      name: "Tamara Schmidt",
      votes: 850,
      defaultProfilePicture: require("@assets/images/user1.png"),
      id: "tamara11",
      isCurrentUser: false,
      role: "participants",
    },
    {
      rank: 5,
      name: "Tamara Schmidt",
      votes: 850,
      defaultProfilePicture: require("@assets/images/user1.png"),
      id: "tamara10",
      role: "participants",
      isCurrentUser: false,
    },
    {
      rank: 6,
      name: "Tamara Schmidt",
      votes: 850,
      defaultProfilePicture: require("@assets/images/user1.png"),
      id: "tamara2",
      isCurrentUser: false,
    },
    {
      rank: 7,
      name: "Tamara Schmidt",
      votes: 850,
      id: "tamara3",
      defaultProfilePicture: require("@assets/images/user1.png"),
      isCurrentUser: false,
    },
    {
      rank: 8,
      name: "Tamara Schmidt",
      votes: 850,
      defaultProfilePicture: require("@assets/images/user1.png"),
      id: "tamara4",
      role: "participants",
      isCurrentUser: false,
    },
    {
      rank: 9,
      name: "Tamara Schmidt",
      votes: 850,
      defaultProfilePicture: require("@assets/images/user1.png"),
      id: "tamara5",
      isCurrentUser: false,
      role: "participants",
    },
    {
      rank: 10,
      name: "Tamara Schmidt",
      votes: 850,
      defaultProfilePicture: require("@assets/images/user1.png"),
      id: "tamara6",
      isCurrentUser: false,
      role: "participants",
    },
  ],
  entries: [
    {
      id: 1,
      username: "@AaravMoves",
      votes: "1.2k Views",
      thumbnail: require("@assets/images/trending1.png"),
      hasVoted: false,
    },
    {
      id: 2,
      username: "@BeatQueen",
      votes: "1.2k Views",
      thumbnail: require("@assets/images/trending2.png"),
      hasVoted: false,
    },
    {
      id: 3,
      username: "@AaravMo",
      votes: "1.2k Views",
      thumbnail: require("@assets/images/trending3.png"),
      hasVoted: false,
    },
  ],
};

export default function LiveCompetitionScreen() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { role, isLoading } = useUserRole();
  const [isRulesExpanded, setIsRulesExpanded] = useState(false);
  const toggleRules = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsRulesExpanded(!isRulesExpanded);
  };
  const liveDotOpacity = useRef(new Animated.Value(1)).current;
  const competitionIdFromParams = params.id
    ? String(params.id)
    : competitionDataMock.id;
  const [competitionData, setCompetitionData] =
    useState<any>(competitionDataMock);
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotOpacity, {
          toValue: 0.2, 
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(liveDotOpacity, {
          toValue: 1, 
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [liveDotOpacity]);
  useEffect(() => {
    (async () => {
      console.log("GETTING DATA FROM API");
      try {
        const resp = await apiClient.get(
          `/competitions/${competitionIdFromParams}`,
        );
        if (resp.data.code === 1 && resp.data.message === "success") {
          console.log(
            `[CompetitionsService] Competition Data is ${resp.data.data}`,
          );
          setCompetitionData(competitionDataMock);
        } else {
          setCompetitionData(competitionDataMock);
        }
      } catch (err) {
        console.error("[CompetitionsService] Competition data is invalid");
      }
    })();
  }, [competitionIdFromParams]);
  useEffect(() => {
    (async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const entries = await AsyncStorage.multiGet(keys);
        console.log(entries);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  const [leaderboardModalVisible, setLeaderboardModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const shareSlideAnim = useRef(new Animated.Value(height)).current;
  const handleShare = async (platform: string) => {
    const competitionLink = `https://gullyfame.com/competition/${competitionIdFromParams}`;
    const competitionText = `Check out "${competitionData.title}" competition on Gully Fame! ${competitionLink}`;

    try {
      switch (platform) {
        case "copy":
          try {
            if (Platform.OS === "web") {
              await navigator.clipboard.writeText(competitionLink);
              Alert.alert("Copied!", "Link copied to clipboard");
            } else {
              Alert.alert("Copy Link", competitionLink, [{ text: "OK" }]);
            }
          } catch {
            Alert.alert("Copy Link", competitionLink);
          }
          break;
        case "whatsapp":
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(competitionText)}`;
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
        case "whatsapp-status":
          const statusUrl = `whatsapp://send?text=${encodeURIComponent(competitionText)}`;
          const canOpenStatus = await Linking.canOpenURL(statusUrl);
          if (canOpenStatus) {
            await Linking.openURL(statusUrl);
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
          const facebookUrl = `fb://share?text=${encodeURIComponent(competitionText)}`;
          const canOpenFB = await Linking.canOpenURL(facebookUrl);
          if (canOpenFB) {
            await Linking.openURL(facebookUrl);
          } else {
            const fbWebUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(competitionLink)}`;
            await Linking.openURL(fbWebUrl);
          }
          break;
        case "twitter":
          const twitterUrl = `twitter://post?message=${encodeURIComponent(competitionText)}`;
          const canOpenTwitter = await Linking.canOpenURL(twitterUrl);
          if (canOpenTwitter) {
            await Linking.openURL(twitterUrl);
          } else {
            const twitterWebUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(competitionText)}`;
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
      });
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Unable to share. Please try again.");
    }
  };
  const getImageSource = (source: any) => {
    if (typeof source === "string") return { uri: source };
    return source;
  };

  
  const mappedLeaderboard = (
    competitionData.leaderboardPreview ||
    competitionData.leaderboard ||
    []
  ).map((participant: any) => ({
    ...participant,
    username: participant.name || participant.username, 
    image: getImageSource(participant.profilePictureUrl || participant.image), 
  }));

  const top10LeaderboardData = mappedLeaderboard.slice(0, 10);
  const restOfLeaderboardData = top10LeaderboardData.filter(
    (perf: any) => perf.rank > 3,
  );
  const pushToVoting = () => {
    router.push("/(main)/reel");
  };
  if (!competitionData) {
    return <ActivityIndicator></ActivityIndicator>;
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C2610" />
      {!isLoading && (
        <View
          style={[
            styles.stickyBottomCTA,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          {role === "fan" ? (
            <TouchableOpacity
              style={styles.fullWidthButton}
              onPress={pushToVoting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#EC9A15", "#FFD700"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientFill}
              >
                <Text style={styles.ctaText}>⭐ Watch & Vote Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              {competitionData.is_current_user_entered ? (
                <>
                  <View style={[styles.halfButton, styles.disabledButton]}>
                    <Text style={styles.disabledText}>🔒 Voting Locked</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.halfButton}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#22C55E", "#16A34A"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientFill}
                    >
                      <Text style={styles.ctaText}>👁️ View Entry</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.halfButton}
                    onPress={pushToVoting}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#EC9A15", "#FFD700"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientFill}
                    >
                      <Text style={styles.ctaText}>⭐ Vote</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.halfButton}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#FF0055", "#FF8C00"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientFill}
                    >
                      <Text style={styles.ctaText}>⚔️ Enter</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      )}

      {}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            
            router.push("/(main)/home");
          }}
          style={styles.headerButton}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {competitionData.title}
        </Text>
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
          style={styles.headerButton}
        >
          <ShareIcon color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {}
        <TouchableOpacity style={styles.bannerContainer} activeOpacity={0.9}>
          <Image
            source={competitionData.bannerImage}
            style={styles.bannerImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.bannerGradient}
          />

          {}
          <View style={styles.liveBadge}>
            {}
            <Animated.View
              style={[styles.liveDot, { opacity: liveDotOpacity }]}
            />
            <Text style={styles.liveBadgeText}>Live</Text>
          </View>
        </TouchableOpacity>

        {}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.categoryText}>
              {competitionData.subtitle || "Competition"}
            </Text>
            {competitionData.sponsorName && (
              <Text style={styles.presenterText}>
                Presented by {competitionData.sponsorName}
              </Text>
            )}
          </View>

          <View style={styles.votingRow}>
            <ClockIcon />
            <Text style={styles.votingText}>
              Voting closes in {getTimeRemaining(competitionData.endDate)}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: "85%" }]} />
          </View>
        </View>

        {}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rewards & Entry Details</Text>
          <View style={styles.card}>
            {}
            <View style={styles.heroPrizeContainer}>
              <Text style={styles.heroPrizeLabel}>TOTAL PRIZE POOL</Text>
              <Text style={styles.heroPrizeAmount}>
                {formatCurrency(
                  competitionData.prizeAmount || competitionData.prizePool || 0,
                )}
              </Text>
            </View>

            <View style={styles.divider} />

            {}
            <View style={styles.podiumContainer}>
              {formatPrizeBreakdown(
                competitionData.prizeAmount || competitionData.prizePool || 0,
                competitionData.winnerSlots || 1,
              ).map((prize, index) => {
                const medals = ["🥇", "🥈", "🥉"];
                const medal = medals[index] || "🏅";

                return (
                  <View key={index} style={styles.podiumPill}>
                    <Text style={styles.podiumMedal}>{medal}</Text>
                    <View style={styles.podiumTextContainer}>
                      <Text style={styles.podiumPosition}>
                        {prize.position} Place
                      </Text>
                      <Text style={styles.podiumAmount}>{prize.amount}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.divider} />

            {}
            <View style={styles.specsRow}>
              {}
              <View style={styles.specBox}>
                <View style={styles.specHeader}>
                  <Text style={styles.specIcon}>🎟️</Text>
                  <Text style={styles.specLabel}>Entry</Text>
                </View>
                {competitionData.entryFee ? (
                  <Text style={styles.specValue}>
                    {formatCurrency(competitionData.entryFee)}
                  </Text>
                ) : (
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>FREE</Text>
                  </View>
                )}
              </View>

              <View style={styles.specVerticalDivider} />

              {}
              <View style={styles.specBox}>
                <View style={styles.specHeader}>
                  <Text style={styles.specIcon}>📅</Text>
                  <Text style={styles.specLabel}>Timeline</Text>
                </View>
                <Text style={styles.specValue}>
                  {formatDateShort(competitionData.startDate)} -{" "}
                  {formatDateShort(competitionData.endDate)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {}
            <View style={styles.detailRowCompact}>
              <View style={styles.socialProofContainer}>
                {}
                <View style={styles.avatarPileContainer}>
                  <View style={styles.avatars}>
                    {top10LeaderboardData
                      .slice(0, 4)
                      .map((participant: any, index: number) => (
                        <Image
                          key={index}
                          source={participant.defaultProfilePicture}
                          style={[
                            styles.pileAvatar,
                            index > 0 && {
                              marginLeft: -12,
                            }, 
                          ]}
                        />
                      ))}
                  </View>
                  <Text style={styles.battlingText}>
                    <Text style={styles.battlingCount}>
                      +{Math.max((competitionData.totalEntries || 0) - 4, 0)}
                    </Text>{" "}
                    others battling!
                  </Text>
                </View>

                {}
                <View style={styles.starFlexBox}>
                  <Text style={styles.starFlexIcon}>⭐</Text>
                  <View>
                    <Text style={styles.starFlexValue}>
                      {formatNumber(competitionData.viewers || 15243)}
                    </Text>
                    <Text style={styles.starFlexLabel}>Stars Cast</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.missionBriefingCard}
            activeOpacity={0.8}
            onPress={toggleRules}
          >
            <View style={styles.missionHeader}>
              <View style={styles.missionTitleRow}>
                <Text style={styles.missionIcon}>📜</Text>
                <Text style={styles.missionTitle}>
                  Mission Briefing & Rules
                </Text>
              </View>
              <Text style={styles.chevron}>{isRulesExpanded ? "▲" : "▼"}</Text>
            </View>

            {isRulesExpanded && (
              <View style={styles.missionContent}>
                {}
                <Text style={styles.missionSectionTitle}>About the Battle</Text>
                <Text style={styles.missionText}>
                  {competitionData.description || "No description available."}
                </Text>

                {}
                {competitionData.rules && (
                  <>
                    <View style={styles.missionDivider} />
                    <Text style={styles.missionSectionTitle}>
                      Rules of Engagement
                    </Text>
                    <View style={styles.rulesList}>
                      {}
                      {competitionData.rules
                        .split("\n")
                        .map((rule: string, index: number) => (
                          <View key={index} style={styles.ruleBulletRow}>
                            <View style={styles.ruleBullet} />
                            <Text style={styles.missionText}>
                              {rule.trim()}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </>
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.section}>
          <View style={styles.leaderboardTitleContainer}>
            <Text style={styles.leaderboardMainTitle}>🏆 LIVE LEADERBOARD</Text>
            <Text style={styles.leaderboardSubTitle}>Top 10 Participants</Text>
          </View>
          <View style={styles.top10Section}>
            <View style={styles.topDancersContainer}>
              {top10LeaderboardData
                .filter((entry: any) => entry.rank === 2)
                .map((entry: any) => (
                  <TopPerformer performer={entry} key={entry.id}></TopPerformer>
                ))}
              {top10LeaderboardData
                .filter((d: any) => d.rank === 1)
                .map((dancer: any) => (
                  <TopPerformer
                    performer={dancer}
                    key={dancer.id}
                  ></TopPerformer>
                ))}

              {}
              {top10LeaderboardData
                .filter((d: any) => d.rank === 3)
                .map((dancer: any) => (
                  <TopPerformer
                    performer={dancer}
                    key={dancer.id}
                  ></TopPerformer>
                ))}
            </View>
          </View>
          <TopTenLeaderboard
            performers={restOfLeaderboardData}
          ></TopTenLeaderboard>
          <TouchableOpacity
            onPress={() => {
              router.push("/(main)/leaderboard/[id]");
            }}
            style={styles.viewAllButton}
            activeOpacity={0.8}
          >
            <Text style={styles.viewAllText}>View Full Leaderboard</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {}
      <Modal
        visible={leaderboardModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLeaderboardModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>LeaderBoard</Text>
              <TouchableOpacity
                onPress={() => setLeaderboardModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              {competitionData.leaderboard.map((participant: any) => (
                <TouchableOpacity
                  key={participant.rank}
                  style={styles.leaderboardItem}
                  onPress={() => {
                    
                    const nameParts = participant.username?.split(" ") || [];
                    const firstName =
                      nameParts[0] || participant.username || "User";
                    const lastName = nameParts.slice(1).join(" ") || "";

                    router.push({
                      pathname: "/(main)/profile/[id]",
                      params: {
                        id: participant.userId || `user${participant.rank}`,
                        userId: participant.userId || `user${participant.rank}`,
                        firstName: firstName,
                        lastName: lastName,
                        role: "participants",
                        bio: "",
                      },
                    } as any);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.leaderboardLeft}>
                    <Text style={styles.rankText}>{participant.rank}</Text>
                    <Image
                      source={participant.image}
                      style={styles.participantImage}
                    />
                    <Text style={styles.participantUsername}>
                      {participant.username}
                    </Text>
                  </View>
                  {participant.rank <= 3 && (
                    <View style={styles.medalContainer}>
                      <MedalIcon rank={participant.rank} size={35} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
                <Text style={styles.shareHeaderTitle}>Share Competition</Text>
                <TouchableOpacity
                  onPress={() => {
                    Animated.timing(shareSlideAnim, {
                      toValue: height,
                      duration: 300,
                      useNativeDriver: true,
                    }).start(() => {
                      setShareModalVisible(false);
                    });
                  }}
                >
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.shareOptionsList}
                contentContainerStyle={styles.shareOptionsContent}
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
                  onPress={() => handleShare("whatsapp-status")}
                >
                  <View
                    style={[
                      styles.shareOptionIconCircle,
                      { backgroundColor: "#25D36620" },
                    ]}
                  >
                    <Image
                      source={require("@assets/ShareIcon/status.png")}
                      style={styles.shareIconImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.shareOptionName} numberOfLines={1}>
                    Status
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
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
