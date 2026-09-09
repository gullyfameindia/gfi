

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { BackIcon } from "@/icons"; 


interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqsData: FAQItem[] = [
  {
    id: 1,
    question: "How do I earn money/coins in Gully Fame?",
    answer: "Aap live competitions me bhaag lekar, accha content upload karke aur doston ko apne Referral Code se join karwa kar genuine cash aur coins earn kar sakte hain.",
  },
  {
    id: 2,
    question: "Why is my KYC verification taking time?",
    answer: "Aamtaur par KYC review me 24 se 48 ghante lagte hain. Agar aapke documents dundhle (blur) hain, toh usme thoda zyada samay lag sakta hai.",
  },
  {
    id: 3,
    question: "Money deducted but not credited in wallet?",
    answer: "Ghabraiye nahi! Kabhi-kabhi payment gateway ki wajah se delay hota hai. 2-3 ghante me amount auto-credit ho jayega. Nahi toh aap niche diye gaye WhatsApp support par transaction screenshot bhej sakte hain.",
  },
  {
    id: 4,
    question: "What are the rules for video submission?",
    answer: "Aapka content original hona chahiye. Kisi bhi tarah ka copyright music ya abusive content upload karne par account ban kiya ja sakta hai.",
  },
];

export default function HelpSupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleEmailSupport = async () => {
    const emailUrl = "mailto:support@gullyfame.com?subject=Gully Fame Support Request";
    try {
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert("Error", "No email app installed on this device.");
      }
    } catch (err) {
      Alert.alert("Error", "Could not launch Email application.");
    }
  };

  const handleWhatsAppSupport = async () => {
    const message = "Hello Gully Fame Support, I need assistance with my account.";
    const whatsappUrl = `whatsapp://send?phone=+919999999999&text=${encodeURIComponent(message)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        
        await Linking.openURL(`https://wa.me/919999999999?text=${encodeURIComponent(message)}`);
      }
    } catch (err) {
      Alert.alert("Error", "Could not open WhatsApp.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C2610" />

      {}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <BackIcon color="white" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {}
        <View style={styles.supportBanner}>
          <Ionicons name="headset-outline" size={48} color="#EC9A15" style={styles.bannerIcon} />
          <Text style={styles.bannerTitle}>We're here to help!</Text>
          <Text style={styles.bannerSubtitle}>
            Koi dikkat aa rahi hai? Niche diye gaye direct options se humari team se turant sampark karein.
          </Text>
        </View>

        {/* Quick Contact Grid */}
        <Text style={styles.sectionTitle}>Direct Support</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactCard} onPress={handleWhatsAppSupport} activeOpacity={0.8}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(37, 211, 102, 0.15)" }]}>
              <FontAwesome5 name="whatsapp" size={24} color="#25D366" />
            </View>
            <Text style={styles.contactText}>WhatsApp Chat</Text>
            <Text style={styles.contactTiming}>24x7 Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleEmailSupport} activeOpacity={0.8}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(236, 154, 21, 0.15)" }]}>
              <Ionicons name="mail-outline" size={24} color="#EC9A15" />
            </View>
            <Text style={styles.contactText}>Email Us</Text>
            <Text style={styles.contactTiming}>Reply in 12 hours</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs Accordion */}
        <Text style={styles.sectionTitle}>FAQs</Text>
        <View style={styles.faqList}>
          {faqsData.map((item) => {
            const isSelected = expandedFaq === item.id;
            return (
              <View key={item.id} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqHeader} 
                  onPress={() => toggleFaq(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Ionicons 
                    name={isSelected ? "chevron-up-circle" : "chevron-down-circle"} 
                    size={20} 
                    color="#EC9A15" 
                  />
                </TouchableOpacity>
                {isSelected && (
                  <View style={styles.faqAnswerBox}>
                    <Text style={styles.faqAnswerText}>{item.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C2610",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  supportBanner: {
    backgroundColor: "#252525",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.2)",
  },
  bannerIcon: {
    marginBottom: 12,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  bannerSubtitle: {
    color: "#aaa",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  sectionTitle: {
    color: "#EC9A15",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 26,
  },
  contactCard: {
    flex: 1,
    backgroundColor: "#252525",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.12)",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  contactText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  contactTiming: {
    color: "#777",
    fontSize: 11,
  },
  faqList: {
    gap: 10,
  },
  faqItem: {
    backgroundColor: "#252525",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.1)",
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  faqQuestion: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    paddingRight: 10,
  },
  faqAnswerBox: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  faqAnswerText: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
});