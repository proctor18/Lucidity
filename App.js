import {View , Text , StyleSheet } from 'react-native' ; 
import { StatusBar } from 'expo-status-bar';
import Onboarding from './pages/Onboarding.js' ; 

export default function App(){
  return(
    <View style={styles.container}>
      <Onboarding />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
})
