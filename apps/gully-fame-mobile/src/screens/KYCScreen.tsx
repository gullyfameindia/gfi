// Created by Kiro - KYC Verification Screen
// Handles KYC document submission and verification status display

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { kycService, KYCStatus, KYCSubmissionData } from "../api/services/kycService";

interface KYCScreenProps {
  navigation?: any;
}

// ✅ CREATED BY KIRO - KYC Screen Component
const KYCScreen: React.FC<KYCScreenProps> = ({ navigation }) => {
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [documentType, setDocumentType] = useState<string>("aadhar");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [frontImageUri, setFrontImageUri] = useState<string | null>(null);
  const [backImageUri, setBackImageUri] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ CREATED BY KIRO - Fetch KYC status on component mount
  useEffect(() => {
    fetchKYCStatus();
  }, []);

  // ✅ CREATED BY KIRO - Fetch current KYC status
  const fetchKYCStatus = async () => {
    try {
      setLoading(true);
      const response = await kycService.getKYCStatus();

      if (response.success && response.data) {
        setKycStatus(response.data);
        console.log("[KYCScreen] KYC status fetched:", response.data.status);
      } else {
        console.error("[KYCScreen] Failed to fetch KYC status:", response.message);
      }
    } catch (error) {
      console.error("[KYCScreen] Error fetching KYC status:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CREATED BY KIRO - Handle document upload
  const handleUploadDocument = async () => {
    if (!documentNumber.trim()) {
      Alert.alert("Error", "Please enter document number");
      return;
    }

    if (!frontImageUri) {
      Alert.alert("Error", "Please select front image");
      return;
    }

    try {
      setSubmitting(true);
      const response = await kycService.uploadDocument(
        documentType,
        documentNumber,
        frontImageUri,
        backImageUri || undefined,
        (progress) => {
          setUploadProgress(progress.percentage);
        }
      );

      if (response.success) {
        Alert.alert("Success", "Document uploaded successfully");
        setDocumentNumber("");
        setFrontImageUri(null);
        setBackImageUri(null);
        setUploadProgress(0);
        // Refresh KYC status
        await fetchKYCStatus();
      } else {
        Alert.alert("Error", response.message || "Failed to upload document");
      }
    } catch (error) {
      console.error("[KYCScreen] Upload error:", error);
      Alert.alert("Error", "Failed to upload document");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ CREATED BY KIRO - Handle KYC submission
  const handleSubmitKYC = async () => {
    try {
      setSubmitting(true);

      const kycData: KYCSubmissionData = {
        firstName: "User",
        lastName: "Name",
        dateOfBirth: "1990-01-01",
        gender: "male",
        address: "123 Main Street",
        city: "City",
        state: "State",
        pincode: "123456",
        country: "India",
        documents: [],
      };

      const response = await kycService.submitKYC(kycData);

      if (response.success) {
        Alert.alert("Success", "KYC submitted successfully");
        await fetchKYCStatus();
      } else {
        Alert.alert("Error", response.message || "Failed to submit KYC");
      }
    } catch (error) {
      console.error("[KYCScreen] Submit error:", error);
      Alert.alert("Error", "Failed to submit KYC");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ CREATED BY KIRO - Render status badge
  const renderStatusBadge = (status: string) => {
    let backgroundColor = "#FFA500";
    let textColor = "#FFFFFF";

    switch (status) {
      case "approved":
        backgroundColor = "#4CAF50";
        break;
      case "rejected":
        backgroundColor = "#F44336";
        break;
      case "under_review":
        backgroundColor = "#2196F3";
        break;
      case "pending":
        backgroundColor = "#FFA500";
        break;
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor }]}>
        <Text style={[styles.statusText, { color: textColor }]}>{status.toUpperCase()}</Text>
      </View>
    );
  };

  // ✅ CREATED BY KIRO - Render loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading KYC Status...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>KYC Verification</Text>
        <Text style={styles.subtitle}>Complete your identity verification</Text>
      </View>

      {/* Current Status */}
      {kycStatus && (
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Current Status</Text>
          {renderStatusBadge(kycStatus.status)}

          {kycStatus.verificationPercentage !== undefined && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>
                Verification Progress: {kycStatus.verificationPercentage}%
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${kycStatus.verificationPercentage}%` }]}
                />
              </View>
            </View>
          )}

          {kycStatus.rejectionReason && (
            <View style={styles.rejectionContainer}>
              <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
              <Text style={styles.rejectionText}>{kycStatus.rejectionReason}</Text>
            </View>
          )}
        </View>
      )}

      {/* Document Upload Section */}
      {(!kycStatus || kycStatus.status === "rejected" || kycStatus.status === "pending") && (
        <View style={styles.uploadCard}>
          <Text style={styles.cardTitle}>Upload Documents</Text>

          {/* Document Type Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Document Type</Text>
            <View style={styles.documentTypeContainer}>
              {["aadhar", "pan", "passport"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.documentTypeButton,
                    documentType === type && styles.documentTypeButtonActive,
                  ]}
                  onPress={() => setDocumentType(type)}
                >
                  <Text
                    style={[
                      styles.documentTypeText,
                      documentType === type && styles.documentTypeTextActive,
                    ]}
                  >
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Document Number Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Document Number</Text>
            <View style={styles.input}>
              <Text style={styles.inputText}>{documentNumber || "Enter document number"}</Text>
            </View>
          </View>

          {/* Front Image Preview */}
          {frontImageUri && (
            <View style={styles.section}>
              <Text style={styles.label}>Front Image</Text>
              <Image source={{ uri: frontImageUri }} style={styles.imagePreview} />
            </View>
          )}

          {/* Back Image Preview */}
          {backImageUri && (
            <View style={styles.section}>
              <Text style={styles.label}>Back Image</Text>
              <Image source={{ uri: backImageUri }} style={styles.imagePreview} />
            </View>
          )}

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Upload Progress: {uploadProgress}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          )}

          {/* Upload Button */}
          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleUploadDocument}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Upload Document</Text>
            )}
          </TouchableOpacity>

          {/* Submit KYC Button */}
          <TouchableOpacity
            style={[styles.button, styles.submitButton, submitting && styles.buttonDisabled]}
            onPress={handleSubmitKYC}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Submit KYC</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Approved Status Message */}
      {kycStatus && kycStatus.status === "approved" && (
        <View style={styles.approvedCard}>
          <Text style={styles.approvedTitle}>✓ KYC Verified</Text>
          <Text style={styles.approvedText}>
            Your identity has been successfully verified. You can now access all features.
          </Text>
        </View>
      )}

      {/* Under Review Message */}
      {kycStatus && kycStatus.status === "under_review" && (
        <View style={styles.reviewCard}>
          <Text style={styles.reviewTitle}>⏳ Under Review</Text>
          <Text style={styles.reviewText}>
            Your KYC documents are being reviewed. This usually takes 24-48 hours.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  approvedCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  reviewCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressContainer: {
    marginTop: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  rejectionContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
  },
  rejectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#C62828",
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 12,
    color: "#D32F2F",
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  documentTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  documentTypeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginHorizontal: 4,
    alignItems: "center",
  },
  documentTypeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  documentTypeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  documentTypeTextActive: {
    color: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F9F9F9",
  },
  inputText: {
    fontSize: 14,
    color: "#666",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  approvedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 8,
  },
  approvedText: {
    fontSize: 14,
    color: "#388E3C",
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565C0",
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: "#1976D2",
  },
});

export default KYCScreen;
