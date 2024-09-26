import { View , Text , StyleSheet } from 'react-native' ; 
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import { createStackNavigator } from '@react-navigation/stack'; // Correct stack navigator import
import Button from '../components/Button.js' ; 
import Input from '../components/Input.js' ; 



export default function Login({navigation}){
  return(
    <View style={styles.container}>
      <View style={styles.rowOne}>
        <Input />
        <Button type="small" text="Continue"/> 
      </View>
    </View>
  )
};



const styles = StyleSheet.create({
  container : {
    flex : 1 , 
    flexDirection : "column" , 
    justifyContent : "center" ,
    alignItems : "center" ,
  },
  rowOne : {
    paddingHorizontal : 32 , 
    paddingVertical : 16 , 
    width : "100%",

  },
});
