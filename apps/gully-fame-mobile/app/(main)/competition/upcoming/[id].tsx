import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
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
    ActivityIndicator,
    LayoutAnimation,
    UIManager,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackIcon, ShareIcon, FacebookIcon, EyeIcon } from "@/icons";
import SafeImage from "@/components/SafeImage";
import { apiClient } from "@/api";
import { upcomingCompetitionStyles as styles } from "@/styles/upcomingCompetitionStyles";

// Enable LayoutAnimation for Android
// NOTE: setLayoutAnimationEnabledExperimental is deprecated in New Architecture
// and doesn't have any effect. Use Reanimated for animations instead if needed.
// if (
//     Platform.OS === "android" &&
//     UIManager.setLayoutAnimationEnabledExperimental
// ) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
// }
const formatPrizeBreakdown = (
    prizeAmount: number,
    winnerSlots: number = 1,
): Array<{ position: string; amount: string }> => {
    // Simple breakdown: distribute prize pool among winner slots
    // In real implementation, this would come from Admin API
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
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const target = new Date(targetDate);
            const now = new Date();
            const difference = target.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(
                        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                    ),
                    minutes: Math.floor(
                        (difference % (1000 * 60 * 60)) / (1000 * 60),
                    ),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <View style={styles.countdownBox}>
            <Text style={styles.countdownTitle}>BATTLE BEGINS IN</Text>
            <View style={styles.countdownRow}>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeValue}>
                        {String(timeLeft.days).padStart(2, "0")}
                    </Text>
                    <Text style={styles.timeLabel}>DAYS</Text>
                </View>
                <Text style={styles.timeColon}>:</Text>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeValue}>
                        {String(timeLeft.hours).padStart(2, "0")}
                    </Text>
                    <Text style={styles.timeLabel}>HRS</Text>
                </View>
                <Text style={styles.timeColon}>:</Text>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeValue}>
                        {String(timeLeft.minutes).padStart(2, "0")}
                    </Text>
                    <Text style={styles.timeLabel}>MIN</Text>
                </View>
                <Text style={styles.timeColon}>:</Text>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeValue}>
                        {String(timeLeft.seconds).padStart(2, "0")}
                    </Text>
                    <Text style={styles.timeLabel}>SEC</Text>
                </View>
            </View>
        </View>
    );
};
const { width, height } = Dimensions.get("window");

// --- Formatters ---
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
    if (!amount) return "₹0";
    return `₹${amount.toLocaleString("en-IN")}`;
};

const getImageSource = (source: any) => {
    if (typeof source === "string") return { uri: source };
    return source;
};

// --- Fallback Mock Data matching the API Contract ---
const MOCK_UPCOMING_DATA = {
    _id: "comp_003",
    status: "UPCOMING",
    title: "Mumbai Rap Cypher",
    subtitle: "Bars only",
    description:
        "Get ready to drop your best 16 bars. Show the city what you're made of.\n\nVideo must be 30-60 seconds long\nOriginal bars required\nNo offensive content or language",
    startDate: "2026-04-01T00:00:00.000Z",
    endDate: "2026-04-15T00:00:00.000Z",
    prizePool: 52000,
    entryFee: 200,
    totalParticipantsJoined: 1000,
    is_current_user_joined: false,
    bannerImage: require("@assets/images/trending2.png"),
    participantsPreview: [
        {
            id: "user_045",
            name: "MC Flow",
            profilePictureUrl: require("@assets/images/user1.png"),
            isCurrentUser: false,
        },
        {
            id: "user_046",
            name: "Divine Clone",
            profilePictureUrl: require("@assets/images/user2.png"),
            isCurrentUser: false,
        },
        {
            id: "user_047",
            name: "Gully Boy",
            profilePictureUrl: require("@assets/images/user1.png"),
            isCurrentUser: false,
        },
        {
            id: "user_048",
            name: "Spitfire",
            profilePictureUrl: require("@assets/images/user2.png"),
            isCurrentUser: false,
        },
    ],
};

export default function UpcomingCompetitionScreen() {
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const competitionIdFromParams = params.id
        ? String(params.id)
        : MOCK_UPCOMING_DATA._id;

    const [competitionData, setCompetitionData] =
        useState<any>(MOCK_UPCOMING_DATA);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const shareSlideAnim = useRef(new Animated.Value(height)).current;
    const [isRulesExpanded, setIsRulesExpanded] = useState(false);

    useEffect(() => {
        (async () => {
            if (!competitionIdFromParams) return;
            try {
                const resp = await apiClient.get(
                    `/competitions/${competitionIdFromParams}`,
                );
                if (resp.data.code === 1 && resp.data.message === "success") {
                    setCompetitionData({
                        ...MOCK_UPCOMING_DATA,
                        ...resp.data.data,
                    });
                }
            } catch (err) {
                console.warn(
                    "[CompetitionsService] API failed, relying on mock fallback",
                    err,
                );
            }
        })();
    }, [competitionIdFromParams]);

    const toggleRules = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsRulesExpanded(!isRulesExpanded);
    };

    const handleJoinNow = () => {
        router.push({
            pathname: "/(main)/camera",
            params: {
                competitionId: competitionData._id,
                competitionName: competitionData.title,
                entryFee: competitionData.entryFee
                    ? competitionData.entryFee.toString()
                    : "0",
            },
        });
    };

    const handleShare = async (platform: string) => {
        // ... (Keep your exact handleShare switch statement logic here!)
        setShareModalVisible(false);
    };

    if (!competitionData) {
        return (
            <View
                style={[
                    styles.container,
                    { justifyContent: "center", alignItems: "center" },
                ]}
            >
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3C2610" />

            {/* Floating Action Bar (Sticky CTA) */}
            <View
                style={[
                    styles.stickyBottomCTA,
                    { paddingBottom: Math.max(insets.bottom, 20) },
                ]}
            >
                {competitionData.is_current_user_joined ? (
                    <View
                        style={[styles.fullWidthButton, styles.disabledButton]}
                    >
                        <Text style={styles.disabledText}>
                            ✅ You are Registered!
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.fullWidthButton}
                        onPress={handleJoinNow}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={["#FF0055", "#FF8C00"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientFill}
                        >
                            <Text style={styles.ctaText}>
                                ⚔️ Enter the Battle
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        if (params.fromPayment === "true")
                            router.replace("/(main)" as any);
                        else router.back();
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
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                {/* Banner */}
                <View style={styles.compCardContainer}>
                    <View style={styles.titleCard}>
                        <View style={styles.compCardImageWrapper}>
                            <Image
                                source={getImageSource(
                                    competitionData.bannerImage,
                                )}
                                style={styles.titleCardImage}
                                resizeMode="cover"
                            />
                            <LinearGradient
                                colors={["transparent", "rgba(0,0,0,0.6)"]}
                                style={styles.bannerGradient}
                            />

                            <View style={styles.upcomingBadge}>
                                <Text style={styles.upcomingBadgeText}>
                                    Upcoming
                                </Text>
                            </View>
                        </View>

                        <View style={styles.titleCardContent}>
                            <View style={styles.titleCardHeader}>
                                <Text style={styles.compCardTitleNew}>
                                    {competitionData.title}
                                </Text>
                                <Text style={styles.compCardSubtitle}>
                                    {competitionData.subtitle || "Competition"}
                                </Text>
                            </View>

                            {/* THE HERO STAT: Prize Pool */}
                            <View style={styles.heroPrizeContainer}>
                                <Text style={styles.heroPrizeLabel}>
                                    TOTAL PRIZE POOL
                                </Text>
                                <Text style={styles.heroPrizeAmount}>
                                    {formatCurrency(
                                        competitionData.prizePool || 0,
                                    )}
                                </Text>
                            </View>

                            {/* FOMO Social Proof (Face Pile) */}
                            {competitionData.participantsPreview &&
                                competitionData.participantsPreview.length >
                                    0 && (
                                    <View style={styles.socialProofContainer}>
                                        <View
                                            style={styles.avatarPileContainer}
                                        >
                                            <View style={styles.avatars}>
                                                {competitionData.participantsPreview
                                                    .slice(0, 4)
                                                    .map(
                                                        (p: any, i: number) => (
                                                            <Image
                                                                key={i}
                                                                source={getImageSource(
                                                                    p.profilePictureUrl,
                                                                )}
                                                                style={[
                                                                    styles.pileAvatar,
                                                                    i > 0 && {
                                                                        marginLeft:
                                                                            -12,
                                                                    },
                                                                ]}
                                                            />
                                                        ),
                                                    )}
                                            </View>
                                            <Text style={styles.battlingText}>
                                                <Text
                                                    style={styles.battlingCount}
                                                >
                                                    {formatNumber(
                                                        competitionData.totalParticipantsJoined ||
                                                            0,
                                                    )}
                                                </Text>{" "}
                                                participants registered!
                                            </Text>
                                        </View>
                                    </View>
                                )}

                            {/* Event Specs: Entry Fee & Timeline */}
                            <View style={styles.specsRow}>
                                <View style={styles.specBox}>
                                    <View style={styles.specHeader}>
                                        <Text style={styles.specIcon}>🎟️</Text>
                                        <Text style={styles.specLabel}>
                                            Entry
                                        </Text>
                                    </View>
                                    {competitionData.entryFee ? (
                                        <Text style={styles.specValue}>
                                            {formatCurrency(
                                                competitionData.entryFee,
                                            )}
                                        </Text>
                                    ) : (
                                        <View style={styles.freeBadge}>
                                            <Text style={styles.freeBadgeText}>
                                                FREE
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.specVerticalDivider} />

                                <View style={styles.specBox}>
                                    <View style={styles.specHeader}>
                                        <Text style={styles.specIcon}>📅</Text>
                                        <Text style={styles.specLabel}>
                                            Starts On
                                        </Text>
                                    </View>
                                    <Text style={styles.specValue}>
                                        {formatDateShort(
                                            competitionData.startDate,
                                        )}
                                    </Text>
                                </View>
                            </View>
                            {/* NEW: Countdown Timer */}
                            <CountdownTimer
                                targetDate={competitionData.startDate}
                            />

                            {/* NEW: Prize Breakdown Podiums */}
                            <View
                                style={{
                                    marginHorizontal: 16,
                                    marginBottom: 16,
                                }}
                            >
                                <Text
                                    style={[
                                        styles.missionSectionTitle,
                                        { marginTop: 0 },
                                    ]}
                                >
                                    Loot Breakdown
                                </Text>
                                <View style={styles.podiumContainer}>
                                    {formatPrizeBreakdown(
                                        competitionData.prizePool || 0,
                                        3, // Hardcoded to 3 slots for visual hype
                                    ).map((prize, index) => {
                                        const medals = ["🥇", "🥈", "🥉"];
                                        const medal = medals[index] || "🏅";
                                        return (
                                            <View
                                                key={index}
                                                style={styles.podiumPill}
                                            >
                                                <Text
                                                    style={styles.podiumMedal}
                                                >
                                                    {medal}
                                                </Text>
                                                <View
                                                    style={
                                                        styles.podiumTextContainer
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.podiumPosition
                                                        }
                                                    >
                                                        {prize.position} Place
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.podiumAmount
                                                        }
                                                    >
                                                        {prize.amount}
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                            {/* Event Details & Rules Accordion */}
                            {(competitionData.description ||
                                competitionData.rules) && (
                                <TouchableOpacity
                                    style={styles.missionBriefingCard}
                                    activeOpacity={0.8}
                                    onPress={toggleRules}
                                >
                                    <View style={styles.missionHeader}>
                                        <View style={styles.missionTitleRow}>
                                            <Text style={styles.missionIcon}>
                                                📜
                                            </Text>
                                            <Text style={styles.missionTitle}>
                                                Event Details & Rules
                                            </Text>
                                        </View>
                                        <Text style={styles.chevron}>
                                            {isRulesExpanded ? "▲" : "▼"}
                                        </Text>
                                    </View>

                                    {isRulesExpanded && (
                                        <View style={styles.missionContent}>
                                            <Text
                                                style={
                                                    styles.missionSectionTitle
                                                }
                                            >
                                                About
                                            </Text>
                                            <Text style={styles.missionText}>
                                                {competitionData.description}
                                            </Text>

                                            {competitionData.rules && (
                                                <>
                                                    <View
                                                        style={
                                                            styles.missionDivider
                                                        }
                                                    />
                                                    <Text
                                                        style={
                                                            styles.missionSectionTitle
                                                        }
                                                    >
                                                        Rules of Engagement
                                                    </Text>
                                                    <View
                                                        style={styles.rulesList}
                                                    >
                                                        {competitionData.rules
                                                            .split("\n")
                                                            .map(
                                                                (
                                                                    rule: string,
                                                                    index: number,
                                                                ) => (
                                                                    <View
                                                                        key={
                                                                            index
                                                                        }
                                                                        style={
                                                                            styles.ruleBulletRow
                                                                        }
                                                                    >
                                                                        <View
                                                                            style={
                                                                                styles.ruleBullet
                                                                            }
                                                                        />
                                                                        <Text
                                                                            style={
                                                                                styles.missionText
                                                                            }
                                                                        >
                                                                            {rule.trim()}
                                                                        </Text>
                                                                    </View>
                                                                ),
                                                            )}
                                                    </View>
                                                </>
                                            )}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Share Modal (Keep your existing Modal JSX here) */}
        </View>
    );
}
