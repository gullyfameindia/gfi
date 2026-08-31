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
    LayoutAnimation,
    UIManager,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import {
    BackIcon,
    ShareIcon,
    FacebookIcon,
    TrophyIcon,
    EyeIcon,
} from "@/icons";
import { pastCompetitionStyles as styles } from "@/styles/pastCompetitionStyles";
import TopPerformer from "@/components/home/TopDancers/TopPerformer";
import TopTenLeaderboard from "@/components/TopTenLeaderboard/TopTenLeaderboard";
import SafeImage from "@/components/SafeImage";
import { apiClient } from "@/api";
// NOTE: setLayoutAnimationEnabledExperimental is deprecated in New Architecture
// and doesn't have any effect. Use Reanimated for animations instead if needed.
// if (
//     Platform.OS === "android" &&
//     UIManager.setLayoutAnimationEnabledExperimental
// ) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
// }
const { height } = Dimensions.get("window");

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

// Gracefully handle strings (API) vs integers (local mock requires)
const getImageSource = (source: any) => {
    if (typeof source === "string") return { uri: source };
    return source;
};

// --- Fallback Mock Data matching the API Contract ---
const MOCK_PAST_DATA = {
    _id: "3",
    status: "ENDED",
    title: "Monsoon Moves 2024",
    subtitle: "Bollywood Fusion",
    description:
        "A celebration of Bollywood fusion dance celebrating the monsoon season!",
    totalParticipants: 245,
    prizePool: 22000,
    startDate: "2024-09-01T00:00:00.000Z",
    endDate: "2024-09-30T00:00:00.000Z",
    totalViews: 5200000,
    bannerImage: require("@assets/images/trending1.png"),
    results: [
        {
            id: "1",
            name: "Aarav Sharma",
            profilePictureUrl: require("@assets/images/user1.png"),
            rank: 1,
            votes: 300000,
            prizeMoneyWon: 15000,
        },
        {
            id: "2",
            name: "Priya Verma",
            profilePictureUrl: require("@assets/images/user1.png"),
            rank: 2,
            votes: 250000,
            prizeMoneyWon: 5000,
        },
        {
            id: "3",
            name: "Rohan Patel",
            profilePictureUrl: require("@assets/images/user1.png"),
            rank: 3,
            votes: 150000,
            prizeMoneyWon: 2000,
        },
        {
            id: "4",
            name: "Neha Gupta",
            profilePictureUrl: require("@assets/images/user1.png"),
            rank: 4,
            votes: 100000,
            prizeMoneyWon: 0,
        },
        {
            id: "5",
            name: "Vikram Singh",
            profilePictureUrl: require("@assets/images/user1.png"),
            rank: 5,
            votes: 95000,
            prizeMoneyWon: 0,
        },
        {
            id: "6",
            name: "Ananya Desai",
            profilePictureUrl: require("@assets/images/user1.png"),
            rank: 6,
            votes: 80000,
            prizeMoneyWon: 0,
        },
        {
            id: "7",
            name: "Ananya Desai",
            profilePictureUrl: require("@assets/images/user1.png"),
            rank: 7,
            votes: 80000,
            prizeMoneyWon: 0,
        },
        {
            id: "8",
            name: "Ananya Desai",
            profilePictureUrl: require("@assets/images/user1.png"),
            rank: 8,
            votes: 80000,
            prizeMoneyWon: 0,
        },
        {
            id: "9",
            name: "Ananya Desai",
            profilePictureUrl: require("@assets/images/user1.png"),
            rank: 9,
            votes: 80000,
            prizeMoneyWon: 0,
        },
        {
            id: "10",
            name: "Ananya Desai",
            profilePictureUrl: require("@assets/images/user1.png"),
            rank: 10,
            votes: 80000,
            prizeMoneyWon: 0,
        },
    ],
    recommendedPastCompetitions: [
        {
            _id: "2",
            title: "Mumbai Street Beats",
            winnerName: "Meghan Jes",
            prizePool: 15000,
            startDate: "2025-09-05T00:00:00.000Z",
            endDate: "2025-09-15T00:00:00.000Z",
            image: require("@assets/images/trending2.png"),
        },
        {
            _id: "3",
            title: "Bangalore Fusion",
            winnerName: "Alex Turner",
            prizePool: 8000,
            startDate: "2025-08-01T00:00:00.000Z",
            endDate: "2025-08-10T00:00:00.000Z",
            image: require("@assets/images/trending3.png"),
        },
    ],
};

export default function PastCompetitionScreen() {
    const params = useLocalSearchParams();
    const competitionIdFromParams = params.id
        ? String(params.id)
        : MOCK_PAST_DATA._id;

    // Initialize strictly with mock data to prevent blank screens
    const [competitionData, setCompetitionData] = useState<any>(MOCK_PAST_DATA);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [isRulesExpanded, setIsRulesExpanded] = useState(false);
    const shareSlideAnim = useRef(new Animated.Value(height)).current;
    const toggleRules = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsRulesExpanded(!isRulesExpanded);
    };
    useEffect(() => {
        (async () => {
            if (!competitionIdFromParams) return;
            try {
                const resp = await apiClient.get(
                    `/competitions/${competitionIdFromParams}`,
                );
                if (resp.data.code === 1 && resp.data.message === "success") {
                    // If API succeeds, merge with local mock to retain local banner images if API lacks them
                    setCompetitionData({
                        ...MOCK_PAST_DATA,
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

    const handleShare = async (platform: string) => {
        const competitionLink = `https://gullyfame.com/competition/${competitionData._id}`;
        const competitionText = `Check out "${competitionData.title}" competition on Gully Fame! ${competitionLink}`;

        try {
            switch (platform) {
                case "copy":
                    try {
                        if (Platform.OS === "web") {
                            await navigator.clipboard.writeText(
                                competitionLink,
                            );
                            Alert.alert("Copied!", "Link copied to clipboard");
                        } else {
                            Alert.alert("Copy Link", competitionLink, [
                                { text: "OK" },
                            ]);
                        }
                    } catch {
                        Alert.alert("Copy Link", competitionLink);
                    }
                    break;
                case "whatsapp":
                    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(competitionText)}`;
                    if (await Linking.canOpenURL(whatsappUrl)) {
                        await Linking.openURL(whatsappUrl);
                    } else {
                        Alert.alert(
                            "Error",
                            "Please install WhatsApp to share",
                        );
                    }
                    break;
                case "whatsapp-status":
                    const statusUrl = `whatsapp://send?text=${encodeURIComponent(competitionText)}`;
                    if (await Linking.canOpenURL(statusUrl)) {
                        await Linking.openURL(statusUrl);
                    } else {
                        Alert.alert(
                            "Error",
                            "Please install WhatsApp to share",
                        );
                    }
                    break;
                case "instagram":
                    const instagramUrl = `instagram://share`;
                    if (await Linking.canOpenURL(instagramUrl)) {
                        await Linking.openURL(instagramUrl);
                    } else {
                        Alert.alert(
                            "Error",
                            "Please install Instagram to share",
                        );
                    }
                    break;
                case "snapchat":
                    const snapchatUrl = `snapchat://`;
                    if (await Linking.canOpenURL(snapchatUrl)) {
                        await Linking.openURL(snapchatUrl);
                    } else {
                        Alert.alert(
                            "Error",
                            "Please install Snapchat to share",
                        );
                    }
                    break;
                case "facebook":
                    const facebookUrl = `fb://share?text=${encodeURIComponent(competitionText)}`;
                    if (await Linking.canOpenURL(facebookUrl)) {
                        await Linking.openURL(facebookUrl);
                    } else {
                        const fbWebUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(competitionLink)}`;
                        await Linking.openURL(fbWebUrl);
                    }
                    break;
                case "twitter":
                    const twitterUrl = `twitter://post?message=${encodeURIComponent(competitionText)}`;
                    if (await Linking.canOpenURL(twitterUrl)) {
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
            }).start(() => setShareModalVisible(false));
        } catch (error) {
            console.error("Error sharing:", error);
            Alert.alert("Error", "Unable to share. Please try again.");
        }
    };

    // Map Results Array
    const mappedResults = (competitionData.results || []).map((r: any) => ({
        id: r.id,
        userId: r.id,
        rank: r.rank,
        name: r.name,
        votes: r.votes,
        badge:
            r.rank === 1
                ? "🥇"
                : r.rank === 2
                  ? "🥈"
                  : r.rank === 3
                    ? "🥉"
                    : "⭐",
        label: "Top Performer",
        defaultProfilePicture: getImageSource(r.profilePictureUrl),
    }));

    const topThreePerformers = mappedResults.filter((p: any) => p.rank <= 3);
    const leaderboardPerformers = mappedResults.filter((p: any) => p.rank > 3);

    // Map More Competitions Array
    const morePastCompetitions = (
        competitionData.recommendedPastCompetitions || []
    ).map((comp: any) => ({
        id: comp._id,
        title: comp.title,
        category: "Competition",
        prize: formatCurrency(comp.prizePool),
        dates: `${formatDateShort(comp.startDate)} - ${formatDateShort(comp.endDate)}`,
        winner: comp.winnerName,
        image: comp.image || require("@assets/images/trending1.png"),
        imageUrl: null,
    }));

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3C2610" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
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
                            <View style={styles.endedBadge}>
                                <Text style={styles.endedBadgeText}>Ended</Text>
                            </View>
                            <View style={styles.statsOverlay}>
                                <View style={styles.statItemOverlay}>
                                    <EyeIcon color="#fff" size={18} />
                                    <Text style={styles.statTextOverlay}>
                                        {formatNumber(
                                            competitionData.totalViews || 0,
                                        )}
                                    </Text>
                                </View>
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

                            <View style={styles.heroPrizeContainer}>
                                <Text style={styles.heroPrizeLabel}>
                                    PRIZE POOL DISTRIBUTED
                                </Text>
                                <Text style={styles.heroPrizeAmount}>
                                    {formatCurrency(
                                        competitionData.prizePool || 0,
                                    )}
                                </Text>
                            </View>

                            {/* Event Specs: Participants & Timeline */}
                            <View style={styles.specsRow}>
                                <View style={styles.specBoxCenter}>
                                    <View style={styles.specHeaderCenter}>
                                        <Text style={styles.specIcon}>👥</Text>
                                        <Text style={styles.specLabel}>
                                            Participants
                                        </Text>
                                    </View>
                                    <Text style={styles.specValueLarge}>
                                        {competitionData.totalParticipants || 0}
                                    </Text>
                                </View>

                                <View style={styles.specVerticalDivider} />

                                <View style={styles.specBoxCenter}>
                                    <View style={styles.specHeaderCenter}>
                                        <Text style={styles.specIcon}>📅</Text>
                                        <Text style={styles.specLabel}>
                                            Timeline
                                        </Text>
                                    </View>
                                    <Text style={styles.specValue}>
                                        {formatDateShort(
                                            competitionData.startDate,
                                        )}{" "}
                                        -{" "}
                                        {formatDateShort(
                                            competitionData.endDate,
                                        )}
                                    </Text>
                                </View>
                            </View>

                            {/* Event Details Accordion */}
                            {(competitionData.description ||
                                competitionData.rules) && (
                                <TouchableOpacity
                                    style={styles.missionBriefingCard}
                                    activeOpacity={0.8}
                                    onPress={toggleRules}
                                >
                                    {/* Giving the header a gold tint makes it look clickable */}
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
                                            {competitionData.description && (
                                                <>
                                                    <Text
                                                        style={
                                                            styles.missionSectionTitle
                                                        }
                                                    >
                                                        About
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.missionText
                                                        }
                                                    >
                                                        {
                                                            competitionData.description
                                                        }
                                                    </Text>
                                                </>
                                            )}

                                            {/* Re-adding the gamified rules list! */}
                                            {competitionData.rules && (
                                                <>
                                                    {competitionData.description && (
                                                        <View
                                                            style={
                                                                styles.missionDivider
                                                            }
                                                        />
                                                    )}
                                                    <Text
                                                        style={
                                                            styles.missionSectionTitle
                                                        }
                                                    >
                                                        Rules
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

                {/* Final Results */}
                {mappedResults.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.finalResultsSection}>
                            <View style={styles.leaderboardTitleContainer}>
                                <Text style={styles.leaderboardMainTitle}>
                                    🏆 FINAL STANDINGS
                                </Text>
                                <Text style={styles.leaderboardSubTitle}>
                                    Top 10 Champions
                                </Text>
                            </View>
                            <View style={styles.finalResultsContainer}>
                                {topThreePerformers
                                    .filter((p: any) => p.rank === 2)
                                    .map((p: any) => (
                                        <TopPerformer
                                            performer={p}
                                            key={p.userId}
                                        />
                                    ))}
                                {topThreePerformers
                                    .filter((p: any) => p.rank === 1)
                                    .map((p: any) => (
                                        <TopPerformer
                                            performer={p}
                                            key={p.userId}
                                        />
                                    ))}
                                {topThreePerformers
                                    .filter((p: any) => p.rank === 3)
                                    .map((p: any) => (
                                        <TopPerformer
                                            performer={p}
                                            key={p.userId}
                                        />
                                    ))}
                            </View>
                        </View>
                        <TopTenLeaderboard performers={leaderboardPerformers} />
                    </View>
                )}

                {/* More Past Competitions */}
                {morePastCompetitions.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.morePastCompTitle}>
                            More Past Competitions
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.pastCompScroll}
                        >
                            {morePastCompetitions.map((comp: any) => (
                                <TouchableOpacity
                                    key={comp.id}
                                    style={styles.compCardNew}
                                    activeOpacity={0.9}
                                    onPress={() =>
                                        router.push(
                                            `/(main)/competition/past/${comp.id}` as any,
                                        )
                                    }
                                >
                                    <SafeImage
                                        defaultImage={getImageSource(
                                            comp.image,
                                        )}
                                        imageUrl={comp.imageUrl}
                                        style={styles.compCardImageNew}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.compCardContentNew}>
                                        <Text
                                            style={styles.compCardTitleNew}
                                            numberOfLines={2}
                                        >
                                            {comp.title}
                                        </Text>
                                        <View style={styles.compCardDetailsNew}>
                                            <View
                                                style={styles.compDetailItemNew}
                                            >
                                                <Svg
                                                    width={16}
                                                    height={16}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <Path
                                                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                                        fill="#FFD700"
                                                    />
                                                </Svg>
                                                <Text
                                                    style={
                                                        styles.compDetailTextNew
                                                    }
                                                >
                                                    Winner: {comp.winner}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.compCardFooterNew}>
                                            <View style={styles.prizeRowNew}>
                                                <TrophyIcon size={18} />
                                                <Text
                                                    style={
                                                        styles.compPrizeTextNew
                                                    }
                                                >
                                                    {comp.prize}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.resultsBtnNew}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    router.push(
                                                        `/(main)/competition/past/${comp.id}` as any,
                                                    );
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        styles.resultsBtnTextNew
                                                    }
                                                >
                                                    View Results
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
                <View style={{ height: 20 }} />
            </ScrollView>

            {/* Share Modal */}
            <Modal
                visible={shareModalVisible}
                transparent={true}
                animationType="none"
                onRequestClose={() => {
                    Animated.timing(shareSlideAnim, {
                        toValue: height,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => setShareModalVisible(false));
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
                        }).start(() => setShareModalVisible(false));
                    }}
                >
                    <Animated.View
                        style={[
                            styles.shareModal,
                            { transform: [{ translateY: shareSlideAnim }] },
                        ]}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <View style={styles.handleBar} />
                            <View style={styles.shareHeader}>
                                <Text style={styles.shareHeaderTitle}>
                                    Share Competition
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        Animated.timing(shareSlideAnim, {
                                            toValue: height,
                                            duration: 300,
                                            useNativeDriver: true,
                                        }).start(() =>
                                            setShareModalVisible(false),
                                        );
                                    }}
                                >
                                    <Text style={styles.closeButton}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.shareOptionsList}
                                contentContainerStyle={
                                    styles.shareOptionsContent
                                }
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
                                    <Text
                                        style={styles.shareOptionName}
                                        numberOfLines={1}
                                    >
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
                                    <Text
                                        style={styles.shareOptionName}
                                        numberOfLines={1}
                                    >
                                        WhatsApp
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.shareOption}
                                    onPress={() =>
                                        handleShare("whatsapp-status")
                                    }
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
                                    <Text
                                        style={styles.shareOptionName}
                                        numberOfLines={1}
                                    >
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
                                    <Text
                                        style={styles.shareOptionName}
                                        numberOfLines={1}
                                    >
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
                                    <Text
                                        style={styles.shareOptionName}
                                        numberOfLines={1}
                                    >
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
                                    <Text
                                        style={styles.shareOptionName}
                                        numberOfLines={1}
                                    >
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
                                    <Text
                                        style={styles.shareOptionName}
                                        numberOfLines={1}
                                    >
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
