// Shared hooks for profile screens - Easy API integration later
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { authService } from "@api/services/authService";

export interface ProfileData {
    id?: string;
    _id?: string;
    firstName: string;
    lastName: string;
    bio: string;
    threeWords?: string;
    profileImage: string | null;
    role: string;
    isVerified: boolean;
    competitionCount: number;
    levelPercentage: number;
    xLink: string;
    instagramLink: string;
}

// Hook for loading own profile data (with API integration ready)
export function useOwnProfile() {
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: "",
        lastName: "",
        bio: "Born to perform. Built by the streets.",
        profileImage: null,
        role: "",
        isVerified: false,
        competitionCount: 0,
        levelPercentage: 30,
        xLink: "",
        instagramLink: "",
    });
    const [isLoading, setIsLoading] = useState(true);

    const loadUserData = useCallback(async () => {
        try {
            // First, load from AsyncStorage immediately (fast, cached data)
            const [
                userFirstName,
                userLastName,
                userBio,
                userThreeWords,
                userProfileImage,
                userRole,
                userInstagram,
                userXLink,
            ] = await Promise.all([
                AsyncStorage.getItem("userFirstName"),
                AsyncStorage.getItem("userLastName"),
                AsyncStorage.getItem("userBio"),
                AsyncStorage.getItem("userThreeWords"),
                AsyncStorage.getItem("userProfileImage"),
                AsyncStorage.getItem("userRole"),
                AsyncStorage.getItem("userInstagram"), // Fetching Instagram
                AsyncStorage.getItem("userXLink"), // Fetching X
            ]);

            // Set cached data immediately to prevent flash
            setProfileData((prev) => ({
                ...prev,
                firstName: userFirstName || "",
                lastName: userLastName || "",
                bio: userBio || prev.bio,
                threeWords: userThreeWords || undefined,
                profileImage: userProfileImage || null,
                role: userRole || "",
                instagramLink: userInstagram || "", // Set Instagram
                xLink: userXLink || "", // Set X
            }));

            setIsLoading(false);

            // Then fetch from API in the background (non-blocking)
            authService
                .getUserProfile()
                .then((profileResult) => {
                    if (profileResult.success && profileResult.data) {
                        const userData = profileResult.data;

                        // Get userId from backend response (could be id or _id)
                        const userId =
                            userData.id || (userData as any)._id || "";

                        // Check if user is verified
                        const hasAllRequiredFields = !!(
                            userData.firstName &&
                            userData.lastName &&
                            userData.email &&
                            userData.mobile &&
                            userData.profileImage &&
                            userData.role &&
                            userData.gender &&
                            userData.dob
                        );

                        // Use a functional state update so we can check our existing local data
                        setProfileData((prev) => {
                            // SAFEGUARD: If API has the links, use them. If not, keep our local cached ones!
                            const apiInstagram =
                                (userData as any).instagramLink ||
                                (userData as any).instagram;
                            const finalInstagram =
                                apiInstagram || prev.instagramLink;

                            const apiXLink = (userData as any).xLink;
                            const finalXLink = apiXLink || prev.xLink;

                            // Also safeguarding bio and threeWords just in case the API misses them
                            const finalBio = userData.bio || prev.bio;
                            const finalThreeWords =
                                (userData as any).threeWords ||
                                prev.threeWords ||
                                "";

                            // Update cache with fresh API data + preserved local data
                            const cacheUpdates: Array<[string, string]> = [
                                ["userFirstName", userData.firstName || ""],
                                ["userLastName", userData.lastName || ""],
                                [
                                    "userProfileImage",
                                    userData.profileImage || "",
                                ],
                                ["userBio", finalBio],
                                ["userThreeWords", finalThreeWords],
                                ["userRole", userData.role || ""],
                                ["userInstagram", finalInstagram], // Preserved!
                                ["userXLink", finalXLink], // Preserved!
                            ];
                            
                            if (userId) {
                                cacheUpdates.push(["userId", userId]);
                            }
                            
                            AsyncStorage.multiSet(cacheUpdates).catch((err) =>
                                console.error("Error updating cache:", err),
                            );

                            return {
                                id: userId,  // ✅ FIX: Store userId in profileData
                                _id: userId, // ✅ FIX: Also store as _id for compatibility
                                firstName: userData.firstName || "",
                                lastName: userData.lastName || "",
                                bio: finalBio,
                                threeWords: finalThreeWords || undefined,
                                profileImage: userData.profileImage || null,
                                role: userData.role || "",
                                isVerified:
                                    hasAllRequiredFields ||
                                    (userData as any).isVerified === true,
                                competitionCount:
                                    (userData as any).competitionCount || 0,
                                levelPercentage:
                                    (userData as any).levelPercentage || 30,
                                xLink: finalXLink, // Preserved!
                                instagramLink: finalInstagram, // Preserved!
                            };
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching profile from API:", error);
                });
        } catch (error) {
            console.error("Error loading user data:", error);
            setIsLoading(false);
        }
    }, []); // Empty dependency array - only create once

    useEffect(() => {
        // Load data on mount
        loadUserData();
    }, []); // Empty dependency array - only run once on mount

    return {
        profileData,
        setProfileData,
        isLoading,
        reloadProfile: loadUserData,
    };
}

// Hook for loading other user's profile data (with API integration ready)
export function useOtherUserProfile() {
    const params = useLocalSearchParams();

    // Extract stable values from params to avoid infinite loops
    const userId = (params.userId as string) || (params.id as string) || "";
    const firstName = (params.firstName as string) || "";
    const lastName = (params.lastName as string) || "";
    const bio = (params.bio as string) || "";
    const role = (params.role as string) || "participants";
    const instagramLink =
        (params.instagramLink as string) || (params.instagram as string) || "";
    const xLink = (params.xLink as string) || "";

    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: firstName,
        lastName: lastName,
        bio: bio,
        profileImage: null,
        role: role,
        isVerified: false,
        competitionCount: 0,
        levelPercentage: 30,
        xLink: xLink,
        instagramLink: instagramLink,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            // TODO: Replace with actual API call when ready
            // const fetchUserProfile = async () => {
            //   const result = await userService.getUserProfile(userId);
            //   if (result.success) {
            //     setProfileData(result.data);
            //   }
            // };
            // fetchUserProfile();

            // For now, use params data
            setProfileData({
                firstName: firstName,
                lastName: lastName,
                bio: bio,
                profileImage: null, // Will come from API
                role: role,
                isVerified: false, // Will come from API
                competitionCount: 0, // Will come from API
                levelPercentage: 30, // Will come from API
                instagramLink: instagramLink,
                xLink: xLink,
            });
        }
    }, [userId, firstName, lastName, bio, role, instagramLink, xLink]); // Depend on specific values

    return { profileData, setProfileData, isLoading };
}
