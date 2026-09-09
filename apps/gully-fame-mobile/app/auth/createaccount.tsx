import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleIcon,
  InstagramIcon,
  AppleIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/icons";
import { authService } from "@api/services/authService";
import { saveUserSession } from "@utils/userSession";

let GoogleSignin: any = null;
let statusCodes: any = null;
try {
  const googleSignIn = require("@react-native-google-signin/google-signin");
  GoogleSignin = googleSignIn.GoogleSignin;
  statusCodes = googleSignIn.statusCodes;
} catch (e) {
  console.warn("[createaccount] @react-native-google-signin not available (requires dev build):", (e as any)?.message);
}

const { width, height } = Dimensions.get("window");

export default function CreateAccount() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"participant" | "fan" | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isInstagramLoading, setIsInstagramLoading] = useState(false);

  
  

  
  
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || undefined;

  useEffect(() => {
    GoogleSignin.configure({ webClientId });
  }, []);
  
  

  
  useEffect(() => {
    const checkTermsAccepted = async () => {
      try {
        const accepted = await AsyncStorage.getItem("termsAccepted");
        if (accepted === "true") {
          setTermsAccepted(true);
        } else {
          setTermsAccepted(false);
        }
      } catch (error) {
        console.error("Error checking terms acceptance:", error);
      }
    };
    checkTermsAccepted();

    
    const interval = setInterval(checkTermsAccepted, 1000);
    return () => clearInterval(interval);
  }, []);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];

    if (pwd.length < 8) {
      errors.push("Minimum 8 characters");
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("At least 1 uppercase letter (A-Z)");
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push("At least 1 lowercase letter (a-z)");
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push("At least 1 number (0-9)");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      errors.push("At least 1 special character (! @ # $ % etc.)");
    }

    return errors;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.length > 0) {
      const errors = validatePassword(text);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }

    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text.length > 0 && text !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleCreateAccount = async () => {
    setErrorMessage("");
    setPasswordErrors([]);
    setConfirmPasswordError("");

    if (
      !firstName ||
      !lastName ||
      !mobileNo ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    const passwordValidationErrors = validatePassword(password);
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      setErrorMessage(
        "Password does not meet requirements. Please check the requirements below.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      setErrorMessage("Password and Confirm Password do not match.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("Please accept the Terms & Conditions to continue.");
      return;
    }

    setIsLoading(true);

    try {
      if (__DEV__) {
        console.log("\n🚀 ========== STARTING REGISTRATION ==========");
        console.log("Form Data:", {
          firstName,
          lastName,
          mobile: mobileNo,
          email,
          password: "***",
          role: role === "participant" ? "participants" : "fan",
        });
        console.log("=============================================\n");
      }

      if (!role) {
        setErrorMessage("Please select your role (Participant or Fan)");
        return;
      }

      const registerData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobile: mobileNo.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role:
          role === "participant"
            ? "participants"
            : ("fan" as "participants" | "fan"),
      };

      const result = await authService.registerUser(registerData);

      if (result.success) {
        if (__DEV__) {
          console.log("\n✅ ========== REGISTRATION SUCCESS ==========");
          console.log("Account created successfully");
          console.log("Navigating to Login screen");
          console.log("Email:", email);
          console.log("Mobile:", mobileNo);
          console.log("===========================================\n");
        }

        setErrorMessage("");
        setSuccessMessage("Account created successfully!");

        const backendRole =
          role === "participant"
            ? "participants"
            : role === "fan"
              ? "fan"
              : "participants";

        await AsyncStorage.multiSet([
          ["accountCreated", "true"],
          ["accountCreatedVia", "normal"],
          ["userRole", backendRole],
          ["userFirstName", firstName],
          ["userLastName", lastName],
          ["userEmail", email],
          ["userMobile", mobileNo],
          ["profileCompleted", "false"],
        ]);

        const query = [
          `role=${encodeURIComponent(role)}`,
          `firstName=${encodeURIComponent(firstName)}`,
          `lastName=${encodeURIComponent(lastName)}`,
          `email=${encodeURIComponent(email)}`,
        ].join("&");
        router.replace(`/onboarding/verify-id?${query}` as any);
      } else {
        const errorMsg =
          result.data?.message ||
          result.error ||
          "Registration failed. Please try again.";
        setErrorMessage(errorMsg);

        if (__DEV__) {
          console.error("\n❌ ========== REGISTRATION FAILED ==========");
          console.error("Error:", errorMsg);
          console.error("Status:", result.status);
          console.error("==========================================\n");
        }
      }
    } catch (error: any) {
      const errorMsg =
        error.message ||
        "Something went wrong while creating your account. Please try again.";
      setErrorMessage(errorMsg);

      if (__DEV__) {
        console.error("\n❌ ========== REGISTRATION EXCEPTION ==========");
        console.error("Exception:", error);
        console.error("==============================================\n");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceToken = async (): Promise<string> => {
    try {
      if (Platform.OS === "web") {
        return "web-device-token";
      }

      const token = await AsyncStorage.getItem("deviceToken");
      if (token) {
        return token;
      }

      const generatedToken = `device-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem("deviceToken", generatedToken);
      return generatedToken;
    } catch (error) {
      console.error("Error getting device token:", error);
      return `fallback-token-${Date.now()}`;
    }
  };

  const getDeviceType = (): "android" | "ios" | "web" | "" => {
    if (Platform.OS === "android") return "android";
    if (Platform.OS === "ios") return "ios";
    if (Platform.OS === "web") return "web";
    return "";
  };

  /**
   * Handle Google authentication response
   * Extracts tokens and prepares them for backend
   * Backend will decide: signup if new user, login if existing user
   */

  // Google Sign-In handler
  const handleGoogleLogin = async (
    iconType: "google" | "instagram" = "google",
  ) => {
    if (iconType !== "google") {
      setIsInstagramLoading(true);
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    setIsGoogleLoading(true);
    setIsSocialLoading(true);

    try {
      if (__DEV__) {
        console.log("\n🚀 ========== NATIVE GOOGLE LOGIN ==========");
      }

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();

      // Handle the new response types directly
      if (response.type === "cancelled") {
        setErrorMessage("Sign-in was cancelled");
        setIsGoogleLoading(false);
        setIsSocialLoading(false);
        return;
      }

      if (response.type !== "success") {
        setErrorMessage("Sign-in was not successful");
        setIsGoogleLoading(false);
        setIsSocialLoading(false);
        return;
      }
      const userInfo = response.data;
      const deviceToken = await getDeviceToken();
      const deviceType = getDeviceType();
      const socialLoginData = {
        googleId: userInfo.user.id,
        email: userInfo.user.email,
        firstName: userInfo.user.givenName || "",
        lastName: userInfo.user.familyName || "",
        device_token: deviceToken,
        device_type: deviceType as "android" | "ios" | "web" | "", // Type assertion to satisfy TS
      };
      if (__DEV__) {
        console.log("✅ Native Auth Success");
        console.log(
          "Token Data for Backend:",
          JSON.stringify(socialLoginData, null, 2),
        );
      }

      // TODO: Send tokenData to backend
      const result = await authService.socialLogin(socialLoginData);

      if (result.success) {
        // Social login response structure is slightly different, check your interface
        if (!result.data?.token) {
          setErrorMessage("Login failed: No token received from server.");
          return;
        }

        await saveUserSession(result.data.token, result.data.user);
        await AsyncStorage.setItem("accountCreatedVia", "google");

        setSuccessMessage("Google authentication successful!");
        router.replace("/auth/location");
      } else {
        setErrorMessage(
          result.error ||
            result.message ||
            "Google login failed on the server.",
        );
      }
    } catch (error: any) {
      if (__DEV__) console.error("❌ Native Auth Error:", error);

      // We only hit this block for actual system/network crashes now
      setErrorMessage(
        error.message || "A system error occurred during sign-in.",
      );
    } finally {
      setIsGoogleLoading(false);
      setIsSocialLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSocialLoading(true);

    try {
      if (__DEV__) {
        console.log("\n🚀 ========== APPLE LOGIN (CREATE ACCOUNT) ==========");
        console.log("Starting Apple authentication...");
        console.log("========================================\n");
      }

      const deviceToken = await getDeviceToken();
      const deviceType = getDeviceType();

      const appleId = "apple_user_id_here";
      const email = "user@icloud.com";
      const firstName = "Apple";
      const lastName = "User";

      if (__DEV__) {
        console.log(
          "⚠️ NOTE: Replace appleId, email, firstName, lastName with actual Apple OAuth data",
        );
        console.log(
          "You need to integrate expo-apple-authentication or @invertase/react-native-apple-authentication",
        );
      }

      const result = await authService.socialLogin({
        appleId: appleId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        device_token: deviceToken,
        device_type: deviceType,
      });

      if (result.success) {
        if (__DEV__) {
          console.log("\n✅ ========== APPLE LOGIN SUCCESS ==========");
          console.log("Response Data:", result.data);
          console.log(
            "Token:",
            result.data?.token ? "Received" : "Not received",
          );
          console.log("=====================================\n");
        }

        setSuccessMessage("Account created successfully!");

        if (!result.data?.token) {
          setErrorMessage("Apple login failed: No token received from server.");
          return;
        }

        await saveUserSession(
          result.data.token,
          result.data?.user || undefined,
          email,
          undefined,
        );

        router.replace("/auth/location");
      } else {
        const errorMsg =
          result.data?.message ||
          result.error ||
          "Apple login failed. Please try again.";
        setErrorMessage(errorMsg);

        if (__DEV__) {
          console.error("\n❌ ========== APPLE LOGIN FAILED ==========");
          console.error("Error:", errorMsg);
          console.error("=====================================\n");
        }
      }
    } catch (error: any) {
      const errorMsg =
        error.message || "Something went wrong. Please try again.";
      setErrorMessage(errorMsg);

      if (__DEV__) {
        console.error("\n❌ ========== APPLE LOGIN EXCEPTION ==========");
        console.error("Exception:", error);
        console.error("========================================\n");
      }
    } finally {
      setIsSocialLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image source={require("@assets/images/gfi.png")} style={styles.logo} />

        <View style={styles.card}>
          <Text
            style={[
              styles.title,
              { fontFamily: "PlayfairDisplay_800ExtraBold" },
            ]}
          >
            Sign up and find your gully fame!
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              First Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your First Name"
              placeholderTextColor="#B7B7B7"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Last Name"
              placeholderTextColor="#B7B7B7"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Mobile No. <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Mobile No."
              placeholderTextColor="#B7B7B7"
              keyboardType="phone-pad"
              value={mobileNo}
              onChangeText={setMobileNo}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              E-mail ID <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your E-mail ID"
              placeholderTextColor="#B7B7B7"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Password <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your Password"
                placeholderTextColor="#B7B7B7"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={handlePasswordChange}
              />
              {password.length > 0 && (
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOffIcon color="#666" size={20} />
                  ) : (
                    <EyeIcon color="#666" size={20} />
                  )}
                </TouchableOpacity>
              )}
            </View>

            {password.length > 0 && (
              <View style={styles.passwordRequirementsContainer}>
                <Text style={styles.passwordRequirementsTitle}>
                  Password Requirements:
                </Text>
                <View style={styles.requirementsList}>
                  <View style={styles.requirementItem}>
                    <Text
                      style={[
                        styles.requirementText,
                        password.length >= 8 && styles.requirementMet,
                      ]}
                    >
                      {password.length >= 8 ? "✓" : "○"} Minimum 8 characters
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Text
                      style={[
                        styles.requirementText,
                        /[A-Z]/.test(password) && styles.requirementMet,
                      ]}
                    >
                      {/[A-Z]/.test(password) ? "✓" : "○"} At least 1 uppercase
                      letter (A-Z)
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Text
                      style={[
                        styles.requirementText,
                        /[a-z]/.test(password) && styles.requirementMet,
                      ]}
                    >
                      {/[a-z]/.test(password) ? "✓" : "○"} At least 1 lowercase
                      letter (a-z)
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Text
                      style={[
                        styles.requirementText,
                        /[0-9]/.test(password) && styles.requirementMet,
                      ]}
                    >
                      {/[0-9]/.test(password) ? "✓" : "○"} At least 1 number
                      (0-9)
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Text
                      style={[
                        styles.requirementText,
                        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                          password,
                        ) && styles.requirementMet,
                      ]}
                    >
                      {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                        ? "✓"
                        : "○"}{" "}
                      At least 1 special character (! @ # $ % etc.)
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {passwordErrors.length > 0 && password.length > 0 && (
              <View style={styles.passwordErrorContainer}>
                {passwordErrors.map((error, index) => (
                  <Text key={index} style={styles.passwordErrorText}>
                    • {error}
                  </Text>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Confirm Password <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  confirmPasswordError && styles.inputError,
                ]}
                placeholder="Confirm your Password"
                placeholderTextColor="#B7B7B7"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
              />
              {confirmPassword.length > 0 && (
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon color="#666" size={20} />
                  ) : (
                    <EyeIcon color="#666" size={20} />
                  )}
                </TouchableOpacity>
              )}
            </View>
            {confirmPasswordError ? (
              <Text style={styles.confirmPasswordErrorText}>
                {confirmPasswordError}
              </Text>
            ) : null}
          </View>

          <Text style={styles.roleTitle}>Choose your role</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "participant" && styles.roleButtonActive,
              ]}
              onPress={() => setRole("participant")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === "participant" && styles.roleButtonTextActive,
                ]}
              >
                Participant
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "fan" && styles.roleButtonActive,
              ]}
              onPress={() => setRole("fan")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === "fan" && styles.roleButtonTextActive,
                ]}
              >
                Fan
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termsRow}>
            <TouchableOpacity
              style={styles.termsLinkContainer}
              activeOpacity={0.8}
              onPress={() => router.push("./termsandconditions")}
            >
              <Text style={styles.termsLink}>
                {termsAccepted
                  ? "✓ Terms & Conditions*"
                  : "Terms & Conditions*"}
              </Text>
            </TouchableOpacity>
          </View>

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

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isLoading && styles.primaryButtonDisabled,
            ]}
            onPress={handleCreateAccount}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Create an account</Text>
            )}
          </TouchableOpacity>

          {}
          <View style={styles.continueWithContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.continueWithText}>OR Continue With</Text>
            <View style={styles.separatorLine} />
          </View>

          {}
          <View style={styles.socialIconsContainer}>
            <TouchableOpacity
              style={styles.socialIconButton}
              activeOpacity={0.7}
              onPress={() => handleGoogleLogin("google")}
              disabled={isSocialLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color="#EC9A15" />
              ) : (
                <GoogleIcon size={40} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialIconButton}
              activeOpacity={0.7}
              onPress={() => handleGoogleLogin("instagram")}
              disabled={isSocialLoading}
            >
              {isInstagramLoading ? (
                <ActivityIndicator size="small" color="#EC9A15" />
              ) : (
                <InstagramIcon size={40} />
              )}
            </TouchableOpacity>
            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={[
                  styles.socialIconButton,
                  isSocialLoading && styles.socialIconButtonDisabled,
                ]}
                activeOpacity={0.7}
                onPress={handleAppleLogin}
                disabled={isSocialLoading}
              >
                {isSocialLoading ? (
                  <ActivityIndicator color="#666" size="small" />
                ) : (
                  <AppleIcon size={40} />
                )}
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.push("./signin")}
            activeOpacity={0.7}
          >
            <Text style={styles.footerText}>
              Already have account? <Text style={styles.footerLink}>Login</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/auth/location?skip=true")}
            activeOpacity={0.7}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>
              Let me have a look!{" "}
              <Text style={styles.skipLink}>SKIP{">>"}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C2610",
  },
  content: {
    paddingHorizontal: width * 0.01,
    paddingTop: height * 0.08,
    paddingBottom: 0,
    alignItems: "center",
  },
  logo: {
    width: width * 0.33,
    height: height * 0.08,
    resizeMode: "contain",
    marginBottom: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#F6F9FD",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 0,
    paddingTop: 20,
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },
  title: {
    fontSize: 25,
    color: "#1F2937",
    marginBottom: 25,
    fontFamily: "PlayfairDisplay_800ExtraBold",
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 6,
    fontFamily: "Inter_600SemiBold",
  },
  required: {
    color: "#DC2626",
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D4DAE9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    paddingVertical: 9,
    fontSize: 15,
    color: "#111827",
    fontFamily: "Inter_400Regular",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  passwordInputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
  passwordRequirementsContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  passwordRequirementsTitle: {
    fontSize: 13,
    color: "#374151",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  requirementsList: {
    gap: 6,
  },
  requirementItem: {
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
  },
  requirementMet: {
    color: "#10B981",
    fontFamily: "Inter_600SemiBold",
  },
  passwordErrorContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  passwordErrorText: {
    fontSize: 12,
    color: "#DC2626",
    fontFamily: "Inter_500Medium",
    marginBottom: 4,
  },
  confirmPasswordErrorText: {
    fontSize: 12,
    color: "#DC2626",
    fontFamily: "Inter_500Medium",
    marginTop: 6,
  },
  roleTitle: {
    fontSize: 15,
    color: "#111827",
    marginBottom: 10,
    fontFamily: "Inter_700Bold",
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  roleButton: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#D4DAE9",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: "#3C2610",
    borderColor: "#3C2610",
  },
  roleButtonText: {
    fontSize: 15,
    color: "#1F2937",
    fontFamily: "Inter_600SemiBold",
  },
  roleButtonTextActive: {
    color: "#FFFFFF",
  },
  termsRow: {
    marginBottom: 15,
    marginTop: 3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  termsLinkContainer: {
    alignItems: "center",
  },
  termsLink: {
    color: "#3C2610",
    textDecorationLine: "underline",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  primaryButton: {
    backgroundColor: "#3C2610",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
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
  footerText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#000",
    fontFamily: "Inter_400Regular",
  },
  footerLink: {
    color: "#EC9A15",
    fontWeight: 900,
  },
  continueWithContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D5DB",
  },
  continueWithText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "#000",
    fontFamily: "Inter_400Regular",
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  socialIconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  socialIconButtonDisabled: {
    opacity: 0.6,
  },
  skipButton: {
    marginTop: 15,
    marginHorizontal: -30,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
  },
  skipText: {
    fontSize: 15,
    color: "#000",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  skipLink: {
    color: "#EC9A15",
  },
});
