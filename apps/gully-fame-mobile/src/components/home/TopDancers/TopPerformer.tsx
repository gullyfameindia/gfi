import { Image, TouchableOpacity, View, Text } from "react-native";
import { styles } from "./styles";
import { topPerformersForHomeScreenFullData } from "@/types/topDancers";
import { router } from "expo-router";
import SafeImage from "@/components/SafeImage";
import React from "react";

// Helper to format big numbers to K/M
const formatNumber = (num: number): string => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

const TopPerformer = React.memo(
    ({ performer }: { performer: topPerformersForHomeScreenFullData }) => {
        const isTopRank = performer.rank === 1;

        // Dynamic Materials based on Rank!
        const getRankStyles = (rank: number) => {
            switch (rank) {
                case 1:
                    return {
                        color: "#FFD700",
                        shadow: "rgba(255, 215, 0, 0.6)",
                    }; // Gold
                case 2:
                    return { color: "#E3E4E5", shadow: "transparent" }; // Silver/Platinum
                case 3:
                    return { color: "#CD7F32", shadow: "transparent" }; // Bronze
                default:
                    return { color: "#EC9A15", shadow: "transparent" }; // Fallback Orange
            }
        };

        const rankTheme = getRankStyles(performer.rank);

        const onPress = () => {
            const userId = performer.userId || `performer${performer.id}`;
            router.push({
                pathname: "/(main)/profile/[id]",
                params: {
                    id: userId,
                    userId: userId,
                    role: "participants",
                },
            });
        };

        return (
            <View
                style={
                    isTopRank ? styles.topDancerCenter : styles.topDancerSide
                }
            >
                <TouchableOpacity
                    onPress={onPress}
                    activeOpacity={0.8}
                    style={{ alignItems: "center" }}
                >
                    <View
                        style={[
                            styles.dancerImageWrapper,
                            // Add a massive glowing aura ONLY to 1st place
                            isTopRank && {
                                shadowColor: rankTheme.color,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 15,
                                elevation: 10,
                            },
                        ]}
                    >
                        {isTopRank && (
                            <View style={styles.starIconWrapper}>
                                <Image
                                    source={require("@assets/images/star.png")}
                                    style={styles.starIcon}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                        <SafeImage
                            defaultImage={performer.defaultProfilePicture}
                            imageUrl={performer.profilePictureUrl}
                            style={[
                                isTopRank
                                    ? styles.dancerImageCenter
                                    : styles.dancerImageSide,
                                { borderColor: rankTheme.color }, // Inject the Gold/Silver/Bronze
                            ]}
                        />
                        <View
                            style={[
                                isTopRank
                                    ? styles.rankBadgeLarge
                                    : styles.rankBadge,
                                { backgroundColor: rankTheme.color }, // Inject the Gold/Silver/Bronze
                            ]}
                        >
                            <Text
                                style={
                                    isTopRank
                                        ? styles.rankBadgeTextLarge
                                        : styles.rankBadgeText
                                }
                            >
                                {performer.rank}
                            </Text>
                        </View>
                    </View>

                    <Text
                        style={
                            isTopRank
                                ? styles.dancerNameCenter
                                : styles.dancerName
                        }
                        numberOfLines={1}
                    >
                        {performer.name}
                    </Text>
                    <Text
                        style={[
                            isTopRank
                                ? styles.dancerPointsCenter
                                : styles.dancerPoints,
                            // Make 1st place text gold!
                            isTopRank && { color: rankTheme.color },
                        ]}
                    >
                        {formatNumber(performer.votes || performer.votes || 0)}{" "}
                        Votes
                    </Text>
                </TouchableOpacity>
            </View>
        );
    },
);
TopPerformer.displayName = "TopPerformer";
export default TopPerformer;
