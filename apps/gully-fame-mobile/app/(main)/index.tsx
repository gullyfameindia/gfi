import { router } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';





export default function MainIndex() {
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn === "true") {
        router.replace('/(main)/home' as any);
      } else {
        
        router.replace('/auth/splashscreen' as any);
      }
    };
    checkAuth();
  }, []);
  return null;
}

