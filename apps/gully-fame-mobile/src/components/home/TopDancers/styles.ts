import { getFontSize, scale } from "@/utils/responsive";
import { Dimensions, StyleSheet } from "react-native";
const getDimensions = () => Dimensions.get("window");
const { width, height } = getDimensions();

export const styles = StyleSheet.create({
    topDancerCenter: {
        alignItems: "center",
        flex: 1,
        marginBottom: 20,
        zIndex: 10, 
    },
    topDancerSide: {
        alignItems: "center",
        flex: 1,
    },
    dancerImageWrapper: {
        position: "relative",
        marginBottom: 12, 
    },
    dancerImageSide: {
        width: width * 0.24,
        height: width * 0.24,
        borderRadius: width * 0.12, 
        borderWidth: 3, 
    },
    dancerImageCenter: {
        width: width * 0.28,
        height: width * 0.28,
        borderRadius: width * 0.14,
        borderWidth: 4, 
    },
    starIconWrapper: {
        position: "absolute",
        top: scale(-55), 
        alignSelf: "center",
        zIndex: 10,
    },
    starIcon: {
        width: scale(50),
        height: scale(60),
    },

    
    rankBadge: {
        position: "absolute",
        bottom: -10, 
        alignSelf: "center", 
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#3C2610", 
    },
    rankBadgeLarge: {
        position: "absolute",
        bottom: -12, 
        alignSelf: "center",
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#3C2610",
    },
    rankBadgeText: {
        color: "#3C2610", 
        fontSize: width * 0.035,
        fontFamily: "Inter_700Bold",
        fontWeight: "900",
    },
    rankBadgeTextLarge: {
        color: "#3C2610",
        fontSize: width * 0.045,
        fontFamily: "Inter_700Bold",
        fontWeight: "900",
    },

    
    dancerName: {
        color: "#fff",
        fontSize: getFontSize(13),
        textAlign: "center",
        marginTop: scale(4),
        marginBottom: scale(2),
        fontFamily: "Inter_700Bold",
        fontWeight: "700",
    },
    dancerNameCenter: {
        color: "#fff",
        fontSize: getFontSize(15),
        textAlign: "center",
        marginTop: scale(4),
        marginBottom: scale(2),
        fontFamily: "Inter_700Bold",
        fontWeight: "800",
    },
    dancerPoints: {
        color: "#C7C7C7",
        fontSize: getFontSize(11),
        textAlign: "center",
        fontFamily: "Inter_400Regular",
    },
    dancerPointsCenter: {
        fontSize: getFontSize(13),
        textAlign: "center",
        fontFamily: "Inter_700Bold",
        fontWeight: "700",
    },
});
