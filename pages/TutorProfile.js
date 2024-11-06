import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ReviewsCarousel from "../components/ReviewsCarousel";

const TutorProfile = ({ route }) => {
  const { name, sessions, rating, description } = route.params;
  const navigation = useNavigation();

  // Sample reviews data
  // ------------------------------------------
  const reviews = [
    {
      id: 1,
      rating: 5,
      text: "Food is absolutely gorgeous and its pricey but really worth it seeing the whole experience",
      reviewer: "Roger Lipshutz",
      age: 28,
    },
    {
      id: 2,
      rating: 4,
      text: "Great experience with engaging lessons!",
      reviewer: "Jane Doe",
      age: 35,
    },
    {
      id: 3,
      rating: 5,
      text: "Highly recommend for anyone looking to learn!",
      reviewer: "John Smith",
      age: 24,
    },
  ];
  // ------------------------------------------

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Image */}
        <ImageBackground
          style={styles.headerImage}
          source={{ uri: "https://via.placeholder.com/300" }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.verifiedBadge}>Verified</Text>
        </ImageBackground>

        {/* Profile Details */}
        <View style={styles.profileContainer}>
          <Text style={styles.name}>{name}</Text>

          {/* Rating Section */}
          <View style={styles.ratingContainer}>
            {[...Array(rating)].map((_, i) => (
              <Ionicons key={i} name="star" size={20} color="#7257FF" />
            ))}
          </View>
          <Text style={styles.sessions}>({sessions})</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Reviews Carousel */}
          <Text style={[styles.sectionTitle, styles.reviewsTitle]}>
            Reviews
          </Text>
          <ReviewsCarousel reviews={reviews} />

          {/* Additional Info Section */}
          <Text style={[styles.sectionTitle, styles.additionalInfoTitle]}>
            More Information
          </Text>
          <Text style={styles.additionalInfo}>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Class auctor
            suspendisse metus, platea magna pellentesque. Est bibendum
            adipiscing malesuada scelerisque, elementum diam! Parturient lacus
            netus.
          </Text>
          <Text style={styles.additionalInfo}>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Class auctor
            suspendisse metus, platea magna pellentesque. Est bibendum
            adipiscing malesuada scelerisque, elementum diam! Parturient lacus
            netus.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Book Session Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate("BookingPage")}
        >
          <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
          <Text style={styles.bookButtonText}>Book Session</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  headerImage: {
    height: 400,
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 10,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#FFFFFF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderColor: "#FFFFFF",
    borderWidth: 1,
  },
  profileContainer: {
    padding: 16,
    backgroundColor: "#1A1A1A",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  sessions: {
    color: "#8E8E8F",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    color: "#8E8E8F",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  reviewsTitle: {
    marginBottom: 16,
  },
  additionalInfoTitle: {
    marginTop: 24,
  },
  additionalInfo: {
    color: "#8E8E8F",
    fontSize: 14,
    marginBottom: 16,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7257FF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "50%",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default TutorProfile;
