import { Dimensions, StyleSheet } from "react-native";
const getDimensions = () => Dimensions.get("window");
const { width } = getDimensions();
export const styles = StyleSheet.create({
  categoriesScroll: {
    paddingRight: width * 0.06,
    paddingBottom: 15,
    paddingTop: 5,
    paddingLeft: width * 0.02,
  },
  section: {
    paddingHorizontal: width * 0.05,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: width * 0.044,
    color: "#fff",
    letterSpacing: 0.2,
    fontFamily: "Inter_600SemiBold",
  },
});
