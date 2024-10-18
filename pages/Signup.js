import { View, Text, StyleSheet } from "react-native";
import { useState } from 'react' ; 
import supabase from '../lib/supabase.js' ; 
import Button from "../components/Button.js";
import Input from "../components/Input";

export default function Signup() {
  const [ loading, setLoading ] = useState(false) ; 
  const [ fname, setFName ] = useState("") ; 
  const [ lname, setLName ] = useState("") ; 
  const [ email , setEmail ] = useState("") ; 

  async function insertCredentials(){ // function to inkkjsert values into the user table  

  }
  return (
    <View style={styles.container}>
      <View style={styles.placeholder} />
      <Text style={styles.signUpHeader}>Sign up</Text>
      <View style={styles.infoContainer}>
        {/* Name */}
        {/* First name */}
        <Text style={styles.Label}>Name</Text>
        <Input placeholder="First Name" callback={setFN} value={email} />
        {/* Last name */}
        <Input placeholder="Last name" />
        {/* Email */}
        <Text style={styles.Label}>Email</Text>
        <Input placeholder="Enter your email address" />
        {/* First name */}
        <Text style={styles.Label}>Password</Text>
        <Input placeholder="Create new password" />
        <Input placeholder="Confirm password" />
      </View>

      <View style={styles.buttonContainer}>
        <Button type="small" text="Continue" />
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
