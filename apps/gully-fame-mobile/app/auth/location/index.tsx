import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LocationScreen() {
  const params = useLocalSearchParams();
  const role = params.role ? String(params.role) : "participant";
  const firstName = params.firstName ? decodeURIComponent(String(params.firstName)) : "";
  const lastName = params.lastName ? decodeURIComponent(String(params.lastName)) : "";
  const email = params.email ? decodeURIComponent(String(params.email)) : "";

  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 

const handleEnableLocation = async () => {
  try {
    setLoading(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLoading(false);
      Alert.alert("Permission Denied", "Location access is needed.");
      return;
    }

    
    const locationPromise = Location.getCurrentPositionAsync({});
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Location timeout")), 5000)
    );

    const userLocation = await Promise.race([locationPromise, timeoutPromise]);
    console.log("User Location:", userLocation);

    
    const isSkipFlow = params.skip === "true";
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    const isFromSignIn = !firstName && !lastName && email && !isSkipFlow;
    const accountCreated = await AsyncStorage.getItem("accountCreated");

    if (isSkipFlow) {
      
      if (accountCreated === "true") {
        
        const userEmail = await AsyncStorage.getItem("userEmail") || email;
        const query = `email=${encodeURIComponent(userEmail)}`;
        router.replace(`/auth/verify-otp?${query}` as any);
      } else {
        
        
        router.replace("/(main)/home" as any);
      }
    } else if (isFromSignIn || isLoggedIn === "true") {
      
      await AsyncStorage.multiSet([
        ["isLoggedIn", "true"],
        ["profileCompleted", "true"],
      ]);
      router.replace("/(main)/home" as any);
    } else {
      
      router.replace("/auth/signin");
    }
  } catch (error) {
    console.error(error);
    setLoading(false);
    Alert.alert("Error", "Could not fetch location. Please try again.");
  }
};

const handleSkip = async () => {
  try {
    const isSkipFlow = params.skip === "true";
    const accountCreated = await AsyncStorage.getItem("accountCreated");
    
    if (isSkipFlow) {
      
      if (accountCreated === "true") {
        
        const userEmail = await AsyncStorage.getItem("userEmail") || email;
        const query = `email=${encodeURIComponent(userEmail)}`;
        router.replace(`/auth/verify-otp?${query}` as any);
      } else {
        
        
        router.replace("/(main)/home" as any);
      }
    } else {
      
      
      router.replace("/(main)/home" as any);
    }
  } catch (error) {
    console.error("Error skipping location:", error);
    router.replace("/(main)/home" as any);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.leftLine} />
      <View style={styles.rightLine} />

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require("@assets/images/location.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Location</Text>
        <Text style={styles.subtitle}>
          Please enable location access so we{"\n"}could provide you accurate
          results of{"\n"}
          nearest properties.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleEnableLocation}
          disabled={loading} 
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Enable</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <Text style={styles.loadingText}>Enabling location...</Text>
        )}

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={loading}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { alignItems: "center", justifyContent: "center", flex: 1 },
  leftLine: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "red",
    opacity: 0.4,
  },
  rightLine: {
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "red",
    opacity: 0.4,
  },
  imageContainer: { marginBottom: 30, marginTop: 80 },
  image: { width: 450, height: 450 },
  title: { fontSize: 22, fontWeight: "bold", color: "#000", marginBottom: 10 },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
    width: "80%",
  },
  button: {
    backgroundColor: "#3C2610",
    paddingVertical: 14,
    paddingHorizontal: 140,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  loadingText: { marginTop: 10, color: "#3C2610", fontSize: 14 },
  skipButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  skipButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
