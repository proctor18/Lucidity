import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { deleteSession } from '../scheduling/calendar.js';
import { createNotification } from '../scheduling/notificationHelpers.js';
import moment from 'moment';
import { supabase } from '../lib/supabase';

const SessionDetailsPage = ({ route }) => {
  const navigation = useNavigation();
  const { session } = route.params;
  const session_id = session.session_id;
  const [isStartPickerVisible, setStartPickerVisible] = React.useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = React.useState(false);

  const handleStartTimeConfirm = (date) => {
    // Handle start time update
    setStartPickerVisible(false);
  };

  const handleEndTimeConfirm = (date) => {
    // Handle end time update
    setEndPickerVisible(false);
  };


  // Logic to handle a cancel button (deleteSessions is under ../scheduling/calendar) and cancellation notification
  const handleCancel = async () => {
    try {
      // Fetch student email from students table
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('email')
        .eq('student_id', session.student_id)
        .single();
      if (studentError) throw new Error('Failed to fetch student email');
  
      // Fetch tutor email from tutors table
      const { data: tutorData, error: tutorError } = await supabase
        .from('tutors')
        .select('email')
        .eq('tutor_id', session.tutor_id)
        .single();
      if (tutorError) throw new Error('Failed to fetch tutor email');
  
      // Cancel the session
      await deleteSession(session_id);
  
      // Format date and time for the notification message
      const formattedDate = moment(session.date).format('MMMM D');
      const formattedStartTime = moment(session.start_time, 'HH:mm:ssZ').format('HH:mm:ss');
      const formattedEndTime = moment(session.end_time, 'HH:mm:ssZ').format('HH:mm:ss');
  
      let type = 'cancelled'
      // Notify the student
      if (session.student_id && studentData.email) {
        await createNotification(
          session.student_id, 
          `Your session for ${session.subject} on ${formattedDate} from ${formattedStartTime} to ${formattedEndTime} has been cancelled!`,
           studentData.email,
           type
        );
      }
  
      // Notify the tutor
      if (session.tutor_id && tutorData.email) {
        await createNotification(
          session.tutor_id,
          `A session has been cancelled with you for ${session.subject} on ${formattedDate} from ${formattedStartTime} to ${formattedEndTime}.`,
          tutorData.email,
          type
        );
      }
  
      Alert.alert("Success", "Session canceled successfully");
      navigation.goBack();
    } catch (error) {
      console.error('Error in handleCancel:', error.message);
      Alert.alert("Error", error.message || "Failed to cancel session");
    }
  };

  function handleNotesCallback() {
    navigation.navigate('NotesPage', {
      session: currentSession.value
    });
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleSection}>
            <Text style={styles.subTitle}>Graduate Level</Text>
            <Text style={styles.title}>{session?.subject || 'Topology'}</Text>
          </View>

          <View style={styles.sessionDetails}>
            <TouchableOpacity 
              style={styles.timeSelector}
              onPress={() => setStartPickerVisible(true)}
            >
              <Text style={styles.label}>Start Time</Text>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{session?.start_time || '12:45AM'}</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.timeSelector}
              onPress={() => setEndPickerVisible(true)}
            >
              <Text style={styles.label}>End Time</Text>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{session?.end_time || '12:45AM'}</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>Course Notes</Text>

              {/* Notes Button */}
              <TouchableOpacity style={styles.notesButton} onPress={() => navigation.navigate('NotesPage', {session})}>
                <Text style={styles.notesButtonText}>Notes</Text>
              </TouchableOpacity>

              <View style={styles.noteItem}>
                <Text style={styles.noteNumber}>1</Text>
                <View>
                  <Text style={styles.noteTitle}>Intro</Text>
                  <Text style={styles.noteSubtitle}>Introduction.pdf</Text>
                </View>
              </View>
              <View style={styles.noteItem}>
                <Text style={styles.noteNumber}>2</Text>
                <View>
                  <Text style={styles.noteTitle}>Note</Text>
                  <Text style={styles.noteSubtitle}>This.pdf</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {handleCancel()}}
            >
              <Text style={styles.cancelButtonText}>Cancel Session</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <DateTimePickerModal
          isVisible={isStartPickerVisible}
          mode="time"
          onConfirm={handleStartTimeConfirm}
          onCancel={() => setStartPickerVisible(false)}
        />
        <DateTimePickerModal
          isVisible={isEndPickerVisible}
          mode="time"
          onConfirm={handleEndTimeConfirm}
          onCancel={() => setEndPickerVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
  },
  safeArea: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  scrollContent: {
    padding: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  sessionDetails: {
    gap: 16,
  },
  timeSelector: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 16,
    borderRadius: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginBottom: 4,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  notesSection: {
    marginTop: 20,
    gap: 12,
  },
  notesTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 16,
    borderRadius: 12,
  },
  noteNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  noteTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  noteSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  notesButton: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  backgroundColor: "#7257FF", // Brighter color for prominence
  borderRadius: 10,
  marginHorizontal: 10,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 5, // For Android shadow
},
notesButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '600', // Bold font for emphasis
  textAlign: 'center',
},

});

export default SessionDetailsPage;
