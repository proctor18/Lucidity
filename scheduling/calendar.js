import supabase from './supabaseClient';
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


/**
 * Function to add an event to database and then sync with Google Calendar
*/
async function addEventToDatabase(userId, eventDetails, googleAccessToken) {
  try {
    // Add the event to Supabase
    const { data, error } = await supabase

    // **** need to replace below table with actual table name, whatever it would be for storing the schedules ****


      .from('schedules')
      .insert({
        user_id: userId,
        event_name: eventDetails.title,
        event_start: eventDetails.startDateTime,
        event_end: eventDetails.endDateTime,
      });

    if (error) {
      throw error;
    }

    console.log('Event added to Supabase:', data);

    // Sync event to Google Calendar
    await addToGoogleCalendar(googleAccessToken, eventDetails);

    console.log('Event synced to Google Calendar');
  } catch (error) {
    console.error('Error adding event to Supabase or syncing with Google Calendar:', error.message);
  }
}


/**
 * Function to delete an event from database and then sync with Google Calendar
*/
async function deleteEventFromDatabase(userId, eventId, googleAccessToken) {
  try {
    // First, retrieve the event from Supabase to get Google Calendar event details (like event name)
    const { data: event, error: fetchError } = await supabase

    // **** need to replace below table with actual table name, whatever it would be for storing the schedules ****


      .from('schedules')
      .select('event_name')
      .eq('user_id', userId)
      .eq('id', eventId)
      .single();

    if (fetchError || !event) {
      throw new Error('Event not found in Supabase');
    }

    // Delete the event from Supabase
    const { error: deleteError } = await supabase

    // **** need to replace below table with actual table name, whatever it would be for storing the schedules ****


      .from('schedules')
      .delete()
      .eq('user_id', userId)
      .eq('id', eventId);

    if (deleteError) {
      throw deleteError;
    }

    console.log('Event deleted from Supabase');

    // Sync the deletion with Google Calendar by event name
    await deleteEventFromGoogleCalendar(googleAccessToken, event.event_name);

    console.log('Event deleted from Google Calendar');
  } catch (error) {
    console.error('Error deleting event from Supabase or syncing with Google Calendar:', error.message);
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


/*
 * Function to get Google Calendar events
*/
async function fetchGoogleCalendar(accessToken) {
  const calendar = initializeGoogleCalendar(accessToken);

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
 * SYNC FUNCTIONS
**************************************************************/

/**
 * Function that will sync a user's Google Calendar with our database, 
   so we know their events
 * Should be called before checking for schedule conflicts
*/
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


/**
 * Function to synchronize Supabase database with Google Calendar
 * Could be useful to call when a user initially syncs their google calendar
*/
async function syncDatabaseToGoogleCalendar(userId, googleAccessToken) {
  try {
    // Fetch all events from database for the user
    const supabaseEvents = await fetchUserEvents(userId);

    for (const event of supabaseEvents) {
      // Check if the event already exists on Google Calendar to avoid duplication
      const googleEvents = await fetchGoogleCalendar(googleAccessToken);
      const existingGoogleEvent = googleEvents.find(
        (googleEvent) => googleEvent.summary === event.event_name &&
          new Date(googleEvent.start.dateTime || googleEvent.start.date).getTime() === new Date(event.event_start).getTime()
      );

      if (!existingGoogleEvent) {
        // Add event to Google Calendar since it doesn't exist
        await addToGoogleCalendar(googleAccessToken, {
          title: event.event_name,
          startDateTime: event.event_start,
          endDateTime: event.event_end,
          // location: event.location,
          // description: event.description,
        });

        console.log('Event synced to Google Calendar:', event.event_name);
      }
    }
  } catch (error) {
    console.error('Error syncing Supabase events with Google Calendar:', error.message);
  }
}


/**************************************************************
 * CONFLICT CHECKING FUNCTIONS
**************************************************************/

/**
 * Helper: Function that will check if two events overlap
*/
function checkForOverlap(event1, event2) {
  const event1Start = new Date(event1.event_start);
  const event1End = new Date(event1.event_end);
  const event2Start = new Date(event2.event_start);
  const event2End = new Date(event2.event_end);

  // Return true if the events overlap
  return event1Start < event2End && event1End > event2Start;
}


/**
 * Function to check for conflicts between two users schedules from Supabase
 * Requires using the syncGoogleCalendar function first for accurate conflict checking
 * This checks the two users ENTIRE schedule, so good to use to find any initial conflicts
 * (validateBooking function in booking.js can be used to check for specific overlap)
 * Could be useful as an admin tool or if we allow bulk bulking of sessions (i.e. recurring sessions)
*/
async function checkForScheduleConflicts(user1Id, user2Id) {
  // Sync both users' calendars with Database before checking for conflicts
  await syncGoogleCalendar(user1Id, user1AccessToken);
  await syncGoogleCalendar(user2Id, user2AccessToken);

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
  fetchGoogleCalendar,
  fetchUserEvents,
  addEventToDatabase,
  deleteEventFromDatabase,
  checkForScheduleConflicts,
  syncGoogleCalendar,
  syncDatabaseToGoogleCalendar,
  // notifyEvents
};