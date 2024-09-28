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
    title: "What's your name?",
    subTitle: "Let's start with the basics",
    inputType: "text"
  },
  {
    title: "What's your email?",
    subTitle: "We'll use this to contact you",
    inputType: "email"
  }
];

export default function PopulateInfo({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [formData, setFormData] = useState({});

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
    } else {
      // You can add input fields for name and email steps here
      return (
        <View style={styles.inputContainer}>
          <Text>Input field for {currentDialog.inputType} goes here</Text>
        </View>
      );
    }
  };

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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#222222',
    width: 16,
  },
  rowOne: {
    padding: 0,
    margin: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  subTitle: {
    color: "#6D6D6D",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  rowTwo: {
    gap: 16,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    height: 225,
    width: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#6D6D6D",
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCard: {
    height: 225,
    width: 160,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
    backgroundColor: "black",
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
});
