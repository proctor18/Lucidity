import React, { useState } from "react";
import { Text, View, StyleSheet, Switch, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../lib/supabase.js";
import Button from "../components/Button";
import { Menu, Provider } from 'react-native-paper';
import Input from "../components/Input";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Profile({ route, navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [optionTwo, setOptionTwo] = useState(false);
  const [optionThree, setOptionThree] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { email, first_name, last_name, role_id, user_id } = route.params;

  // Logic to handle our logout
  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              navigation.navigate('Login');
            } catch (error) {
              Alert.alert("Logout Failed", error.message);
            }
          },
        },
      ]
    );
  };
  return (
    <Provider>
      <View style={styles.container}>
        {/* Header with menu for logout */}
        <View style={styles.header}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Ionicons name="menu" size={24} color="white" />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={handleLogout} title="Logout" />
          </Menu>
        </View>

      {/* User Display */}
      <View style={styles.userDisplay}>
        <View style={styles.imageContainer}></View>
        <Text style={styles.usernameInfo}>{first_name}</Text>
        <Text style={styles.userEmailInfo}>{email}</Text>
        <Button title="Edit Profile" style={styles.editButton} />
      </View>

      {/* Options */}
      <TouchableOpacity style={styles.editProfileButton}>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionRow}>
        <Icon name="favorite" size={24} color="white" />
        <Text style={styles.optionText}>Saved Sessions</Text>
        <Icon name="chevron-right" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionRow}>
        <Icon name="download" size={24} color="white" />
        <Text style={styles.optionText}>Downloads</Text>
        <Icon name="chevron-right" size={24} color="white" />
      </TouchableOpacity>

      {/* Settings */}
      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.settingsRow}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: "#767577", true: "#7257FF" }}
          thumbColor={isDarkMode ? "#FFFFFF" : "#f4f3f4"}
        />
      </View>
      <View style={styles.settingsRow}>
        <Text style={styles.settingText}>Option Two</Text>
        <Switch
          value={optionTwo}
          onValueChange={setOptionTwo}
          trackColor={{ false: "#767577", true: "#7257FF" }}
          thumbColor={isDarkMode ? "#FFFFFF" : "#f4f3f4"}
        />
      </View>
      <View style={styles.settingsRow}>
        <Text style={styles.settingText}>Option Three</Text>
        <Switch
          value={optionThree}
          onValueChange={setOptionThree}
          trackColor={{ false: "#767577", true: "#7257FF" }}
          thumbColor={isDarkMode ? "#FFFFFF" : "#f4f3f4"}
        />
      </View>

      <View style={styles.bottomNav}></View>
    </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#131313",
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end", // Aligns items to the right
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  userDisplay: {
    alignItems: "center",
    marginBottom: 15,
  },
  imageContainer: {
    height: 80,
    width: 80,
    backgroundColor: "white",
    borderRadius: 40,
    opacity: 0.1,
    marginBottom: 12,
  },
  usernameInfo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  userEmailInfo: {
    fontSize: 14,
    color: "white",
    opacity: 0.6,
  },
  editButton: {
    backgroundColor: "#7257FF",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  editProfileButton: {
    backgroundColor: "F0EDFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
    marginBottom: 25,
  },
  editProfileText: {
    color: "#7257FF",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A1A",
    padding: 15,
    borderRadius: 10,
    marginVertical: 4,
  },
  optionText: {
    color: "white",
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 10,
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 15,
    borderRadius: 10,
    marginVertical: 4,
  },
  settingText: {
    color: "white",
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
});
