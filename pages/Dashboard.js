import { View , Text , StyleSheet } from 'react-native' ;


export default function Dashboard({ navigation , route }){

  const {email} = route.params ; 

  return(
    <View style={styles.container}>
      <Text>
        {/* Test if email loads from params  */}
        HEllo { email } 
      </Text>
    </View>
  )
} ;

const styles = StyleSheet.create({
  container:{

  },
})
