import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView  } from 'react-native';
import { supabase } from '../lib/supabase'; // Ensure you have configured Supabase here

const NotesPage = ({ route }) => {
  const { session } = route.params; // Get the session data passed from SessionDetailsPage
  const [note, setNote] = useState(session?.session_notes || ''); // Initialize with current notes if available

  // Function to save the note to the Supabase database
  const saveNote = async () => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ session_notes: note })
        .eq('session_id', session.session_id); // Replace 'id' with the actual column name
  
      if (error) throw error;
      alert('Notes updated successfully');
    } catch (error) {
      console.error('Error updating notes:', error.message);
      alert(`Failed to update notes: ${error.message}`);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Session Notes</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Add your notes here"
          placeholderTextColor="#777777"
          value={note}
          onChangeText={setNote}
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
          <Text style={styles.saveButtonText}>Save Notes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NotesPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#131313',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24, // Ensures spacing from the top
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 150,
    width: '100%',
    padding: 16,
    backgroundColor: '#1B1C1E',
    color: '#FFFFFF',
    borderRadius: 8,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  saveButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#7257FF',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});