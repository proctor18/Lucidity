import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

export default function Input({ placeholder, callback, value }) { // Changed from text to value
  return (
    <View>
      <TextInput
        style={styles.Input}
        placeholder={placeholder}
        value={value}
        onChangeText={callback}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  Input: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});
