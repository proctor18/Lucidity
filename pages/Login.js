import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateCredentials() {
    // we can check db here
    if (password && email) {
      // just check if they are populated for now
      navigation.navigate("PopulateInfo");
    }
    // ------------------- Error Handling ----------------
    // ------------------- Error Handling ----------------
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}></View>
      <Text style={styles.loginHeader}>Login</Text>
      <View style={styles.rowOne}>
        <Input placeholder="Email" callback={setEmail} value={email} />
        <Input placeholder="Password" callback={setPassword} value={password} />
        <Button type="small" text="Continue" callback={validateCredentials} />
      </View>
      <View style={styles.rowTwo}>
        <View style={styles.divider}></View>
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider}></View>
      </View>
      <View style={styles.rowThree}>
        <Button
          type="medium"
          text="Sign in with Google"
          trailing="rightarrow"
          leading="google"
        />
        <Button
          type="medium"
          text="Sign in with LinkedIn"
          trailing="rightarrow"
          leading="linkedin"
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  imageContainer: {
    height: 100,
    width: 100,
    backgroundColor: "white",
    borderRadius: 24,
    opacity: 0.1,
    marginBottom: 24,
  },
  container: {
    backgroundColor: "#0F0F0F",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loginHeader: {
    fontSize: "25px",
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
    color: "white",
  },
  rowOne: {
    width: "100%",
    gap: 16,
    marginBottom: 16,
  },
  rowTwo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
    marginVertical: 16,
  },
  divider: {
    backgroundColor: "#E5E7EB",
    height: 1,
    flex: 1,
  },
  dividerText: {
    color: "#E5E7EB",
    fontSize: 14,
    paddingHorizontal: 10,
  },
  rowThree: {
    width: "100%",
    gap: 10,
    marginTop: 16,
  },
  infoInputs: {
    backgroundColor: "#222",
  },
});
