import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Conversation = ({ route }) => {
  const navigation = useNavigation();
  const { tutorName } = route.params;
  const [activeTab, setActiveTab] = useState("Messages");
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Oh, hello! All perfectly. I will check it and get back to you soon",
      sender: "tutor",
      time: "04:45 PM",
    },
    {
      id: "2",
      text: "Sorry about that.",
      sender: "user",
      time: "2:04 PM",
      status: "Read",
    },
    { id: "3", text: "No worries", sender: "tutor", time: "04:45 PM" },
  ]);
  const [input, setInput] = useState("");

  const renderMessage = ({ item }) => (
    <View
      style={
        item.sender === "user"
          ? styles.userMessageWrapper
          : styles.tutorMessageWrapper
      }>
      <View
        style={[
          styles.messageContainer,
          item.sender === "user"
            ? styles.userMessageContainer
            : styles.tutorMessageContainer,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={5}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.tutorName}>{tutorName}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab("Messages")}
          style={styles.tabWrapper}>
          <Text
            style={[styles.tab, activeTab === "Messages" && styles.activeTab]}>
            Messages
          </Text>
          {activeTab === "Messages" && <View style={styles.activeLine} />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("Details")}
          style={styles.tabWrapper}>
          <Text
            style={[styles.tab, activeTab === "Details" && styles.activeTab]}>
            Details
          </Text>
          {activeTab === "Details" && <View style={styles.activeLine} />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type Something"
          placeholderTextColor="#8E8E8F"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            /* Send functionality should be here */
          }}>
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingTop: 70,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#1A1A1A",
  },
  tutorName: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tabWrapper: {
    alignItems: "center",
    flex: 1,
  },
  tab: {
    fontSize: 16,
    color: "#8E8E8F",
    paddingHorizontal: 20,
  },
  activeTab: {
    color: "#FFFFFF",
  },
  activeLine: {
    height: 2,
    backgroundColor: "#7257FF",
    width: "100%",
    marginTop: 4,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  userMessageWrapper: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    marginVertical: 6,
  },
  tutorMessageWrapper: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
    marginVertical: 6,
  },
  messageContainer: {
    maxWidth: "75%",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  tutorMessageContainer: {
    backgroundColor: "#2A2A2A",
  },
  userMessageContainer: {
    backgroundColor: "#7257FF",
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  timeText: {
    color: "#8E8E8F",
    fontSize: 10,
    marginTop: 4,
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
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#FFFFFF",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#7257FF",
    padding: 10,
    borderRadius: 20,
  },
});

export default Conversation;
