import React, { useState , useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase.js" ; 
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Data of all available subjects
// ----------------------------------------
const data = [
  "Math",
  "English",
  "Biology",
  "Chemistry",
  "Anthropology",
  "Badges",
];
// ----------------------------------------

const Search = () => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const navigation = useNavigation();
  const [ loading , setLoading ] = useState(false) ; 

  const handleSearch = (text) => {
    setQuery(text);
    if (text) {
      const filtered = data.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
      console.log(filteredData)
    } else {
      setFilteredData(data);
    }
  };

  // useEffect( () => {
  //   getValues() ; 
  // } , []) ; 
  //
  // async function getValues(){
  //   setLoading(true) ; 
  //   try {
  //     const { data , error } = await supabase
  //       .from("tutors")
  //       .select("*")
  //
  //     console.log(data) ; 
  //   } catch (error) {
  //     console.log("Error Occurred while fetching : " , error) ; 
  //   }
  //   finally{
  //     setLoading(false) ; 
  //   }
  // }
  //
  const handlePress = (subject) => {
    navigation.navigate("SearchResults", { subject });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <Text style={styles.itemText}>{item}</Text>
      <Ionicons name="chevron-forward" size={18} color="white" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#8E8E8F" />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#8E8E8F"
          value={query}
          onChangeText={handleSearch}
        />
      </View>
      <Text style={styles.resultsTitle}>Search results</Text>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item}
        renderItem={renderItem}
      />
    </View>
  );
};

{
  /* <Ionicons name="chevron-back" size={18} color="#7257FF" /> */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 16,
    paddingTop: 70,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 25,
    padding: 15,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  resultsTitle: {
    color: "#8E8E8F",
    fontSize: 16,
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  itemText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default Search;
