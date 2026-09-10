import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    leaderboardSection: {
        flex: 1,
        marginTop: 10,
        backgroundColor: "#3C2610", // Keeps the background matching the theme
    },
    leaderboardContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 40,
    },
    playerBannerCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2A1A0B",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 10, // Gives the floating gap effect in FlatList
        borderWidth: 1,
        borderColor: "#4A3A2A",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
        height: 80, // Matches ITEM_HEIGHT
    },
    cardAccentStrip: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: "#EC9A15",
    },
    rankBadgeContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        marginRight: 14,
    },
    rankNumber: {
        color: "#999",
        fontSize: 16,
        fontWeight: "800",
    },
    leaderboardAvatarWrapper: {
        position: "relative",
        marginRight: 14,
    },
    leaderboardAvatarImage: {
        width: 46,
        height: 46,
        borderRadius: 23,
        borderWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    leaderboardInfo: {
        flex: 1,
        justifyContent: "center",
    },
    leaderboardName: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    pointsRowList: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    leaderboardPoints: {
        color: "#FFD700",
        fontSize: 13,
        fontWeight: "600",
    },
});
