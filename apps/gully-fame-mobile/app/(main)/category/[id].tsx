import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  Modal,
  Animated,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, G, Circle, Rect, Polygon } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCategories } from "@/api/services/categoryService";

const { width, height } = Dimensions.get("window");


const defaultCategoryData = {
  name: "Category",
  tagline: "Explore amazing content",
  description: "Discover exciting content in this category",
  banner: require("@assets/images/carousel1.png"),
  following: "0",
  activeContests: 0,
  topDancers: 0,
};
const CATEGORY_NAME_FIXES: Record<string, string> = {
  categor: "Category",
  category: "Category",
  dancin: "Dance",
  dancing: "Dance",
  musi: "Music",
  coo: "Cook",
  cook: "Cook",
  comedy: "Comedy",
};

const normalizeCategoryName = (name?: string) => {
  const raw = String(name || "").trim();
  return CATEGORY_NAME_FIXES[raw.toLowerCase()] || raw;
};

const getStatusLabel = (status: "live" | "upcoming" | "past" | "all") => {
  const labels = {
    live: "Live",
    upcoming: "Upcoming",
    past: "Past",
    all: "All",
  };
  return labels[status];
};

const sampleReels = [
  { id: 1, thumbnail: require("@assets/images/trending1.png") },
  { id: 2, thumbnail: require("@assets/images/trending2.png") },
  { id: 3, thumbnail: require("@assets/images/trending3.png") },
  { id: 4, thumbnail: require("@assets/images/trending1.png")},
  { id: 5, thumbnail: require("@assets/images/trending2.png") },
  { id: 6, thumbnail: require("@assets/images/trending3.png") },
  { id: 7, thumbnail: require("@assets/images/trending1.png") },
  { id: 8, thumbnail: require("@assets/images/trending2.png") },
];

const liveCompetitions = [
  { 
    id: 1, 
    title: "Street Style Showdown", 
    prize: "₹23,000", 
    participants: 142,
    endDate: "2 days left",
    image: require("@assets/images/trending1.png") 
  },
  { 
    id: 2, 
    title: "Bollywood Beat Battle", 
    prize: "₹15,000", 
    participants: 98,
    endDate: "5 days left",
    image: require("@assets/images/trending2.png") 
  },
];

const upcomingCompetitions = [
  { 
    id: 1, 
    title: "Delhi Dance Clash", 
    prize: "₹30,000",
    startDate: "Dec 12",
    entryFee: "Free Entry",
    participants: 0,
    image: require("@assets/images/trending3.png") 
  },
  { 
    id: 2, 
    title: "Music Mania 2024", 
    prize: "₹20,000",
    startDate: "Dec 18",
    entryFee: "₹149 Entry Fee",
    participants: 0,
    image: require("@assets/images/trending1.png") 
  },
];

const pastCompetitions = [
  { 
    id: 1, 
    title: "Summer Showdown 2024", 
    winner: "Aman K.",
    prize: "₹25,000",
    participants: 256,
    image: require("@assets/images/trending2.png") 
  },
  { 
    id: 2, 
    title: "Monsoon Madness", 
    winner: "Priya S.",
    prize: "₹18,000",
    participants: 189,
    image: require("@assets/images/trending3.png") 
  },
];

const topPerformers = [
  { 
    rank: 1, 
    name: "Aman K.", 
    points: 1245, 
    image: require("@assets/images/user1.png"), 
    wins: 12,
    userId: "aman1",
    firstName: "Aman",
    lastName: "Kumar",
    role: "participants",
    bio: "Top performer",
  },
  { 
    rank: 2, 
    name: "Priya S.", 
    points: 1180, 
    image: require("@assets/images/user2.png"), 
    wins: 10,
    userId: "priya2",
    firstName: "Priya",
    lastName: "Sharma",
    role: "participants",
    bio: "Rising star",
  },
  { 
    rank: 3, 
    name: "Rohan V.", 
    points: 1050, 
    image: require("@assets/images/user1.png"), 
    wins: 8,
    userId: "rohan1",
    firstName: "Rohan",
    lastName: "Verma",
    role: "participants",
    bio: "Fan favorite",
  },
];



const CompetitionCard = React.memo(({ comp, index, type }: any) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = React.useCallback(async () => {
    
    if (type !== "live") {
      const { validateKycBeforeCompetition } = await import('@utils/kycValidation');
      const isValid = await validateKycBeforeCompetition();
      
      if (!isValid) {
        return; 
      }
    }
    
    if (type === "live") {
      router.push(`/(main)/competition/live/${comp.id}?scrollToEntries=true` as any);
    } else {
      router.push(`/(main)/competition/upcoming/${comp.id}` as any);
    }
  }, [comp.id, type]);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [
      {
        scale: scaleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.compCard, animatedStyle]}>
      <Image source={comp.image} style={styles.compCardImage} resizeMode="cover" />
      <View style={styles.compCardContent}>
        <Text style={styles.compCardTitle} numberOfLines={2}>{comp.title}</Text>
        <View style={styles.compCardDetails}>
          {type === "live" ? (
            <>
              <View style={styles.compDetailItem}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="12" r="10" stroke="#EC9A15" strokeWidth={2}/>
                  <Path d="M12 6v6l4 2" stroke="#EC9A15" strokeWidth={2} strokeLinecap="round"/>
                </Svg>
                <Text style={styles.compDetailText}>{comp.endDate}</Text>
              </View>
              <View style={styles.compDetailItem}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#EC9A15" strokeWidth={2}/>
                  <Circle cx="9" cy="7" r="4" stroke="#EC9A15" strokeWidth={2}/>
                  <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#EC9A15" strokeWidth={2}/>
                </Svg>
                <Text style={styles.compDetailText}>{comp.participants} joined</Text>
              </View>
            </>
          ) : (
            <View style={styles.compDetailItem}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#EC9A15" strokeWidth={2}/>
                <Path d="M16 2v4M8 2v4M3 10h18" stroke="#EC9A15" strokeWidth={2}/>
              </Svg>
              <Text style={styles.compDetailText}>Starts: {comp.startDate}</Text>
            </View>
          )}
        </View>
        <View style={styles.compCardFooter}>
          <View style={styles.prizeTag}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M18 2H6v7a6 6 0 0 0 12 0V2z" stroke="#FFD700" strokeWidth={2}/>
            </Svg>
            <Text style={styles.prizeText}>{comp.prize}</Text>
          </View>
          <TouchableOpacity 
            style={type === "live" ? styles.voteBtn : styles.joinBtn}
            activeOpacity={0.8}
            onPress={handlePress}
          >
            <Text style={type === "live" ? styles.voteBtnText : styles.joinBtnText}>
              {type === "live" ? "Vote Now" : "Join Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
});

CompetitionCard.displayName = 'CompetitionCard';

export default function CategoryDetailScreen() {
  const params = useLocalSearchParams();
  const { id, tab } = params;
  const categoryId = typeof id === 'string' ? parseInt(id, 10) : (Array.isArray(id) ? parseInt(id[0], 10) : (id as number));
  const [category, setCategory] = useState(defaultCategoryData);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState(tab === "reels" ? "reels" : "competitions");

  
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const result = await getCategories({ page: 1, limit: 50 });
        if (result.success && result.data && result.data.items.length > 0) {
          setAllCategories(result.data.items);
          const foundCategory = result.data.items.find(
            (cat: any) => parseInt(cat.id) === categoryId
          );
          if (foundCategory) {
            setCategory({
              name: foundCategory.name,
              tagline: foundCategory.tagline || `${foundCategory.name} content`,
              description: foundCategory.description || `Explore ${foundCategory.name}`,
              banner: require("@assets/images/carousel1.png"), 
              following: "0",
              activeContests: 0,
              topDancers: 0,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    fetchCategoryData();
  }, [categoryId]);
  
  useEffect(() => {
    if (tab === "reels") {
      setActiveTab("reels");
    }
  }, [tab]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(id);
  const [statusFilter, setStatusFilter] = useState<"live" | "past" | "upcoming" | "all">("live");
  
  
  const handleFilterChange = React.useCallback((status: "live" | "past" | "upcoming" | "all") => {
    setStatusFilter(status);
  }, []);
  
  const handleTabChange = React.useCallback((tabName: string) => {
    setActiveTab(tabName);
  }, []);
  
  
  const liveDotBlink = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotBlink, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(liveDotBlink, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    blinkAnimation.start();
    return () => blinkAnimation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C2610" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5M12 19l-7-7 7-7" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </TouchableOpacity>
          
          {}
          <TouchableOpacity 
            style={styles.categoryDropdown}
            onPress={() => setFilterVisible(true)}
          >
            <Text style={styles.categoryDropdownText}>{category.name}</Text>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M6 9l6 6 6-6" stroke="#EC9A15" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </TouchableOpacity>
          
          <View style={{ width: 24 }} />
        </View>

        {}
        <ImageBackground
          source={category.banner}
          style={styles.heroSection}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
            style={styles.heroOverlay}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{category.name.toUpperCase()}</Text>
              <Text style={styles.heroTagline}>{category.tagline}</Text>
              <TouchableOpacity 
                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                onPress={() => setIsFollowing(!isFollowing)}
              >
                <Text style={styles.followBtnText}>
                  {isFollowing ? "Following" : "Follow Category"}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>

        {}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
              <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#EC9A15" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              <Circle cx="9" cy="7" r="4" stroke="#EC9A15" strokeWidth={2}/>
              <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#EC9A15" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
            <Text style={styles.statNumber}>{category.following}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>

          <View style={[styles.statItem, styles.statItemCenter]}>
            <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
              <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="#EC9A15" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" stroke="#EC9A15" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M18 2H6v7a6 6 0 0 0 12 0V2z" stroke="#EC9A15" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
            <Text style={styles.statNumber}>{category.activeContests}</Text>
            <Text style={styles.statLabel}>Competitions</Text>
          </View>

          <View style={styles.statItem}>
            <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
              <G>
                <Path d="M17.33,5.67c-0.08-0.55-0.19-1.23-0.71-1.76c-0.53-0.52-1.21-0.63-1.76-0.71c-0.23-0.03-0.46-0.07-0.6-0.13 c-0.12-0.05-0.3-0.19-0.48-0.32C13.35,2.44,12.77,2,12,2s-1.35,0.44-1.78,0.76c-0.18,0.13-0.36,0.27-0.48,0.32 C9.6,3.13,9.37,3.17,9.14,3.2C8.59,3.28,7.91,3.39,7.39,3.91C6.86,4.44,6.76,5.12,6.67,5.67C6.64,5.9,6.6,6.13,6.55,6.27 C6.5,6.39,6.36,6.57,6.23,6.74C5.91,7.17,5.47,7.76,5.47,8.53s0.44,1.35,0.76,1.78c0.13,0.18,0.27,0.36,0.32,0.48 c0.06,0.14,0.09,0.37,0.13,0.6c0.08,0.55,0.19,1.23,0.71,1.76c0.53,0.52,1.21,0.63,1.76,0.71c0.23,0.03,0.46,0.07,0.6,0.13 c0.12,0.05,0.3,0.19,0.48,0.32c0.43,0.32,1.01,0.76,1.78,0.76c0.77,0,1.35-0.44,1.78-0.76c0.17-0.13,0.36-0.27,0.48-0.32 c0.14-0.06,0.37-0.09,0.6-0.13c0.55-0.08,1.23-0.19,1.76-0.71c0.53-0.52,0.63-1.21,0.71-1.76c0.03-0.23,0.07-0.46,0.13-0.6 c0.05-0.12,0.19-0.3,0.32-0.48c0.32-0.43,0.76-1.01,0.76-1.78s-0.44-1.35-0.76-1.78c-0.13-0.18-0.27-0.36-0.32-0.48 C17.4,6.13,17.36,5.9,17.33,5.67z M16.17,9.11c-0.2,0.26-0.42,0.56-0.56,0.91c-0.15,0.36-0.21,0.74-0.26,1.07 c-0.03,0.21-0.08,0.56-0.15,0.64c-0.08,0.07-0.43,0.12-0.64,0.15c-0.33,0.05-0.7,0.11-1.07,0.26c-0.35,0.15-0.65,0.37-0.91,0.56 c-0.17,0.13-0.48,0.36-0.58,0.36s-0.42-0.23-0.58-0.36c-0.26-0.2-0.56-0.42-0.91-0.56c-0.36-0.15-0.74-0.21-1.07-0.26 c-0.21-0.03-0.56-0.08-0.64-0.14c-0.07-0.08-0.12-0.44-0.15-0.65c-0.05-0.33-0.11-0.7-0.26-1.07C8.25,9.67,8.03,9.37,7.83,9.11 C7.71,8.94,7.47,8.63,7.47,8.53s0.23-0.42,0.36-0.58c0.2-0.26,0.42-0.56,0.56-0.91C8.54,6.67,8.6,6.3,8.65,5.97 C8.68,5.76,8.74,5.41,8.8,5.33c0.08-0.07,0.43-0.12,0.64-0.15c0.33-0.05,0.7-0.11,1.06-0.26c0.35-0.15,0.65-0.37,0.91-0.56 C11.58,4.23,11.9,4,12,4s0.42,0.23,0.58,0.36c0.26,0.2,0.56,0.42,0.91,0.56c0.36,0.15,0.74,0.21,1.07,0.26 c0.21,0.03,0.56,0.08,0.64,0.14c0.07,0.08,0.12,0.44,0.15,0.65c0.05,0.33,0.11,0.7,0.26,1.07c0.15,0.35,0.37,0.65,0.56,0.91 c0.13,0.17,0.36,0.48,0.36,0.58S16.29,8.94,16.17,9.11z" fill="#EC9A15"/>
                <Path d="M2.76,17.97l3.51,0.88l1.04,2.53c0.13,0.31,0.41,0.54,0.74,0.6c0.33,0.06,0.68-0.05,0.91-0.3L12,18.46l3.04,3.23 c0.19,0.2,0.46,0.31,0.73,0.31c0.06,0,0.12-0.01,0.18-0.02c0.33-0.06,0.61-0.29,0.74-0.6l1.04-2.53l3.51-0.88 c0.37-0.09,0.65-0.38,0.73-0.75s-0.05-0.75-0.35-0.99l-2.95-2.38c-0.43-0.35-1.06-0.28-1.41,0.15c-0.35,0.43-0.28,1.06,0.15,1.41 l1.39,1.12l-2.05,0.51c-0.31,0.08-0.56,0.3-0.68,0.59l-0.65,1.57l-2.7-2.87c-0.38-0.4-1.08-0.4-1.46,0l-2.7,2.87l-0.65-1.57 c-0.12-0.29-0.37-0.51-0.68-0.59l-2.05-0.51l1.39-1.12c0.43-0.35,0.5-0.98,0.15-1.41c-0.35-0.43-0.97-0.5-1.41-0.15l-2.95,2.38 c-0.29,0.24-0.43,0.62-0.35,0.99S2.39,17.88,2.76,17.97z" fill="#EC9A15"/>
                <Polygon points="12,5.62 11.19,7.27 9,7.62 10.69,8.81 10,10.62 12,9.77 14,10.62 13.31,8.81 15,7.62 12.81,7.27" fill="#EC9A15"/>
              </G>
            </Svg>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Top 10</Text>
          </View>
        </View>

        {}
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "competitions" && styles.tabButtonActive]}
            onPress={() => handleTabChange("competitions")}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabButtonText, activeTab === "competitions" && styles.tabButtonTextActive]}>
              Competitions
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "reels" && styles.tabButtonActive]}
            onPress={() => handleTabChange("reels")}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabButtonText, activeTab === "reels" && styles.tabButtonTextActive]}>
              Reels
            </Text>
          </TouchableOpacity>
        </View>

        {}
        {activeTab === "competitions" && (
          <View style={styles.filterContainer}>
            <View style={styles.filterRow}>
              {(["live", "upcoming", "past", "all"] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[styles.filterChip, statusFilter === status && styles.filterChipActive]}
                  onPress={() => handleFilterChange(status)}
                  activeOpacity={0.7}
                >
                  {statusFilter === status && status === "live" && <View style={styles.liveIndicator} />}
                  <Text style={[styles.filterChipText, statusFilter === status && styles.filterChipTextActive]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {}
        {activeTab === "competitions" ? (
          <View style={styles.content}>
            {(() => {
              
              let filteredComps: any[] = [];
              
              if (statusFilter === "live") {
                filteredComps = liveCompetitions.map(comp => ({ ...comp, type: "live" }));
              } else if (statusFilter === "upcoming") {
                filteredComps = upcomingCompetitions.map(comp => ({ ...comp, type: "upcoming" }));
              } else if (statusFilter === "past") {
                filteredComps = pastCompetitions.map(comp => ({ ...comp, type: "past" }));
              } else {
                
                filteredComps = [
                  ...liveCompetitions.map(comp => ({ ...comp, type: "live" })),
                  ...upcomingCompetitions.map(comp => ({ ...comp, type: "upcoming" })),
                  ...pastCompetitions.map(comp => ({ ...comp, type: "past" })),
                ];
              }


              if (filteredComps.length === 0) {
                return (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No competitions found</Text>
                    <Text style={styles.emptyStateSubtext}>Try adjusting your filters</Text>
                  </View>
                );
              }

              
              const liveComps = filteredComps.filter(c => c.type === "live");
              const upcomingComps = filteredComps.filter(c => c.type === "upcoming");
              const pastComps = filteredComps.filter(c => c.type === "past");

              return (
                <>
                  {liveComps.length > 0 && (
                    <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                          <Animated.View style={[styles.liveDot, { opacity: liveDotBlink }]} />
                          <Text style={styles.sectionTitle}>Live Competitions</Text>
                        </View>
                      </View>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pastCompScroll}>
                        {liveComps.map((comp) => (
                          <TouchableOpacity 
                            key={comp.id} 
                            style={styles.compCardNew}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/(main)/competition/live/${comp.id}?scrollToEntries=true` as any)}
                          >
                            <Image source={comp.image} style={styles.compCardImageNew} resizeMode="cover" />
                            <View style={styles.compCardContentNew}>
                              <Text style={styles.compCardTitleNew} numberOfLines={2}>{comp.title}</Text>
                              <View style={styles.compCardDetailsNew}>
                                <View style={styles.compDetailItemNew}>
                                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                                    <Circle cx="12" cy="12" r="10" stroke="#EC9A15" strokeWidth={2}/>
                                    <Path d="M12 6v6l4 2" stroke="#EC9A15" strokeWidth={2} strokeLinecap="round"/>
                                  </Svg>
                                  <Text style={styles.compDetailTextNew}>{comp.endDate}</Text>
                                </View>
                                <View style={styles.compDetailItemNew}>
                                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                                    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#EC9A15" strokeWidth={2}/>
                                    <Circle cx="9" cy="7" r="4" stroke="#EC9A15" strokeWidth={2}/>
                                  </Svg>
                                  <Text style={styles.compDetailTextNew}>{comp.participants} joined</Text>
                                </View>
                              </View>
                              <View style={styles.compCardFooterNew}>
                                <View style={styles.prizeRowNew}>
                                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                                    <G>
                                      <Path d="M12 14V17M12 14C9.58104 14 7.56329 12.2822 7.10002 10M12 14C14.419 14 16.4367 12.2822 16.9 10M17 5H19.75C19.9823 5 20.0985 5 20.1951 5.01921C20.5918 5.09812 20.9019 5.40822 20.9808 5.80491C21 5.90151 21 6.01767 21 6.25C21 6.94698 21 7.29547 20.9424 7.58527C20.7056 8.77534 19.7753 9.70564 18.5853 9.94236C18.2955 10 17.947 10 17.25 10H17H16.9M7 5H4.25C4.01767 5 3.90151 5 3.80491 5.01921C3.40822 5.09812 3.09812 5.40822 3.01921 5.80491C3 5.90151 3 6.01767 3 6.25C3 6.94698 3 7.29547 3.05764 7.58527C3.29436 8.77534 4.22466 9.70564 5.41473 9.94236C5.70453 10 6.05302 10 6.75 10H7H7.10002M12 17C12.93 17 13.395 17 13.7765 17.1022C14.8117 17.3796 15.6204 18.1883 15.8978 19.2235C16 19.605 16 20.07 16 21H8C8 20.07 8 19.605 8.10222 19.2235C8.37962 18.1883 9.18827 17.3796 10.2235 17.1022C10.605 17 11.07 17 12 17ZM7.10002 10C7.03443 9.67689 7 9.34247 7 9V4.57143C7 4.03831 7 3.77176 7.09903 3.56612C7.19732 3.36201 7.36201 3.19732 7.56612 3.09903C7.77176 3 8.03831 3 8.57143 3H15.4286C15.9617 3 16.2282 3 16.4339 3.09903C16.638 3.19732 16.8027 3.36201 16.901 3.56612C17 3.77176 17 4.03831 17 4.57143V9C17 9.34247 16.9656 9.67689 16.9 10" stroke="#EC9A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </G>
                                  </Svg>
                                  <Text style={styles.compPrizeTextNew}>{comp.prize}</Text>
                                </View>
                                <TouchableOpacity 
                                  style={styles.voteBtnNew}
                                  onPress={(e) => {
                                    e.stopPropagation();
                                    router.push(`/(main)/competition/live/${comp.id}?scrollToEntries=true` as any);
                                  }}
                                >
                                  <Text style={styles.voteBtnTextNew}>Vote Now</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  {upcomingComps.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Upcoming Competitions</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pastCompScroll}>
                        {upcomingComps.map((comp) => (
                          <TouchableOpacity 
                            key={comp.id} 
                            style={styles.compCardNew}
                            activeOpacity={0.9}
                            onPress={() => {
                              
                              router.push(`/(main)/competition/upcoming/${comp.id}` as any);
                            }}
                          >
                            <Image source={comp.image} style={styles.compCardImageNew} resizeMode="cover" />
                            <View style={styles.compCardContentNew}>
                              <Text style={styles.compCardTitleNew} numberOfLines={2}>{comp.title}</Text>
                              <View style={styles.compCardDetailsNew}>
                                <View style={styles.compDetailItemNew}>
                                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                                    <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#EC9A15" strokeWidth={2}/>
                                    <Path d="M16 2v4M8 2v4M3 10h18" stroke="#EC9A15" strokeWidth={2}/>
                                  </Svg>
                                  <Text style={styles.compDetailTextNew}>Starts: {comp.startDate}</Text>
                                </View>
                              </View>
                              <View style={styles.compCardFooterNew}>
                                <View style={styles.prizeRowNew}>
                                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                                    <G>
                                      <Path d="M12 14V17M12 14C9.58104 14 7.56329 12.2822 7.10002 10M12 14C14.419 14 16.4367 12.2822 16.9 10M17 5H19.75C19.9823 5 20.0985 5 20.1951 5.01921C20.5918 5.09812 20.9019 5.40822 20.9808 5.80491C21 5.90151 21 6.01767 21 6.25C21 6.94698 21 7.29547 20.9424 7.58527C20.7056 8.77534 19.7753 9.70564 18.5853 9.94236C18.2955 10 17.947 10 17.25 10H17H16.9M7 5H4.25C4.01767 5 3.90151 5 3.80491 5.01921C3.40822 5.09812 3.09812 5.40822 3.01921 5.80491C3 5.90151 3 6.01767 3 6.25C3 6.94698 3 7.29547 3.05764 7.58527C3.29436 8.77534 4.22466 9.70564 5.41473 9.94236C5.70453 10 6.05302 10 6.75 10H7H7.10002M12 17C12.93 17 13.395 17 13.7765 17.1022C14.8117 17.3796 15.6204 18.1883 15.8978 19.2235C16 19.605 16 20.07 16 21H8C8 20.07 8 19.605 8.10222 19.2235C8.37962 18.1883 9.18827 17.3796 10.2235 17.1022C10.605 17 11.07 17 12 17ZM7.10002 10C7.03443 9.67689 7 9.34247 7 9V4.57143C7 4.03831 7 3.77176 7.09903 3.56612C7.19732 3.36201 7.36201 3.19732 7.56612 3.09903C7.77176 3 8.03831 3 8.57143 3H15.4286C15.9617 3 16.2282 3 16.4339 3.09903C16.638 3.19732 16.8027 3.36201 16.901 3.56612C17 3.77176 17 4.03831 17 4.57143V9C17 9.34247 16.9656 9.67689 16.9 10" stroke="#EC9A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </G>
                                  </Svg>
                                  <Text style={styles.compPrizeTextNew}>{comp.prize}</Text>
                                </View>
                                <TouchableOpacity 
                                  style={styles.joinBtnNew}
                                  onPress={async (e) => {
                                    e.stopPropagation();
                                    
                                    const { validateKycBeforeCompetition } = await import('@utils/kycValidation');
                                    const isValid = await validateKycBeforeCompetition();
                                    if (!isValid) {
                                      return; 
                                    }
                                    
                                    router.push(`/(main)/competition/upcoming/${comp.id}` as any);
                                  }}
                                >
                                  <Text style={styles.joinBtnTextNew}>Join Now</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  {pastComps.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Past Competitions</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pastCompScroll}>
                        {pastComps.map((comp) => (
                          <TouchableOpacity 
                            key={comp.id} 
                            style={styles.compCardNew}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/(main)/competition/past/${comp.id}` as any)}
                          >
                            <Image source={comp.image} style={styles.compCardImageNew} resizeMode="cover" />
                            <View style={styles.compCardContentNew}>
                              <Text style={styles.compCardTitleNew} numberOfLines={2}>{comp.title}</Text>
                              <View style={styles.compCardDetailsNew}>
                                <View style={styles.compDetailItemNew}>
                                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700"/>
                                  </Svg>
                                  <Text style={styles.compDetailTextNew}>Winner: {comp.winner}</Text>
                                </View>
                              </View>
                              <View style={styles.compCardFooterNew}>
                                <View style={styles.prizeRowNew}>
                                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                                    <G>
                                      <Path d="M12 14V17M12 14C9.58104 14 7.56329 12.2822 7.10002 10M12 14C14.419 14 16.4367 12.2822 16.9 10M17 5H19.75C19.9823 5 20.0985 5 20.1951 5.01921C20.5918 5.09812 20.9019 5.40822 20.9808 5.80491C21 5.90151 21 6.01767 21 6.25C21 6.94698 21 7.29547 20.9424 7.58527C20.7056 8.77534 19.7753 9.70564 18.5853 9.94236C18.2955 10 17.947 10 17.25 10H17H16.9M7 5H4.25C4.01767 5 3.90151 5 3.80491 5.01921C3.40822 5.09812 3.09812 5.40822 3.01921 5.80491C3 5.90151 3 6.01767 3 6.25C3 6.94698 3 7.29547 3.05764 7.58527C3.29436 8.77534 4.22466 9.70564 5.41473 9.94236C5.70453 10 6.05302 10 6.75 10H7H7.10002M12 17C12.93 17 13.395 17 13.7765 17.1022C14.8117 17.3796 15.6204 18.1883 15.8978 19.2235C16 19.605 16 20.07 16 21H8C8 20.07 8 19.605 8.10222 19.2235C8.37962 18.1883 9.18827 17.3796 10.2235 17.1022C10.605 17 11.07 17 12 17ZM7.10002 10C7.03443 9.67689 7 9.34247 7 9V4.57143C7 4.03831 7 3.77176 7.09903 3.56612C7.19732 3.36201 7.36201 3.19732 7.56612 3.09903C7.77176 3 8.03831 3 8.57143 3H15.4286C15.9617 3 16.2282 3 16.4339 3.09903C16.638 3.19732 16.8027 3.36201 16.901 3.56612C17 3.77176 17 4.03831 17 4.57143V9C17 9.34247 16.9656 9.67689 16.9 10" stroke="#EC9A15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </G>
                                  </Svg>
                                  <Text style={styles.compPrizeTextNew}>{comp.prize}</Text>
                                </View>
                                <TouchableOpacity 
                                  style={styles.resultsBtnNew}
                                  onPress={(e) => {
                                    e.stopPropagation();
                                    router.push(`/(main)/competition/past/${comp.id}` as any);
                                  }}
                                >
                                  <Text style={styles.resultsBtnTextNew}>View Results</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </>
              );
            })()}

            {}
            <View style={styles.section}>
              <View style={[styles.sectionHeader, { justifyContent: 'center', width: '100%' }]}>
                <Text style={[styles.sectionTitle, { textAlign: 'center', width: '100%' }]}>Top Three Performers This Week</Text>
              </View>
              <View style={styles.topDancersContainer}>
                {}
                {topPerformers
                  .filter((d) => d.rank === 2)
                  .map((dancer) => {
                    const nameParts = dancer.name?.split(' ') || [];
                    const firstName = nameParts[0] || dancer.name || 'User';
                    const lastName = nameParts.slice(1).join(' ') || '';
                    return (
                      <TouchableOpacity 
                        key={dancer.rank} 
                        style={styles.topDancerSide}
                        onPress={() => {
                          
                          const userId = dancer.userId || `performer${dancer.rank}`;
                          const firstName = dancer.firstName || dancer.name?.split(' ')[0] || dancer.name || 'User';
                          const lastName = dancer.lastName || dancer.name?.split(' ').slice(1).join(' ') || '';
                          router.push({
                            pathname: "/(main)/profile/[id]",
                            params: {
                              id: userId,
                              userId: userId,
                              firstName: firstName,
                              lastName: lastName,
                              role: dancer.role || "participants",
                              bio: dancer.bio || "",
                            }
                          } as any);
                        }}
                        activeOpacity={0.8}
                      >
                        <View style={styles.dancerImageWrapper}>
                          <Image
                            source={dancer.image}
                            style={styles.dancerImageSide}
                          />
                          <View style={styles.rankBadge}>
                            <Text style={styles.rankBadgeText}>{dancer.rank}</Text>
                          </View>
                        </View>
                        <Text style={styles.dancerName} numberOfLines={1}>
                          {dancer.name}
                        </Text>
                        <Text style={styles.dancerPoints}>{dancer.points} pts</Text>
                        <View style={styles.followButtonSmall}>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                {}
                {topPerformers
                  .filter((d) => d.rank === 1)
                  .map((dancer) => {
                    const nameParts = dancer.name?.split(' ') || [];
                    const firstName = nameParts[0] || dancer.name || 'User';
                    const lastName = nameParts.slice(1).join(' ') || '';
                    return (
                      <TouchableOpacity 
                        key={dancer.rank} 
                        style={styles.topDancerCenter}
                        onPress={() => {
                          router.push({
                            pathname: "/(main)/profile/[id]",
                            params: {
                              id: dancer.userId || `performer${dancer.rank}`,
                              userId: dancer.userId || `performer${dancer.rank}`,
                              firstName: firstName,
                              lastName: lastName,
                              role: "participants",
                              bio: "",
                            }
                          } as any);
                        }}
                        activeOpacity={0.8}
                      >
                        <View style={styles.dancerImageWrapper}>
                          {}
                          <View style={styles.starIconWrapper}>
                            <Image
                              source={require("@assets/images/star.png")}
                              style={styles.starIcon}
                              resizeMode="contain"
                            />
                          </View>
                          <Image
                            source={dancer.image}
                            style={styles.dancerImageCenter}
                          />
                          <View style={styles.rankBadgeLarge}>
                            <Text style={styles.rankBadgeTextLarge}>
                              {dancer.rank}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.dancerNameCenter} numberOfLines={1}>
                          {dancer.name}
                        </Text>
                        <Text style={styles.dancerPointsCenter}>{dancer.points} pts</Text>
                        <View style={styles.followButtonCenter}>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                {}
                {topPerformers
                  .filter((d) => d.rank === 3)
                  .map((dancer) => {
                    const nameParts = dancer.name?.split(' ') || [];
                    const firstName = nameParts[0] || dancer.name || 'User';
                    const lastName = nameParts.slice(1).join(' ') || '';
                    return (
                      <TouchableOpacity 
                        key={dancer.rank} 
                        style={styles.topDancerSide}
                        onPress={() => {
                          
                          const userId = dancer.userId || `performer${dancer.rank}`;
                          const firstName = dancer.firstName || dancer.name?.split(' ')[0] || dancer.name || 'User';
                          const lastName = dancer.lastName || dancer.name?.split(' ').slice(1).join(' ') || '';
                          router.push({
                            pathname: "/(main)/profile/[id]",
                            params: {
                              id: userId,
                              userId: userId,
                              firstName: firstName,
                              lastName: lastName,
                              role: dancer.role || "participants",
                              bio: dancer.bio || "",
                            }
                          } as any);
                        }}
                        activeOpacity={0.8}
                      >
                        <View style={styles.dancerImageWrapper}>
                          <Image
                            source={dancer.image}
                            style={styles.dancerImageSide}
                          />
                          <View style={styles.rankBadge}>
                            <Text style={styles.rankBadgeText}>{dancer.rank}</Text>
                          </View>
                        </View>
                        <Text style={styles.dancerName} numberOfLines={1}>
                          {dancer.name}
                        </Text>
                        <Text style={styles.dancerPoints}>{dancer.points} pts</Text>
                        <View style={styles.followButtonSmall}>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.reelsGrid}>
              {sampleReels.map((reel) => (
                <TouchableOpacity 
                  key={reel.id} 
                  style={styles.reelCard}
                  onPress={() => router.push(`/(main)/reel?reelId=${reel.id}&categoryId=${categoryId}&from=category` as any)}
                  activeOpacity={0.9}
                >
                  <Image source={reel.thumbnail} style={styles.reelImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.reelGradient}
                  >
                    <View style={styles.reelStats}>
                      <View style={styles.reelStat}>
                        {


}
                        {}
                      </View>
                      <View style={styles.reelStat}>
                        {

}
                        {}
                      </View>
                    </View>
                    {}
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {}
      <Modal
        visible={filterVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterVisible(false)}
        >
          <View style={styles.filterPopup}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterHeaderText}>Select Category</Text>
            </View>
            {(allCategories.length > 0 ? allCategories : [{ id: '1', name: 'Dancing' }, { id: '2', name: 'Music' }, { id: '3', name: 'Comedy' }, { id: '4', name: 'Cook' }]).map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterOption,
                  selectedCategoryId == cat.id.toString() && styles.filterOptionActive
                ]}
                onPress={() => {
                  setSelectedCategoryId(cat.id.toString());
                  setFilterVisible(false);
                  router.replace(`/(main)/category/${cat.id}` as any);
                }}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedCategoryId == cat.id.toString() && styles.filterOptionTextActive
                ]}>
                  {cat.name}
                </Text>
                {selectedCategoryId == cat.id.toString() && (
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path d="M20 6L9 17l-5-5" stroke="#EC9A15" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3C2610",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  categoryDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  categoryDropdownText: {
    color: "#fff",
    fontSize: 16,
  },
  heroSection: {
    width: width,
    height: height * 0.28,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  heroContent: {
    alignItems: "flex-start",
  },
  heroTitle: {
    fontSize: width * 0.08,
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 2,
  },
  heroTagline: {
    fontSize: width * 0.038,
    color: "#fff",
    marginBottom: 20,
    opacity: 0.9,
  },
  followBtn: {
    backgroundColor: "#EC9A15",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  followingBtn: {
    backgroundColor: "#2a2a2a",
    borderWidth: 1.5,
    borderColor: "#EC9A15",
  },
  followBtnText: {
    color: "#fff",
    fontSize: 14,
  },
  statsSection: {
    flexDirection: "row",
    backgroundColor: "#40301F",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statItemCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#3a3a3a",
  },
  statNumber: {
    fontSize: 15,
    color: "#EC9A15",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  tabButtons: {
    flexDirection: "row",
    backgroundColor: "#40301F",
    paddingVertical: 8,
    paddingHorizontal: 20,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  tabButtonActive: {
    backgroundColor: "#EC9A15",
  },
  tabButtonText: {
    fontSize: 15,
    color: "#999",
  },
  tabButtonTextActive: {
    color: "#fff",
  },
  content: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    color: "#fff",
    marginBottom: 12,
  },
  compCard: {
    backgroundColor: "#40301F",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compCardImage: {
    width: "100%",
    height: 200,
  },
  compCardContent: {
    padding: 9,
  },
  compCardTitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 7,
    marginTop: 7,
    lineHeight: 18,
    fontWeight: "bold",
  },
  compCardDetails: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 7,
    flexWrap: "wrap",
  },
  compDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  compDetailText: {
    fontSize: 11,
    color: "#ccc",
  },
  compCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 3,
  },
  prizeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(255, 215, 0, 0.12)",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 12,
  },
  prizeText: {
    fontSize: 13,
    color: "#FFD700",
  },
  voteBtn: {
    backgroundColor: "#EC9A15",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#EC9A15",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  voteBtnText: {
    color: "#fff",
    fontSize: 13,
  },
  joinBtn: {
    backgroundColor: "rgba(236, 154, 21, 0.15)",
    borderWidth: 1.5,
    borderColor: "#EC9A15",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  joinBtnText: {
    color: "#EC9A15",
    fontSize: 11,
  },
  pastCompScroll: {
    gap: 15,
  },
  pastCompCard: {
    width: width * 0.6,
    height: 280,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#2a2a2a",
  },
  pastCompImage: {
    width: "100%",
    height: "100%",
  },
  pastCompGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 16,
    justifyContent: "flex-end",
  },
  pastCompTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  winnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  winnerText: {
    fontSize: 13,
    color: "#ccc",
  },
  prizeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  pastCompPrize: {
    fontSize: 15,
    color: "#EC9A15",
  },
  resultsBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  resultsBtnText: {
    color: "#fff",
    fontSize: 13,
  },
  
  topDancersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: width * 0.04,
    paddingVertical: 15,
    paddingHorizontal: width * 0.02,
    marginTop: 30,
  },
  topDancerSide: {
    alignItems: "center",
    flex: 1,
  },
  topDancerCenter: {
    alignItems: "center",
    flex: 1,
    marginBottom: 20,
  },
  dancerImageWrapper: {
    position: "relative",
    marginBottom: 6,
  },
  
  dancerImageSide: {
    width: width * 0.24,
    height: width * 0.24,
    borderRadius: width * 0.5,
    borderWidth: 2.5,
    borderColor: "#EC9A15",
  },
  
  dancerImageCenter: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: width * 0.14,
    borderWidth: 2.5,
    borderColor: "#EC9A15",
  },
  starIconWrapper: {
    position: "absolute",
    top: -45,
    alignSelf: "center",
    zIndex: 10,
  },
  starIcon: {
    width: 50,
    height: 60,
  },
  rankBadge: {
    position: "absolute",
    top: 80,
    left: 30,
    backgroundColor: "#EC9A15",
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.050,
    justifyContent: "center",
    alignItems: "center",
  },
  rankBadgeLarge: {
    position: "absolute",
    top: 95,
    left: 40,
    backgroundColor: "#EC9A15",
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.050,
    justifyContent: "center",
    alignItems: "center",
  },
  rankBadgeText: {
    color: "#fff",
    fontSize: width * 0.028,
    fontWeight: "700",
  },
  rankBadgeTextLarge: {
    color: "#fff",
    fontSize: width * 0.035,
    fontWeight: "700",
  },
  dancerName: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 2,
    fontWeight: "700",
  },
  dancerNameCenter: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 2,
    fontWeight: "700",
  },
  dancerPoints: {
    color: "#fff",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 6,
    fontWeight: "400",
  },
  dancerPointsCenter: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "400",
  },
  followButtonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  followButtonSmallText: {
    color: "#fff",
    fontSize: width * 0.025,
  },
  followButtonCenter: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  followButtonCenterText: {
    color: "#000",
    fontSize: width * 0.028,
  },
  reelsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
  },
  reelCard: {
    width: (width - 50) / 2,
    height: 260,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#2a2a2a",
    marginBottom: 10,
  },
  reelImage: {
    width: "100%",
    height: "100%",
  },
  reelGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  reelStats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 6,
  },
  reelStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reelStatText: {
    fontSize: 11,
    color: "#fff",
  },
  reelCreator: {
    fontSize: 12,
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterPopup: {
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    width: "80%",
    maxHeight: "60%",
    overflow: "hidden",
  },
  filterHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  filterHeaderText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  filterOptionActive: {
    backgroundColor: "rgba(236, 154, 21, 0.1)",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#fff",
  },
  filterOptionTextActive: {
    color: "#EC9A15",
  },
  filterContainer: {
    backgroundColor: "#40301F",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#rgba(130, 94, 35, 0.1)",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  filterChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "#1a1a1a",
    borderWidth: 1.5,
    borderColor: "#3a3a3a",
    minHeight: 38,
  },
  filterChipActive: {
    backgroundColor: "#EC9A15",
    borderColor: "#EC9A15",
    shadowColor: "#EC9A15",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipText: {
    fontSize: 13,
    color: "#999",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF3B30",
    marginRight: 6,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: "#999",
  },
  
  compCardNew: {
    width: width * 0.75,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#40301F",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  compCardImageNew: {
    width: "100%",
    height: 250,
  },
  compCardContentNew: {
    backgroundColor: "#40301F",
    padding: 12,
  },
  compCardTitleNew: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 20,
  },
  compCardDetailsNew: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  compDetailItemNew: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  compDetailTextNew: {
    fontSize: 12,
    color: "#ccc",
  },
  compCardFooterNew: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prizeRowNew: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  compPrizeTextNew: {
    fontSize: 14,
    color: "#EC9A15",
    fontWeight: "600",
  },
  voteBtnNew: {
    backgroundColor: "#EC9A15",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  voteBtnTextNew: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  joinBtnNew: {
    backgroundColor: "#EC9A15",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinBtnTextNew: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  resultsBtnNew: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resultsBtnTextNew: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
