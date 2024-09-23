import { View , Text , StyleSheet } from 'react-native' ; 
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import { createStackNavigator } from '@react-navigation/stack'; // Correct stack navigator import

export default function Login({navigation}){
  return(
    <View>
      <Text>
        Hello world
      </Text>
    </View>
  )
};



const styles = StyleSheet.create({
  container : {

  }
});
