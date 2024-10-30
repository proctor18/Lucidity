import { View, Text, StyleSheet, Alert } from "react-native";
import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import Button from "../components/Button.js";
import Input from "../components/Input";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function Signup({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cmpPassword, setCMPPassword] = useState("");

  async function insertCredentials() {
    if (!fname || !lname || !email || !password || !cmpPassword) {
      Alert.alert("Error", "Please Enter valid values for all the fields.");
      return;
    }
    if (password !== cmpPassword) {
      Alert.alert("Error", "The Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('email')
        .eq('email', email)
        .single();

      const { data: tutorData, error: tutorError } = await supabase
        .from('tutors')
        .select('email')
        .eq('email', email)
        .single();

      if (studentData || tutorData) {
        Alert.alert("Email already exists", "Please sign in or utilize a unique email.");
        setLoading(false);
        return;
      }

      const userId = uuidv4();
      navigation.navigate("PopulateInfo", {
        first_name: fname,
        last_name: lname,
        email: email,
        password: password,
        user_id: userId
      });

    } catch (error) {
      console.log("Error Occurred", error);
      Alert.alert("Error", "An error occurred while signing up. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.placeholder} />
      <Text style={styles.signUpHeader}>Sign up</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.Label}>Name</Text>
        <Input placeholder="First Name" callback={setFName} value={fname} />
        <Input placeholder="Last Name" callback={setLName} value={lname} />

        <Text style={styles.Label}>Email</Text>
        <Input placeholder="Email" callback={setEmail} value={email} />
        
        <Text style={styles.Label}>Password</Text>
        <Input 
          placeholder="Password" 
          callback={setPassword} 
          value={password} 
          secureTextEntry={true}
        />
        <Input 
          placeholder="Confirm password" 
          callback={setCMPPassword} 
          value={cmpPassword}
          secureTextEntry={true}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          type="small" 
          text="Continue" 
          callback={insertCredentials}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 10,
    marginBottom: 50,
  },
  container: {
    backgroundColor: "black",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 30,
  },
  infoContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 16,
  },
  signUpHeader: {
    fontSize: 25, // Fixed px unit
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 100,
    height: 100,
    backgroundColor: "#222",
    borderRadius: 32,
  },
  Label: {
    color: "white",
    fontSize: 17, // Fixed px unit
    fontWeight: "bold",
  },
});
