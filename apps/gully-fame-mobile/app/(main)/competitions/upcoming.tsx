import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import Svg, { Path, Circle, G, Rect } from "react-native-svg";

const { width, height } = Dimensions.get("window");


const upcomingCompetitions = [
  {
    id: 1,
    title: "Bollywood Beats 2026",
    category: "Bollywood",
    location: "Delhi NCR",
    startsOn: "Starts Nov 15",
    registered: 450,
    entryFee: "Free Entry",
    image: require("@assets/images/trending1.png"),
  },
  {
    id: 2,
    title: "Classical Carnival",
    category: "Classical",
    location: "Chennai",
    startsOn: "Starts Nov 20",
    registered: 280,
    entryFee: "100 Coins",
    image: require("@assets/images/trending2.png"),
  },
];

const topPerformersOfWeek = [
  {
    id: 1,
    rank: 1,
    name: "Aarav M.",
    username: "@AaravMoves",
    coins: 2450,
    image: require("@assets/images/user1.png"),
    wins: 15,
  },
  {
    id: 2,
    rank: 2,
    name: "Priya K.",
    username: "@BeatQueen",
    coins: 2180,
    image: require("@assets/images/user2.png"),
    wins: 12,
  },
  {
    id: 3,
    rank: 3,
    name: "Rohan S.",
    username: "@RhythmRiot",
    coins: 2050,
    image: require("@assets/images/user1.png"),
    wins: 10,
  },
  
];

export default function UpcomingCompetitionsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C2610" />

      {}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="#fff"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upcoming Competitions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        <View style={styles.competitionsSection}>
          <Text style={styles.sectionTitle}>Register Now</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pastCompScroll}
          >
            {upcomingCompetitions.map((comp) => (
              <TouchableOpacity
                key={comp.id}
                style={styles.compCardNew}
                activeOpacity={0.9}
                onPress={() =>
                  router.push(`/(main)/competition/upcoming/${comp.id}` as any)
                }
              >
                <View style={styles.compCardImageWrapper}>
                  <Image
                    source={comp.image}
                    style={styles.compCardImageNew}
                    resizeMode="cover"
                  />

                  {}
                  <View style={styles.upcomingBadge}>
                    <Text style={styles.upcomingBadgeText}>Upcoming</Text>
                  </View>

                  {}
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateBadgeText}>{comp.startsOn}</Text>
                  </View>
                </View>

                <View style={styles.compCardContentNew}>
                  <Text style={styles.compCardTitleNew} numberOfLines={2}>
                    {comp.title}
                  </Text>
                  <Text style={styles.compCardSubtitle}>
                    {comp.category} • {comp.location}
                  </Text>
                  <View style={styles.compCardDetailsNew}>
                    <View style={styles.compDetailItemNew}>
                      {}
                      <Svg
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <Path
                          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                          stroke="#EC9A15"
                          strokeWidth={2}
                        />
                        <Circle
                          cx="9"
                          cy="7"
                          r="4"
                          stroke="#EC9A15"
                          strokeWidth={2}
                        />
                      </Svg>
                      <Text style={styles.compDetailTextNew}>
                        {comp.registered} Registered
                      </Text>
                    </View>
                  </View>
                  <View style={styles.compCardFooterNew}>
                    <View style={styles.prizeRowNew}>
                      <Text style={styles.compPrizeTextNew}>
                        {comp.entryFee}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.actionBtnNew}
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/(main)/competition/upcoming/${comp.id}` as any,
                        );
                      }}
                    >
                      <Text style={styles.actionBtnTextNew}>Join Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {}
        <View style={styles.topPerformersSection}>
          <View style={styles.sectionHeader}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <G>
                <Path
                  d="M12 14V17M12 14C9.58104 14 7.56329 12.2822 7.10002 10M12 14C14.419 14 16.4367 12.2822 16.9 10M17 5H19.75C19.9823 5 20.0985 5 20.1951 5.01921C20.5918 5.09812 20.9019 5.40822 20.9808 5.80491C21 5.90151 21 6.01767 21 6.25C21 6.94698 21 7.29547 20.9424 7.58527C20.7056 8.77534 19.7753 9.70564 18.5853 9.94236C18.2955 10 17.947 10 17.25 10H17H16.9M7 5H4.25C4.01767 5 3.90151 5 3.80491 5.01921C3.40822 5.09812 3.09812 5.40822 3.01921 5.80491C3 5.90151 3 6.01767 3 6.25C3 6.94698 3 7.29547 3.05764 7.58527C3.29436 8.77534 4.22466 9.70564 5.41473 9.94236C5.70453 10 6.05302 10 6.75 10H7H7.10002M12 17C12.93 17 13.395 17 13.7765 17.1022C14.8117 17.3796 15.6204 18.1883 15.8978 19.2235C16 19.605 16 20.07 16 21H8C8 20.07 8 19.605 8.10222 19.2235C8.37962 18.1883 9.18827 17.3796 10.2235 17.1022C10.605 17 11.07 17 12 17ZM7.10002 10C7.03443 9.67689 7 9.34247 7 9V4.57143C7 4.03831 7 3.77176 7.09903 3.56612C7.19732 3.36201 7.36201 3.19732 7.56612 3.09903C7.77176 3 8.03831 3 8.57143 3H15.4286C15.9617 3 16.2282 3 16.4339 3.09903C16.638 3.19732 16.8027 3.36201 16.901 3.56612C17 3.77176 17 4.03831 17 4.57143V9C17 9.34247 16.9656 9.67689 16.9 10"
                  stroke="#FFD700"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </G>
            </Svg>
            <Text style={styles.topPerformersTitle}>
              Top Performers of Week
            </Text>
          </View>

          <View style={styles.topDancersContainer}>
            {}
            <View style={styles.topDancerSide}>
              <View style={styles.dancerImageWrapper}>
                <Image
                  source={topPerformersOfWeek[1].image}
                  style={styles.dancerImageSide}
                />
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>2</Text>
                </View>
              </View>
              <Text style={styles.dancerName} numberOfLines={1}>
                {topPerformersOfWeek[1].name}
              </Text>
              <Text style={styles.dancerPoints}>
                {topPerformersOfWeek[1].coins} coins
              </Text>
            </View>

            {}
            <View style={styles.topDancerCenter}>
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
                  source={topPerformersOfWeek[0].image}
                  style={styles.dancerImageCenter}
                />
                <View style={styles.rankBadgeLarge}>
                  <Text style={styles.rankBadgeTextLarge}>1</Text>
                </View>
              </View>
              <Text style={styles.dancerNameCenter} numberOfLines={1}>
                {topPerformersOfWeek[0].name}
              </Text>
              <Text style={styles.dancerPointsCenter}>
                {topPerformersOfWeek[0].coins} coins
              </Text>
            </View>

            {}
            <View style={styles.topDancerSide}>
              <View style={styles.dancerImageWrapper}>
                <Image
                  source={topPerformersOfWeek[2].image}
                  style={styles.dancerImageSide}
                />
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>3</Text>
                </View>
              </View>
              <Text style={styles.dancerName} numberOfLines={1}>
                {topPerformersOfWeek[2].name}
              </Text>
              <Text style={styles.dancerPoints}>
                {topPerformersOfWeek[2].coins} coins
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  
  upcomingBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#1E88E5", 
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  upcomingBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  actionBtnNew: {
    backgroundColor: "#EC9A15",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnTextNew: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
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
    backgroundColor: "#3C2610",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 30,
  },
  competitionsSection: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 14,
    fontWeight: "700",
  },
  pastCompScroll: {
    gap: 15,
    paddingHorizontal: 0,
  },
  compCardNew: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#40301F",
    marginRight: 15,
    width: width * 0.75,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  compCardImageWrapper: {
    position: "relative",
    width: "100%",
  },
  compCardImageNew: {
    width: "100%",
    height: 220,
  },
  compCardContentNew: {
    backgroundColor: "#40301F",
    padding: 12,
  },
  completedBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completedBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  dateBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(60, 38, 16, 0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
  },
  compCardTitleNew: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    marginTop: 0,
    marginBottom: 4,
  },
  compCardSubtitle: {
    fontSize: 13,
    color: "#ccc",
    marginBottom: 8,
  },
  compCardDetailsNew: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  compDetailItemNew: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  compDetailTextNew: {
    fontSize: 12,
    color: "#ccc",
  },
  compCardFooterNew: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
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
  resultsBtnNew: {
    backgroundColor: "#EC9A15",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resultsBtnTextNew: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  
  topPerformersSection: {
    padding: 16,
    paddingHorizontal: 16,
    marginTop: 20,
    backgroundColor: "#40301F",
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  topPerformersTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  topDancersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: width * 0.04,
    paddingVertical: 15,
    paddingHorizontal: width * 0.02,
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
    borderRadius: width * 0.12,
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
    bottom: -15,
    alignSelf: "center",
    backgroundColor: "#EC9A15",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#3C2610",
  },
  rankBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  rankBadgeLarge: {
    position: "absolute",
    bottom: -15,
    alignSelf: "center",
    backgroundColor: "#EC9A15",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#3C2610",
  },
  rankBadgeTextLarge: {
    color: "#fff",
    fontSize: 16,
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
  
});
