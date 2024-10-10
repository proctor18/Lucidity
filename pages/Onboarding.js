
import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Video } from 'expo-av';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VideoComponent = ({ source }) => {
  const video = useRef(null);

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={video}
        source={source}
        style={styles.video}
        resizeMode="cover"
        isLooping // Sets default bool to false ig idek , dont do this its shite 
        shouldPlay
      />
    </View>
  );
};

export default function Onboarding({navigation}) {
  const width = useSharedValue(64);
  const borderRadius = useSharedValue(32);
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useSharedValue(0);

  const dialog = [
    {
      title: "Learning can be lacklustre at times ,",
      subtitle: "Let's gamify it.",
      color: '#0F0F0F',
      video: require('../assets/anims/AnimTwo.mp4')
    },
    {
      title: "Effortless booking",
      subtitle: "Anytime , Anywhere.",
      color: '#0F0F0F',
      video: require('../assets/anims/AnimTwo.mp4')
    },
    {
      title: "Tangible milestones,",
      subtitle: "Meaningful practice.",
      color: '#0F0F0F',
      video: require('../assets/anims/AnimTwo.mp4')
    },
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    borderRadius: borderRadius.value,
    backgroundColor: '#222',
  }));

  const imageContainerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollX.value,
      [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
      [dialog[0].color, dialog[1].color, dialog[2].color]
    ),
    transform: [{
      scale: interpolate(
        scrollX.value,
        [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
        [1, 1, 1],
        Extrapolate.CLAMP
      ),
    }],
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(({ item }) => (
    <View style={styles.page}>
      <Animated.View style={[styles.imageContainer, imageContainerAnimatedStyle]}>
        <VideoComponent source={item.video} />
      </Animated.View>
      <View style={styles.TextContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  ), []);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
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
  }, [dialog.length, width, borderRadius]);

  return (
    <View style={styles.container}>
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
            <Text style={styles.buttonText} onPress={() => navigation.navigate("Start")}>
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
    backgroundColor: '#0F0F0F',
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
    backgroundColor: '#222222',
    marginHorizontal: 6,
    borderWidth : 1 , 
    borderStyle : 'solid' , 
    borderColor :  '#2F2F31' , 
  },
  activeCircle: {
    backgroundColor: '#8770FF',
    width: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    // marginBottom: 10,
    color : 'white' ,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#8770FF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#222',
    paddingVertical: 15,
    height: 64,
    // borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth : 1 , 
    borderStyle : 'solid' , 
    borderColor :  '#2F2F31' , 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  TextContainer: {
    width : '100%',
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
  lottieAnimation: {
    width: 300,
    height: 300,
  },
  video: {
    width: 400,
    height: 400,
  },
});


