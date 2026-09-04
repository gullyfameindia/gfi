// File Route: apps/gully-fame-mobile/app/_layout.tsx

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BrandingProvider } from "@contexts/BrandingContext";
import {
    useFonts,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
} from "@expo-google-fonts/rubik";
import {
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
    PlayfairDisplay_900Black,
} from "@expo-google-fonts/playfair-display";
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from "@expo-google-fonts/inter";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { registerDeviceForNotifications, setupNotificationListeners } from "@/api/services/notificationIntegrationService";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const [fontsLoaded, fontError] = useFonts({
        Rubik_400Regular,
        Rubik_500Medium,
        Rubik_700Bold,
        PlayfairDisplay_400Regular,
        PlayfairDisplay_500Medium,
        PlayfairDisplay_600SemiBold,
        PlayfairDisplay_700Bold,
        PlayfairDisplay_800ExtraBold,
        PlayfairDisplay_900Black,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            console.log("✅ Fonts ready");
            
            // Register push notifications on app launch
            registerDeviceForNotifications();
            
            // Setup notification listeners with navigation
            const unsubscribe = setupNotificationListeners(
                (notification) => {
                    console.log("[RootLayout] Notification received:", notification);
                },
                (notification) => {
                    console.log("[RootLayout] Notification tapped:", notification);
                    // Handle navigation based on notification type
                    handleNotificationNavigation(notification);
                }
            );

            SplashScreen.hideAsync();
            
            return unsubscribe;
        }
    }, [fontsLoaded, fontError]);

    const handleNotificationNavigation = (notification: any) => {
        const { type, data } = notification;
        
        if (!data) return;

        switch (type) {
            case "comment":
                if (data?.reelId) {
                    // Navigate would be done via router, but we're at root level
                    // This will be handled in the nested screen
                }
                break;
            case "like":
                if (data?.reelId) {
                    // Navigate to reel
                }
                break;
            case "follow":
                if (data?.userId) {
                    // Navigate to profile
                }
                break;
            case "competition":
                if (data?.competitionId) {
                    // Navigate to competition
                }
                break;
            default:
                break;
        }
    };

    if (!fontsLoaded && !fontError) {
        console.log("⏳ Waiting for fonts...");
        return null;
    }

    return (
        <UserRoleProvider>
            <BrandingProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            // ✅ FIX 1: Pure navigation layout background ko dark brown kiya
                            contentStyle: { backgroundColor: "#3C2610" },
                            // ✅ FIX 2: Global soft fade animation transition apply kiya (Blinking strict zero)
                            animation: "fade",
                        }}
                    >
                        <Stack.Screen
                            name="index"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="auth"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="onboarding"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(main)"
                            options={{ headerShown: false }}
                        />
                    </Stack>
                    {/* ✅ FIX 3: StatusBar ko light content mode me lock kiya */}
                    <StatusBar style="light" backgroundColor="#3C2610" translucent={false} />
                </GestureHandlerRootView>
            </BrandingProvider>
        </UserRoleProvider>
    );
}