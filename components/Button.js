import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";

const IMAGE_MAP = {
  google: require("../assets/icons/google.png"),
  linkedin: require("../assets/icons/linkedin.png"),
  rightarrow: require("../assets/icons/rightarrow.png"),
};

export default function Button({ type, text, callback, leading, trailing  , active }) {
  return (
    <View style={styles.container}>
      {type === "small" && (
        <TouchableOpacity style={styles.small} onPress={callback}>
          <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
      )}
      {type === "medium" && (
        <TouchableOpacity style={styles.medium} onPress={callback}>
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
      {type === "chip" && (
        <TouchableOpacity style={[styles.chip  , active && styles.activeChip ]} onPress={callback}>
          {leading && (
            <Image
              style={styles.chipImage}
              source={IMAGE_MAP[leading]}
            />
          )}
          <Text style={styles.textChip}>{text}</Text>
          {trailing && (
            <Image
              style={styles.chipImage}
              source={IMAGE_MAP[trailing]}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  small: {
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#222",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#2F2F31",
  },
  text: {
    fontWeight: "bold",
    color: "white",
    fontSize: 18,
  },
  textMedium: {
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
  },
  medium: {
    flexDirection: "row",
    paddingVertical: 14,
    gap: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#2F2F31",
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    backgroundColor: "#222",
  },
  buttonImage: {
    height: 18,
    width: 18,
  },
  chip: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 34, // Change to 16 when you add the images 
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#2F2F31",
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    backgroundColor: "#222",
  },
  activeChip  : {
    backgroundColor : "red",
  },
  chipImage: {
    height: 18,
    width: 18,
  },
  textChip: {
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
  },
});
