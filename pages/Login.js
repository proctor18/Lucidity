import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { createClient } from '@supabase/supabase-js';
import Button from "../components/Button";
import Input from "../components/Input";

// Supabase client configuration
const supabaseUrl = 'https://tqtqpftsctrshouqpcej.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHFwZnRzY3Ryc2hvdXFwY2VqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODg5MTU0MywiZXhwIjoyMDQ0NDY3NTQzfQ.2h9rCohCCLwl1AGT8Kg8CXjp7fw87jYSV3zz6qRtKxs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstNames, setFirstNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  function validateCredentials() {
    if (password && email) {
      navigation.navigate("PopulateInfo");
    }
    // ------------------- Error Handling ----------------
    // ------------------- Error Handling ----------------
  }

  useEffect(() => {
    async function fetchFirstNames() {
      try {
        // Fetch first names from the users table
        const { data, error } = await supabase
          .from('users')
          .select('role_id')

        if (error) {
          console.error("Error fetching data:", error);
          setError(error.message);
          return; 
        }

        // Log the received data
        console.log("Fetched data:", data);

        if (data && data.length > 0) {
          setFirstNames(data);
        } else {
          console.log("No data found in response");
          setFirstNames([]); // No users found
        }
      } catch (error) {
        console.error("Error caught in catch block:", error);
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Hide loading state
      }
    }

    fetchFirstNames();
  }, [email , password]);

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
    // backgroundColor: "#0F0F0F",
    backgroundColor: "black",
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
    opacity : 0.4,
  },
  dividerText: {
    color: "#E5E7EB",
    fontSize: 14,
    paddingHorizontal: 10,
    opacity : 0.4,
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
