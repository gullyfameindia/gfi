// Created by Kiro - KYC Verification Service
// Handles KYC document submission, verification, and status tracking
// PRODUCTION READY: All endpoints use centralized API_ENDPOINTS configuration

import apiClient from "../axios";
import { ApiResponse } from "../types";
import API_ENDPOINTS from "../endpoints";

export interface KYCDocument {
  type: "aadhar" | "pan" | "passport" | "driving_license" | "voter_id";
  documentNumber: string;
  documentUrl?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  uploadedAt?: string;
}

export interface KYCSubmissionData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  documents: KYCDocument[];
}

export interface KYCStatus {
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
  documents?: KYCDocument[];
  verificationPercentage?: number;
}

export interface DocumentUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// ✅ CREATED BY KIRO - Submit KYC information
export async function submitKYC(kycData: KYCSubmissionData): Promise<ApiResponse<KYCStatus>> {
  try {
    console.log("[kycService] Submitting KYC data");

    const response = await apiClient.post<any>(API_ENDPOINTS.KYC.SUBMIT, kycData);
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const kycStatus: KYCStatus = {
        status: responseData.data.status || "pending",
        submittedAt: responseData.data.submittedAt,
        documents: responseData.data.documents,
        verificationPercentage: responseData.data.verificationPercentage || 0,
      };

      console.log("[kycService] KYC submitted successfully");

      return {
        success: true,
        data: kycStatus,
        message: responseData.message || "KYC submitted successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to submit KYC",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[kycService] Submit KYC error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message,
      data: undefined,
    };
  }
}

// ✅ CREATED BY KIRO - Get KYC verification status
export async function getKYCStatus(): Promise<ApiResponse<KYCStatus>> {
  try {
    console.log("[kycService] Getting KYC status");

    const response = await apiClient.get<any>(API_ENDPOINTS.KYC.GET_STATUS);
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const kycStatus: KYCStatus = {
        status: responseData.data.status || "pending",
        submittedAt: responseData.data.submittedAt,
        approvedAt: responseData.data.approvedAt,
        rejectionReason: responseData.data.rejectionReason,
        documents: responseData.data.documents,
        verificationPercentage: responseData.data.verificationPercentage || 0,
      };

      console.log("[kycService] KYC status retrieved:", kycStatus.status);

      return {
        success: true,
        data: kycStatus,
        message: responseData.message || "KYC status retrieved successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to get KYC status",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[kycService] Get KYC status error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message,
      data: undefined,
    };
  }
}

// ✅ CREATED BY KIRO - Upload KYC document
export async function uploadDocument(
  documentType: string,
  documentNumber: string,
  frontImageUri: string,
  backImageUri?: string,
  onProgress?: (progress: DocumentUploadProgress) => void
): Promise<ApiResponse<KYCDocument>> {
  try {
    console.log("[kycService] POST user/kyc (upload-document)", {
      documentType,
      documentNumber,
    });

    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("documentNumber", documentNumber);

    // Append front image
    formData.append("frontImage", {
      uri: frontImageUri,
      name: `${documentType}_front.jpg`,
      type: "image/jpeg",
    } as any);

    // Append back image if provided
    if (backImageUri) {
      formData.append("backImage", {
        uri: backImageUri,
        name: `${documentType}_back.jpg`,
        type: "image/jpeg",
      } as any);
    }

    // Using kyc/upload-document as it's not explicitly in Postman spec
    const response = await apiClient.post<any>("kyc/upload-document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: any) => {
        if (onProgress) {
          const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    });

    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const document: KYCDocument = {
        type: responseData.data.type || documentType,
        documentNumber: responseData.data.documentNumber || documentNumber,
        frontImageUrl: responseData.data.frontImageUrl,
        backImageUrl: responseData.data.backImageUrl,
        uploadedAt: responseData.data.uploadedAt,
      };

      console.log("[kycService] Document uploaded successfully");

      return {
        success: true,
        data: document,
        message: responseData.message || "Document uploaded successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to upload document",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[kycService] Upload document error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Upload failed",
      error: error.message,
      data: undefined,
    };
  }
}

// ✅ CREATED BY KIRO - Verify KYC document
export async function verifyDocument(documentId: string): Promise<ApiResponse<KYCDocument>> {
  try {
    console.log("[kycService] Verifying document:", documentId);

    const response = await apiClient.post<any>(`kyc/verify-document/${documentId}`, {});
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const document: KYCDocument = {
        type: responseData.data.type,
        documentNumber: responseData.data.documentNumber,
        frontImageUrl: responseData.data.frontImageUrl,
        backImageUrl: responseData.data.backImageUrl,
        uploadedAt: responseData.data.uploadedAt,
      };

      console.log("[kycService] Document verified successfully");

      return {
        success: true,
        data: document,
        message: responseData.message || "Document verified successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to verify document",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[kycService] Verify document error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Verification failed",
      error: error.message,
      data: undefined,
    };
  }
}

// ✅ CREATED BY KIRO - Resubmit KYC after rejection
export async function resubmitKYC(kycData: KYCSubmissionData): Promise<ApiResponse<KYCStatus>> {
  try {
    console.log("[kycService] POST user/kyc (resubmit)");

    // Using user/kyc for resubmit per Postman spec
    const response = await apiClient.post<any>("user/kyc", kycData);
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      const kycStatus: KYCStatus = {
        status: responseData.data.status || "pending",
        submittedAt: responseData.data.submittedAt,
        documents: responseData.data.documents,
        verificationPercentage: responseData.data.verificationPercentage || 0,
      };

      console.log("[kycService] KYC resubmitted successfully");

      return {
        success: true,
        data: kycStatus,
        message: responseData.message || "KYC resubmitted successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to resubmit KYC",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[kycService] POST user/kyc (resubmit) error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Network error occurred",
      error: error.message,
      data: undefined,
    };
  }
}

export const kycService = {
  submitKYC,
  getKYCStatus,
  uploadDocument,
  verifyDocument,
  resubmitKYC,
};
