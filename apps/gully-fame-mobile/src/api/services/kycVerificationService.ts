





import apiClient from "../axios";
import { ApiResponse } from "../types";
import * as FileSystem from "expo-file-system";

export interface KYCDocument {
  type: "aadhar" | "pan" | "driving_license" | "passport";
  frontImageUri: string;
  backImageUri?: string;
  documentNumber: string;
}

export interface KYCSubmitRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  documents: KYCDocument[];
}

export interface KYCStatus {
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
  documents: {
    type: string;
    status: "pending" | "approved" | "rejected";
  }[];
}





export async function uploadKYCDocument(
  documentType: string,
  imageUri: string,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<{ documentId: string; url: string }>> {
  try {
    console.log("[kycVerificationService] Uploading KYC document:", documentType);

    
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      throw new Error("Document image not found");
    }

    
    const formData = new FormData();
    formData.append("document", {
      uri: imageUri,
      type: "image/jpeg",
      name: `kyc_${documentType}_${Date.now()}.jpg`,
    } as any);
    formData.append("documentType", documentType);

    
    const response = await apiClient.post<any>("kyc/upload-document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress?.(percentage);
      },
    });

    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: {
          documentId: responseData.data.documentId || responseData.data.id,
          url: responseData.data.url,
        },
        message: "Document uploaded successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Upload failed",
      error: "API returned unsuccessful response",
      data: { documentId: "", url: "" },
    };
  } catch (error: any) {
    console.error("[kycVerificationService] Upload error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to upload document",
      error: error.message,
      data: { documentId: "", url: "" },
    };
  }
}






export async function submitKYCVerification(
  request: KYCSubmitRequest
): Promise<ApiResponse<{ kycId: string; status: string }>> {
  try {
    console.log("[kycVerificationService] POST user/kyc");

    
    const uploadedDocuments = [];
    for (const doc of request.documents) {
      
      const frontResult = await uploadKYCDocument(`${doc.type}_front`, doc.frontImageUri);

      if (!frontResult.success) {
        throw new Error(`Failed to upload ${doc.type} front image`);
      }

      uploadedDocuments.push({
        type: doc.type,
        frontDocumentId: frontResult.data.documentId,
        documentNumber: doc.documentNumber,
      });

      
      if (doc.backImageUri) {
        const backResult = await uploadKYCDocument(`${doc.type}_back`, doc.backImageUri);

        if (!backResult.success) {
          throw new Error(`Failed to upload ${doc.type} back image`);
        }

        uploadedDocuments[uploadedDocuments.length - 1].backDocumentId = backResult.data.documentId;
      }
    }

    
    const payload = {
      firstName: request.firstName,
      lastName: request.lastName,
      dateOfBirth: request.dateOfBirth,
      address: request.address,
      city: request.city,
      state: request.state,
      pincode: request.pincode,
      documents: uploadedDocuments,
    };

    const response = await apiClient.post<any>("user/kyc", payload);
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: {
          kycId: responseData.data.kycId || responseData.data.id,
          status: responseData.data.status || "pending",
        },
        message: responseData.message || "KYC submitted successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "KYC submission failed",
      error: "API returned unsuccessful response",
      data: { kycId: "", status: "failed" },
    };
  } catch (error: any) {
    console.error("[kycVerificationService] POST user/kyc error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to submit KYC",
      error: error.message,
      data: { kycId: "", status: "error" },
    };
  }
}






export async function getKYCStatus(): Promise<ApiResponse<KYCStatus>> {
  try {
    console.log("[kycVerificationService] GET user/kyc");

    const response = await apiClient.get<any>("user/kyc");
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      return {
        success: true,
        data: {
          status: responseData.data.status || "pending",
          submittedAt: responseData.data.submittedAt,
          approvedAt: responseData.data.approvedAt,
          rejectionReason: responseData.data.rejectionReason,
          documents: responseData.data.documents || [],
        },
        message: "Status retrieved successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to get status",
      error: "API returned unsuccessful response",
      data: {
        status: "pending",
        documents: [],
      },
    };
  } catch (error: any) {
    console.error("[kycVerificationService] GET user/kyc error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to get KYC status",
      error: error.message,
      data: {
        status: "error",
        documents: [],
      },
    };
  }
}






export async function updateKYCInformation(
  request: Partial<KYCSubmitRequest>
): Promise<ApiResponse<{ status: string }>> {
  try {
    console.log("[kycVerificationService] PUT user/kyc");

    const payload = {
      firstName: request.firstName,
      lastName: request.lastName,
      dateOfBirth: request.dateOfBirth,
      address: request.address,
      city: request.city,
      state: request.state,
      pincode: request.pincode,
    };

    
    const response = await apiClient.put<any>("user/kyc", payload);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      return {
        success: true,
        data: {
          status: responseData.data.status || "updated",
        },
        message: responseData.message || "KYC updated successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Update failed",
      error: "API returned unsuccessful response",
      data: { status: "failed" },
    };
  } catch (error: any) {
    console.error("[kycVerificationService] PUT user/kyc error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to update KYC",
      error: error.message,
      data: { status: "error" },
    };
  }
}





export async function resubmitKYC(
  request: KYCSubmitRequest
): Promise<ApiResponse<{ kycId: string; status: string }>> {
  try {
    console.log("[kycVerificationService] Resubmitting KYC");

    
    return await submitKYCVerification(request);
  } catch (error: any) {
    console.error("[kycVerificationService] Resubmit error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to resubmit KYC",
      error: error.message,
      data: { kycId: "", status: "error" },
    };
  }
}
