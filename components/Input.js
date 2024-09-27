import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

export default function Input({ placeholder }) {
  const [text, setText] = useState("");
  return (
    <View>
      <TextInput
        style={styles.Input}
        placeholder={placeholder}
        value={text}
        onChangeText={setText}
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
