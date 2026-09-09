
import { useEffect } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';





export default function Index() {
  useEffect(() => {
    
    
    router.replace('/auth/splashscreen' as any);
  }, []);

  return <View style={{ flex: 1 }} />;
}

