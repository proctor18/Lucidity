import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { supabase } from '../lib/supabase';

const NotesPage = ({ route }) => {
  const { session } = route.params;
  const [note, setNote] = useState('');
  const [isDraft, setIsDraft] = useState(false);

  // Load the current note from Supabase when the component mounts
  useEffect(() => {
    const fetchNote = async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('session_notes')
        .eq('session_id', session.session_id)
        .single();

      if (error) {
        console.error('Error fetching notes:', error.message);
      } else if (data) {
        setNote(data.session_notes || '');
      }
    };

    fetchNote();
  }, [session.session_id]);

  const saveNote = async () => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ session_notes: note })
        .eq('session_id', session.session_id);

      if (error) throw error;
      alert('Notes updated successfully');
      setIsDraft(false); // Reset draft flag after saving
    } catch (error) {
      console.error('Error updating notes:', error.message);
      alert(`Failed to update notes: ${error.message}`);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Session Notes</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Add your notes here"
              placeholderTextColor="#777777"
              value={note}
              onChangeText={(text) => {
                setNote(text);
                setIsDraft(true); // Mark as draft when editing
              }}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
              <Text style={styles.saveButtonText}>{isDraft ? 'Save Note' : 'Saved!'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default NotesPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#131313',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 375, // Increased the height to make it larger
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
