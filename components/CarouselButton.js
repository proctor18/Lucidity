import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

const CarouselButton = () => {

  return (
    <Pressable
      style={styles.button}
      onPress={() => {
        console.log('Activate the card');
      }}
    >
      <Text style={styles.text}>Activate the card</Text>
    </Pressable>
  );
};

export default CarouselButton ;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    marginVertical: 20,
    padding: 18,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#111111',
  },
});
