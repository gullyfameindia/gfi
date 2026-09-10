import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";
const RoleBasedBanner = ({ onLayout }: { onLayout?: (event: any) => void }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem("userRole");
        setUserRole(role);
      } catch (error) {
        console.error("Error loading user role:", error);
        setUserRole(null);
      }
    };
    loadUserRole();
  }, []);

  // Backend returns "participants" (plural), but we also check for "participant" (singular) for compatibility
  const isParticipant =
    userRole === "participant" || userRole === "participants";

  return (
    <View style={styles.communityBannerSection} onLayout={onLayout}>
      <LinearGradient
        colors={["#2a2a2a", "#1a1a1a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.communityBanner}
      >
        <Image
          source={require("@assets/images/gfi.png")}
          style={styles.bannerLogo}
          resizeMode="contain"
        />
        <Text style={styles.bannerTitle}>
          {isParticipant
            ? "Join Competitions"
            : "Change your role to participate in competition"}
        </Text>
        <TouchableOpacity
          style={styles.bannerButton}
          onPress={() => {
            if (isParticipant) {
              router.push("/(main)/competitions" as any);
            } else {
              router.push("/(main)/account-center" as any);
            }
          }}
        >
          <Text style={styles.bannerButtonText}>Join Now</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};
export default RoleBasedBanner;
