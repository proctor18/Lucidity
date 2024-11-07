// Login.js
import React, { useState, useContext } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { supabase } from '../lib/supabase.js';
import Button from "../components/Button";
import Input from "../components/Input";
import { UserContext } from '../components/UserContext.js';

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  async function validateCredentials() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data: tutorData, error: tutorError } = await supabase
        .from('tutors')
        .select('role_id, first_name, last_name, email, tutor_id')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (tutorError && tutorError.code !== 'PGRST116') {
        Alert.alert("Error", "An error occurred while verifying tutor credentials.");
        console.error("Tutor verification error:", tutorError);
        return;
      }

      if (tutorData) {
        // Set the user data in context for tutor
        setUser({
          email: tutorData.email,
          first_name: tutorData.first_name,
          last_name: tutorData.last_name,
          role_id: tutorData.role_id,
          user_id: tutorData.tutor_id,
        });
      
        // Navigate to MainTabs with tutor information as params
        navigation.reset({
          index: 0,
          routes: [{ 
            name: 'MainTabs',
            params: { 
              email: tutorData.email,
              first_name: tutorData.first_name,
              last_name: tutorData.last_name,
              role_id: tutorData.role_id,
              user_id: tutorData.tutor_id,
            },
          }],
        });
        return;
      }
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('role_id, first_name, last_name, email, student_id')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (studentError && studentError.code !== 'PGRST116') {
        Alert.alert("Error", "An error occurred while verifying student credentials.");
        console.error("Student verification error:", studentError);
        return;
      }

      if (studentData) {
        // Set the user data in context
        setUser({
          email: studentData.email,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          role_id: studentData.role_id,
          user_id: studentData.student_id,
        });
      
        // Then navigate to MainTabs
        navigation.reset({
          index: 0,
          routes: [{ 
            name: 'MainTabs',
            params: { 
              email: studentData.email,
              first_name: studentData.first_name,
              last_name: studentData.last_name,
              role_id: studentData.role_id,
              user_id: studentData.student_id,
            },
          }],
        });
        return;
      }

      Alert.alert("Error", "Invalid email or password.");

    } catch (error) {
      Alert.alert("Error", "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}></View>
      <Text style={styles.loginHeader}>Login</Text>
      <View style={styles.rowOne}>
        <Input 
          placeholder="Email" 
          callback={setEmail} 
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input 
          placeholder="Password" 
          callback={setPassword} 
          value={password} 
          secureTextEntry 
        />
        <Button 
          type="small" 
          text={loading ? "Loading..." : "Continue"} 
          callback={validateCredentials} 
          disabled={loading} 
        />
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
    backgroundColor: "#1A1A1A",
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
