import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SearchResults = ({ route }) => {
  const { subject } = route.params;
  const navigation = useNavigation();

  // List of search results of selected subject. Populate with actual data
  // --------------------------------------------------
  const resultsData = [
    {
      id: "1",
      name: "Mohamed S.",
      certification: "Certification",
      status: "Verified",
      sessions: "27 sessions",
      avatar: "https://via.placeholder.com/50", // Placeholder avatar image
    },
    {
      id: "2",
      name: "Sheila H.",
      certification: "Certification",
      status: "Verified",
      sessions: "27 sessions",
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: "3",
      name: "Gus F.",
      certification: "Certification",
      status: "Verified",
      sessions: "27 sessions",
      avatar: "https://via.placeholder.com/50",
    },
  ];
  // --------------------------------------------------

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() =>
        navigation.navigate("TutorProfile", {
          name: item.name,
          sessions: item.sessions,
          rating: 5, // 5 star rating as a placeholder
          description: `Hi! I'm ${item.name}, this is a placeholder description.`,
        })
      }>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.certification}>{item.certification}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.verified}>{item.status}</Text>
        <Text style={styles.sessions}>({item.sessions})</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header*/}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color="#7257FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results for "{subject}"</Text>
      </View>

      {/* Main Content */}
      <FlatList
        data={resultsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    paddingTop: 80,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  listContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  certification: {
    color: "#8E8E8F",
    fontSize: 14,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  verified: {
    color: "#7257FF",
    fontSize: 14,
    fontWeight: "600",
  },
  sessions: {
    color: "#8E8E8F",
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginVertical: 8,
  },
});

export default SearchResults;
