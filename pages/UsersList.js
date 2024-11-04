import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = 'https://tqtqpftsctrshouqpcej.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHFwZnRzY3Ryc2hvdXFwY2VqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODg5MTU0MywiZXhwIjoyMDQ0NDY3NTQzfQ.2h9rCohCCLwl1AGT8Kg8CXjp7fw87jYSV3zz6qRtKxs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UsersList() {
  const [firstNames, setFirstNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    async function fetchFirstNames() {
      try {
        // Fetch first names from the users table
        const { data, error } = await supabase
          .from('users')
          .select('role_id')

        if (error) {
          console.error("Error fetching data:", error);
          setError(error.message);
          return; 
        }

        // Log the received data
        console.log("Fetched data:", data);

        if (data && data.length > 0) {
          setFirstNames(data);
        } else {
          console.log("No data found in response");
          setFirstNames([]); // No users found
        }
      } catch (error) {
        console.error("Error caught in catch block:", error);
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Hide loading state
      }
    }

    fetchFirstNames();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? ( // Check if there's an error
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : firstNames.length > 0 ? (
        <FlatList
          data={firstNames}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.nameText}>{item.first_name}</Text>
          )}
        />
      ) : (
        <Text style={styles.noUsersText}>No users found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
  },
  errorText: {
    color: "red", // Highlight error text
    fontSize: 18,
    marginBottom: 10, // Add some space below the error message
  },
  noUsersText: {
    color: "white",
    fontSize: 18,
  },
  nameText: {
    color: "white",
    fontSize: 16,
  },
});
