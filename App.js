import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Onboarding from "./pages/Onboarding.js";
import Login from "./pages/Login.js";
import Launch from "./pages/Launch.js";
import PopulateInfo from "./pages/PopulateInfo.js";
import Profile from "./pages/Profile.js";
import Start from "./pages/Start.js";
import Dashboard from "./pages/Dashboard.js";
import Signup from "./pages/Signup.js";
import UsersList from "./pages/UsersList.js";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ route }) {
  const { email, first_name, last_name, role_id, user_id } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {

          backgroundColor: 'rgba(26, 26, 26, 1)', // swap out later for transparent blur 
          borderTopColor: '#2A2A2A',
          borderTopWidth: 1,
          paddingBottom: 10,
          height: 65,
        },

        tabBarActiveTintColor: '#7257FF',
        tabBarInactiveTintColor: '#8E8E8F',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "DashboardTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "SearchTab") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "ProfileTab") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "SettingsTab") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
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
        component={UsersList}
        options={{ tabBarLabel: "Search" }}
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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="PopulateInfo" component={PopulateInfo} />
        <Stack.Screen name="Launch" component={Launch} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
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
