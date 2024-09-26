import { TextInput , View , Text , StyleSheet } from 'react-native' ; 
import { useState } from 'react' ;


export default function Input(){
  const [text, setText] = useState("") ; 
  return(
    <View>
      <TextInput
        style={styles.Input}
        label="Email"
        value={text}
        onChange={text => setText(text)}
      />
    </View>
  )
};


const styles = StyleSheet.create({
  Input : {
    paddingVertical : 20 ,
    width : "100%", 
    // color : "white" , 
    // backgroundColor: "#232323" , 
    alignItems : "center" , 
    justifyContents : "center" , 
    borderRadius : 8 , 
  },
});
