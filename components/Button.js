import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Button({ type  , text , callback }) {
  return (
    <View style={styles.container}>
      {type === "small" && (
        <TouchableOpacity style={styles.small}>
          <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
      )}
      {type === "medium" && (
        <TouchableOpacity style={styles.medium}>
          <Text style={styles.textMedium}>{text}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  small : {
    paddingVertical : 20 ,
    width : "100%", 
    color : "white" , 
    alignItems : "center" , 
    backgroundColor: "#232323" , 
    justifyContents : "center" , 
    borderRadius : 8 , 
  },
  text :{
    fontWeight : 600 , 
    color : "white" , 
    fontSize : 18 , 
  },
  textMedium :{
    fontWeight : 600 , 
    color : "black" , 
    fontSize : 15 , 
  },
  medium : {
    paddingVertical : 18 ,
    width : "100%", 
    color : "black" , 
    alignItems : "center" , 
    backgroundColor: "white" , 
    justifyContents : "center" , 
    borderRadius : 8 , 
    borderStyle : "solid" , 
    borderWidth : 1 ,
    borderColor : "#E5E7EB" ,
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
    fontWeight : "light" , 
  },
})

