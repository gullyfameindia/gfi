import { homePageHeroSlidesAPIData } from "@/types/homePageHeroSlides";
import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Image,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from "react-native";
import { styles } from "./styles";
import SafeImage from "@/components/SafeImage";
import { BASE_URL } from "@/api/axios";
const getDimensions = () => Dimensions.get("window");
const HeroBannerCarousel = ({
  slides,
}: {
  slides: homePageHeroSlidesAPIData[];
}) => {
  const carouselRef = useRef<ScrollView | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [dimensions, setDimensions] = useState(getDimensions());
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(
      e.nativeEvent.contentOffset.x / dimensions.width,
    );
    const actualIndex = slideIndex === slides.length ? 0 : slideIndex;
    if (activeSlide !== actualIndex) {
      setActiveSlide(slideIndex);
    }
  };
  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(
      e.nativeEvent.contentOffset.x / dimensions.width,
    );
    if (slideIndex === slides.length) {
      carouselRef.current?.scrollTo({ x: 0, animated: false });
    }
  };
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      if (activeSlide === slides.length - 1) {
        carouselRef.current?.scrollTo({
          x: slides.length * dimensions.width,
          animated: true,
        });
        setTimeout(() => {
          carouselRef.current?.scrollTo({ x: 0, animated: false });
        }, 500);
      } else {
        carouselRef.current?.scrollTo({
          x: (activeSlide + 1) * dimensions.width,
          animated: true,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, dimensions.width, activeSlide]);
  return (
    <>
      <ScrollView
        ref={carouselRef}
        horizontal
        onScroll={onScroll}
        pagingEnabled
        onMomentumScrollEnd={onMomentumScrollEnd}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => {
          const fullUrl = `${BASE_URL}${slide.image}`;
          return (
            <View
              key={slide.id}
              style={[styles.heroSlideWrapper, { width: dimensions.width }]}
            >
              <SafeImage
                defaultImage={require("@assets/images/carousel1.png")}
                imageUrl={fullUrl}
                style={styles.heroBackgroundImage}
              ></SafeImage>
              <View style={styles.heroContent}>
                <Image
                  source={require("@assets/images/gfi.png")}
                  style={styles.gfiLogoImage}
                  resizeMode="contain"
                />
                <Text style={styles.heroTitle}>{slide.title}</Text>
                <Text style={styles.heroSubtitle}>{slide.subtitle}</Text>
              </View>
            </View>
          );
        })}
        {slides.length > 0 && (
          <View style={[styles.heroSlideWrapper, { width: dimensions.width }]}>
            <SafeImage
              defaultImage={require("@assets/images/carousel1.png")}
              style={styles.heroBackgroundImage}
            ></SafeImage>
            <View style={styles.heroContent}>
              <Image
                source={require("@assets/images/gfi.png")}
                style={styles.gfiLogoImage}
                resizeMode="contain"
              />
              <Text style={styles.heroTitle}>{slides[0].title}</Text>
              <Text style={styles.heroSubtitle}>{slides[0].subtitle}</Text>
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.carouselDots}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.heroDot,
              index === activeSlide
                ? styles.heroDotActive
                : styles.heroDotInactive,
            ]}
          />
        ))}
      </View>
    </>
  );
};
export default HeroBannerCarousel;
