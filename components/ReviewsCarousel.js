import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ReviewsCarousel = ({ reviews }) => {
  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.reviewCard,
        index === reviews.length - 1 && styles.lastCard,
      ]}>
      {/* Star rating */}
      <View style={styles.ratingContainer}>
        {[...Array(item.rating)].map((_, i) => (
          <Ionicons key={i} name="star" size={16} color="#7257FF" />
        ))}
      </View>
      {/* Review text */}
      <Text style={styles.reviewText}>{item.text}</Text>
      <Text style={styles.reviewer}>
        {item.reviewer}, {item.age}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={reviews}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContainer}
    />
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    paddingLeft: 16,
  },
  reviewCard: {
    width: 250,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 16,
    marginRight: 16,
  },
  lastCard: {
    marginRight: 0,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 4,
  },
  reviewer: {
    color: "#8E8E8F",
    fontSize: 12,
  },
});

export default ReviewsCarousel;
