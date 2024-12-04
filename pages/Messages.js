import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Button,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { supabase } from "../supabaseClient"; // Assuming supabaseClient is properly set up
import { Swipeable } from "react-native-gesture-handler";

export default function Messages() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatName, setCurrentChatName] = useState(""); // Store current chat name
  const [searchQuery, setSearchQuery] = useState(""); // State for search bar
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [receiverEmail, setReceiverEmail] = useState(""); // State for new receiver's email
  const route = useRoute();
  const { user_id: currentUserId } = route.params || {};

  // Reference for FlatList
  const flatListRef = useRef(null);

  if (!currentUserId) {
    console.error("User ID is undefined");
    return (
      <View style={styles.container}>
        <Text>User ID not found. Please log in again.</Text>
      </View>
    );
  }

  // Fetch user name
  const fetchUserName = async (id) => {
    let { data, error } = await supabase
      .from("tutors")
      .select("first_name, last_name, email")
      .eq("tutor_id", id)
      .single();

    if (error || !data) {
      ({ data, error } = await supabase
        .from("students")
        .select("first_name, last_name, email")
        .eq("student_id", id)
        .single());
    }

    return data ? `${data.first_name} ${data.last_name}` : "Unknown";
  };

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        let { data, error } = await supabase
          .from("messages")
          .select("sender_id, receiver_id, content, sent_at")
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .neq("content", "") // Exclude empty messages
          .order("sent_at", { ascending: false });

        if (error) return console.error("Error fetching conversations:", error);

        // Group by conversation partner and take the latest message
        const conversationsMap = data.reduce((acc, message) => {
          const partnerId =
            message.sender_id === currentUserId
              ? message.receiver_id
              : message.sender_id;

          if (!acc[partnerId]) {
            acc[partnerId] = { ...message, partnerId };
          }
          return acc;
        }, {});

        const conversationData = await Promise.all(
          Object.values(conversationsMap).map(async (conversation) => {
            const name = await fetchUserName(conversation.partnerId);
            return {
              id: conversation.partnerId,
              name,
              lastMessage: conversation.content,
              sentAt: conversation.sent_at,
            };
          })
        );

        setConversations(conversationData);
      } catch (err) {
        console.error("Error loading conversations:", err.message);
      }
    };

    loadConversations();
  }, [currentUserId]);

  // Load messages
  const loadMessages = async (chatPartnerId) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${chatPartnerId}),and(sender_id.eq.${chatPartnerId},receiver_id.eq.${currentUserId})`
      )
      .order("sent_at", { ascending: true });

    if (error) return console.error("Error loading messages:", error.message);

    setMessages(data);
    setCurrentChat(chatPartnerId);
    setCurrentChatName(await fetchUserName(chatPartnerId));

    // Scroll to the end of the list when messages are loaded
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!content || !currentChat) return;

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: currentUserId,
        receiver_id: currentChat,
        content,
        is_read: false,
        sent_at: new Date(),
      },
    ]);

    if (error) return console.error("Error sending message:", error);

    setContent("");
    loadMessages(currentChat);
  };

  // Handle search query
  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Start a new conversation
  const startNewConversation = async () => {
    if (!receiverEmail) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    try {
      let { data, error } = await supabase
        .from("tutors")
        .select("tutor_id, first_name, last_name")
        .ilike("email", receiverEmail);

      let receiverId = data?.[0]?.tutor_id;
      let receiverName = data?.[0]
        ? `${data[0].first_name} ${data[0].last_name}`
        : null;

      if (!receiverId) {
        ({ data, error } = await supabase
          .from("students")
          .select("student_id, first_name, last_name")
          .ilike("email", receiverEmail));

        if (data?.[0]) {
          receiverId = data[0].student_id;
          receiverName = `${data[0].first_name} ${data[0].last_name}`;
        }
      }

      if (!receiverId) {
        Alert.alert("Error", "Receiver not found with that email.");
        return;
      }

      setIsModalVisible(false);
      setReceiverEmail("");

      const isExistingConversation = conversations.some(
        (conv) => conv.id === receiverId
      );

      if (!isExistingConversation) {
        setConversations((prevConversations) => [
          ...prevConversations,
          { id: receiverId, name: receiverName },
        ]);
      }

      loadMessages(receiverId);
    } catch (error) {
      console.error("Error fetching receiver:", error.message);
      Alert.alert(
        "Error",
        "An error occurred while trying to fetch the receiver."
      );
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      // Delete all messages from the database for this conversation
      const { error } = await supabase
        .from("messages")
        .delete()
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${currentUserId})`
        );

      if (error) {
        console.error("Error deleting conversation:", error);
        return;
      }

      // Remove the conversation from the state
      setConversations((prev) =>
        prev.filter((conversation) => conversation.id !== conversationId)
      );

      console.log("Conversation deleted successfully.");
    } catch (err) {
      console.error("Error deleting conversation:", err.message);
    }
  };

  // Render the right swipe action
  const renderRightActions = (conversationId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteConversation(conversationId)}>
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {!currentChat ? (
        <View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Conversations"
              placeholderTextColor="#8E8E8F"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => setIsModalVisible(true)} // Open the modal to start a new conversation
            >
              <Ionicons name="add-circle" size={30} color="#7257FF" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => loadMessages(item.id)}
                onLongPress={() => {
                  // Long press triggers a confirmation alert to delete the conversation
                  Alert.alert(
                    "Delete Conversation",
                    "Are you sure you want to delete this conversation?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => deleteConversation(item.id),
                      },
                    ]
                  );
                }}>
                <View style={styles.avatar}>
                  <Ionicons
                    name="person-circle-outline"
                    size={40}
                    color="#8E8E8F"
                  />
                </View>
                <View style={styles.messageDetails}>
                  <Text style={styles.conversationName}>{item.name}</Text>
                  <Text style={styles.conversationMessage} numberOfLines={1}>
                    {item.lastMessage || "No messages yet"}
                  </Text>
                </View>
                <Text style={styles.timestamp}>
                  {item.sentAt
                    ? new Date(item.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyMessageContainer}>
                <Text style={styles.emptyMessageText}>
                  No conversations at this time.
                </Text>
              </View>
            }
          />

          {/* Modal for Adding a New Conversation */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter Tutor's Email</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Email"
                  value={receiverEmail}
                  onChangeText={setReceiverEmail} // Update receiver's email
                />
                <Button
                  title="Start Conversation"
                  onPress={startNewConversation}
                />
                <Button
                  title="Cancel"
                  onPress={() => setIsModalVisible(false)}
                  color="#ff5c5c"
                />
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={5}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setCurrentChat(null)}>
              <Ionicons name="chevron-back" size={24} color="#7257FF" />
            </TouchableOpacity>
            <Text style={styles.tutorName}>{currentChatName}</Text>
            <View style={{ width: 24 }} />
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.message_id.toString()}
            renderItem={({ item }) => (
              <View
                style={
                  item.sender_id === currentUserId
                    ? styles.sentMessage
                    : styles.receivedMessage
                }>
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
            )}
            keyboardShouldPersistTaps="handled"
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              value={content}
              onChangeText={setContent}
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
    paddingTop: 40, // Padding to create space at the top
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tutorName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  sentMessage: {
    backgroundColor: "#7257FF", // Blue background for sent messages
    alignSelf: "flex-end", // Align to the right
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: "80%",
    marginRight: 15,
  },

  receivedMessage: {
    backgroundColor: "#404040", // Dark gray for received messages
    alignSelf: "flex-start", // Align to the left
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: "80%",
  },

  messageText: {
    color: "#FFFFFF", // White text
    fontSize: 16, // Increase text size for readability
    lineHeight: 20, // Add line height for spacing
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    marginBottom: 25,
  },

  input: {
    flex: 1,
    backgroundColor: "#2A2A2A", // Dark background for contrast
    borderRadius: 20, // Rounded corners for the input
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 16,
    marginRight: 10,
  },

  sendButton: {
    backgroundColor: "#7257FF", // Blue for Send button
    padding: 10,
    borderRadius: 20,
  },
  userMessageWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 4,
  },
  tutorMessageWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 4,
  },

  messageContainer: {
    maxWidth: "80%", // Restrict width for better bubble size
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
    minWidth: 100, // Ensure bubbles are not too small
  },

  userMessageContainer: {
    backgroundColor: "#7257FF", // Blue background for sent messages
    alignSelf: "flex-end", // Sent messages align to the right
  },

  tutorMessageContainer: {
    backgroundColor: "#404040", // Dark gray for received messages
    alignSelf: "flex-start", // Received messages align to the left
  },

  messageText: {
    color: "#FFFFFF", // White text color for contrast
    fontSize: 16, // Adequate font size for readability
    lineHeight: 20, // Space between lines to avoid text cramped together
  },

  timeText: {
    fontSize: 10,
    color: "#8E8E8F",
    marginTop: 5,
  },

  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  avatar: {
    marginRight: 10,
  },
  messageDetails: {
    flex: 1,
  },
  conversationName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  conversationMessage: {
    color: "#8E8E8F",
    fontSize: 14,
  },
  timestamp: {
    color: "#8E8E8F",
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    paddingBottom: 30,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#FFFFFF",
  },
  plusButton: {
    paddingLeft: 10,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "#1A1A1A",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  modalInput: {
    backgroundColor: "#2A2A2A", // Dark background for input field
    color: "#FFFFFF", // White text color for visibility
    width: "100%", // Full width of the modal content
    height: 40, // Increased height for better typing space
    paddingVertical: 10, // Vertical padding for better spacing
    paddingHorizontal: 15, // Horizontal padding for better space
    borderRadius: 10, // Slight curve to the input's corners
    fontSize: 16, // Set a reasonable font size
    marginTop: 10,
    marginBottom: 10, // Space below the input field
  },

  emptyMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 250,
  },
  emptyMessageText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
