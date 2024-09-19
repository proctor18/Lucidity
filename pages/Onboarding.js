import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function Onboarding() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap : 16 , 
  },
  imageContainer : {
    backgroundColor : 'red' , 
    height : 430 , 
    width : 345 , 
  },
});
