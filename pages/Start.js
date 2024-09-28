import { View , Text , StyleSheet } from 'react-native' ; 
import Button from "../components/Button.js" ; 


export default function Start({ navigation }){

  function navigationHandle(){
    navigation.navigate("Login")  
  }
  function navigationHandleTwo(){
    navigation.navigate("Signup")  
  }
  return(
    <View style={styles.container}>
      <Text>
        Hello world this is Start
      </Text>
      <View style={styles.buttonContainer}>
        <Button 
          type="small" 
          text="Login" 
          callback={navigationHandle} 
        />
        <Button 
          type="small" 
          text="Sign up" 
          callback={navigationHandleTwo} 
        />
      </View>
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  buttonContainer : {
    flexDirection : 'column' , 
  },
});
