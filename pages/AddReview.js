import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabase";

const AddReview = ({ route, navigation }) => {
  const { tutorID } = route.params;
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");

  const handleAddReview = async () => {
    if (!rating || !reviewText) {
      Alert.alert("Error", "Please fill in both rating and review.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("auth_request") // Using auth_request table
        .insert([
          {
            tutor_id: tutorID,
            status: 0, // Keep status pending
            static_data: { text: reviewText, rating: parseInt(rating) }, // Store review in JSON
          },
        ]);

      if (error) throw error;

      Alert.alert("Success", "Review added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding review:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />
      <TextInput
        style={styles.input}
        placeholder="Write your review"
        value={reviewText}
        onChangeText={setReviewText}
        multiline
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#2F2F31",
    color: "#FFFFFF",
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#4F4F4F",
  },
  submitButton: {
    backgroundColor: "#00CC99",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddReview;
