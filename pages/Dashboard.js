import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import SessionsCarousel from "../components/SessionsCarousel.js";
import ButtonDiv from "../components/ButtonDiv.js";
import SessionDrawer from "../components/SessionDrawer.js";
import { supabase } from "../lib/supabase.js";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { fetchDayAvailability } from "../scheduling/calendar.js";
import moment from 'moment'

const Header = ({
  userName = "Username",
  greeting = "Good Morning!",
  navigation,
  role_id,
  user_id,
}) => {

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          <View style={styles.onlineIndicator} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>
  
      {/* Right Container for Icons */}
      <View style={styles.rightContainer}>
        {/* Time Off Button */}
        {role_id === 1 && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("TimeOff", { tutorId: user_id })}
        >
          <FontAwesome name="calendar-times-o" size={24} color="white" />
        </TouchableOpacity>
      )}
      
        {/* Chat Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Messages", { user_id })}
        >
          <Ionicons name="chatbubble-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default function Dashboard({ navigation, route }) {
  const { email, first_name, last_name, role_id, user_id, bookingSuccess } = route.params;
  const [availabilityDays, setAvailabilityDays] = useState([]);
  const [availabilityTimes, setAvailabilityTimes] = useState({ start_time: null, end_time: null });
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const currentIndex = useSharedValue(0);
  const [sessionVisible, setSessionVisible] = useState(false);

  const currentSession = useDerivedValue(() => {
    const index = Math.min(
      Math.max(Math.round(currentIndex.value), 0),
      sessions.length - 1
    );
    return sessions[index];
  });

  const loadAvailability = async () => {
    try {
      const availability = await fetchDayAvailability(user_id);
      setAvailabilityDays(availability.day_of_week || []);
      setAvailabilityTimes({
        start_time: availability.start_time,
        end_time: availability.end_time,
      });
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  };

  function handleVisibleSession() {
    navigation.navigate("SessionDetails", {
      session: currentSession.value,
    });
  }

  // Load availability only if role_id === 1 (a tutor)
  useFocusEffect(
    useCallback(() => {
      if (role_id === 1) {
        loadAvailability();
      }
    }, [user_id])
  );

  useFocusEffect(
    useCallback(() => {
      fetchSessions(role_id);
    }, [role_id])
  );

  useEffect(() => {
    if (bookingSuccess) {
      Alert.alert('Success', 'Your session has been successfully booked!');
    }
  }, [bookingSuccess]);

  async function fetchSessions(role_id) {
    try {
      setLoading(true);
      setError(null);

      const isStudent = role_id !== 1; // role_id 1 is for tutors (therfore !== 1 means student)

      const selectFields = `
        session_id, start_time, end_time, student_id, tutor_id, subject, session_date
      `;
      
      console.log(`Fetching ${isStudent ? 'Student' : 'Tutor'} sessions for user ${user_id}`);


      const filterColumn = isStudent ? 'student_id' : 'tutor_id';
      
      const { data, error } = await supabase
      .from('sessions')
      .select(selectFields)
      .eq(filterColumn, user_id);

      if (error) {
        console.error("Error fetching sessions:", error);
        setError(error.message);
        return;
      }

      if (data) {
        console.log("Sessions fetched successfully:", data);
        setSessions(data);
      } else {
        console.log("No sessions found");
        setSessions([]);
      }
    } catch (error) {
      console.error("Exception while fetching sessions:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 18) return "Good Afternoon!";
    return "Good Evening!";
  };

  return (
    // Check if role_id is 1 (tutor)
    // -------------------------- TUTOR DASHBOARD --------------------------
    role_id === 1 ? 
  <>
    <ScrollView
      contentContainerStyle={styles.container}
      overScrollMode="never"
      bounces={true}
      endFillColor="#131313"
      style={styles.scrollView}>
      <Header
        userName={first_name}
        greeting={getGreeting()}
        navigation={navigation}
        user_id={user_id}
        role_id={role_id}
      />
      <View style={styles.textContainer}>
        <Text style={styles.sessionText}>Sessions with Students</Text>
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
      </View>

      <View style={styles.CarouselContainer}>
        <SessionsCarousel
          sessions={sessions}
          loading={loading}
          currentIndex={currentIndex}
          itemCallback={handleVisibleSession}
        />
      </View>

      <View style={styles.rowTwo}>
        <View style={styles.textContainer}>
          <Text style={styles.sessionText}>Details</Text>
        </View>
        <View style={styles.buttonDiv}>
          <ButtonDiv
            date="Wednesday"
            buttonText={
              loading
                ? "Loading..."
                : currentSession.value?.session_date || "No sessions"
            }
            countDown="2 weeks"
          />
          <View style={styles.horizontalContainer}>
          {/* Tutor Availability Button */}
          <ButtonDiv
              type="wide"
              loading={loading}
              showIcon={false}
              buttonText="Your Availability"
              buttonSubtext={
                availabilityDays.length
                  ? `${availabilityDays.join(", ")}\n\n${
                      availabilityTimes.start_time && availabilityTimes.end_time
                        ? `${moment.utc(availabilityTimes.start_time, "HH:mm:ssZ").format("h:mm A")} - ${moment.utc(availabilityTimes.end_time, "HH:mm:ssZ").format("h:mm A")}`
                        : ""
                    }`
                  : "No Availability Set"
              }
              buttonSubtextStyle={{
                textAlign: 'center',
                paddingTop: 30,
                whiteSpace: 'pre-line',
              }}
              onPress={() => navigation.navigate('UpdateAvailability')}
            />

            <ButtonDiv
              type="wide"
              loading={loading}
              data={currentSession.value}
            />
          </View>
        </View>
      </View>
    </ScrollView>

    <SessionDrawer
      visible={sessionVisible}
      onClose={() => setSessionVisible(false)}
      session={currentSession}
      onUpdateTime={(type, newTime) => {
        console.log(type, newTime);
      }}
      onCancelSession={() => {
        console.log("Session cancelled");
      }}
    />
  </> : /* -------------------------- STUDENT DASHBOARD -------------------------- */ 
  <> 
      <ScrollView
        contentContainerStyle={styles.container}
        overScrollMode="never"
        bounces={true}
        endFillColor="#131313"
        style={styles.scrollView}>
        <Header
          userName={first_name}
          greeting={getGreeting()}
          navigation={navigation}
          user_id={user_id}
        />
        <View style={styles.textContainer}>
          <Text style={styles.sessionText}>Sessions with Tutors</Text>
          {error && <Text style={styles.errorText}>Error: {error}</Text>}
        </View>

        <View style={styles.CarouselContainer}>
          <SessionsCarousel
            sessions={sessions}
            loading={loading}
            currentIndex={currentIndex}
            itemCallback={handleVisibleSession}
          />
        </View>

        <View style={styles.rowTwo}>
          <View style={styles.textContainer}>
            <Text style={styles.sessionText}>Details</Text>
          </View>
          <View style={styles.buttonDiv}>
            <ButtonDiv
              date="Wednesday"
              buttonText={
                loading
                  ? "Loading..."
                  : currentSession.value?.session_date || "No sessions"
              }
              countDown="2 weeks"
            />
            <View style={styles.horizontalContainer}>
              <ButtonDiv
                type="wide"
                loading={loading}
                data={currentSession.value}
              />
              <ButtonDiv
                type="wide"
                loading={loading}
                data={currentSession.value}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <SessionDrawer
        visible={sessionVisible}
        onClose={() => setSessionVisible(false)}
        session={currentSession}
        onUpdateTime={(type, newTime) => {
          console.log(type, newTime);
        }}
        onCancelSession={() => {
          console.log("Session cancelled");
        }}
      />
    </>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#131313",
  },
  scrollView: {
    backgroundColor: "#131313",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emailText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#131313",
    paddingTop: 50,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00C6AE",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#131313",
  },
  textContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 16,
    opacity: 0.9,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  gear: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  CarouselContainer: {
    paddingVertical: 16,
  },
  sessionText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginTop: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    paddingBottom: 4,
  },
  badge: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDiv: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  rowTwo: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
  iconButton: {
    marginLeft: 20,
  },
});
