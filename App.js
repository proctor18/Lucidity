import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Onboarding from "./pages/Onboarding.js";
import Login from "./pages/Login.js";
import Launch from "./pages/Launch.js";
import PopulateInfo from "./pages/PopulateInfo.js";
import Profile from "./pages/Profile.js";
import Start from "./pages/Start.js";
import BookingPage from "./pages/BookingPage.js";
import Dashboard from "./pages/Dashboard.js";
import Signup from "./pages/Signup.js";
import Notifications from "./pages/Notifications.js"
import UsersList from "./pages/UsersList.js";
import Search from "./pages/Search.js";
import SearchResults from "./pages/SearchResults.js";
import SessionDetailsPage from "./components/SessionDetailsPage.js";
import TutorProfile from "./pages/TutorProfile.js";
import MessagesList from "./pages/MessagesList";
import Conversation from "./pages/Conversation";
import TimeOff from "./pages/TimeOff.js";
import { UserProvider } from './components/UserContext.js';
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotesPage from "./pages/NotesPage.js";
import { checkUnreadNotifications } from './scheduling/notificationHelpers.js';
import { useFocusEffect } from '@react-navigation/native';
import Messages from "./pages/Messages.js"; // New import for Messages screen
import { supabase } from './lib/supabase.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ route }) {
  const { email, first_name, last_name, role_id, user_id } = route.params || {};
  const [hasUnread, setHasUnread] = useState(false);

  // Check for unread notifications whenever the screen gains focus
  useFocusEffect(
    useCallback(() => {
      const fetchUnreadNotifications = async () => {
        const hasUnreadNotifications = await checkUnreadNotifications(user_id);
        setHasUnread(hasUnreadNotifications);
      };

      fetchUnreadNotifications();
    }, [user_id])
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(26, 26, 26, 1)", // swap out later for transparent blur
          borderTopColor: "#2A2A2A",
          borderTopWidth: 1,
          paddingBottom: 32,
          paddingTop: 6,
          height: 80,
        },

        tabBarActiveTintColor: "#7257FF",
        tabBarInactiveTintColor: "#8E8E8F",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let showDot = false;

          if (route.name === "DashboardTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "SearchTab") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "NotificationsTab") {
            iconName = focused ? "notifications" : "notifications-outline";
            showDot = hasUnread; // Show dot if there are unread notifications
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "SettingsTab") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return (
            <View>
              <Ionicons name={iconName} size={size} color={color} />
              {showDot && (
                <View
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -6,
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                    backgroundColor: '#7257FF', // Purple dot for unread notifications
                  }}
                />
              )}
            </View>
          );
        },
        
      })}>
      <Tab.Screen
        name="DashboardTab"
        component={Dashboard}
        initialParams={{ email, first_name, last_name, role_id, user_id }}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="SearchTab"
        component={Search}
        options={{ tabBarLabel: "Search" }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={Notifications}
        initialParams={{ user_id }}
        options={{ tabBarLabel: "Notifications" }}
        listeners={{
          tabPress: () => setHasUnread(false), // Clear dot when Notifications tab is opened
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        initialParams={{ email, first_name, last_name, role_id, user_id }}
        component={Profile}
        options={{ tabBarLabel: "Settings" }}
      />
      {/* <Tab.Screen
        name="SettingsTab"
        component={Start}
        options={{ tabBarLabel: "Settings" }}
      /> */}
    </Tab.Navigator>
  );
}


// Root Stack for managing all navigation flows
export default function App() {
  return (
    <UserProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="SessionDetails" component={SessionDetailsPage} />
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="PopulateInfo" component={PopulateInfo} />
        <Stack.Screen name="Launch" component={Launch} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="TimeOff" component={TimeOff} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="SearchResults" component={SearchResults} />
        <Stack.Screen name="TutorProfile" component={TutorProfile} />
        <Stack.Screen name="BookingPage" component={BookingPage} />
        <Stack.Screen name="Messages" component={Messages} />
        <Stack.Screen name="NotesPage" component={NotesPage} /*options={{ title: 'Session Notes' }}*/ />
        <Stack.Screen name="MessagesList" component={MessagesList} />
        <Stack.Screen name="Conversation" component={Conversation} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 0,
  },
});
