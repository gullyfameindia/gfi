import { LeaderboardAPIData } from "@/types/leaderboard";
import React, { useCallback, useState } from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { Path, Svg } from "react-native-svg";
import { styles } from "./styles";
import { FlatList } from "react-native-gesture-handler";
import { router } from "expo-router";
import SafeImage from "../SafeImage";

interface InfiniteScrollingLeaderboardProps {
    limit: number;
    data: LeaderboardAPIData[];
}

// Quick helper to format big numbers to K/M
const formatNumber = (num: number): string => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

const Card = React.memo(({ data }: { data: LeaderboardAPIData }) => {
    const onNavigate = (userId: string | number | undefined) => {
        if (!userId) return;
        router.push({
            pathname: "/(main)/profile/[id]",
            params: { id: userId, userId: userId },
        });
    };

    return (
        <TouchableOpacity
            style={styles.playerBannerCard}
            onPress={() => onNavigate(data.id)}
            activeOpacity={0.8}
        >
            {/* Gamified accent strip on the left */}
            <View style={styles.cardAccentStrip} />

            <View style={styles.rankBadgeContainer}>
                <Text style={styles.rankNumber}>{data.rank}</Text>
            </View>

            <View style={styles.leaderboardAvatarWrapper}>
                <SafeImage
                    imageUrl={data.profilePictureUrl}
                    defaultImage={require("@assets/images/user2.png")}
                    style={styles.leaderboardAvatarImage}
                />
            </View>

            <View style={styles.leaderboardInfo}>
                <Text style={styles.leaderboardName} numberOfLines={1}>
                    {data.name}
                </Text>
                <View style={styles.pointsRowList}>
                    <Svg
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="#FFD700"
                    >
                        <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </Svg>
                    <Text style={styles.leaderboardPoints}>
                        {formatNumber(data.points || (data as any).votes || 0)}{" "}
                        Stars
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const ITEM_HEIGHT = 80;
Card.displayName = "InfiniteLeaderboardEntry";

function InfiniteScrollingLeaderboard({
    limit,
    data,
}: InfiniteScrollingLeaderboardProps) {
    const [displayedData, setDisplayedData] = useState(data.slice(0, limit));
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchMoreData = useCallback(() => {
        if (isLoading) return;
        if (displayedData.length >= data.length) return;
        setIsLoading(true);
        setTimeout(() => {
            const nextBatch = data.slice(page * limit, (page + 1) * limit);
            setDisplayedData((prev) => [...prev, ...nextBatch]);
            setPage((page) => page + 1);
            setIsLoading(false);
        }, 1000);
    }, [data, displayedData.length, isLoading, limit, page]);

    const getItemLayout = useCallback(
        (data: any, index: number) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        }),
        [],
    );

    const renderItem = useCallback(({ item }: { item: LeaderboardAPIData }) => {
        return <Card data={item}></Card>;
    }, []);

    const keyExtractor = useCallback(
        (item: LeaderboardAPIData) => item.id.toString(),
        [],
    );

    return (
        <View style={styles.leaderboardSection}>
            <FlatList
                data={displayedData}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.5}
                getItemLayout={getItemLayout}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.leaderboardContent}
                ListFooterComponent={
                    isLoading ? (
                        <View style={{ padding: 20 }}>
                            <ActivityIndicator size="large" color="#FFD700" />
                        </View>
                    ) : (
                        <View style={{ height: 20 }} />
                    ) // Padding at the end of the list
                }
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
}

export default InfiniteScrollingLeaderboard;
