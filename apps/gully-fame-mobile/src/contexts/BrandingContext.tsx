import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { Image } from "react-native";
import { appBrandingService } from "../api/services/appBrandingService";

interface BrandingContextType {
  logoUrl: string | null;
  splashImages: string[];
  isLoading: boolean;
  imagesPreloaded: boolean;
}

const BrandingContext = createContext<BrandingContextType>({
  logoUrl: null,
  splashImages: [],
  isLoading: true,
  imagesPreloaded: false,
});

export const useBranding = () => useContext(BrandingContext);

interface BrandingProviderProps {
  children: ReactNode;
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [splashImages, setSplashImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;

    const fetchBrandingAssets = async () => {
      try {
        console.log("[BrandingContext] Fetching branding assets...");

        const [logoResult, splashResult] = await Promise.all([
          appBrandingService.getLogo(),
          appBrandingService.getSplash(),
        ]);

        if (logoResult.success && logoResult.data?.logoUrl) {
          const logo = logoResult.data.logoUrl;
          if (logo.toLowerCase().endsWith(".svg")) {
            console.log("[BrandingContext] Logo is SVG, using default");
            setLogoUrl(null);
          } else {
            console.log("[BrandingContext] Logo fetched:", logo);
            setLogoUrl(logo);
          }
        }

        if (splashResult.success && splashResult.data) {
          const splashData = splashResult.data;
          let images: string[] = [];

          if (Array.isArray(splashData.images)) {
            images = splashData.images;
          } else if (splashData.splashScreens && Array.isArray(splashData.splashScreens)) {
            images = splashData.splashScreens
              .map((screen: any) => screen.imageUrl || screen)
              .filter(Boolean);
          } else if (splashData.splashImageUrl) {
            images = [splashData.splashImageUrl];
          } else if (splashData.backgroundImageUrl) {
            images = [splashData.backgroundImageUrl];
          }

          if (images.length > 0) {
            console.log("[BrandingContext] Splash images fetched:", images.length);
            setSplashImages(images);

            console.log("[BrandingContext] Preloading all onboarding images...");
            const preloadPromises = images.map((imageUrl, index) =>
              Image.prefetch(imageUrl)
                .then(() => {
                  console.log(`[BrandingContext] Preloaded image ${index + 1}/${images.length}`);
                  return true;
                })
                .catch((error) => {
                  console.warn(`[BrandingContext] Failed to preload image ${index + 1}:`, imageUrl);
                  return false;
                })
            );

            await Promise.all(preloadPromises);
            console.log("[BrandingContext] All images preloaded successfully");
            setImagesPreloaded(true);
          }
        }
      } catch (error) {
        console.error("[BrandingContext] Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandingAssets();
  }, []);

  return (
    <BrandingContext.Provider value={{ logoUrl, splashImages, isLoading, imagesPreloaded }}>
      {children}
    </BrandingContext.Provider>
  );
};
