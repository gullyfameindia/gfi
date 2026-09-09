import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; 
import Svg, { Path } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTermsAndConditions } from '@/api/services/cmsService';

export default function TermsAndConditions() {
  const router = useRouter(); 
  const [isPressed, setIsPressed] = useState(false);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const result = await getTermsAndConditions();
        if (result.success && result.data) {
          const termsContent = result.data.termsAndConditions || result.data.content || '';
          setContent(termsContent);
        }
      } catch (error) {
        console.error('Error fetching terms and conditions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const handleAgree = async () => {
    try {
      
      await AsyncStorage.setItem("termsAccepted", "true");
      
      router.back();
    } catch (error) {
      console.error("Error saving terms acceptance:", error);
      
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {}
     <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Svg width={15} height={15} viewBox="0 0 16 16" fill="none">
          <Path
            d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z"
            fill="white"
          />
        </Svg>
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { fontFamily: "PlayfairDisplay_500Medium" }]}>
        Terms & Conditions
      </Text>
    </View>

      {}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3C2610" />
          </View>
        ) : (
          <Text style={styles.termsText}>
            {content || 'No terms and conditions available.'}
          </Text>
        )}
      </ScrollView>

      {}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.agreeButton, isPressed && styles.agreeButtonPressed]}
          onPress={handleAgree}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={1}
        >
          <Text style={styles.agreeButtonText}>Agree</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3C2610',
    paddingTop:70,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 18,
    color: '#FFF',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'left',
    fontSize: 18,
    color: '#FFF',
    marginLeft: 15,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  termsText: {
    fontSize: 13,
    color: '#727272',
    textAlign: 'justify',
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  agreeButton: {
    backgroundColor: '#E9ECEF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  agreeButtonPressed: {
    backgroundColor: '#D1D5DB',
  },
  agreeButtonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: "Inter_500Medium",
  },
});