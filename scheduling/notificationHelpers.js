import { supabase } from '../lib/supabase';
import { SENDGRID_API_KEY } from '@env';
import axios from 'axios';

/**
 * Checks our database for any notifications that have not been read
*/
export const checkUnreadNotifications = async (user_id) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user_id)
      .eq('is_read', false);

    if (error) {
      console.error('Error fetching unread notifications:', error);
      return false;
    }

    return data.length > 0;
  } catch (error) {
    console.error('Error checking unread notifications:', error);
    return false;
  }
};

/**
 * Function that creates a new notification for a user
*/
export const createNotification = async (user_id, message, email) => {
  try {
    // Insert notification into the database
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        message,
        is_read: false,
        created_at: new Date(),
      });

    if (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }

    // Send email notification
    await sendEmailNotification(email, message);

    return data;
  } catch (err) {
    console.error('Error in createNotification:', err.message);
    return null;
  }
};

/**
  * Fetches all notifications for a user and sorts them based on the latest notifications
*/
export const fetchNotifications = async (user_id) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false }); // Latest notifications first
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return data;
  };
 

export const markNotificationAsRead = async (notificationId) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('notification_id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return null;
    }
    return data;
  };
  
export const markAllNotificationsAsRead = async (user_id) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user_id)
      .eq('is_read', false);
  
    if (error) {
      console.error('Error marking notifications as read:', error);
    }
    return data;
  };

/**
 * Function that deletes a single notification for a user
*/
export const handleDeleteNotification = async (notificationId, setNotifications) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('notification_id', notificationId);
  
    if (error) {
      console.error('Error deleting notification:', error);
      return;
    }
  
    // Update notifications that is being handled by our frontend
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.notification_id !== notificationId)
    );
  };

/**
 * Function that will delete ALL notifications for a user
*/
export const clearAll = async (setNotifications, user_id) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user_id);
  
    if (error) {
      console.error('Error clearing notifications:', error);
      return;
    }

    setNotifications([]);
  };

/**
 * Function uses sendgrid API template in order to send emails to tutors/students
*/
export const sendEmailNotification = async (email, sessionDetails) => {
  const SENDGRID_URL = 'https://api.sendgrid.com/v3/mail/send';
  const apiKey = SENDGRID_API_KEY
  
  const emailData = {
    personalizations: [
      {
        to: [{ email }],
        subject: 'Your Tutoring Session is Confirmed',
      },
    ],
    from: {
      email: 'lucidity.notifications@gmail.com',
      name: 'Lucidity',
    },
    content: [
      {
        type: 'text/plain',
        value: `Hi, your session is confirmed! Here are the details:\n\n${sessionDetails}`,
      },
    ],
  };

  try {
    await axios.post(SENDGRID_URL, emailData, {
      headers: {
        Authorization: `Bearer ${apiKey}`, 
        'Content-Type': 'application/json',
      },
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    throw new Error('Failed to send email');
  }
};
