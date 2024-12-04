import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { updateTutorAvailability } from '../scheduling/calendar';
import { UserContext } from '../components/UserContext.js';
import Button from '../components/Button.js';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import moment from 'moment';

const DAYS_MAP = [
    {
      title: "Monday",
      icon: "../assets/icons/mathPurple.png",
      activeIcon: "../assets/icons/mathWhite.png",
    },
    {
      title: "Tuesday",
      icon: "../assets/icons/mathPurple.png",
      activeIcon: "../assets/icons/mathWhite.png",
    },
    {
      title: "Wednesday",
      icon: "../assets/icons/mathPurple.png",
      activeIcon: "../assets/icons/mathWhite.png",
    },
    {
      title: "Thursday",
      icon: "../assets/icons/mathPurple.png",
      activeIcon: "../assets/icons/mathWhite.png",
    },
    {
      title: "Friday",
      icon: "../assets/icons/mathPurple.png",
      activeIcon: "../assets/icons/mathWhite.png",
    },
    {
      title: "Saturday",
      icon: "../assets/icons/mathPurple.png",
      activeIcon: "../assets/icons/mathWhite.png",
    },
    {
      title: "Sunday",
      icon: "../assets/icons/mathPurple.png",
      activeIcon: "../assets/icons/mathWhite.png",
    },
  ];
  const generateTimeSlots = (startTime, endTime, interval = 60) => {
    const slots = [];
    let current = moment(startTime, "hh:mm A");
  
    while (current.isBefore(moment(endTime, "hh:mm A"))) {
      slots.push(current.format("hh:mm A"));
      current.add(interval, "minutes");
    }
  
    return slots;
  };

export default function UpdateAvailability() {
  const [timeSlots] = useState(generateTimeSlots("8:00 AM", "11:00 PM", 60));
  const morningSlots = timeSlots.filter((time) => moment(time, "hh:mm A").hour() < 12);
  const afternoonSlots = timeSlots.filter((time) => moment(time, "hh:mm A").hour() >= 12);
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const { email, first_name, last_name, role_id, user_id } = user;

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleSlot = (slot) => {
    if (selectedTimeSlots.length < 2) {
      // Add slot if not selected
      setSelectedTimeSlots((prevSlots) =>
        prevSlots.includes(slot) ? prevSlots.filter((s) => s !== slot) : [...prevSlots, slot]
      );
    } else if (selectedTimeSlots.includes(slot)) {
      // Allow deselecting
      setSelectedTimeSlots((prevSlots) => prevSlots.filter((s) => s !== slot));
    } else {
      alert('Please only select two morning or afternoon time slots.');
    }
  };

  const handleSave = async () => {
    const tutorId = user_id

    try {
      if (selectedTimeSlots.length !== 2) {
        alert('Please select exactly two time slots: one for start and one for end.');
        return;
      }

      // Must sort times to ensure placed into database correctly
      const sortedTimeSlots = selectedTimeSlots.sort((a, b) => 
        moment.utc(a, "hh:mm A").diff(moment.utc(b, "hh:mm A"))
      );

      const availabilityData = {
        tutor_id: user_id,
        day_of_week: selectedDays,
        start_time: moment.utc(sortedTimeSlots[0], "hh:mm A").format("HH:mm:ssZ"),
        end_time: moment.utc(sortedTimeSlots[1], "hh:mm A").format("HH:mm:ssZ"),
      };
      
      const result = await updateTutorAvailability(
        availabilityData.tutor_id,
        availabilityData.day_of_week,
        availabilityData.start_time,
        availabilityData.end_time
      );

      if (result.success) {
        // Navigate to MainTabs on save
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              params: {screen: 'DashboardTab', email, first_name, last_name, role_id, user_id},
            },
          ],
        });
      } else {
        alert('Failed to update availability. Please try again.');
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.fullContainer}>
      <SafeAreaView style={styles.fullContainer}>
        {/* Header Section */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={18} color="#7257FF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Update Your Availability</Text>
        </View>
        <View>
          {/* Day Selection */}
          <View style={styles.chipContainer}>
          {DAYS_MAP.map((day) => (
              <Button
                key={day.title}
                type="chip"
                text={day.title}
                callback={() => toggleDay(day.title)}
                active={selectedDays.includes(day.title)}
              />
            ))}
          </View>

          {/* Time Slot Selection */}
          <View style={styles.timeSlotContainer}>
            <Text style={styles.label}>Select Your Start and End Availability</Text>

            {/* Morning Slots */}
            <View>
              <Text style={styles.timeLabel}>Morning</Text>
              <FlatList
                data={morningSlots}
                keyExtractor={(item) => item}
                horizontal
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => toggleSlot(item)}
                    style={[
                      styles.slotButton,
                      selectedTimeSlots.includes(item) && styles.selectedSlotButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        selectedTimeSlots.includes(item) && styles.selectedSlotText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Afternoon Slots */}
            <View>
              <Text style={styles.timeLabel}>Afternoon</Text>
              <FlatList
                data={afternoonSlots}
                keyExtractor={(item) => item}
                horizontal
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => toggleSlot(item)}
                    style={[
                      styles.slotButton,
                      selectedTimeSlots.includes(item) && styles.selectedSlotButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        selectedTimeSlots.includes(item) && styles.selectedSlotText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
        {/* Save Button */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={[
                styles.saveButton,
                (!selectedDays.length || selectedTimeSlots.length !== 2) && styles.buttonDisabled,
                ]}
                onPress={handleSave}
                disabled={!selectedDays.length || selectedTimeSlots.length !== 2}
            >
                <Text style={styles.saveButtonText}>Save Availability</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: "#131313",
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
    fullContainer: {
        flexGrow: 1,
        paddingBottom: 20,
        backgroundColor: '#131313',
      },
    chipContainer : {
        marginTop: 30,
        width : "100%" , 
        flexDirection : "row" ,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    chipButton: {
        padding: 10,
        borderRadius: 16,
        backgroundColor: 'rgba(51, 51, 51, 0.8)',
        margin: 5,
    },
    selectedChipButton: {
        backgroundColor: "rgba(114, 87, 255, 0.3)",
        borderColor: "rgba(155, 137, 255, 0.3)",
        borderWidth: 1,
    },
    chipText: {
      fontSize: 14,
      color: '#FFFFFF',
    },
    selectedChipText: {
      color: "rgba(155, 137, 255, 1.0)",
      fontWeight: "bold",
    },
    timeSlotContainer: {
        paddingHorizontal: 32,
        paddingVertical: 16,
      },
    label: {
        color: '#ffffff',
        fontSize: 17,
        marginTop: 15,
        fontWeight: "bold",
    },
    timeLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "rgba(128, 128, 128, 1.0)",
        marginBottom: 10,
        marginTop: 20
    },
    slotButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(51, 51, 51, 0.8)',
        marginHorizontal: 5,
    },
    selectedSlotButton: {
        backgroundColor: "rgba(114, 87, 255, 0.3)",
        borderRadius: 10,
        borderColor: "rgba(155, 137, 255, 0.3)",
        borderWidth: 1
    },
    slotText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    selectedSlotText: {
        color: "rgba(155, 137, 255, 1.0)",
        fontWeight: "bold",
    },
    saveButton: {
        paddingVertical: 15,
        width: "70%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        backgroundColor: "#222",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#2F2F31",
        },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.6,
      },
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: "center",
        paddingBottom: 10,
    },
  });