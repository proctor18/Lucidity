import { View, Text, StyleSheet, Alert } from "react-native";
import { useState } from 'react';
import { supabase } from '../lib/supabase.js'; // Properly import please 
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
      const { data, error } = await supabase
        .from('users')
        .select('role_id')
        .eq('email', email)
        .single();

      if (data) {
        Alert.alert("Email already exists", "Please sign in or utilize a unique email.");
      } else {
        const userId = uuidv4(); // generate uuid for the user 
        const { error } = await supabase
          .from('users')
          .insert({
            first_name: fname,
            last_name: lname,
            email: email,
            password: password,
            user_id : userId
          });

        if (!error) {
          navigation.navigate("PopulateInfo" , {
            first_name: fname,
            last_name: lname,
            email: email,
            user_id : userId
          });
        } else {
          throw error;
        }
      }
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
{/*----------------------------------------------------------------  Name -----------------------------------------------------------------------*/}

        <Text style={styles.Label}>Name</Text>

        <Input placeholder="First Name" callback={setFName} value={fname} />

        <Input placeholder="Last Name" callback={setLName} value={lname} />

{/*----------------------------------------------------------------  Name -----------------------------------------------------------------------*/}

{/*----------------------------------------------------------------  Email -----------------------------------------------------------------------*/}

        {/* Email */}
        <Text style={styles.Label}>Email</Text>
        <Input placeholder="Email" callback={setEmail} value={email} />
        {/* First name */}
        <Text style={styles.Label}>Password</Text>
        <Input placeholder="Password" callback={setPassword} value={password} />
        <Input placeholder="Confirm password" callback={setCMPPassword} value={cmpPassword} />
      </View>

{/*----------------------------------------------------------------  Email -----------------------------------------------------------------------*/}

      <View style={styles.buttonContainer}>
        <Button type="small" text="Continue" callback={insertCredentials}/>
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
    // backgroundColor: "#0F0F0F",
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
    fontSize: "25px",
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
    fontSize: "17px",
    fontWeight: "bold",
  },
});
