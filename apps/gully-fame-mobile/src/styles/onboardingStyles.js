import { StyleSheet } from "react-native";

export const onboardingStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 120,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    lineHeight: 44,
    textAlign: "left",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 17,
    color: "white",
    lineHeight: 28,
    textAlign: "left",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
  skipButton: {},
  skip: { 
    color: "white", 
    fontSize: 14, 
    fontWeight: "400" 
  },
  dots: { 
    flexDirection: "row" 
  },
  dot: {
    width: 30,
    height: 3,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 5,
  },
  activeDot: { 
    backgroundColor: "white" 
  },
  nextButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});