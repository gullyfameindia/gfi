import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { wp, hp } from "@utils/responsive";

const DEFAULT_LOGO = require("@assets/images/logogfi.png");
const DEFAULT_BACKGROUND = "#3C2610";

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [hasStartedAnimation, setHasStartedAnimation] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const navigationTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hasStartedAnimation) {
      setHasStartedAnimation(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

  useEffect(() => {
    if (!hasNavigated) {
      navigationTimer.current = setTimeout(async () => {
        if (hasNavigated) return;
        setHasNavigated(true);
        
        try {
          const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
          let hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
          
          
          console.log("[SplashScreen] Navigation check:", {
            isLoggedIn,
            hasSeenOnboarding,
            __DEV__,
          });
          
          
          
          if (__DEV__) {
            await AsyncStorage.removeItem("hasSeenOnboarding");
            hasSeenOnboarding = null;
          }
          
          if (isLoggedIn === "true") {
            console.log("[SplashScreen] User is logged in, going to home");
            router.replace("/(main)/home" as any);
          } else {
            if (hasSeenOnboarding === "true") {
              console.log("[SplashScreen] User has seen onboarding, going to signin");
              router.replace("/auth/signin" as any);
            } else {
              console.log("[SplashScreen] User has NOT seen onboarding, going to onboarding1");
              router.replace("/auth/onboarding1" as any);
            }
          }
        } catch (error) {
          console.error("[SplashScreen] Navigation error:", error);
          router.replace("/auth/onboarding1" as any);
        }
      }, 2500);
    }

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: DEFAULT_BACKGROUND }]}>
      <Animated.Image
        source={DEFAULT_LOGO}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3C2610",
  },
  logo: {
    width: wp(70),
    height: hp(40),
    maxWidth: 300,
    maxHeight: 300,
  },
});
