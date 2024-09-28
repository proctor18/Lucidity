import { View , Text , StyleSheet  , TouchableOpacity } from 'react-native' ; 
import React , { useState } from 'react' ; 
import Button from '../components/Button.js'


const dialog  = [
  {
    title :  "Help us get to know you better",
    subTitle :  "Which one are you?"
  },
  {
    title :  "Help us get to know you better",
    subTitle :  "Help us get to know you better"
  },
]
 
export default function PopulateInfo({ navigation } ){
  const [activeCard , setActiveCard]  = useState("") ; 
  return(
    <View style={styles.container}>
      <View style={styles.rowOne}>
        <Text style={styles.subTitle}>
          {dialog[0].subTitle}
        </Text>
        <Text style={styles.title}>
          {dialog[0].title}
        </Text>
      </View>

      <View style={styles.rowTwo}>

        <TouchableOpacity style={ activeCard==="Tutor" ? styles.activeCard : styles.card} onPress={() => setActiveCard("Tutor")}>
        </TouchableOpacity>

        <TouchableOpacity style={ activeCard==="Student" ? styles.activeCard : styles.card} onPress={() => setActiveCard("Student")}>
        </TouchableOpacity>


      </View>
      <View style={styles.buttonContainer}>
        <Button 
          type="small" 
          text="Continue" 
          // callback={} 
        />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    width : "100%" , 
    height : "100%" , 
    paddingHorizontal : 32 , 
    flexDrection : "column" , 
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop : 128 , 
    paddingBottom: 40,
  },
  rowOne : {
    padding : 0 , 
    margin : 0 , 
    width : "100%",
    alignItems: "flex-start" ,
    justifyContent : "flex-start" ,
  },
  subTitle : {
    color : "black" , 
    fontWeight : "bold" , 
    fontSize : 24 , 

  },

  title : {
    color : "#6D6D6D" , 
    fontWeight : "bold" , 
    fontSize : 18 , 
  },

  rowTwo : {
    gap : 8 , 
    width: "100%" , 
    flexDirection : "row" , 
    alignItems : "center" , 
    justifyContent : "center" , 
  },
  card : {
    height : 225,
    width : 160,
    borderRadius : 12 , 
    borderWidth: 1 , 
    borderStyle : "solid" , 
    borderColor : "#6D6D6D" ,
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  activeCard : {
    height : 225,
    width : 160,
    borderRadius : 12 , 
    borderWidth: 1 , 
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
    backgroundColor : "black"  ,
  },
  buttonContainer: {
    width : "100%"  ,
  },
});

