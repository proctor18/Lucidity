import React from 'react';
import { View, Text, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';

const Item = ({ item, width, height, marginHorizontal, fullWidth, x, index, callback }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [20, 0, -20],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [60, 0, 60],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ rotateZ: `${rotateZ}deg` }, { translateY: translateY }],
    };
  });

  return (
    <TouchableOpacity onPress={callback} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.container,
          {
            width: width,
            height: height,
            marginHorizontal: marginHorizontal,
            transformOrigin: Platform.OS === 'android' ? '120px 400px' : 'bottom',
          },
          animatedStyle,
        ]}
      >
        <View style={styles.imageContainer}>
          <Image source={item.image} style={[styles.image, { width: width }]} resizeMode="cover" />
        </View>
        
        

        <View style={styles.bottomContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textExp}>{item.exp}</Text>
            <Text style={styles.textName}>{item.name}</Text>
          </View>
          <View style={styles.visaContainer}>
            <Image source={item.visa} resizeMode="contain" style={styles.visa} />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1B1C1E',
    borderRadius: 12,
    overflow: 'hidden',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#313234',
  },
  imageContainer: { 
    flex: 4 
  },
  image: {
    flex: 1 
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  textContainer: {
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  textName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textExp: {
    color: 'white',
    fontSize: 16,
    opacity: 0.7,
  },
  visaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visa: {
    width: 58,
  },
  chip: {
    position: 'absolute',
    transform: [{ scale: 0.4 }, { rotateZ: '90deg' }],
    right: -40,
    top: 20,
  },


  notesButton: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: '#00C6AE',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  notesButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});
