import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const MessagesList = () => {
  const navigation = useNavigation();

  const tutors = [
    { id: "1", name: "Mohamed S." },
    { id: "2", name: "Sheila H." },
    { id: "3", name: "Gus F." },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tutorItem}
      onPress={() =>
        navigation.navigate("Conversation", { tutorName: item.name })
      }>
      <Text style={styles.tutorName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={tutors}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 16,
    paddingTop: 70,
  },
  header: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 16,
  },
  tutorItem: {
    padding: 16,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    marginBottom: 8,
  },
  tutorName: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default MessagesList;
