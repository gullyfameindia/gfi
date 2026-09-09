

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C2610" />

      {}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.lastUpdated}>Last Updated: July 2026</Text>

        <View style={styles.policyCard}>
          {}
          <Text style={styles.sectionHeading}>1. Introduction</Text>
          <Text style={styles.policyText}>
            Welcome to Gully Fame. Hum aapki privacy ka poora sammaan karte hain. Yeh Privacy Policy aapko batati hai ki jab aap humari mobile application use karte hain, toh hum aapki kaun si information collect karte hain aur usko kaise secure rakhte hain.
          </Text>

          {}
          <Text style={styles.sectionHeading}>2. Information We Collect</Text>
          <Text style={styles.policyText}>
            Hum niche di gayi details collect kar sakte hain taaki aapko app ka best experience mil sake:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Personal Data:</Text> Name, email address, mobile number, aur profile picture jab aap sign-up karte hain.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>User Content:</Text> Jo videos, reels, aur comments aap app par upload ya share karte hain.</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Device Data:</Text> IP address, device type, operating system, aur app usage statistics.</Text>

          {}
          <Text style={styles.sectionHeading}>3. How We Use Your Information</Text>
          <Text style={styles.policyText}>
            Collect ki gayi information ka use hum in cheezon ke liye karte hain:
          </Text>
          <Text style={styles.bulletPoint}>• Aapka account manage karne aur profile setup ke liye.</Text>
          <Text style={styles.bulletPoint}>• Competitions aur leaderboards ko transparently chalane ke liye.</Text>
          <Text style={styles.bulletPoint}>• Referral rewards aur wallet balances ko calculate aur credit karne ke liye.</Text>
          <Text style={styles.bulletPoint}>• App ki performance improve karne aur bugs fix karne ke liye.</Text>

          {}
          <Text style={styles.sectionHeading}>4. Data Security</Text>
          <Text style={styles.policyText}>
            Aapka data humare liye bohot keemti hai. Hum aapke personal information ko unauthorized access, alteration, ya disclosure se bachane ke liye industry-standard security encryption aur firewalls ka use karte hain.
          </Text>

          {}
          <Text style={styles.sectionHeading}>5. Third-Party Services</Text>
          <Text style={styles.policyText}>
            Hum kuch trusted third-party services (jaise analytics tools ya payment gateways) ka use kar sakte hain. In third-party vendors ke paas aapke data ka limited access hota hai aur woh isko kisi aur purpose ke liye use nahi kar sakte.
          </Text>

          {}
          <Text style={styles.sectionHeading}>6. Changes to this Policy</Text>
          <Text style={styles.policyText}>
            Hum time-to-time is Privacy Policy ko update kar sakte hain. Jab bhi koi bada badlav hoga, hum aapko app notification ya email ke throw inform kar denge. App ka lagatar use karna yeh darshata hai ki aap nayi policy se sahmat hain.
          </Text>

          {}
          <Text style={styles.sectionHeading}>7. Contact Us</Text>
          <Text style={styles.policyText}>
            Agar aapke paas is Privacy Policy ko lekar koi sawal ya shikayat hai, toh aap hume kabhi bhi mail kar sakte hain:
          </Text>
          <Text style={styles.emailText}>privacy@gullyfame.com</Text>
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
  lastUpdated: {
    color: "#EC9A15",
    fontSize: 13,
    marginBottom: 16,
    textAlign: "right",
    fontWeight: "500",
    paddingHorizontal: 4,
  },
  policyCard: {
    backgroundColor: "#252525",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.15)",
  },
  sectionHeading: {
    color: "#EC9A15", 
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  policyText: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
    textAlign: "justify",
  },
  bulletPoint: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 22,
    paddingLeft: 10,
    marginBottom: 6,
  },
  boldText: {
    color: "#fff",
    fontWeight: "600",
  },
  emailText: {
    color: "#EC9A15",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    textDecorationLine: "underline",
  },
});