import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  circularCategoryWrapper: {
    alignItems: "center",
    marginRight: width * 0.06,
  },
  circularCategory: {
    width: width * 0.16,
    height: width * 0.16,
    borderRadius: width * 0.08,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#55402D",
    borderWidth: 2,
    borderColor: "#55402D",
    shadowColor: "#000",
  },
  circularCategoryName: {
    color: "#fff",
    fontSize: width * 0.032,
    lineHeight: width * 0.04,
    fontWeight: "500",
    width: width * 0.16 + 12,
    textAlign: "center",
    alignSelf: "center",
  },
  circularCategoryNameActive: {
    color: "#EC9A15",
  },
});