import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Button({ type  , text , callback }) {
  return (
    <View style={styles.container}>
      {type === "large" && (

        <Text>Hello world</Text>
      )}
      {type === "small" && (
        <TouchableOpacity style={styles.small}>
          <Text style={styles.text}>{text}</Text>
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
    fontWeight : "bold" , 
    color : "white" , 
    fontSize : 18 , 
  },
})

