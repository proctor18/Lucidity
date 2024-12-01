import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MessagesList = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [sortDescending, setSortDescending] = useState(true);

  const tutors = [
    {
      id: "1",
      name: "Mohamed S.",
      message: "Hi there! How can I help you?",
      time: "5m ago",
    },
    {
      id: "2",
      name: "Sheila H.",
      message: "Let’s review your progress...",
      time: "15m ago",
    },
    {
      id: "3",
      name: "Gus F.",
      message: "Check out this new material...",
      time: "1h ago",
    },
  ];

  const filteredTutors = tutors
    .filter((tutor) => tutor.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortDescending
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name)
    );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() =>
        navigation.navigate("Conversation", { tutorName: item.name })
      }>
      <View style={styles.avatar}>
        <FontAwesome name="user-circle" size={40} color="#8E8E8F" />
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.tutorName}>{item.name}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#7257FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Search and Sort Bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#8E8E8F"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#8E8E8F"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={() => setSortDescending(!sortDescending)}>
          <Ionicons
            name={sortDescending ? "arrow-down-outline" : "arrow-up-outline"}
            size={20}
            color="#8E8E8F"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

      {/* Tutors List */}
      <FlatList
        data={filteredTutors}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
    padding: 16,
    paddingTop: 70,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
  },
  messagesList: {
    paddingBottom: 20,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  avatar: {
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  tutorName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  messageText: {
    color: "#8E8E8F",
    fontSize: 14,
    marginTop: 2,
  },
  messageTime: {
    color: "#8E8E8F",
    fontSize: 12,
  },
});

export default MessagesList;
