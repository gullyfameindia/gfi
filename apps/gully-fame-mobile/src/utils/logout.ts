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

    
    router.replace("/auth/splashscreen" as any);
  } catch (error) {
    console.error("❌ Failed to log out:", error);
    
    router.replace("/auth/splashscreen" as any);
  }
};
