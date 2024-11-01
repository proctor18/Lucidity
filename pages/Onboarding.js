import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolateColor,
  interpolate,
  Extrapolate,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { useAnimatedScrollHandler } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoComponent = ({ source, isVisible }) => {
  const video = useRef(null);

  React.useEffect(() => {
    if (isVisible) {
      video.current.playAsync();
    } else {
      video.current.stopAsync();
    }
  }, [isVisible]);

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={video}
        source={source}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={false}
        isMuted={true}
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

  const [visibleIndex, setVisibleIndex] = useState(0);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const drawerAnimation = useSharedValue(SCREEN_HEIGHT);

  const dialog = [
    {
      title: "Simple booking",
      subtitle: "Anytime    Anywhere.",
      color: '#0F0F0F',
      video: require('../assets/anims/direction.mp4')
    },
    {
      title: "Learning can be lacklustre , Let's",
      subtitle: "Gamify it.",
      color: '#0F0F0F',
      video: require('../assets/anims/Anim.mp4')
    },
    {
      title: "Real-time alerts,",
      subtitle: "no delay.",
      color: '#0F0F0F',
      video: require('../assets/anims/Throw.mp4')
    },
  ];

  const showDrawer = () => {
    setIsDrawerVisible(true);
    drawerAnimation.value =  withSpring(0 , {
      mass: 1,
      damping: 10,
      stiffness: 47,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    })
  
  };

  const hideDrawer = () => {
    drawerAnimation.value = withSpring(SCREEN_HEIGHT, {}, () => {
      runOnJS(setIsDrawerVisible)(false);
    });
  };

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

  const drawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: drawerAnimation.value }],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(({ item, index }) => (
    <View style={styles.page}>
      <Animated.View style={[styles.imageContainer, imageContainerAnimatedStyle]}>
        <VideoComponent source={item.video} isVisible={index === visibleIndex} />
      </Animated.View>
      <View style={styles.TextContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  ), [visibleIndex]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentStep(newIndex);
      setVisibleIndex(newIndex);
      if (newIndex === dialog.length - 1) {
        width.value = withSpring(164);
        borderRadius.value = withSpring(12);
      } else {
        width.value = withSpring(64);
        borderRadius.value = withSpring(32);
      }
    }
  }, [dialog.length, width, borderRadius]);

  const handleGetStarted = () => {
    if (currentStep === dialog.length - 1) {
      navigation.navigate("Start");
    }
  };

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
            <TouchableOpacity onPress={handleGetStarted}>
              <Text style={styles.buttonText}>
                {currentStep === dialog.length - 1 ? 'Get Started' : ''}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      {isDrawerVisible && (
        <Animated.View style={[styles.overlay, drawerStyle]}>
          <BlurView intensity={80} style={styles.blurContainer}>
            <View style={styles.drawer}>
              <TouchableOpacity style={styles.closeButton} onPress={hideDrawer}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <View style={styles.drawerHandle} />
              <Text style={styles.drawerTitle}>Continue with</Text>
              <Text style={styles.drawerSubtitle}>Select the sign in option you would like to continue with</Text>
              <TouchableOpacity style={styles.drawerButton}>
                <Text style={styles.drawerButtonText}>Log in</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.drawerButton}>
                <Text style={styles.drawerButtonText}>Sign up</Text>
              </TouchableOpacity>
              <View style={styles.drawerButtonRow}>
                <TouchableOpacity style={[styles.drawerButton, styles.halfButton]}>
                  <Text style={styles.drawerButtonText}>Sign up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.drawerButton, styles.halfButton]}>
                  <Text style={styles.drawerButtonText}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#12101d',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    mixBlendMode: 'screen' 
  },
  video: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    height: 475,
    width: SCREEN_WIDTH,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#2F2F31',
  },
  activeCircle: {
    backgroundColor: '#B7ACFF',
    width: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'white',
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#B7ACFF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#222',
    paddingVertical: 15,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#2F2F31',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  TextContainer: {
    width: '100%',
    marginBottom: 48,
  },
  buttonContainer: {
    flexDirection: 'row',
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
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  blurContainer: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  drawer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 48,
    paddingHorizontal : 20 ,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#3A3A3C',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  drawerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
  },
  drawerButton: {
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  drawerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  drawerButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfButton: {
    flex: 0.48,
  },
});
