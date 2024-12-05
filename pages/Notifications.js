import React, { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, handleDeleteNotification, clearAll } from '../scheduling/notificationHelpers.js';
import { supabase } from '../lib/supabase';
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from '../components/UserContext.js';


const NotificationsList = () => {
  const route = useRoute();
  const { user_id } = route.params;
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(UserContext);

  const { email } = user;

  // Function to load notifications
  const loadNotifications = async () => {
    const initialNotifications = await fetchNotifications(user_id);
    setNotifications(initialNotifications);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();

      // Real time notifications
      const notificationsChannel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT',
            schema: 'public',
            table: 'notifications' 
        },
          (payload) => {
            if (payload.new.user_id === user_id) {
              setNotifications((prev) => [payload.new, ...prev]);
            }
          }
        )
        .subscribe();

      return async () => {
        // Mark notifications as read when leaving the screen
        markAllNotificationsAsRead(user_id);
        supabase.removeChannel(notificationsChannel);
      };
    }, [user_id])
  );

  const handleMarkAsRead = async (notificationId) => {
    await markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, item.is_read ? styles.read : styles.unread]}
      onPress={() => handleMarkAsRead(item.notification_id)}
    >
      <View style={styles.bulletDot} />
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.dateText}>
          {new Date(item.created_at).toLocaleString([], {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </Text>
      </View>

      {/* Single Delete Button (Trashcan) */}
      <TouchableOpacity onPress={() => handleDeleteNotification(item.notification_id, setNotifications)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color="rgba(128, 128, 128, 0.6)" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.headerContainer}>
        <Ionicons name="notifications-outline" size={24} color="#7257FF" style={styles.bellIcon} />
        <Text style={styles.header}>Notifications</Text>

      {/* Clear All buttton */}   
      {notifications.length > 0 && (
          <TouchableOpacity onPress={() => clearAll(setNotifications, user_id)} style={styles.clearAllButton}>
            <Text style={styles.clearAllButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* No Notifications message */}   
      {notifications.length === 0 ? (
      <View style={styles.emptyMessageContainer}>
        <Text style={styles.emptyMessageText}>No notifications at this time.</Text>
      </View>
    ) : (

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notification_id.toString()}
        renderItem={renderItem}
      />
    )}
    </SafeAreaView>
  );
};

const styles = {
  safeContainer: { 
    padding: 16, 
    backgroundColor: '#1A1A1A', 
    flex: 1 
},
headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 25
  },
bellIcon: {
    marginRight: 5,
  },
  header: { 
    color: "#FFFFFF",
    fontSize: 24, 
    fontWeight: 'bold', 
    padding: 16,
    flex: 1,

},
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7257FF',
    marginRight: 8,
    marginTop: 7,
    alignSelf: 'flex-start',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  messageContainer: {
    flex: 1,
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessageText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  clearAllButton: {
    padding: 10,
  },
  clearAllButtonText: {
    color: "rgba(255, 77, 77, 0.7)",
    fontWeight: '600',
    fontSize: 16,
  },
  unread: { 
    backgroundColor: '#4A4A4A' 
},
  read: { 
    backgroundColor: '#2A2A2A' 
},
  messageText: { 
    fontSize: 16,
    color: "#FFFFFF"
},
  dateText: { 
    fontSize: 12, 
    color: '#888' 
},
  
};

export default NotificationsList;