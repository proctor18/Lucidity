import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolateColor,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useAnimatedScrollHandler } from 'react-native-reanimated';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import { createStackNavigator } from '@react-navigation/stack'; // Correct stack navigator import


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Onboarding({navigation}) {
  const width = useSharedValue(64);
  const borderRadius = useSharedValue(32);
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useSharedValue(0);

  const dialog = [
    {
      title: "Effortless Tutor Booking Anytime, Anywhere",
      subtitle: "",
      color: '#FF6B6B'
    },
    {
      title: "Build trust with a transparent rating system.",
      subtitle: "",
      color: '#4ECDC4'
    },
    {
      title: "Easily reschedule sessions to fit your needs.",
      subtitle: "",
      color: '#45B7D1'
    },
  ];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      borderRadius: borderRadius.value,
      backgroundColor: '#222',
    };
  });

  const imageContainerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollX.value,
      [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
      [dialog[0].color, dialog[1].color, dialog[2].color]
    );

    return {
      backgroundColor,
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
            [1, 0.8, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  function handlePress() {
    // if (currentStep === dialog.length - 1) {
    //   width.value = withSpring(164);
    //   borderRadius.value = withSpring(12);
    // } else {
    //   flatListRef.current.scrollToIndex({ index: currentStep + 1, animated: true });
    // }
  }

  const renderItem = ({ item }) => (
    <View style={styles.page}>
      <View style={styles.TextContainer}>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentStep(viewableItems[0].index);
      if (viewableItems[0].index === dialog.length - 1) {
        width.value = withSpring(164);
        borderRadius.value = withSpring(12);
      } else {
        width.value = withSpring(64);
        borderRadius.value = withSpring(32);
      }
    }
  }).current;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, imageContainerAnimatedStyle]}>
        {/* Placeholder for image */}
      </Animated.View>
      <Animated.FlatList
        ref={flatListRef}
        data={dialog}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        keyExtractor={(_, index) => index.toString()}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      <View style={styles.contentContainer}>
        <View style={styles.buttonContainer}>
          <View style={styles.pagination}>
            {dialog.map((_, index) => (
              <View
                key={index}
                style={[styles.circle, currentStep === index && styles.activeCircle]}
              />
            ))}
          </View>
          <Animated.View style={[styles.button, animatedStyle]}>
            <Text style={styles.buttonText} onPress={ () => navigation.navigate("Login") }>
              {currentStep === dialog.length - 1 ? 'Get Started' : ''}
            </Text>
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
    height: 430,
    width: 345,
    borderRadius: 20,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
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
    backgroundColor: '#222222',
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#222',
    paddingVertical: 15,
    height: 64,
    // borderRadius: 12,
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
    flexDirection : 'row' , 
    alignItems: 'space-between',
    justifyContent: 'space-between',
    width: '100%',
  },
  page: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});


