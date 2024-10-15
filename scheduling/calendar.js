import supabase from './supabaseClient';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { google } from 'googleapis';

// Configure Google Sign-In
GoogleSignin.configure({
  // Scope = type of access we have to a users Calendar
  // Need full read, write pwermission since we are adding, deleting, reading events
  scopes: ['https://www.googleapis.com/auth/calendar'],
  // The Google Calendar WebClientId for our project
  webClientId: '396349567792-gfg556v4e4jb22qa29nhsf3kltp6tan0.apps.googleusercontent.com',
});


/**************************************************************
 * Function to get Google Calendar events
**************************************************************/
async function fetchGoogleCalendar(accessToken) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    return events.data.items;
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    throw new Error('Error fetching calendar events');
  }
}


/**************************************************************
 * Function to fetch user events from Supabase
**************************************************************/
async function fetchUserEvents(userId) {
  try {
    const { data, error } = await supabase

    // **** need to replace below table with actual table name, whatever it would be for storing the schedules ****

      .from('schedules')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching events:', error.message);
      return [];
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return [];
  }
}


/**************************************************************
 * Function that allows for an event to be added to Google Calendars
**************************************************************/
async function addToGoogleCalendar(accessToken, eventDetails) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const event = await calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary: eventDetails.title,
        location: eventDetails.location,
        description: eventDetails.description,
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


/**************************************************************
 * Function that allows for an event to be deleted from Google Calendars
**************************************************************/
async function deleteEventFromGoogleCalendar(accessToken, eventId) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

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
 * Function that will sync a user's Google Calendar with our database, 
   so we know their events
**************************************************************/
async function syncGoogleCalendar(userId, googleAccessToken) {
  const googleEvents = await fetchGoogleCalendarEvents(googleAccessToken);

  for (const event of googleEvents) {
    const { summary, start, end } = event;

    // Check if event exists in Supabase to avoid duplicating
    const { data: existingEvent } = await supabase
    // **** need to replace below table with actual table name, whatever it would be for storing the schedules ****
      .from('schedules')
      .select('*')
      .eq('user_id', userId)
      .eq('event_name', summary)
      .eq('event_start', start.dateTime || start.date)
      .single();

    if (!existingEvent) {
      // If event does not exist, insert it into our database
      await supabase.from('schedules').insert({
        user_id: userId,
        event_name: summary,
        event_start: start.dateTime || start.date,
        event_end: end.dateTime || end.date,
      });

      console.log('Event synced to Supabase:', summary);
    }
  }
}


/**************************************************************
 * Function that will check if two events overlap
**************************************************************/
function checkForOverlap(event1, event2) {
  const event1Start = new Date(event1.event_start);
  const event1End = new Date(event1.event_end);
  const event2Start = new Date(event2.event_start);
  const event2End = new Date(event2.event_end);

  // Return true if the events overlap
  return event1Start < event2End && event1End > event2Start;
}


/**************************************************************
 * Function to check for conflicts between two users schedules from Supabase
 * Requires using the syncGoogleCalendar function first for accurate conflict checking
**************************************************************/
async function checkForScheduleConflicts(user1Id, user2Id) {
  // Fetch events for both users
  const user1Events = await fetchUserEvents(user1Id);
  const user2Events = await fetchUserEvents(user2Id);

  const conflicts = [];

  // Compare each event from user1 with each event from user2
  for (let event1 of user1Events) {
    for (let event2 of user2Events) {
      if (checkForOverlap(event1, event2)) {
        conflicts.push({ event1, event2 });
      }
    }
  }

  return conflicts;
}


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

export {
  fetchGoogleCalendar,
  fetchUserEvents,
  addToGoogleCalendar,
  deleteEventFromGoogleCalendar,
  checkForOverlap,
  checkForScheduleConflicts,
  syncGoogleCalendar,
  // notifyEvents
};