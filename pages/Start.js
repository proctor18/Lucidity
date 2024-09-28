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
      <Text style={styles.headerText}>
        Empowering students and tutors with seamless scheduling.
      </Text>
      <Text style={styles.paragraph}>
        Connecting students and tutors has never been easier. Explore the
        largest network of available sessions and schedule your learning or
        teaching with ease.
      </Text>

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
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 32,
    marginBottom: 50,
  },
  paragraph: {
    fontSize: 15,
    marginBottom: 30,
    marginTop: 25,
  },
  headerText: {
    fontSize: 21,
    fontWeight: "bold",
  },

  // Placeholder box, add cool graphic or something
  placeholder: {
    backgroundColor: "grey",
    borderRadius: 32,
    width: "100%",
    height: 400,
    marginBottom: 20,
  },
});
