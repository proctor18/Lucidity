import { View, Text, StyleSheet } from "react-native";
import Button from "../components/Button.js";
import Input from "../components/Input";

export default function Signup() {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder} />
      <Text style={styles.signUpHeader}>Sign up</Text>
      <View style={styles.infoContainer}>
        {/* Name */}
        {/* First name */}
        <Text style={styles.luhLabel}>Name</Text>
        <Input placeholder="First name" />
        {/* Last name */}
        <Input placeholder="Last name" />
        {/* Email */}
        <Text style={styles.luhLabel}>Email</Text>
        <Input placeholder="Enter your email address" />
        {/* First name */}
        <Text style={styles.luhLabel}>Password</Text>
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
    backgroundColor: "#0F0F0F",
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
  luhLabel: {
    color: "white",
    fontSize: "17px",
    fontWeight: "bold",
  },
});
