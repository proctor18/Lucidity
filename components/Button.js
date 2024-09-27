import { Image , StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const IMAGE_MAP = {
  "google" : require("../assets/icons/google.png") ,
  "linkedin" : require("../assets/icons/linkedin.png") ,
  "rightarrow" : require("../assets/icons/rightarrow.png") ,
}



export default function Button({ type  , text , callback , leading , trailing }) {
  return (
    <View style={styles.container}>
      {type === "small" && (
        <TouchableOpacity style={styles.small}>
          <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
      )}
      {type === "medium" && (
        <TouchableOpacity style={styles.medium}>
          { leading && (
            <Image 
              style={styles.buttonImage} 
              source={IMAGE_MAP[leading]} // No need to use require here
            />
          )}
          <Text style={styles.textMedium}>{text}</Text>
          { trailing && (
            <Image 
              style={styles.buttonImage} 
              source={IMAGE_MAP[trailing]} // No need to use require here
            />
          )}
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
    justifyContent : "center" , 
    borderRadius : 8 , 
  },
  text :{
    fontWeight : "bold", 
    color : "white" , 
    fontSize : 18 , 
  },
  textMedium :{
    fontWeight : "bold", 
    color : "black" , 
    fontSize : 15 , 
  },
  medium : {
    flexDirection : "row",
    paddingVertical : 18 ,
    gap : 12 , 
    width : "100%", 
    color : "black" , 
    alignItems : "space-between" , 
    backgroundColor: "white" , 
    justifyContent : "center" , 
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
  buttonImage : {
    height : 18 , 
    width : 18 , 
  } ,
})

