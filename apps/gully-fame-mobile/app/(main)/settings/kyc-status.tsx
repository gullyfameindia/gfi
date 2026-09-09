

import React, { useState } from "react";
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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";


export default function KYCStatusScreen() {
  
  const [status, setStatus] = useState<"unverified" | "pending" | "verified" | "rejected">("pending");

  const renderStatusCard = () => {
    switch (status) {
      case "pending":
        return (
          <LinearGradient
            colors={['rgba(236, 154, 21, 0.15)', 'rgba(236, 154, 21, 0.05)']}
            style={[styles.statusCard, { borderColor: '#EC9A15' }]}
          >
            <View style={styles.iconGlowPending}>
              <MaterialCommunityIcons name="clock-fast" size={48} color="#EC9A15" />
            </View>
            <Text style={styles.statusTitle}>Verification Pending</Text>
            <Text style={styles.statusDesc}>
              Aapke documents humari team review kar rahi hai. Isme aamtaur par 24-48 ghante lagte hain.
            </Text>
          </LinearGradient>
        );
      case "verified":
        return (
          <LinearGradient
            colors={['rgba(37, 211, 102, 0.15)', 'rgba(37, 211, 102, 0.05)']}
            style={[styles.statusCard, { borderColor: '#25D366' }]}
          >
            <View style={styles.iconGlowVerified}>
              <MaterialCommunityIcons name="shield-check" size={48} color="#25D366" />
            </View>
            <Text style={styles.statusTitle}>Fully Verified</Text>
            <Text style={styles.statusDesc}>
              Congratulations! Aapka account verified hai. Ab aap bina kisi limit ke withdrawals kar sakte hain.
            </Text>
          </LinearGradient>
        );
      case "rejected":
        return (
          <LinearGradient
            colors={['rgba(255, 68, 68, 0.15)', 'rgba(255, 68, 68, 0.05)']}
            style={[styles.statusCard, { borderColor: '#ff4444' }]}
          >
            <View style={styles.iconGlowRejected}>
              <MaterialCommunityIcons name="shield-alert" size={48} color="#ff4444" />
            </View>
            <Text style={styles.statusTitle}>Verification Failed</Text>
            <Text style={styles.statusDesc}>
              Aapke documents clear nahi the ya details mismatch ho rahi thi. Kripya dobara submit karein.
            </Text>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>Re-Submit Documents</Text>
            </TouchableOpacity>
          </LinearGradient>
        );
      default:
        return (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
            style={[styles.statusCard, { borderColor: '#666' }]}
          >
            <View style={styles.iconGlowUnverified}>
              <MaterialCommunityIcons name="shield-off-outline" size={48} color="#ccc" />
            </View>
            <Text style={styles.statusTitle}>Account Unverified</Text>
            <Text style={styles.statusDesc}>
              Apni winnings ko bank me withdraw karne ke liye aapko apni KYC puri karni hogi.
            </Text>
            <TouchableOpacity 
              style={styles.actionButtonGold} 
              activeOpacity={0.8}
              onPress={() => setStatus("pending")} 
            >
              <Text style={styles.actionButtonTextGold}>Start Verification</Text>
            </TouchableOpacity>
          </LinearGradient>
        );
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
        <Text style={styles.headerTitle}>KYC Verification</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {}
        <View style={styles.securityBanner}>
          <FontAwesome5 name="lock" size={14} color="#25D366" />
          <Text style={styles.securityText}>Bank-grade 256-bit encryption. Your data is 100% secure.</Text>
        </View>

        {}
        {renderStatusCard()}

        {}
        <Text style={styles.sectionTitle}>Verification Steps</Text>
        
        <View style={styles.stepsContainer}>
          {}
          <View style={styles.stepRow}>
            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, styles.stepDotCompleted]}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
              <View style={[styles.stepLine, styles.stepLineCompleted]} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Mobile Verification</Text>
              <Text style={styles.stepDesc}>OTP verified successfully</Text>
            </View>
          </View>

          {}
          <View style={styles.stepRow}>
            <View style={styles.stepIndicator}>
              <View style={[
                styles.stepDot, 
                status === 'verified' || status === 'pending' ? styles.stepDotCompleted : styles.stepDotPending
              ]}>
                {status === 'verified' || status === 'pending' ? (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                ) : (
                  <Text style={styles.stepNumber}>2</Text>
                )}
              </View>
              <View style={[
                styles.stepLine, 
                status === 'verified' || status === 'pending' ? styles.stepLineCompleted : styles.stepLinePending
              ]} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Identity Document</Text>
              <Text style={styles.stepDesc}>
                {status === 'verified' ? 'PAN/Aadhaar verified' : status === 'pending' ? 'Document under review' : 'Upload PAN or Aadhaar card'}
              </Text>
            </View>
          </View>

          {}
          <View style={styles.stepRow}>
            <View style={styles.stepIndicator}>
              <View style={[
                styles.stepDot, 
                status === 'verified' ? styles.stepDotCompleted : styles.stepDotPending
              ]}>
                {status === 'verified' ? (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                ) : (
                  <Text style={styles.stepNumber}>3</Text>
                )}
              </View>
            </View>
            <View style={[styles.stepContent, { paddingBottom: 0 }]}>
              <Text style={styles.stepTitle}>Selfie Verification</Text>
              <Text style={styles.stepDesc}>
                {status === 'verified' ? 'Face matched successfully' : 'Take a live selfie to match document'}
              </Text>
            </View>
          </View>
        </View>

        {}
        <TouchableOpacity style={styles.supportLink} onPress={() => router.push("/(main)/settings/help-support" as any)}>
          <Text style={styles.supportText}>Need help with verification? <Text style={styles.supportHighlight}>Contact Support</Text></Text>
        </TouchableOpacity>

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
  securityBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(37, 211, 102, 0.1)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(37, 211, 102, 0.2)",
    gap: 8,
  },
  securityText: {
    color: "#25D366",
    fontSize: 12,
    fontWeight: "600",
  },
  statusCard: {
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 30,
  },
  iconGlowPending: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(236, 154, 21, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(236, 154, 21, 0.3)",
  },
  iconGlowVerified: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(37, 211, 102, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(37, 211, 102, 0.3)",
  },
  iconGlowRejected: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 68, 68, 0.3)",
  },
  iconGlowUnverified: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statusTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statusDesc: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  actionButtonGold: {
    backgroundColor: "#EC9A15",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#EC9A15",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonTextGold: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  stepsContainer: {
    backgroundColor: "#252525",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(236, 154, 21, 0.1)",
  },
  stepRow: {
    flexDirection: "row",
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: 16,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  stepDotCompleted: {
    backgroundColor: "#25D366",
  },
  stepDotPending: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#666",
  },
  stepNumber: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "bold",
  },
  stepLine: {
    width: 2,
    height: 40,
    marginVertical: 4,
  },
  stepLineCompleted: {
    backgroundColor: "#25D366",
  },
  stepLinePending: {
    backgroundColor: "#444",
  },
  stepContent: {
    flex: 1,
    paddingBottom: 24,
  },
  stepTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  stepDesc: {
    color: "#999",
    fontSize: 13,
  },
  supportLink: {
    marginTop: 30,
    alignItems: "center",
  },
  supportText: {
    color: "#aaa",
    fontSize: 14,
  },
  supportHighlight: {
    color: "#EC9A15",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});