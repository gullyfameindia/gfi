import React, { useState, useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path } from "react-native-svg";
import PhoneMessageIcon from "@components/ui/PhoneMessageIcon";
import { authService } from "@api/services/authService";
import { saveUserSession } from "@utils/userSession";

const { width, height } = Dimensions.get("window");

export default function VerifyOtp() {
  const params = useLocalSearchParams();
  const txnId = params.txnId ? String(params.txnId) : "";
  const email = params.email ? decodeURIComponent(String(params.email)) : "";
  const fromForgotPassword = params.fromForgotPassword === "true";
  const fromRoleChange = params.fromRoleChange === "true";
  const fromEmailChange = params.fromEmailChange === "true";
  const fromMobileChange = params.fromMobileChange === "true";
  const newRole = params.newRole ? String(params.newRole) : "";

  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [currentTxnId, setCurrentTxnId] = useState(txnId);

  const getMaskedEmailOrMobile = () => {
    if (!email || email.length < 4) {
      return "******123";
    }
    if (email.includes("@")) {
      const [localPart, domain] = email.split("@");
      const maskedLocal = localPart.length > 2 
        ? localPart.slice(0, 2) + "*".repeat(localPart.length - 2)
        : "**";
      return `${maskedLocal}@${domain}`;
    } else {
      const lastDigits = email.slice(-4);
      const maskedLength = email.length - 4;
      const masked = "*".repeat(maskedLength);
      return `${masked}${lastDigits}`;
    }
  };

  useEffect(() => {
    
    setSuccessMessage("OTP has been sent to your number");
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleResendOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsResending(true);

    try {
      if (__DEV__) {
        console.log('\n📱 ========== RESEND OTP REQUEST ==========');
        console.log('UserId (email or mobile):', email);
        console.log('==========================================\n');
      }

      const result = await authService.resendOtp(email);

      if (result.success) {
        if (__DEV__) {
          console.log('✅ OTP resent successfully');
          console.log('New TxnId:', result.data?.txnId);
        }

        if (result.data?.txnId) {
          setCurrentTxnId(result.data.txnId);
        }

        setOtp("");
        setSuccessMessage("A new verification code has been sent.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      } else {
        const errorMsg = result.error || "Failed to resend OTP. Please try again.";
        setErrorMessage(errorMsg);

        if (__DEV__) {
          console.error('❌ Resend OTP failed:', errorMsg);
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || "Something went wrong. Please try again.";
      setErrorMessage(errorMsg);

      if (__DEV__) {
        console.error('❌ Resend OTP exception:', error);
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleValidate = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    
    if (!otp || otp.length !== 6) {
      setErrorMessage("Please enter the 6-digit code sent to your phone.");
      return;
    }

    const activeTxnId = currentTxnId || txnId;
    
    if (!activeTxnId) {
      setErrorMessage("Transaction ID is missing. Please try logging in again.");
      return;
    }
    
    setIsLoading(true);

    try {
      const isEmail = email.includes("@");
      const identifier = email.trim().toLowerCase();

      if (__DEV__) {
        console.log('\n🚀 ========== STARTING OTP VERIFICATION ==========');
        console.log('Login Method:', isEmail ? 'Email + OTP' : 'Mobile + OTP');
        console.log('Identifier:', identifier);
        console.log('TxnId:', activeTxnId);
        console.log('OTP:', otp);
        console.log('Note: This maps to the same user account as password login');
        console.log('=============================================\n');
      }

      const verifyOtpData = {
        txnId: activeTxnId,
        otp: otp,
      };

      if (__DEV__) {
        console.log('\n📋 ========== VERIFY OTP DATA PREPARATION ==========');
        console.log('TxnId from params:', txnId);
        console.log('Email from params:', email);
        console.log('Data being sent to verifyOtp:', JSON.stringify(verifyOtpData, null, 2));
        console.log('Keys in verifyOtpData:', Object.keys(verifyOtpData));
        console.log('Has txnId key:', 'txnId' in verifyOtpData);
        console.log('==================================================\n');
      }

      const result = await authService.verifyOtp(verifyOtpData);

      if (result.success) {
        if (__DEV__) {
          console.log('\n✅ ========== OTP VERIFICATION SUCCESS ==========');
          console.log('Full Result:', JSON.stringify(result, null, 2));
          console.log('Result Data:', JSON.stringify(result.data, null, 2));
          console.log('From Forgot Password:', fromForgotPassword);
          console.log('===========================================\n');
        }

        if (fromForgotPassword) {
          setSuccessMessage("OTP verified successfully! You can now reset your password.");
          if (__DEV__) {
            console.log('⚠️ Forgot password flow: NOT saving session, but keeping token for reset password API');
            console.log('Token will be used for reset password endpoint');
          }
          
          router.replace(`/auth/resetpassword?email=${encodeURIComponent(identifier)}` as any);
          return;
        }

        
        if (fromRoleChange && newRole) {
          if (__DEV__) {
            console.log('✅ OTP verified for role change');
            console.log('New Role:', newRole);
          }

          setSuccessMessage("OTP verified successfully! Updating your role...");
          
          
          setTimeout(() => {
            router.replace({
              pathname: "/(main)/account-center",
              params: {
                roleChangeVerified: "true",
                newRole: newRole,
              },
            } as any);
          }, 1000);
          return;
        }

        
        if (fromEmailChange) {
          if (__DEV__) {
            console.log('✅ OTP verified for email change');
            console.log('New Email:', email);
          }

          setSuccessMessage("OTP verified successfully! Your email has been updated.");
          
          setTimeout(() => {
            router.replace({
              pathname: "/(main)/account-center",
              params: {
                emailChangeVerified: "true",
                newEmail: encodeURIComponent(email), 
              },
            } as any);
          }, 1000);
          return;
        }

        
        if (fromMobileChange) {
          if (__DEV__) {
            console.log('✅ OTP verified for mobile change');
            console.log('New Mobile:', email); 
          }

          setSuccessMessage("OTP verified successfully! Your mobile number has been updated.");
          
          setTimeout(() => {
            router.replace({
              pathname: "/(main)/account-center",
              params: {
                mobileChangeVerified: "true",
                newMobile: encodeURIComponent(email), 
              },
            } as any);
          }, 1000);
          return;
        }

        setSuccessMessage("OTP verified successfully!");
        
        if (!result.data?.token) {
          setErrorMessage("OTP verification failed: No token received from server.");
          return;
        }

        let userData = result.data?.user;
        
        if (__DEV__) {
          console.log('\n🔍 ========== EXTRACTING USER DATA ==========');
          console.log('Step 1 - Check result.data.user:', JSON.stringify(result.data?.user, null, 2));
          console.log('Step 2 - Check result.data directly:', JSON.stringify(result.data, null, 2));
          console.log('Step 3 - Check all possible locations...');
        }
        
        if (!userData && result.data && typeof result.data === 'object') {
          if (__DEV__) {
            console.log('⚠️ User data not in result.data.user, checking alternative locations...');
            console.log('Checking if user fields are directly in result.data...');
            console.log('Has email:', !!(result.data as any).email);
            console.log('Has firstName:', !!(result.data as any).firstName);
            console.log('Has lastName:', !!(result.data as any).lastName);
            console.log('Has mobile:', !!(result.data as any).mobile);
          }
          
          if ((result.data as any).email || (result.data as any).firstName || (result.data as any).mobile) {
            userData = {
              id: (result.data as any).id || (result.data as any).userId || "",
              email: (result.data as any).email || "",
              firstName: (result.data as any).firstName || "",
              lastName: (result.data as any).lastName || "",
              mobile: (result.data as any).mobile || "",
              role: (result.data as any).role || "participant",
            };
            if (__DEV__) {
              console.log('✅ Found user data directly in result.data');
              console.log('Extracted User Data:', JSON.stringify(userData, null, 2));
            }
          }
        }

        if (__DEV__) {
          console.log('\n📤 ========== FINAL USER DATA TO SAVE ==========');
          console.log('User Data:', JSON.stringify(userData, null, 2));
          console.log('Has User Data:', !!userData);
          console.log('Fallback Email:', isEmail ? identifier : undefined);
          console.log('Fallback Mobile:', !isEmail ? identifier : undefined);
          console.log('==========================================\n');
        }

        await saveUserSession(
          result.data.token,
          userData || undefined,
          isEmail ? identifier : undefined,
          !isEmail ? identifier : undefined
        );

        await AsyncStorage.setItem("accountCreatedVia", "normal");

        router.replace("/auth/location");
    } else {
        const errorMsg = result.data?.message || result.error || "OTP verification failed. Please try again.";
        
        let displayError = errorMsg;
        if (errorMsg.toLowerCase().includes("invalid")) {
          displayError = "Invalid OTP. Please check and try again.";
        } else if (errorMsg.toLowerCase().includes("expired")) {
          displayError = "OTP has expired. Please request a new one.";
        } else if (errorMsg.toLowerCase().includes("mismatch")) {
          displayError = "OTP mismatch. Please enter the correct code.";
        }
        
        setErrorMessage(displayError);

        if (__DEV__) {
          console.error('\n❌ ========== OTP VERIFICATION FAILED ==========');
          console.error('Error:', errorMsg);
          console.error('==========================================\n');
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || "Something went wrong. Please try again.";
      setErrorMessage(errorMsg);

      if (__DEV__) {
        console.error('\n❌ ========== OTP VERIFICATION EXCEPTION ==========');
        console.error('Exception:', error);
        console.error('==============================================\n');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path
              d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z"
              fill="#263238"
            />
          </Svg>
        </TouchableOpacity>

        {}
        <Text style={[styles.title, { fontFamily: "PlayfairDisplay_600SemiBold" }]}>
          Verify Mobile Number
        </Text>
        <Text style={styles.subtitle}>
          We have sent verification code to your mobile number
        </Text>

        {}
        <View style={styles.iconContainer}>
          <PhoneMessageIcon width={80} height={73} />
        </View>

        {}
        <Text style={styles.instructionTitle}>Enter a verification code</Text>
        <Text style={styles.instructionSubtitle}>
          A verification code was sent to {getMaskedEmailOrMobile()}
        </Text>

        {}
        <View style={styles.otpContainer}>
        <View style={styles.otpRow}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.otpBox,
                otp[index] && styles.otpBoxFilled
              ]}
            >
              <Text style={styles.otpBoxText}>{otp[index] || ""}</Text>
            </View>
          ))}
        </View>

          {}
        <TextInput
          value={otp}
          onChangeText={(value) => setOtp(value.replace(/[^0-9]/g, "").slice(0, 6))}
          keyboardType="number-pad"
          style={styles.hiddenInput}
          maxLength={6}
            autoFocus={true}
            editable={true}
            caretHidden={true}
        />
        </View>
        {}
        <TouchableOpacity 
          style={[styles.resendButton, isResending && styles.resendButtonDisabled]} 
          activeOpacity={0.7} 
          onPress={handleResendOtp}
          disabled={isResending}
        >
          {isResending ? (
            <ActivityIndicator color="#F59E0B" />
          ) : (
            <Text style={styles.resendText}>Resend OTP</Text>
          )}
        </TouchableOpacity>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {successMessage ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        {}
        <TouchableOpacity 
          style={[styles.validateButton, isLoading && styles.validateButtonDisabled]} 
          activeOpacity={0.85} 
          onPress={handleValidate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
          <Text style={styles.validateButtonText}>Validate OTP</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: height * 0.06,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.6)",
    lineHeight: 20,
    marginBottom: 40,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  instructionTitle: {
    fontSize: 22,
    fontWeight: "400",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },
  instructionSubtitle: {
    fontSize: 10,
    color: "rgba(0, 0, 0, 0.6)",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 32,
    fontFamily: "Inter_400Regular",
  },
  otpContainer: {
    position: "relative",
    marginBottom: 32,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  otpBox: {
    width: width * 0.12,
    height: width * 0.14,
    borderWidth: 1,
    borderColor: "#999999",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  otpBoxFilled: {
    borderColor: "#999999",
  },
  otpBoxText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    fontSize: 1,
    color: "transparent",
    zIndex: 10,
  },
  resendButton: {
    alignItems: "center",
    marginBottom: 220,
    paddingVertical: 8,
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendText: {
    color: "#F59E0B",
    fontWeight: "600",
    fontSize: 15,
  },
  validateButton: {
    backgroundColor: "#3C2610",
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  validateButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  validateButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Inter_500Medium",
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderColor: "#DC2626",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: "#D1FAE5",
    borderColor: "#10B981",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  successText: {
    color: "#10B981",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
});