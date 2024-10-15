import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Onboarding from "./pages/Onboarding.js";
import Login from "./pages/Login.js";
import Launch from "./pages/Launch.js";
import PopulateInfo from "./pages/PopulateInfo.js";
import Start from "./pages/Start.js";
import Signup from "./pages/Signup.js";
import UsersList from "./pages/UsersList.js";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native"; // Import NavigationContainer
import { createStackNavigator } from "@react-navigation/stack"; // Correct stack navigator import

const Stack = createStackNavigator(); // Stack Navigation

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="PopulateInfo" component={PopulateInfo} />
        <Stack.Screen name="Launch" component={Launch} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="UsersList" component={UsersList} />
      </Stack.Navigator>
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
