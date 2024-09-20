import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle  , withSpring } from 'react-native-reanimated';

export default function App() {
  const width = useSharedValue(64); // Define shared value for width
  const [currentStep, setCurrentStep] = useState('stepOne');
  const dialog = {
    stepOne: {
      title: "Effortless Tutor Booking Anytime, Anywhere",
      subtitle: "Clear Learning, Achieved Simply"
    },
    stepTwo: {
      title: "Effortless Tutor Booking Anytime, Anywhere",
      subtitle: "Clear Learning, Achieved Simply"
    },
    stepThree: {
      title: "Effortless Tutor Booking Anytime, Anywhere",
      subtitle: "Clear Learning, Achieved Simply"
    },
  };

  // Animated style for width
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  function handlePress() {
    width.value = width.value === 64 ? withSpring(164) : withSpring(64);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.imageContainer}>
        {/* Placeholder for image */}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.TextContainer}>
          <Text style={styles.subtitle}>{dialog[currentStep].subtitle}</Text>
          <Text style={styles.title}>{dialog[currentStep].title}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.pagination}>
            <View style={[styles.circle, styles.activeCircle]} />
            <View style={styles.circle} />
            <View style={styles.circle} />
          </View>
          <Animated.View style={animatedStyle}>
            <TouchableOpacity style={[styles.button]} onPress={handlePress}>
              <Text style={styles.buttonText}></Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  imageContainer: {
    backgroundColor: '#f0f0f0',
    height: 430,
    width: 345,
    borderRadius: 20,
    marginBottom: 20,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  circle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 6,
  },
  activeCircle: {
    backgroundColor: '#4B5563',
    width: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4B5563',
  },
  button: {
    backgroundColor: '#6D6D6D',
    paddingVertical: 15,
    height: 64,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  TextContainer: {
    marginBottom: 48,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 32,
  },
});
