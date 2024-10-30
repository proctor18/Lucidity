import React from "react";
import {  StyleSheet , Text , View , TouchableOpacity } from "react-native";

export default function ButtonDiv( { buttonText= "Example" , date = "12:45PM" , countDown = "10 minutes" , type = "long"}){
  return(
    <TouchableOpacity 
      style={styles.container}
      onPress={() => {/* Add your onPress handler here */}}
    >
      <View>
        <Text style={styles.buttonText}>
          {buttonText}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.time}>
            {date}
          </Text>
          <View style={styles.chip}>
            <Text style={styles.time}>
              {countDown}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.icon}>

      </View>
    </TouchableOpacity>
  )
};


const styles = StyleSheet.create({
  container: {
    flex : 1 , 
    flexDirection : 'row' , 
    justifyContent : 'space-between' , 
    alignItems : 'center' , 
    backgroundColor: '#1B1C1E',
    marginHorizontal: 16,
    paddingVertical : 24 , 
    padding: 16,
    borderRadius: 12,
    borderStyle : 'solid' , 
    borderWidth : 1 , 
    borderColor : '#313234' , 
    maxHeight : 90 , 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18 ,
    fontWeight: '600',
    paddingBottom : 4 , 
  },
  badge : {
    flex : 1 , 
    flexDirection : 'row' , 
    gap : 4 , 
    justifyContent : 'center' , 
    alignItems : 'center' , 
  }, 
  time : {
    color : 'white' , 
    opacity : 0.7 ,
    fontSize : 14 , 
  },
  chip : {
    paddingVertical : 2 , 
    paddingHorizontal : 4 , 
    borderRadius : 4 , 
    backgroundColor : '#2E2E30' ,
    fontSize : 14 , 
  },
  icon : {
    width : 48 , 
    height : 48 , 
    backgroundColor : '#2E2E30' ,
    borderRadius : 24,
  },
});
