

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


const faqsData = [
  {
    id: 1,
    question: "How do I earn coins in Gully Fame?",
    answer: "Aap competitions me participate karke, doston ko invite karke aur daily check-ins ke throw coins earn kar sakte hain.",
  },
  {
    id: 2,
    question: "My video is failing to upload. What should I do?",
    answer: "Pehle apna internet connection check karein. Agar problem bani rehti hai, toh app ka cache clear karein ya support team ko contact karein.",
  },
  {
    id: 3,
    question: "How can I withdraw my rewards?",
    answer: "Aap apne Profile section me jaakar 'Wallet' par click karke minimum balance reach hone par direct Paytm/UPI me withdraw kar sakte hain.",
  },
  {
    id: 4,
    question: "Can I change my username or role?",
    answer: "Haan, aap Settings -> Edit Profile me jaakar apna username aur personal details kabhi bhi change kar sakte hain.",
  },
];

export default function HelpSupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    if (expandedFaq === id) {
      setExpandedFaq(null); 
    } else {
      setExpandedFaq(id); 
    }
  };

  const handleEmailSupport = async () => {
    const emailUrl = "mailto:support@gullyfame.com?subject=Gully Fame App Support Request";
    const canOpen = await Linking.canOpenURL(emailUrl);
    if (canOpen) {
      await Linking.openURL(emailUrl);
    } else {
      Alert.alert("Error", "No email app found on your device.");
    }
  };

  const handleWhatsAppSupport = async () => {
    const message = "Hello Gully Fame Support team, I need some help regarding the app.";
    const whatsappUrl = `whatsapp://send?phone=+919999999999&text=${encodeURIComponent(message)}`; 
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
    } else {
      
      await Linking.openURL(`https://wa.me/919999999999?text=${encodeURIComponent(message)}`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C2610" />

      {}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {}
        <View style={styles.topCard}>
          <Ionicons name="headset-outline" size={50} color="#EC9A15" style={{ marginBottom: 12 }} />
          <Text style={styles.topTitle}>How can we help you?</Text>
          <Text style={styles.topDesc}>
            Humari team aapki poori madad karne ke liye taiyar hai. Neeche diye gaye FAQs dekhein ya direct chat karein.
          </Text>
        </View>

        {}
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactCard} onPress={handleWhatsAppSupport} activeOpacity={0.8}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(37, 211, 102, 0.2)' }]}>
              <FontAwesome5 name="whatsapp" size={24} color="#25D366" />
            </View>
            <Text style={styles.contactName}>Chat via WhatsApp</Text>
            <Text style={styles.contactSub}>Fastest Response</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleEmailSupport} activeOpacity={0.8}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(29, 161, 242, 0.2)' }]}>
              <Ionicons name="mail-outline" size={24} color="#1DA1F2" />
            </View>
            <Text style={styles.contactName}>Email Support</Text>
            <Text style={styles.contactSub}>Reply within 24 hrs</Text>
          </TouchableOpacity>
        </View>

        {}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqContainer}>
          {faqsData.map((faq) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqHeader} 
                  onPress={() => toggleFaq(faq.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons 
                    name={isOpen ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#EC9A15" 
                  />
                </TouchableOpacity>
                {isOpen && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
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
  topCard: {
    backgroundColor: "#252525",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.2)",
  },
  topTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  topDesc: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  contactContainer: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 28,
  },
  contactCard: {
    flex: 1,
    backgroundColor: "#252525",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.15)",
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  contactName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  contactSub: {
    color: "#888",
    fontSize: 11,
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: "#252525",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.15)",
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
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  faqAnswer: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
});