import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, SafeAreaView, Alert } from 'react-native';
import Button from '../components/Button.js';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import  { supabase } from '../lib/supabase.js' ; 
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const dialog = [
  {
    title: "Help us get to know you better",
    subTitle: "Which one are you?",
    options: ["Student", "Tutor"]
  },
  {
    title: "What subjects are you comfortable with?" ,
    subTitle: "Help us get to know you better",
    inputType: "text"
  },
  {
    title: "Select your preferred grade level",
    subTitle: "Help us get to know you better",
    inputType: "int",
  },
  {
    title: "What is your availability like?" ,
    subTitle: "Help us get to know you better",
    inputType: "email"
  }
];

const TOPIC_MAP = [
  {
    title : "Math" , 
    subCount : 1 , 
    icon : "../assets/icons/mathPurple.png"  , 
    activeIcon : "../assets/icons/mathWhite.png" 
  },
  {
    title : "Chemistry" , 
    subCount : 1 , 
    icon : "../assets/icons/mathPurple.png"  , 
    activeIcon : "../assets/icons/mathWhite.png" 
  },
  {
    title : "Art" , 
    subCount : 1 , 
    icon : "../assets/icons/mathPurple.png"  , 
    activeIcon : "../assets/icons/mathWhite.png" 
  },
  {
    title : "Language Arts" , 
    subCount : 1 , 
    icon : "../assets/icons/mathPurple.png"  , 
    activeIcon : "../assets/icons/mathWhite.png" 
  },
  {
    title : "Biology" , 
    subCount : 1 , 
    icon : "../assets/icons/mathPurple.png"  , 
    activeIcon : "../assets/icons/mathWhite.png" 
  },
  {
    title : "Philosophy" , 
    subCount : 1 , 
    icon : "../assets/icons/mathPurple.png"  , 
    activeIcon : "../assets/icons/mathWhite.png" 
  },
  {
    title : "Physics" , 
    subCount : 1 , 
    icon : "../assets/icons/mathPurple.png"  , 
    activeIcon : "../assets/icons/mathWhite.png" 
  },
  {
    title : "Programming" , 
    subCount : 1 , 
    icon : "../assets/icons/mathPurple.png"  , 
    activeIcon : "../assets/icons/mathWhite.png" 
  },
  {
    title : "Anthropology" , 
    subCount : 1 , 
    icon : "../assets/icons/mathPurple.png"  , 
    activeIcon : "../assets/icons/mathWhite.png" 
  },
];

const GRADE_MAP = [
  {
    title: "Grade 1",
    value: 1,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Grade 2",
    value: 2,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Grade 3",
    value: 3,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Grade 4",
    value: 4,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Grade 5",
    value: 5,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Grade 6",
    value: 6,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Grade 7",
    value: 7,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Grade 8",
    value: 8,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Grade 9",
    value: 9,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Grade 10",
    value: 10,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Grade 11",
    value: 11,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Grade 12",
    value: 12,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
  {
    title: "Post Secondary",
    value: 13,
    icon: "../assets/icons/mathPurple.png",
    activeIcon: "../assets/icons/mathWhite.png",
  },
];

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

export default function PopulateInfo({ route }) {

  const { first_name , last_name , email , user_id  , password } = route.params ; 

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [formData, setFormData] = useState({});
  const [topicList , setTopic ] = useState([]) ;
  const [loading , setLoading ] = useState(false) ;
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isQualified, setIsQualified] = useState(false);
  const navigation = useNavigation();

  const [timeSlots] = useState(generateTimeSlots("8:00 AM", "11:00 PM", 60));
  const morningSlots = timeSlots.filter((time) => moment(time, "hh:mm A").hour() < 12);
  const afternoonSlots = timeSlots.filter((time) => moment(time, "hh:mm A").hour() >= 12);

  //Function to handle the writing to the database
  async function writeValues() {
    if (!topicList || !selectedOption) {
      console.error("Error: Values are missing");
      return; // Return early if values are missing
    }
    setLoading(true);
  
    try {
      // Insert Tutor or Student
      const userInfo = {
        role_id: selectedOption === "Tutor" ? 1 : 0,
        topics: topicList,
        [selectedOption === "Tutor" ? "tutor_id" : "student_id"]: user_id,
        password,
        email,
        first_name,
        last_name,
        ...(selectedOption === "Tutor" && { is_qualified: isQualified }),
        grade_level: selectedGrade
      };
  
      const { data: tutorData, error: tutorError } = await supabase
        .from(selectedOption === "Tutor" ? "tutors" : "students")
        .insert(userInfo);
  
      if (tutorError) {
        console.error("Error while inserting user:", tutorError);
        Alert.alert("Error", "Failed to save user information.");
        return;
      }
  
      // Insert Availability (Only for Tutors)
      if (selectedOption === "Tutor") {
        if (!selectedDays.length || selectedTimeSlots.length !== 2) {
          Alert.alert("Error", "Please select days and time slots.");
          return;
        }
  
        const availabilityData = {
          tutor_id: user_id,
          day_of_week: selectedDays, 
          start_time: moment.utc(selectedTimeSlots[0], "hh:mm A").format("HH:mm:ssZ"),
          end_time: moment.utc(selectedTimeSlots[1], "hh:mm A").format("HH:mm:ssZ"),
        };
  
        const { data: availabilityDataResponse, error: availabilityError } = await supabase
          .from("availability")
          .insert(availabilityData);
  
        if (availabilityError) {
          console.error("Error while inserting availability:", availabilityError);
          Alert.alert("Error", "Failed to save availability.");
          return;
        }
      }
  
      // Success
      Alert.alert("Success", "Your information has been saved!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Unexpected error:", error.message);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }
// -------------------------------- Review ------------------------------
  
  const addTopic = (newTopic) => {
      if(topicList.includes(newTopic)) {
        const index = topicList.indexOf(newTopic);
        const updatedTopics = [...topicList]; 
        updatedTopics.splice(index, 1);   
        setTopic(updatedTopics);         
      } else {
        setTopic([...topicList, newTopic]);    
      }
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

// -------------------------------- Review ------------------------------
const handleContinue = () => {
  if (selectedOption === "Student" && currentStep === 2) {
    writeValues();
    return;
  }

  // Proceed to the next step if not at the end
  if (currentStep < dialog.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    writeValues(); // Submit on the final step
  }
};

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setFormData({ ...formData, userType: option });
  };

  const toggleSlot = (slot) => {
    if (selectedTimeSlots.includes(slot)) {
      setSelectedTimeSlots(selectedTimeSlots.filter((time) => time !== slot));
    } else if (selectedTimeSlots.length < 2) {
      setSelectedTimeSlots([...selectedTimeSlots, slot]);
    } else {
      alert("Only two time slots can be selected.");
    }
  };

  const renderContent = () => {
    const currentDialog = dialog[currentStep];

    // Tutor / Student Selector
    if (currentStep === 0) {
      return (
        <View style={styles.rowTwo}>
          {currentDialog.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={selectedOption === option ? styles.activeCard : styles.card}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={selectedOption === option ? styles.activeCardText : styles.cardText}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

// -------------------------------- Review ------------------------------
    // Subject Selecter
    if (currentStep === 1){
      return ( 
        <View style={styles.chipContainer}>
          {TOPIC_MAP.map((topic) => (
            <Button
              key={topic.title} // Always use a unique key
              type="chip"
              text={topic.title}
              callback={() => addTopic(topic.title)} // Use a function reference
              active={topicList.includes(topic.title)} // Check if the topic is in the active topics
            />
          ))}
        </View>
      )
    }

    // Grade Level
    if (currentStep === 2) {
      return (
        <View style={styles.chipContainer}>
          {GRADE_MAP.map((grade) => (
            <Button
              key={grade.value}
              type="chip"
              text={grade.title}
              callback={() => setSelectedGrade(grade.value)}
              active={selectedGrade === grade.value}
              icon={selectedGrade === grade.value ? grade.activeIcon : grade.icon}
            />
          ))}
        </View>
      );
    }

    // Availability
    if (currentStep === 3) {
      return (
        <ScrollView contentContainerStyle={styles.fullContainer}>
        <SafeAreaView style={styles.fullContainer}>
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
        
        {/* Qualification Checkmark */}
        <View style={styles.checkContainer}>
          <BouncyCheckbox
            size={25}
            fillColor="#7257FF" // Color when selected
            unfillColor="#FFFFFF" // Background color when unselected
            text="Do you consider yourself qualified to be a tutor?"
            iconStyle={{ borderColor: "#7257FF", borderRadius: 4 }}
            textStyle={{ fontSize: 16, color: "white", textDecorationLine: "none" }}
            isChecked={isQualified}
            onPress={(isChecked) => setIsQualified(isChecked)}
          />
        </View>
    </View>
    </SafeAreaView>
    </ScrollView>
    );
  }};
// -------------------------------- Review ------------------------------

  return (
    <View style={styles.container}>
      <View style={styles.pagination}>
        {dialog.map((_, index) => {
          // Only render the first two dots if selectedOption is "Student"
          if (selectedOption === "Student" && index > 2) {
            return null;
          }
          return (
            <View
              key={index}
              style={[styles.paginationDot, currentStep === index && styles.activeDot]}
            />
          );
        })}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.rowOne}>
          <Text style={styles.subTitle}>{dialog[currentStep].subTitle}</Text>
          <Text style={styles.title}>{dialog[currentStep].title}</Text>
        </View>
        {renderContent()}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          type="small"
          text={
            selectedOption === "Student" && currentStep === 2
              ? "Submit"
              : currentStep === dialog.length - 1
              ? "Submit"
              : "Continue"
          }
          callback={handleContinue}
          disabled={
            ((currentStep === 0 && !selectedOption) ||
            (selectedOption === "Tutor" && !isQualified && currentStep == 3)) // Tutor must check qualified to continue
          }
          style={[
            styles.button,
            (
              ((currentStep === 0 && !selectedOption) ||
              (selectedOption === "Tutor" && !isQualified))
            ) && styles.buttonDisabled
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 32,
    flexDirection: "column",
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
  },
  fullContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: 'black',
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  paginationDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'grey',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#8770FF', // change to blue later 
    width: 16,
  },
  rowOne: {
    padding: 0,
    margin: 0,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 40,
    textAlign : 'left' , 
  },
  subTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    opacity : 0.7 ,
    textAlign : 'left' , 
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    textAlign : 'left' , 
  },
  rowTwo: {
    gap: 8,
    width: "100%",
    hieght : "100%" ,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    height: 225,
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#2F2F31",
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCard: {
    height: 225,
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
    backgroundColor: "#27223F",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    color: "#6D6D6D",
    fontSize: 18,
    fontWeight: "bold",
  },
  activeCardText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  chipContainer : {
    width : "100%" , 
    flexDirection : "row" ,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  timeSlotContainer: {
    marginTop: 15,
  },
  timeLabel: {
    color: "rgba(128, 128, 128, 1.0)",
    fontSize: 17,
    marginTop: 15,
    fontWeight: "bold",
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
    color: '#ffffff',
  },
  selectedSlotText: {
    color: "rgba(155, 137, 255, 1.0)",
    fontWeight: "bold"
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
    color: "#FFFFFF",
    marginBottom: 10,
    marginTop: 20
  },
  buttonDisabled: {
    backgroundColor: "#D3D3D3",
    opacity: 0.6,
  },
  checkContainer: {
    paddingTop: 20,
  },
});