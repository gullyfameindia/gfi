import AsyncStorage from "@react-native-async-storage/async-storage";
import { removeAuthToken } from "@api/axios";
import { router } from "expo-router";

export const performLogout = async (): Promise<void> => {
  try {
    await removeAuthToken();

    await AsyncStorage.multiRemove([
      "isLoggedIn",
      "authToken",
      "userId",
      "userRole",
      "userEmail",
      "userFirstName",
      "userLastName",
      "userMobile",
      "accountCreated",
      "profileCompleted",
      "termsAccepted",
      "hasSeenOnboarding",
    ]);

    if (__DEV__) {
      console.log("✅ Logout successful - All user data cleared");
    }

    // Navigate to splash screen which will then route to signin
    router.replace("/auth/splashscreen" as any);
  } catch (error) {
    console.error("❌ Failed to log out:", error);
    // Even if there's an error, try to navigate to splash screen
    router.replace("/auth/splashscreen" as any);
  }
};
