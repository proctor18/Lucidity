import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import SessionsCarousel from '../components/SessionsCarousel.js';
import ButtonDiv from '../components/ButtonDiv.js';
import { supabase } from '../lib/supabase.js';
import { useSharedValue } from 'react-native-reanimated';

const Header = ({ userName = 'Username', greeting = 'Good Morning!' }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          <View style={styles.onlineIndicator} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.settingsButton}>
        <View style={styles.settingsIcon}>
          <View style={styles.gear} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default function Dashboard({ navigation, route }) {
  const { email, first_name, last_name, role_id, user_id } = route.params;
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const currentIndex = useSharedValue(0);

  useEffect(() => {
    fetchSessions(role_id);
  }, [role_id]);

  async function fetchSessions(role_id) {
    try {
      setLoading(true);
      setError(null);

      const isStudent = true ; 
      
      console.log(`Fetching ${isStudent ? 'Student' : 'Tutor'} sessions for user ${user_id}`);
      
      const { data, error } = await supabase
        .from('sessions')
        .select('session_id , start_time , end_time , tutor_id , subject , session_date ')
        .eq('student_id', user_id);

      if (error) {
        console.error('Error fetching sessions:', error);
        setError(error.message);
        return;
      }

      if (data) {
        console.log('Sessions fetched successfully:', data);
        setSessions(data);
      } else {
        console.log('No sessions found');
        setSessions([]);
      }

    } catch (error) {
      console.error('Exception while fetching sessions:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container} 
      overScrollMode="never" 
      bounces={true}
      endFillColor='#131313' 
      style={styles.scrollView}
    >
      <Header userName={first_name} greeting={getGreeting()} />
      
      <View style={styles.textContainer}>
        <Text style={styles.sessionText}>
          Sessions 
        </Text>
        {error && (
          <Text style={styles.errorText}>Error: {error}</Text>
        )}
      </View>

      <View style={styles.CarouselContainer}>
        <SessionsCarousel 
          sessions={sessions}
          loading={loading}
          currentIndex={currentIndex}
          // setCurrentIndex={setCurrentIndex}
        /> 
      </View>

      <View style={styles.rowTwo}>
        <View style={styles.textContainer}>
          <Text style={styles.sessionText}>
            Details
          </Text>
        </View>
        <View style={styles.buttonDiv}>
          <ButtonDiv 
            date='Wednesday'
            buttonText={loading ? 'Loading...' : sessions[currentIndex.value]?.session_date || 'No sessions'} // 
            countDown="2 weeks" 
            
          />
          <View style={styles.horizontalContainer}>
            <ButtonDiv 
              type='wide'
              loading={loading}
              data={sessions[0]}
            />
            <ButtonDiv 
              type='wide'
              loading={loading}
              data={sessions[0]}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#131313',
  },
  scrollView: {
    backgroundColor: '#131313',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emailText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#131313',
    paddingTop: 50,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C6AE',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#131313',
  },
  textContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gear: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  CarouselContainer: { 
    paddingVertical: 16,
  },
  sessionText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    paddingBottom: 4,
  },
  badge: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDiv: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  rowTwo: {
    flex: 1,
  }
});