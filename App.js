import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Onboarding from './pages/Onboarding.js';
import Login from './pages/Login.js';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import { createStackNavigator } from '@react-navigation/stack'; // Correct stack navigator import

const Stack = createStackNavigator(); // Stack Navigation 

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
});
