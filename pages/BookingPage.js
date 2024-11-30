import React, { useState, useContext,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import moment from 'moment';
import { UserContext } from '../components/UserContext.js';
import { useGoogleAuth } from '../components/useGoogleAuth.js';
import { supabase } from '../lib/supabase';
// import ourGoogleAuthentication from '../wherever.that.is';
import { validateBooking, bookSession, fetchUserSessions  } from '../scheduling/calendar.js';
import { createNotification } from '../scheduling/notificationHelpers.js';

const BookingPage = ({ route }) => {
  const { tutorId, subject } = route.params;
  const [selectedDate, setselectedDate] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const { googleAccessToken } = useGoogleAuth();
  const currentDate = moment().format('YYYY-MM-DD');
  const [timeSlots, setTimeSlots] = useState([]);
  const [morningSlots, setMorningSlots] = useState([]);
  const [afternoonSlots, setAfternoonSlots] = useState([]);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [availability, setAvailability] = useState(null);

  const { email, first_name, last_name, role_id, user_id } = user;

  // Fetch tutor availability
  useEffect(() => {
    fetchTutorAvailability();
  }, []);

  // Retrieves the timeslots that are unavailable for the tutor
  useEffect(() => {
    const fetchUnavailableSlots = async () => {
      let tutor_id = '27b8300a-d69b-4cbc-97f9-e06f59e63bb9'
      const sessions = await fetchUserSessions(tutor_id);

      const unavailable = sessions.flatMap((session) => {
        const sessionStart = moment.utc(`${session.session_date} ${session.start_time}`, 'YYYY-MM-DD HH:mm:ssZ');
        const sessionEnd = moment.utc(`${session.session_date} ${session.end_time}`, 'YYYY-MM-DD HH:mm:ssZ');
        const times = [];
  
        while (sessionStart.isBefore(sessionEnd)) {
          times.push(sessionStart.format('YYYY-MM-DD hh:mm A'));
          sessionStart.add(30, 'minutes');
        }
  
        return times;
      });
      setUnavailableSlots(unavailable);
    };

    fetchUnavailableSlots();
  }, []);

  // Generate 30-minute intervals
  useEffect(() => {
    if (availability) {
      const startTime = moment(availability.start_time, 'HH:mm');
      const endTime = moment(availability.end_time, 'HH:mm');
      const slots = [];

      while (startTime.isBefore(endTime)) {
        slots.push(startTime.format('hh:mm A'));
        startTime.add(30, 'minutes');
      }

      setTimeSlots(slots);

      // Split into morning and afternoon
      const morning = slots.filter((time) => moment(time, 'hh:mm A').isBefore(moment('12:00 PM', 'hh:mm A')));
      const afternoon = slots.filter((time) => moment(time, 'hh:mm A').isSameOrAfter(moment('12:00 PM', 'hh:mm A')));

      setMorningSlots(morning);
      setAfternoonSlots(afternoon);
    }
  }, [availability]);

  // Handle booking
  const handleBooking = async () => {
    let studentId = null;

    // If user is a student
    studentId = user_id;

    let tutorId = '27b8300a-d69b-4cbc-97f9-e06f59e63bb9' // example ID here, should replace when searchresults returns tutorId

    if (!selectedDate || selectedTimes.length < 2) {
      Alert.alert("Incomplete Details", "Please select a date and time range to book a session.");
      return;
    }

    // Sort selected times
    const [startTime, endTime] = selectedTimes
    .sort((a, b) => moment(a, 'hh:mm A').isBefore(moment(b, 'hh:mm A')) ? -1 : 1)
    .map((time) => moment.utc(`${selectedDate} ${time}`, 'YYYY-MM-DD hh:mm A').format('HH:mm:ss'));

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

      // Format date and time for the notification message
      const formattedDate = moment(selectedDate).format('MMMM D');
      const formattedStartTime = startTime;
      const formattedEndTime = endTime;

      if (bookingData) {
        // Can test/demo the email being sent using temp-mail.org and replacing email variable with generated temp email
        setStatusMessage('Session booked successfully!');
        // Notify the student
        await createNotification(studentId, `Your session on ${formattedDate} from ${formattedStartTime} to ${formattedEndTime} has been confirmed!`, email);
        // Notify the tutor
        await createNotification(tutorId, `A new session has been booked with you on ${formattedDate} from ${formattedStartTime} to ${formattedEndTime}.`, 'Teachertest@gmail.com');
        if (googleAccessToken) {
          setStatusMessage((prev) => prev + ' Synced with Google Calendar.');
        }
      } else {
        setStatusMessage('Failed to book session. Please try again.');
      }

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            params: { screen: 'DashboardTab', email, first_name, last_name, role_id, user_id, bookingSuccess: true,},
          },
        ],
      });
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
      let tutorId = '27b8300a-d69b-4cbc-97f9-e06f59e63bb9'; // Example ID, should replace    
      const { data: availability, error } = await supabase
        .from('availability')
        .select('day_of_week, start_time, end_time')
        .eq('tutor_id', tutorId);
    
      if (error) {
        console.error('Error fetching availability:', error.message);
        return;
      }
    
      /*
      const { data: timeOff, error: timeOffError } = await supabase
        .from('time_off')
        .select('date')
        .eq('tutor_id', tutorId);
    
      if (timeOffError) {
        console.error('Error fetching time-off:', timeOffError.message);
        return;
      }
      */
    
      if (availability && availability.length > 0) {
        const availableDays = availability.flatMap((item) => item.day_of_week);
        
        /*
        // Exclude time-off dates
        const unavailableDates = timeOff.map((off) => off.date);
        const filteredDays = availableDays.filter(
          (day) => !unavailableDates.includes(moment(day, "dddd").format("YYYY-MM-DD"))
        );
        
    
        markAvailableDates(filteredDays);
        setAvailability(filteredDays);
        */

        markAvailableDates(availableDays);
        setAvailability(availability[0]);
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
        // Unavailable dates will be formatted differently
        marked[formattedDate] = {
          disabled: true,
          disableTouchEvent: true,
        };
      }
    }

    setMarkedDates(marked);
    };

    const onDayPress = (day) => {
      const dateMoment = moment(day.dateString);
    
      // Disable dates outside the 30-day range
      const isOutOfRange = dateMoment.isBefore(moment()) || dateMoment.isAfter(moment().add(30, 'days'));
      if (isOutOfRange) {
        Alert.alert('Unavailable', 'This date is outside the allowed range.');
        return;
      }
    
      // Disable explicitly marked unavailable dates
      if (markedDates[day.dateString]?.disabled) {
        Alert.alert('Unavailable', 'This date is not available for booking.');
        return;
      }
    
      setselectedDate(day.dateString); // Set the selected date if valid
    };

  // Handle slot selection
  const handleTimeSlotPress = (time) => {
    if (selectedTimes.length === 0) {
      setSelectedTimes([time]);
   } else if (selectedTimes.length === 1) {
    const selectedMoment = moment(selectedTimes[0], 'hh:mm A'); // Parse the existing selected time
    const currentMoment = moment(time, 'hh:mm A'); // Parse the newly selected time

    // Compare the times selected
    if (currentMoment.isAfter(selectedMoment)) {
      setSelectedTimes([...selectedTimes, time]);
    } else {
      setSelectedTimes([time]);
    }
  } else {
    setSelectedTimes([time]);
  }
};

  // Return all of our unavailable times
  const isUnavailable = (time) => {
    const fullDateTime = `${selectedDate} ${time}`;
    return unavailableSlots.includes(fullDateTime);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
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
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#2A2A2A' }}>
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate && !markedDates[selectedDate]?.disabled
            ? { [selectedDate]: { selected: true, selectedColor: '#7257FF' } }
            : {}),
          [currentDate]: {marked: true, dotColor: '#7257FF' }, // Purple dot under today's date
        }}
        onDayPress={onDayPress}
        theme={{
          calendarBackground: '#1A1A1A',
          textDisabledColor: 'rgba(255, 255, 255, 0.3)',
          dayTextColor: 'rgba(255, 255, 255, 0.3)',
          monthTextColor: '#ffffff',
          arrowColor: '#7257FF', 
          todayTextColor: '#7257FF',
        }}
      />
      </View>

      {/* Show Subject */}
      <Text style={styles.subjectLabel}>Booking Session For {subject}</Text>

      {/* Start Time and End Time Pickers */}
      <View style={styles.container}>
      {/* Morning Slots */}
      {morningSlots.length > 0 && (
        <>
          <Text style={styles.label}>Morning</Text>
          <FlatList
            data={morningSlots}
            keyExtractor={(item) => item}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => !isUnavailable(item) && handleTimeSlotPress(item)}
                style={[
                  styles.slotButton,
                  selectedTimes.includes(item) && styles.selectedSlotButton,
                  isUnavailable(item) && styles.unavailableSlotButton,
                ]}
                disabled={isUnavailable(item)} // Disables unavailable slots
              >
                <Text
                  style={[
                    styles.slotText,
                    isUnavailable(item) && styles.unavailableSlotText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.slotContainer}
          />
        </>
      )}
      {/* Afternoon Slots */}
      {afternoonSlots.length > 0 && (
        <>
          <Text style={styles.label}>Afternoon</Text>
          <FlatList
            data={afternoonSlots}
            keyExtractor={(item) => item}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => !isUnavailable(item) && handleTimeSlotPress(item)}
                style={[
                  styles.slotButton,
                  selectedTimes.includes(item) && styles.selectedSlotButton,
                  isUnavailable(item) && styles.unavailableSlotButton,
                ]}
                disabled={isUnavailable(item)} // Disable unavailable slots
              >
                <Text
                  style={[
                    styles.slotText,
                    isUnavailable(item) && styles.unavailableSlotText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.slotContainer}
          />
        </>
      )}
    </View>

      {/* Status Message */}
      {statusMessage ? <Text style={styles.status}>{statusMessage}</Text> : null}
  
      {/* Confirmation Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleBooking} disabled={isBooking}>
        <Text style={styles.confirmButtonText}>{isBooking ? 'Booking...' : 'Confirm Booking'}</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
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
  subjectLabel: {
    color: '#8E8E8F',
    marginTop: 15,
    fontWeight: "bold",
    textAlign: 'center'
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 20,
    fontWeight: "bold",
  },
  status: {
    marginTop: 10,
    textAlign: 'center',
    color: '#ffffff',
  },
  confirmButton: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#7257FF', // Purple button color
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  slotContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginHorizontal: 15,
  },
  slotButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#333333',
    marginHorizontal: 5,
  },
  selectedSlotButton: {
    backgroundColor: '#7257FF',
  },
  unavailableSlotButton: {
    backgroundColor: '#555555', // Grey out unavailable slots
  },
  slotText: {
    fontSize: 16,
    color: '#ffffff',
  },
  unavailableSlotText: {
    color: '#999999', // Faded text for unavailable slots
  },
});

export default BookingPage;