import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotesPage = ({ route }) => {
  const { session } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes for {session.name}</Text>
      {/* Display session details or notes here */}
    </View>
  );
};

export default NotesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
