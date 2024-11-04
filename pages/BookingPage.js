import React, { useState, useContext,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../components/UserContext.js';
import { useGoogleAuth } from '../components/useGoogleAuth.js';
import { supabase } from '../lib/supabase';
// import ourGoogleAuthentication from '../wherever.that.is';
import { validateBooking, bookSession } from '../scheduling/calendar.js';

const BookingPage = () => {
  const [selectedDate, setselectedDate] = useState({});
  const [startTime, setStartTime] = useState(''); 
  const [endTime, setEndTime] = useState('');     
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [subject, setSubject] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const { googleAccessToken } = useGoogleAuth();
  const currentDate = moment().format('YYYY-MM-DD');

  const { email, first_name, last_name, role_id, user_id } = user;

  

  // Day selection function
  const onDayPress = (day) => {
    setselectedDate(day.dateString);
  };

  // Time selection handlers
  const onStartTimeChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartTime(moment(selectedDate).format("hh:mm A"));
    }
  };
  const onEndTimeChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndTime(moment(selectedDate).format("hh:mm A"));
    }
  };

  // Fetch tutor availability when component starts
  useEffect(() => {
    fetchTutorAvailability();
  }, []);

  // Handle booking
  const handleBooking = async () => {
    let studentId = null;

     // If user is a student
    if (role_id === 0) {
      studentId = user_id;
    }

    let tutorId = '27b8300a-d69b-4cbc-97f9-e06f59e63bb9' // example ID here, should replace when searchresults returns tutorId

    if (!selectedDate || !startTime || !endTime || !subject) {
      Alert.alert("Incomplete Details", "Please select a date, start time, end time, and subject.");
      return;
    }

    // Calculate day of week from selectedDate
    const dayOfWeek = moment(selectedDate).format('dddd');

    setIsBooking(true);
    setStatusMessage('');

    try {
      const validation = await validateBooking(studentId, tutorId, selectedDate, startTime, endTime);

      if (!validation.available) {
        setStatusMessage(`${validation.conflict}`);
        setIsBooking(false);
        return;
      }

      const bookingData = await bookSession(studentId, tutorId, selectedDate, startTime, endTime, subject, googleAccessToken);

      if (bookingData) {
        setStatusMessage('Session booked successfully!');
        if (googleAccessToken) {
          setStatusMessage((prev) => prev + ' Synced with Google Calendar.');
        }
      } else {
        setStatusMessage('Failed to book session. Please try again.');
      }

    } catch (error) {
      console.error('Error handling booking request:', error);
      setStatusMessage('An error occurred during booking.');
    } finally {
      setIsBooking(false);
    }
  };

    // Maybe add some button to ask user to sign in with google here if they want to sync with google calendar??
    // Ex. !googleAccessToken => then "Sign in with Google to sync your sessions with google calendar?"


    const fetchTutorAvailability = async () => {
      let tutorId = '27b8300a-d69b-4cbc-97f9-e06f59e63bb9' // example ID here, should replace
      const { data: availability, error } = await supabase
        .from('availability')
        .select('day_of_week, start_time, end_time')
        .eq('tutor_id', tutorId);
  
      if (error) {
        console.error('Error fetching availability:', error.message);
        return;
      }
  
      if (availability) {
        markAvailableDates(availability.map((item) => item.day_of_week));
      }
    };
  
    const markAvailableDates = (availableDays) => {
      const marked = {};
      const today = moment();
  
      // Check over 30 days to find available dates
      for (let i = 0; i < 30; i++) {
        const date = today.clone().add(i, 'days');
        const dayOfWeek = date.format('dddd');
        const formattedDate = date.format('YYYY-MM-DD');
  
        // Check if this day of the week is in the tutors availability
        if (availableDays.includes(dayOfWeek)) {
          marked[formattedDate] = {
            selected: true, selectedColor: 'rgba(211, 211, 211, 0.3)'
        };
      } else {
        // Unavailable dates with lighter/disabled styling
        marked[formattedDate] = {
          disabled: true,
          disableTouchEvent: true,
        };
      }
    }
  
      setMarkedDates(marked);
    };

  // Initialize start time to 12:00 AM for the DateTimePicker
  const initialMidnight = new Date();
  initialMidnight.setHours(0, 0, 0, 0);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color="#7257FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Your Booking Dates</Text>
      </View>
  
      {/* Calendar */}
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#7257FF' } } : {}),
          [currentDate]: { marked: true, dotColor: '#7257FF' }, // Purple dot under today's date
        }}
        onDayPress={onDayPress}
        theme={{
          calendarBackground: '#1A1A1A',
          textDisabledColor: 'rgba(255, 255, 255, 0.3)',
          dayTextColor: 'rgba(255, 255, 255, 0.3)',
          monthTextColor: '#ffffff',
          arrowColor: '#ffffff', 
          todayTextColor: '#7257FF', // Purple color for today's date text
        }}
      />

       {/* Subject Picker */}
      <Text style={styles.label}>Select Subject:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={subject}
          onValueChange={(itemValue) => setSubject(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Subject" value="" />
          <Picker.Item label="Math" value="Math" />
          <Picker.Item label="Biology" value="Biology" />
          <Picker.Item label="English" value="English" />
          <Picker.Item label="Chemistry" value="English" />
          <Picker.Item label="Anthropology" value="English" />
        </Picker>
      </View>

      {/* Start Time and End Time Pickers */}
      <Text style={styles.label}>Start Time:</Text>
      <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timeButton}>
        <Text style={styles.timeButtonText}>{startTime || "Select Start Time"}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={initialMidnight}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onStartTimeChange}
        />
      )}

      <Text style={styles.label}>End Time:</Text>
      <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.timeButton}>
        <Text style={styles.timeButtonText}>{endTime || "Select End Time"}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={initialMidnight}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onEndTimeChange}
        />
      )}

      {/* Status Message */}
      {statusMessage ? <Text style={styles.status}>{statusMessage}</Text> : null}
  
      {/* Confirmation Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleBooking} disabled={isBooking}>
        <Text style={styles.confirmButtonText}>{isBooking ? 'Booking...' : 'Confirm Booking'}</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1A1A1A", // Background off-black color
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    paddingTop: 80,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  label: {
    color: '#ffffff',
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 20,
  },
  timeButton: {
    height: 40,
    marginHorizontal: 20,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#333333',
  },
  timeButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  status: {
    marginTop: 10,
    textAlign: 'center',
    color: '#ffffff',
  },
  confirmButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#7257FF', // Purple button color
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  pickerContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#333333',
    borderRadius: 5,
  },
  picker: {
    color: '#ffffff',
    height: 50,
  },
});

export default BookingPage;