import { supabase } from '../lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { google } from 'googleapis';

// Configure Google Sign-In
GoogleSignin.configure({
  // Scope = type of access we have to a users Calendar
  // Need full read, write permission since we are adding, deleting, reading events
  scopes: ['https://www.googleapis.com/auth/calendar'],
  // The Google Calendar WebClientId for our project
  webClientId: '396349567792-gfg556v4e4jb22qa29nhsf3kltp6tan0.apps.googleusercontent.com',
});


/**************************************************************
 * DATABASE FUNCTIONS
**************************************************************/

/**
 * Function to fetch user events from database
*/
async function fetchUserSessions(userId) {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .or(`student_id.eq.${userId},tutor_id.eq.${userId}`)
      .order('session_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching sessions:', err);
    return [];
  }
}


/**
 * Function to delete an event from database and then sync with Google Calendar
*/
async function deleteSession(userId, sessionId, googleAccessToken) {
  try {
    const { data: session, error: fetchError } = await supabase
      .from('sessions')
      .select('start_time, end_time')
      .eq('student_id', userId)
      .or(`tutor_id.eq.${userId}`)
      .eq('session_id', sessionId)
      .single();

    if (fetchError || !session) {
      throw new Error('Session not found in Supabase');
    }

    const { error: deleteError } = await supabase
      .from('sessions')
      .delete()
      .eq('session_id', sessionId);

    if (deleteError) {
      throw deleteError;
    }

    console.log('Session deleted from Supabase');

    // Optionally delete from Google Calendar
    await deleteEventFromGoogleCalendar(googleAccessToken, sessionId);

    console.log('Session deleted from Google Calendar');
  } catch (error) {
    console.error('Error deleting session or syncing with Google Calendar:', error.message);
  }
}


/**************************************************************
 * GOOGLE CALENDAR FUNCTIONS
**************************************************************/

/**
 * Helper: Initializes and returns a Google Calendar client with the given access token.
 */
function initializeGoogleCalendar(accessToken) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}


/**
 * Function that allows for event to be added to Google Calendars
*/
async function addToGoogleCalendar(accessToken, eventDetails) {
  const calendar = initializeGoogleCalendar(accessToken);

  try {
    const event = await calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary: eventDetails.title,
        // events have the format of '2024-01(month)-01(day) 01:00:00(hour:minute:second)'
        start: {
          dateTime: eventDetails.startDateTime,
        },
        end: {
          dateTime: eventDetails.endDateTime, 
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      },
    });

    console.log('Event created:', event.data.htmlLink);

    // Returns a link to the event in Google Calendar, if we want to do this
    return event.data.htmlLink; 
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    throw new Error('Error adding event to Google Calendar');
  }
}


/**
 * Function that allows for event to be deleted from Google Calendars
*/
async function deleteEventFromGoogleCalendar(accessToken, eventId) {
  const calendar = initializeGoogleCalendar(accessToken);

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    console.log('Event deleted from Google Calendar');
  } catch (error) {
    console.error('Error deleting event from Google Calendar:', error);
    throw new Error('Error deleting event from Google Calendar');
  }
}


/**************************************************************
 * BOOKING FUNCTIONS
**************************************************************/

/**
 * Helper: Function that will check if two events overlap
*/
function checkForOverlap(session1, session2) {
  const session1Start = new Date(`${session1.session_date}T${session1.start_time}`);
  const session1End = new Date(`${session1.session_date}T${session1.end_time}`);
  const session2Start = new Date(`${session2.session_date}T${session2.start_time}`);
  const session2End = new Date(`${session2.session_date}T${session2.end_time}`);

  return session1Start < session2End && session1End > session2Start;
}

/**
 * Helper: Takes a list of sessions and checks if any overlap with the requested time slot
*/
function hasSchedulingConflicts(existingSessions, requestedSession) {
  for (let session of existingSessions) {
    if (checkForOverlap(requestedSession, session)) {
      return true;
    }
  }
  return false;
}


/**
 * Helper: Function to check if the requested time falls within any of the tutor's availability times for requested day
*/
async function tutorAvailability(tutorId, dayOfWeek, timeSlot) {
  // Fetch all available records for the tutor for requested day
  const { data: availability, error } = await supabase
    .from('availability')
    .select('*')
    .eq('tutor_id', tutorId)
    .eq('day_of_week', dayOfWeek); // maybe should change this to the exact date as day_of_week could cause issues

  if (error || !availability) {
    console.error('Tutor availability not found:', error);
    return false;
  }

  // Convert time into comparable format (arbitrary date of 2024-01-01 is chosen)
  const requestedStartTime = new Date(`2024-01-01T${timeSlot.startDateTime.split('T')[1]}`);
  const requestedEndTime = new Date(`2024-01-01T${timeSlot.endDateTime.split('T')[1]}`);

  // Check if requested time fits within any of the tutors available slots
  for (let slot of availability) {
    const startTime = new Date(`2024-01-01T${slot.start_time}`);
    const endTime = new Date(`2024-01-01T${slot.end_time}`);

    if (requestedStartTime >= startTime && requestedEndTime <= endTime) {
      return true;
    }
  }

  // If no availability slot matches, return false
  return false;
}

/***************************** START EXAMPLE ******************************************/

// EXAMPLE USAGE OF BELOW FUNCTIONS:
// How using the below functions in our frontend could be used to book a session (example code)
// Example time slot
const timeSlot = {
  sessionDate: '2024-10-15',   // Desired date of the session
  startTime: '10:00:00',       // Start time of the session
  endTime: '11:00:00'          // End time of the session
};
async function handleBooking(studentId, tutorId, timeSlot, studentAccessToken, tutorAccessToken) {
    // Validate availability
    const validation = await validateBooking(
      studentId,
      tutorId,
      timeSlot.sessionDate,
      timeSlot.startTime,
      timeSlot.endTime
    );
  
    if (!validation.available) {
      console.log('Booking failed due to conflict:', validation.conflict);
      return;
    }
  
    // If available, proceed to book the session
    const bookedSession = await bookSession(
      studentId,
      tutorId,
      timeSlot.sessionDate,
      timeSlot.startTime,
      timeSlot.endTime,
      tutorAccessToken
    );
  
    if (bookedSession) {
      console.log('Session successfully booked:', bookedSession);
    } else {
      console.log('Booking failed.');
    }
  }

  // Example usage with mock IDs and access tokens
const studentId = 'student123';
const tutorId = 'tutor456';
const studentAccessToken = 'student-google-access-token';
const tutorAccessToken = 'tutor-google-access-token';

handleBooking(studentId, tutorId, timeSlot, studentAccessToken, tutorAccessToken);

/***************************** END EXAMPLE ******************************************/

/**
 * Function that will check if the specified time slot for a student and a tutor 
 * This checks only the SPECIFIED time slot for conflict, rather than the entirety of the users' schedules
*/
async function validateBooking(studentId, tutorId, sessionDate, startTime, endTime) {
  // Check tutor availability
  const dayOfWeek = new Date(sessionDate).toLocaleString('en-US', { weekday: 'long' });
  const timeSlot = {
    startDateTime: `${sessionDate}T${startTime}`,
    endDateTime: `${sessionDate}T${endTime}`
  };

  const available = await tutorAvailability(tutorId, dayOfWeek, timeSlot);
  if (!available) {
    return { available: false, conflict: 'Tutor is not available during the requested time' };
  }

  const requestedSession = { session_date: sessionDate, start_time: startTime, end_time: endTime };

  // Check for conflicts with the students existing sessions
  const studentSessions = await fetchUserSessions(studentId);
  const studentSessionsOnDate = studentSessions.filter(session => session.session_date === sessionDate);
  if (hasSchedulingConflicts(studentSessionsOnDate, requestedSession)) {
    return { available: false, conflict: 'Student has a scheduling conflict' };
  }

  // Check for conflicts with the tutors existing sessions
  const tutorSessions = await fetchUserSessions(tutorId);
  const tutorSessionsOnDate = tutorSessions.filter(session => session.session_date === sessionDate);
  if (hasSchedulingConflicts(tutorSessionsOnDate, requestedSession)) {
    return { available: false, conflict: 'Tutor has a scheduling conflict' };
  }

  // If no conflicts and tutor is available, return available status
  return { available: true };
}


/**
 * Function that allows for a session to be booked AFTER a timeslot has been validated
*/  
async function bookSession(studentId, tutorId, sessionDate, startTime, endTime) {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        student_id: studentId,
        tutor_id: tutorId,
        session_date: sessionDate,
        start_time: startTime,
        end_time: endTime,
      });

    if (error) throw error;
    console.log('Session booked successfully:', data);

    await addToGoogleCalendar(googleAccessToken, {
      title: `Tutoring Session with ${studentId === userId ? 'Tutor' : 'Student'} ${studentId === userId ? tutorId : studentId}`,
      startDateTime: `${sessionDate}T${startTime}`,
      endDateTime: `${sessionDate}T${endTime}`,
      location: 'Online',
      description: 'Tutoring session scheduled through the app',
    });

    console.log('Session synced to Google Calendar');

    return data;
  } catch (error) {
    console.error('Error booking session:', error.message);
  }
}


/**************************************************************
 * NOTIFICATION FUNCTIONS
**************************************************************/

// /**************************************************************
//  * Possible Function that could send out a message to a user, need to integrate it with
//    notification service / function of some sort (like React Native Push Notifications)
//  * Currently only displays message to terminal for testing
// **************************************************************/
// function notifyEvents(events) {
//   const now = new Date();

//   events.forEach(event => {
//     const eventStart = new Date(event.start || event.start.dateTime);
//     // Time to event in minutes
//     const timeToEvent = (eventStart - now) / (1000 * 60); 

//     // Ex. Notify if the event is within 60 minutes (can change these numbers)
//     if (timeToEvent <= 60 && timeToEvent > 0) { 
//       console.log(`Reminder: You have an upcoming event "${event.title}" at ${eventStart}`);
//     }
//   });
// }


/**************************************************************
 * EXPORTS
**************************************************************/
export {
  checkForOverlap,
  fetchUserSessions,
  deleteSession,
  validateBooking,
  bookSession,
  tutorAvailability,
  hasSchedulingConflicts,
  // notifyEvents
};