import React, { useContext } from "react";
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
import { UserContext } from "../components/UserContext.js";

const TutorProfile = ({ route }) => {
  const { name, sessions, rating, description, subject, tutorID } =
    route.params;
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  const { role_id } = user;

  // Sample reviews data
  // ------------------------------------------
  const reviews = [
    {
      id: 1,
      rating: 5,
      text: "This tutor is incredible! The lessons are very engaging and informative. Highly recommend!",
      reviewer: "Rachel Green",
      age: 30,
    },
    {
      id: 2,
      rating: 4,
      text: "Great tutor, explains concepts clearly. Sometimes a little fast, but overall great experience.",
      reviewer: "Chandler Bing",
      age: 32,
    },
    {
      id: 3,
      rating: 5,
      text: "The best tutor I’ve ever had! Learned so much in such a short time. Worth every minute!",
      reviewer: "Phoebe Buffay",
      age: 28,
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
            I specialize in Mathematics and Physics, and I'm passionate about
            helping students grasp complex concepts with ease. My approach
            combines interactive lessons and real-world examples, making
            learning both fun and practical.
          </Text>
          <Text style={styles.additionalInfo}>
            I offer tutoring for students at various levels, from high school to
            university. I can help with exam preparation, homework assistance,
            and deepening your understanding of key concepts.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Book Session Button */}
      <View style={styles.fixedButtonContainer}>
        {role_id !== 1 && (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() =>
              navigation.navigate("BookingPage", { tutorID, subject })
            }>
            <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
            <Text style={styles.bookButtonText}>Book Session</Text>
          </TouchableOpacity>
        )}
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
