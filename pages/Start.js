import { View, Text, StyleSheet } from "react-native";
import Button from "../components/Button.js";

export default function Start({ navigation }) {
  function navigationHandle() {
    navigation.navigate("Login");
  }
  function navigationHandleTwo() {
    navigation.navigate("Signup");
  }
  return (
    <View style={styles.container}>
      <View style={styles.placeholder} />

      <View style={styles.buttonContainer}>
        <Button type="small" text="Login" callback={navigationHandle} />
        <Button type="small" text="Sign up" callback={navigationHandleTwo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 10,
    marginBottom: 16,
    marginTop: 70,
  },
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 70,
  },

  // Placeholder box, add cool graphic or something
  placeholder: {
    backgroundColor: "#222",
    borderRadius: 32,
    width: "100%",
    height: 400,
    marginBottom: 20,
  },
});
