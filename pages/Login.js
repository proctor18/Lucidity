import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.rowOne}>
        <Input placeholder="Email" />
        <Input placeholder="Password" />
        <Button type="small" text="Continue" />
      </View>
      <View style={styles.rowTwo}>
        <View style={styles.divider}></View>
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider}></View>
      </View>
      <View style={styles.rowThree}>
        <Button type="medium" text="Sign in with Google" />
        <Button type="medium" text="Sign in with LinkedIn" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  rowOne: {
    width: "100%",
    gap: 16,
    marginBottom: 16,
  },
  rowTwo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
    marginVertical: 16,
  },
  divider: {
    backgroundColor: "#E5E7EB",
    height: 1,
    flex: 1,
  },
  dividerText: {
    fontSize: 14,
    paddingHorizontal: 10,
  },
  rowThree: {
    width: "100%",
    gap: 10,
    marginTop: 16,
  },
});
