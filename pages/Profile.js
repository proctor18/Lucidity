import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase.js";
import Button from "../components/Button"; // Import your new Button component
import { useNavigation } from "@react-navigation/native";

export default function Profile({ route, navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(route.params.email);
  const [newFirstName, setNewFirstName] = useState(route.params.first_name);
  const [newLastName, setNewLastName] = useState(route.params.last_name);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTutor, setIsTutor] = useState(false); // State to track if user is a tutor

  const { email, first_name, last_name, role_id, user_id } = route.params;

  // Check if the logged-in user is a tutor
  useEffect(() => {
    console.log("role_id:", role_id);
    if (role_id === 1) {
      setIsTutor(true);
    } else {
      setIsTutor(false);
    }
  }, [role_id]);

  // Function to handle verification
  const handleVerification = () => {
    // Use the correct tutor_id for navigation
    console.log("tutor_id", route.params.user_id);
    navigation.navigate("VerificationScreen", {
      tutorId: route.params.user_id,
    });
  };

  // Logic to handle logout
  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            Alert.alert("Logout Failed", error.message);
          }
        },
      },
    ]);
  };

  // Function to handle profile update
  const handleSaveProfile = async () => {
    try {
      if (
        newEmail === email &&
        newFirstName === first_name &&
        newLastName === last_name &&
        !newPassword // Don't check password if it's empty
      ) {
        Alert.alert("No changes", "You haven't made any changes.");
        return;
      }

      // Handle password change if provided
      if (newPassword !== "" || confirmPassword !== "") {
        if (newPassword !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match.");
          return;
        }
        // Include password in the database update
        const { data, error } = await supabase
          .from(role_id === "tutor" ? "tutors" : "students")
          .update({
            email: newEmail,
            first_name: newFirstName,
            last_name: newLastName,
            password: newPassword, // Update password in the same request
          })
          .eq("student_id", user_id);

        if (error) {
          Alert.alert("Error", "Failed to update profile.");
          console.error(error);
          return;
        }
      }

      const { data, error } = await supabase
        .from(role_id === "tutor" ? "tutors" : "students")
        .update({
          email: newEmail,
          first_name: newFirstName,
          last_name: newLastName,
        })
        .eq("student_id", user_id);

      if (error) {
        Alert.alert("Error", "Failed to update profile.");
        console.error(error);
        return;
      }

      Alert.alert("Success", "Profile updated successfully.");
      setIsEditing(false);
      route.params.email = newEmail;
      route.params.first_name = newFirstName;
      route.params.last_name = newLastName;
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "An error occurred while saving the profile.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profilePictureContainer}>
            <Text style={styles.profilePictureText}>
              {newFirstName?.charAt(0).toUpperCase() || ""}
            </Text>
          </View>

          {isEditing ? (
            <>
              <Text style={styles.editHeader}>Edit Profile</Text>
              <TextInput
                style={styles.inputField}
                value={newFirstName}
                onChangeText={setNewFirstName}
                placeholder="First Name"
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.inputField}
                value={newLastName}
                onChangeText={setNewLastName}
                placeholder="Last Name"
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.inputField}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.inputField}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                placeholderTextColor="#888"
                secureTextEntry
              />
              <TextInput
                style={styles.inputField}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm New Password"
                placeholderTextColor="#888"
                secureTextEntry
              />
            </>
          ) : (
            <>
              <Text style={styles.usernameInfo}>
                {newFirstName} {newLastName}
              </Text>
              <Text style={styles.userEmailInfo}>{newEmail}</Text>
            </>
          )}
        </View>

        {/* Edit Button */}
        <View style={styles.buttonContainer}>
          {!isEditing && (
            <Button
              type="small"
              text="Edit Profile"
              callback={() => setIsEditing(true)}
            />
          )}
        </View>

        {isEditing && (
          <View style={styles.buttonRowContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Show the Verification button only if user is a tutor */}
        {isTutor && !isEditing && (
          <View style={styles.buttonContainer}>
            <Button
              type="small"
              text="Verification"
              callback={handleVerification}
            />
          </View>
        )}

        {/* Logout Button */}
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#131313",
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  profileSection: {
    alignItems: "center",
  },
  usernameInfo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  userEmailInfo: {
    fontSize: 14,
    color: "white",
    opacity: 0.6,
    marginBottom: 20,
  },
  inputField: {
    backgroundColor: "#131313",
    color: "white",
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 19,
    borderRadius: 8,
    fontSize: 16,
    width: "110%",
    borderWidth: 1,
    borderColor: "#2F2F31",
    borderStyle: "solid",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  buttonRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButtonContainer: {
    width: "100%",
    marginTop: 20,
    paddingBottom: 20,
    justifyContent: "center",
  },
  logoutButton: {
    backgroundColor: "#131313",
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 19,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f9515e",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
  },
  logoutButtonText: {
    color: "#f9515e",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  editHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  profilePictureContainer: {
    height: 90,
    width: 90,
    borderRadius: 45,
    backgroundColor: "#2F2F31",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  profilePictureText: {
    fontSize: 38,
    fontWeight: "bold",
    color: "white",
  },
});
