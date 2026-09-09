import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserKycStatus } from "../api/services/userService";
import { getCurrentUser } from "../api/services/userService";





export async function areAllKycStepsCompleted(): Promise<boolean> {
  try {
    
    const userResult = await getCurrentUser();
    const user = userResult.success ? userResult.data : null;

    
    const hasBio = user?.bio && user.bio.trim().length > 0;
    const hasImage = user?.profileImage && user.profileImage.length > 0;
    const hasDob = user?.dob && user.dob.trim().length > 0;
    const hasGender = user?.gender && user.gender.trim().length > 0;

    
    const faceScanDone = await AsyncStorage.getItem("faceScanDone");
    const hasFaceScan = faceScanDone === "true";

    
    const allCompleted = Boolean(hasBio && hasImage && hasDob && hasGender && hasFaceScan);

    if (__DEV__) {
      console.log("[kycValidation] KYC Steps Check:", {
        hasBio,
        hasImage,
        hasDob,
        hasGender,
        hasFaceScan,
        allCompleted,
      });
    }

    return allCompleted;
  } catch (error) {
    console.error("[kycValidation] Error checking KYC steps:", error);
    return false;
  }
}





export async function autoVerifyKycIfComplete(): Promise<boolean> {
  try {
    const allStepsCompleted = await areAllKycStepsCompleted();

    if (!allStepsCompleted) {
      if (__DEV__) {
        console.log("[kycValidation] Not all KYC steps completed, skipping auto-verification");
      }
      return false;
    }

    
    const kycResult = await getUserKycStatus();
    const currentStatus = kycResult.success && kycResult.data ? kycResult.data.status : null;

    
    if (currentStatus === "completed" || currentStatus === "approved") {
      if (__DEV__) {
        console.log("[kycValidation] KYC already completed/approved");
      }
      return true;
    }

    
    
    if (__DEV__) {
      console.log("[kycValidation] All steps completed, KYC should be automatically verified");
      console.log(
        '[kycValidation] Backend should set status to "completed" when all required fields are present'
      );
    }

    return true;
  } catch (error) {
    console.error("[kycValidation] Error in auto-verification:", error);
    return false;
  }
}






export async function isKycCompleted(): Promise<boolean> {
  try {
    
    const allStepsCompleted = await areAllKycStepsCompleted();

    if (allStepsCompleted) {
      
      await autoVerifyKycIfComplete();

      
      const result = await getUserKycStatus();

      if (result.success && result.data) {
        const status = result.data.status;
        
        return status === "completed" || status === "approved" || allStepsCompleted;
      }

      
      return allStepsCompleted;
    }

    
    const result = await getUserKycStatus();

    if (result.success && result.data) {
      const status = result.data.status;
      return status === "completed" || status === "approved";
    }

    return false;
  } catch (error) {
    console.error("[kycValidation] Error checking KYC status:", error);
    return false;
  }
}






export async function getFirstIncompleteStep(): Promise<string | null> {
  try {
    const userResult = await getCurrentUser();
    const user = userResult.success ? userResult.data : null;

    
    const hasDob = user?.dob && user.dob.trim().length > 0;
    if (!hasDob) return "dob";

    const hasGender = user?.gender && user.gender.trim().length > 0;
    if (!hasGender) return "gender";

    const hasBio = user?.bio && user.bio.trim().length > 0;
    if (!hasBio) return "bio";

    const hasImage = user?.profileImage && user.profileImage.length > 0;
    if (!hasImage) return "image";

    const faceScanDone = await AsyncStorage.getItem("faceScanDone");
    const hasFaceScan = faceScanDone === "true";
    if (!hasFaceScan) return "faceScan";

    
    return null;
  } catch (error) {
    console.error("[kycValidation] Error getting incomplete step:", error);
    return "dob"; 
  }
}






export async function validateKycBeforeCompetition(): Promise<boolean> {
  const isCompleted = await isKycCompleted();

  if (!isCompleted) {
    Alert.alert(
      "KYC Verification Required",
      "Please complete your KYC verification to participate in competitions."
    );
    return false;
  }

  return true;
}
