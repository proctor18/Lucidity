import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { supabase } from "../supabaseClient";

export default function Messages() {
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [newReceiverEmail, setNewReceiverEmail] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [slideUpAnimation] = useState(
    new Animated.Value(Dimensions.get("window").height)
  );
  const navigation = useNavigation();
  const route = useRoute();
  const { user_id: currentUserId } = route.params || {};

  if (!currentUserId) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          User ID not found. Please log in again.
        </Text>
      </View>
    );
  }

  // Move loadConversations out of useEffect so it can be reused
  const loadConversations = async () => {
    try {
      let { data, error } = await supabase
        .from("messages")
        .select("sender_id, receiver_id, content, sent_at")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .neq("content", "") // Exclude empty messages
        .order("sent_at", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error.message);
        return;
      }

      // Extract unique conversation partners
      const uniqueConversations = Array.from(
        new Set(
          data.map(({ sender_id, receiver_id }) =>
            sender_id === currentUserId ? receiver_id : sender_id
          )
        )
      );

      const conversationData = uniqueConversations.map((id) => ({
        id,
        name: `User ${id}`, // Fetch and format user names if needed
        message: data.find(
          (msg) =>
            (msg.sender_id === id && msg.receiver_id === currentUserId) ||
            (msg.receiver_id === id && msg.sender_id === currentUserId)
        )?.content,
        time: "Just now", // You can convert the `sent_at` timestamp into a human-readable format
      }));

      setConversations(conversationData);
    } catch (err) {
      console.error("Error loading conversations:", err.message);
    }
  };

  // Call loadConversations on component mount and when currentUserId changes
  useEffect(() => {
    loadConversations();
  }, [currentUserId]);

  const showNewMessageModal = () => {
    Animated.timing(slideUpAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideNewMessageModal = () => {
    Animated.timing(slideUpAnimation, {
      toValue: Dimensions.get("window").height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const sendMessage = async () => {
    if (!newReceiverEmail || !messageContent) {
      Alert.alert("Error", "Please provide both an email and a message.");
      return;
    }

    try {
      // Insert the message into the database
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: currentUserId,
          receiver_id: newReceiverEmail,
          content: messageContent,
          sent_at: new Date(),
        },
      ]);

      if (error) {
        console.error("Error sending message:", error.message);
        Alert.alert("Error", "Failed to send the message.");
        return;
      }

      // Clear input fields
      setMessageContent("");
      setNewReceiverEmail("");

      // Reload the conversations list to include the new message
      await loadConversations();

      // Hide the modal
      hideNewMessageModal();
    } catch (err) {
      console.error("Error sending message:", err.message);
      Alert.alert("Error", "Something went wrong while sending the message.");
    }
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity style={styles.messageItem} onPress={() => {}}>
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#7257FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          onPress={showNewMessageModal}
          style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#8E8E8F" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#8E8E8F"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Conversations */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderConversation}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No conversations found.</Text>
        }
      />

      {/* Sliding Modal */}
      <Animated.View
        style={[
          styles.fullScreenModal,
          { transform: [{ translateY: slideUpAnimation }] },
        ]}>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Message</Text>
            <TouchableOpacity onPress={hideNewMessageModal}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalToField}>
            <Text style={styles.toLabel}>To:</Text>
            <TextInput
              style={styles.toInput}
              placeholder="Enter receiver's email"
              placeholderTextColor="#8E8E8F"
              value={newReceiverEmail}
              onChangeText={setNewReceiverEmail}
            />
          </View>
          <View style={styles.modalBottomBar}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message"
              placeholderTextColor="#8E8E8F"
              value={messageContent}
              onChangeText={setMessageContent}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
    padding: 16,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: { marginRight: 16 },
  addButton: { marginLeft: 16 },
  headerTitle: { fontSize: 20, color: "#FFFFFF", fontWeight: "bold" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  searchInput: { flex: 1, color: "#FFFFFF", fontSize: 14 },
  messagesList: { paddingBottom: 20 },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  avatar: { marginRight: 12 },
  messageContent: { flex: 1 },
  tutorName: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  messageText: { color: "#8E8E8F", fontSize: 14 },
  messageTime: { color: "#8E8E8F", fontSize: 12 },
  fullScreenModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#131313",
    padding: 16,
    paddingTop: 80,
  },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, color: "#FFFFFF", fontWeight: "bold" },
  modalCancel: { color: "#007AFF", fontSize: 16 },
  modalToField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  toLabel: { color: "#FFFFFF", fontSize: 16, marginRight: 8 },
  toInput: { flex: 1, color: "#FFFFFF", fontSize: 14 },
  modalBottomBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 10,
    borderRadius: 10,
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  messageInput: { flex: 1, color: "#FFFFFF", fontSize: 14 },
  sendButton: { marginLeft: 8 },
  emptyText: { color: "#8E8E8F", textAlign: "center" },
});
