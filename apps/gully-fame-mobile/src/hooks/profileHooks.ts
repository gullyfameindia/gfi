
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "@api/services/authService";

export interface ProfileData {
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
        AsyncStorage.getItem("userInstagram"), 
        AsyncStorage.getItem("userXLink"), 
      ]);

      
      setProfileData((prev) => ({
        ...prev,
        firstName: userFirstName || "",
        lastName: userLastName || "",
        bio: userBio || prev.bio,
        threeWords: userThreeWords || undefined,
        profileImage: userProfileImage || null,
        role: userRole || "",
        instagramLink: userInstagram || "", 
        xLink: userXLink || "", 
      }));

      setIsLoading(false);

      
      authService
        .getUserProfile()
        .then((profileResult) => {
          if (profileResult.success && profileResult.data) {
            const userData = profileResult.data;

            
            const userId = userData.id || (userData as any)._id || "";

            
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

            
            setProfileData((prev) => {
              
              const apiInstagram = (userData as any).instagramLink || (userData as any).instagram;
              const finalInstagram = apiInstagram || prev.instagramLink;

              const apiXLink = (userData as any).xLink;
              const finalXLink = apiXLink || prev.xLink;

              
              const finalBio = userData.bio || prev.bio;
              const finalThreeWords = (userData as any).threeWords || prev.threeWords || "";

              
              const cacheUpdates: Array<[string, string]> = [
                ["userFirstName", userData.firstName || ""],
                ["userLastName", userData.lastName || ""],
                ["userProfileImage", userData.profileImage || ""],
                ["userBio", finalBio],
                ["userThreeWords", finalThreeWords],
                ["userRole", userData.role || ""],
                ["userInstagram", finalInstagram], 
                ["userXLink", finalXLink], 
              ];
              
              if (userId) {
                cacheUpdates.push(["userId", userId]);
              }
              
              AsyncStorage.multiSet(cacheUpdates).catch((err) => console.error("Error updating cache:", err));

              return {
                id: userId,  
                _id: userId, 
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                bio: finalBio,
                threeWords: finalThreeWords || undefined,
                profileImage: userData.profileImage || null,
                role: userData.role || "",
                isVerified: hasAllRequiredFields || (userData as any).isVerified === true,
                competitionCount: (userData as any).competitionCount || 0,
                levelPercentage: (userData as any).levelPercentage || 30,
                xLink: finalXLink, 
                instagramLink: finalInstagram, 
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
  }, []); 

  useEffect(() => {
    
    loadUserData();
  }, []); 

  return {
    profileData,
    setProfileData,
    isLoading,
    reloadProfile: loadUserData,
  };
}


export function useOtherUserProfile(params?: any) {
  
  const userId = (params?.userId as string) || (params?.id as string) || "";
  const firstName = (params?.firstName as string) || "";
  const lastName = (params?.lastName as string) || "";
  const bio = (params?.bio as string) || "";
  const role = (params?.role as string) || "participants";
  const instagramLink = (params?.instagramLink as string) || (params?.instagram as string) || "";
  const xLink = (params?.xLink as string) || "";

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
      
      
      
      
      
      
      
      

      
      setProfileData({
        firstName: firstName,
        lastName: lastName,
        bio: bio,
        profileImage: null, 
        role: role,
        isVerified: false, 
        competitionCount: 0, 
        levelPercentage: 30, 
        instagramLink: instagramLink,
        xLink: xLink,
      });
    }
  }, [userId, firstName, lastName, bio, role, instagramLink, xLink]); 

  return { profileData, setProfileData, isLoading };
}
