import { StyleSheet } from "react-native";

export const leaderboardScreenStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#3C2610", // Matches the deep brown theme
    },
    headerContainer: {
        backgroundColor: "#3C2610",
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 215, 0, 0.15)", // Subtle gold separator line
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        zIndex: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    titleWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    headerMainTitle: {
        fontSize: 18,
        color: "#FFD700", // Gold text
        fontWeight: "800",
        letterSpacing: 1,
        textShadowColor: "rgba(255, 215, 0, 0.4)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    headerSubTitle: {
        fontSize: 13,
        color: "#C7C7C7",
        marginTop: 2,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    placeholder: {
        width: 40,
    },

    // --- Live Status Badge ---
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 215, 0, 0.08)", // Faint gold pill background
        alignSelf: "center",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        marginTop: 4,
        borderWidth: 1,
        borderColor: "rgba(255, 215, 0, 0.2)",
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#22C55E", // Neon green "online" dot
        marginRight: 8,
    },
    statusText: {
        color: "#EC9A15",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1,
    },

    // --- List Container ---
    listContainer: {
        flex: 1,
        backgroundColor: "#3C2610", // Ensure scrolling background matches
    },
});
