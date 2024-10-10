import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Button from '../components/Button.js';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const dialog = [
  {
    title: "Help us get to know you better",
    subTitle: "Which one are you?",
    options: ["Student", "Tutor"]
  },
  {
    title: "What subjects are you comfortable teaching?" ,
    subTitle: "Help us get to know you better",
    inputType: "text"
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
,
]

export default function PopulateInfo({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [formData, setFormData] = useState({});

  const [topicList , setTopic ] = useState([]) ;

// -------------------------------- Review ------------------------------
  
  const addTopic = (newTopic) => {
      if(topicList.includes(newTopic)) {
        const index = topicList.indexOf(newTopic);
        const updatedTopics = [...topicList]; // Create a copy of the array
        updatedTopics.splice(index, 1);   // Remove the item
        setTopic(updatedTopics);          // Update the state
      } else {
        setTopic([...topicList, newTopic]);    // Add new topic to the array
      }
  };


// -------------------------------- Review ------------------------------
  const handleContinue = () => {
    if (currentStep < dialog.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Form completed:", formData);
      // navigation.navigate("NextScreen", { formData });
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setFormData({ ...formData, userType: option });
  };

  const renderContent = () => {
    const currentDialog = dialog[currentStep];

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
    //
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

    if (currentStep === 2){
      return ( 
        <View style={styles.chipContainer}>
        </View>
      )
    }
  };
// -------------------------------- Review ------------------------------

  return (
    <View style={styles.container}>
      <View style={styles.pagination}>
        {dialog.map((_, index) => (
          <View
            key={index}
            style={[styles.paginationDot, currentStep === index && styles.activeDot]}
          />
        ))}
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
          text={currentStep === dialog.length - 1 ? "Submit" : "Continue"}
          callback={handleContinue}
          disabled={currentStep === 0 && !selectedOption}
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
    // backgroundColor: '#0F0F0F',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex_start",
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
  } ,
});
