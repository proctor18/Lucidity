import React, { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, Alert, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars"; 
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { fetchTimeOff, addTimeOff, removeTimeOff } from "../scheduling/calendar";
import { supabase } from '../lib/supabase';

export default function TimeOff({ route, navigation }) {
  const { tutorId } = route.params;
  const [markedDates, setMarkedDates] = useState({});
  const [timeOffDates, setTimeOffDates] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // Reload time off dates whenever screen gains focus or `refresh`
  useFocusEffect(
    useCallback(() => {
      loadTimeOffDates();
    }, [refresh])
  );

  async function loadTimeOffDates() {
    try {
      const timeOffDates = await fetchTimeOff(tutorId); 
      setTimeOffDates(timeOffDates);
      const dates = {};
  
      timeOffDates.forEach((date) => {
        dates[date] = { disabled: true, marked: true, dotColor: "rgba(255, 255, 255, 0.3)" };
      });

      // Fetch session dates
    const { data: existingSessions, error: sessionError } = await supabase
    .from("sessions")
    .select("session_date")
    .eq("tutor_id", tutorId);

    if (sessionError) {
        console.error("Error fetching session dates:", sessionError.message);
        throw sessionError;
    }

    // Mark session dates
    if (existingSessions && existingSessions.length > 0) {
        existingSessions.forEach((session) => {
            const sessionDate = session.session_date;
            dates[sessionDate] = {disabled: true, marked: true, dotColor: "rgba(255, 255, 255, 0.3)" };
        });
    }
    
      const today = moment().format("YYYY-MM-DD");
      dates[today] = { disabled: true, marked: true, dotColor: "#7257FF", customStyles: {
        text: {
          color: "#7257FF",
        },
      }, };
  
      setMarkedDates(dates);
    } catch (error) {
      console.error("Error loading time-off dates:", error.message);
      Alert.alert("Error", "Could not load time-off dates.");
    }
  }

  function onDayPress(day) {
    const { dateString } = day;
  
    Alert.alert(
      "Add Time Off",
      `Would you like to set ${moment(dateString).format("MMM DD, YYYY")} as a time-off?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await addTimeOff(tutorId, dateString); // Add time off
              await loadTimeOffDates(); // Refresh
            } catch (error) {
              console.error("Error adding time off:", error.message);
              Alert.alert("Error", "Failed to add time off.");
            }
          },
        },
      ]
    );
  }

  async function onRemoveTimeOff(date) {
    try {
      await removeTimeOff(tutorId, date);
  
      setTimeOffDates((prevDates) => prevDates.filter((d) => d !== date));
      setMarkedDates((prevDates) => {
        const updatedDates = { ...prevDates };
        delete updatedDates[date];
        return updatedDates;
      });
    } catch (error) {
      console.error("Error removing time-off date:", error.message);
    }
  }

  return (
    <>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color="#7257FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Your Time Off</Text>
        <Text style={styles.subtitle}>
          Select dates when you're unavailable for bookings
        </Text>
      </View>

      <View style={styles.container}>
  
        {/* Calendar */}
        <Calendar
          markedDates={markedDates}
          disableAllTouchEventsForDisabledDays
          markingType="custom"
          minDate={moment().format("YYYY-MM-DD")}
          onDayPress={onDayPress}
          theme={{
            calendarBackground: "#1A1A1A",
            textDisabledColor: "rgba(255, 255, 255, 0.3)",
            dayTextColor: "rgba(255, 255, 255, 0.8)",
            monthTextColor: "#ffffff",
            arrowColor: "#7257FF",
            todayTextColor: "#7257FF",
          }}
        />
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#2A2A2A' }}></View>
        <Text style={styles.listTitle}>Your Time Off Dates</Text>
  
        {/* Time Off List */}
        {timeOffDates.length > 0 ? (
        <View style={styles.timeOffList}>
            {timeOffDates
            .slice()
            .sort((a, b) => moment(a).diff(moment(b))) // Sort based on closest to furthest date
            .map((date) => (
                <View key={date} style={styles.dateItem}>
                {/* Dot */}
                <View style={styles.dateDot} />
                
                {/* Date Text */}
                <Text style={styles.dateText}>
                    {moment(date).format("MMM DD, YYYY")}
                </Text>

                {/* Remove Button */}
                <TouchableOpacity
                    onPress={() =>
                    Alert.alert(
                        "Cancel Time Off",
                        `Are you sure you want to remove your time off for ${moment(
                        date
                        ).format("MMM DD, YYYY")}?`,
                        [
                        { text: "No", style: "cancel" },
                        {
                            text: "Yes",
                            onPress: async () => {
                            try {
                                await onRemoveTimeOff(date); // Remove time off
                                await loadTimeOffDates(); // Refresh
                            } catch (error) {console.error("Error removing time off:",error.message);
                                Alert.alert("Error", "Failed to remove time off.");
                            }},
                        },
                        ]
                    )}
                >
                    <Ionicons
                    name="trash-outline"
                    size={17}
                    color="rgba(128, 128, 128, 0.6)"
                    marginLeft={6}
                    />
                </TouchableOpacity>
                </View>
            ))}
          </View>
          ) : (
          <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No time off dates added yet.</Text>
          </View>
          )}
      </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1A1A1A",
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
  subtitle: {
    fontSize: 14,
    color: "#9A9A9A",
    textAlign: "center",
    marginBottom: 16,
  },
  dateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    marginBottom: 12,
    width: "47%",
  },
  dateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7257FF", 
    marginRight: 8,
  },
  timeOffList: {
    backgroundColor: "#1A1A1A",
    marginTop: 16,
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "300"
  },
  emptyText: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
  },
  listTitle: {
    fontSize: 16,
    color: "#9A9A9A",
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center", 
    alignItems: "center", 
  },
});