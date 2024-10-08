//Things to add to this component 
// Trailing number which represents the number of subclasses of the subject 
// On expand to show other ones we want to render




import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";

const IMAGE_MAP = {
  google: require("../assets/icons/google.png"),
  linkedin: require("../assets/icons/linkedin.png"),
  rightarrow: require("../assets/icons/rightarrow.png"),
};

export default function ButtonChip({ type, text, callback, leading, trailing }) {
  return (
    <View style={styles.container}>
      {type === "regular" && (
        <TouchableOpacity style={styles.medium} onClick={callback}>
          {leading && (
            <Image
              style={styles.buttonImage}
              source={IMAGE_MAP[leading]} 
            />
          )}
          <Text style={styles.textMedium}>{text}</Text>
          {trailing && (
            <Image
              style={styles.buttonImage}
              source={IMAGE_MAP[trailing]} 
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textMedium: {
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
  },
  medium: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingVertical: 32,
    gap: 12,
    color: "white",
    alignItems: "space-between",
    justifyContent: "center",
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    fontWeight: "light",
    backgroundColor: "#222",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#2F2F31",
  },
  buttonImage: {
    height: 18,
    width: 18,
  },
});
