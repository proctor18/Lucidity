import React, { useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import supabase from '../lib/supabase.js' ; 
import Button from "../components/Button";
import Input from "../components/Input";


export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function validateCredentials() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('role_id') 
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "An error occurred while verifying credentials.");
        return;
      }

      if (data) {
        console.log("Login successful:", data);
        navigation.navigate("PopulateInfo"); // Check to see if role_id exists , if it does then this implies that the user has gone through onboarding , change this to navigate to the start screen . 
      } else {
        Alert.alert("Error", "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error caught in catch block:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}></View>
      <Text style={styles.loginHeader}>Login</Text>
      <View style={styles.rowOne}>
        <Input placeholder="Email" callback={setEmail} value={email} />
        <Input placeholder="Password" callback={setPassword} value={password} secureTextEntry />
        <Button type="small" text={loading ? "Loading..." : "Continue"} callback={validateCredentials} disabled={loading} />
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
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loginHeader: {
    fontSize: 25,
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
    opacity: 0.4,
  },
  dividerText: {
    color: "#E5E7EB",
    fontSize: 14,
    paddingHorizontal: 10,
    opacity: 0.4,
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
