import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { supabase } from "../lib/supabase.js"; // Your Supabase client
import Icon from "react-native-vector-icons/Ionicons"; // Example using Ionicons
import * as ImagePicker from "expo-image-picker"; // For taking a photo
import Mailer from "react-native-mail"; // To send email
import * as FileSystem from "expo-file-system"; // Import FileSystem

export default function VerificationScreen({ route, navigation }) {
  const { tutorId } = route.params;
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  // Request camera permission on load
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Function to handle resume selection
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Accept all file types
      });

      if (result.type === "cancel") {
        return; // User cancelled, do nothing
      }

      // Access the file object from the assets array
      const selectedFile = result.assets[0];

      // Set the selected file in state
      setFile(selectedFile);
      if (!selectedFile) {
        throw new Error("File DNE");
      }
      console.log(selectedFile);
      console.log("File selected:", selectedFile);
    } catch (error) {
      Alert.alert("Error", "An error occurred while picking the document.");
      console.error(error);
    }
  };

  // Function to handle resume upload

  // Function to send the email with the uploaded resume
  const handleUploadResume = async () => {
    const auth_req = uuidv4(); // Generate a unique request ID
    try {
      console.log("user_id", tutorId);
      const { data, error } = await supabase.from("auth_request").insert({
        request_id: auth_req,
        tutor_id: tutorId,
        status: 0,
        created_at: new Date().toISOString(), // Ensure correct timestamp format
      });

      if (error) {
        // Explicitly log if there's an error
        console.error("Error inserting data:", error.message);
      } else if (data) {
        // Log data if insertion was successful
        console.log("Data inserted successfully:", data);
      }
    } catch (error) {
      // Catch unexpected errors
      console.error("Unexpected error occurred:", error.message);
    }
  };

  const sendEmail = (fileName, fileUri) => {
    Mailer.mail(
      {
        subject: "Resume Upload",
        recipients: ["your-email@example.com"], // Replace with your email
        body: `You have received a new resume: ${fileName}`,
        isHTML: false,
        attachments: [
          {
            path: fileUri, // Path to the uploaded file
            type: "pdf", // The file type (adjust based on file)
            name: fileName, // The file name
          },
        ],
      },
      (error, event) => {
        if (error) {
          Alert.alert("Email Error", "Could not send the email.");
        } else {
          Alert.alert(
            "Email Sent",
            "Your resume has been emailed successfully."
          );
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Upload your Resume for Verification</Text>
        <Text style={styles.description}>
          Regulations require you to upload a resume in order to allow you to
          start tutoring! Don't worry, your data will stay safe and private
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handlePickDocument}
        disabled={loading}>
        <Icon
          name="document-attach"
          size={24}
          color="white"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>
          {file ? `Selected: ${file.name}` : "Pick a Resume"}
        </Text>
      </TouchableOpacity>

      {file && (
        <TouchableOpacity
          style={[styles.uploadButtonYes, styles.uploadButton]}
          onPress={handleUploadResume}
          disabled={loading}>
          <Text style={styles.UploadbuttonText}>
            {loading ? "Uploading..." : "Upload Resume"}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.or}>or</Text>

      {/* Button to open the camera */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  or: {
    fontSize: 15,
    color: "white",
    marginVertical: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  textGroup: {
    alignItems: "left",
  },
  header: {
    fontSize: 30,
    color: "white",
    marginBottom: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 15,
    color: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#131313",
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
    height: "22%",
    flexDirection: "row", // Align icon and text horizontally
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#cab2dd",
    borderStyle: "solid",
  },

  Cambutton: {
    backgroundColor: "#2A2A2A",
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
    flexDirection: "row", // Align icon and text horizontally
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 10, // Space between the icon and text
  },
  uploadButtonYes: {
    backgroundColor: "#131313",
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
    flexDirection: "row", // Align icon and text horizontally
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#a0e49d",
    borderStyle: "solid",
  },
  uploadButton: {
    backgroundColor: "#131313",
  },
  UploadbuttonText: {
    color: "#a0e49d",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
