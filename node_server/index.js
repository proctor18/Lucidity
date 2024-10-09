const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Function that could fetch user events from backend (for comparing with other users, etc.)
async function fetchEvents(accessToken) {
const oauth2Client = new google.auth.OAuth2();
oauth2Client.setCredentials({ access_token: accessToken });

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

try {
    const events = await calendar.events.list({
    calendarId: 'primary',
    // Fetch newest events from time this function is ran 
    timeMin: new Date().toISOString(),
    // Fetch up to 100 events
    maxResults: 100, 
    singleEvents: true,
    orderBy: 'startTime',
    });

    return events.data.items;

} catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Error fetching calendar events');
    }
}


// Function that will check if two events overlap
function checkForOverlap(event1, event2) {
const event1Start = new Date(event1.start.dateTime || event1.start.date);
const event1End = new Date(event1.end.dateTime || event1.end.date);

const event2Start = new Date(event2.start.dateTime || event2.start.date);
const event2End = new Date(event2.end.dateTime || event2.end.date);

// Return true if the events overlap
return event1Start < event2End && event1End > event2Start;
}


// Function that will check user schedules for conflicts
async function checkForScheduleConflicts(user1AccessToken, user2AccessToken) {
// Fetch events for both users
const user1Events = await fetchEvents(user1AccessToken);
const user2Events = await fetchEvents(user2AccessToken);

const conflicts = [];

// Compare each event from user1 with each event from user2
for (let event1 of user1Events) {
for (let event2 of user2Events) {
    if (checkForOverlap(event1, event2)) {
    // If there's a conflict, add the conflicting events to the list
    conflicts.push({ event1, event2 });
    }
    }
    }

    return conflicts;
}


// Handles our POST requests for schedule conflicts
app.post('/api/check-schedule-conflicts', async (req, res) => {
    const { user1AccessToken, user2AccessToken } = req.body;
  
    try {
      const conflicts = await checkForScheduleConflicts(user1AccessToken, user2AccessToken);
  
      if (conflicts.length > 0) {
        res.status(200).json({
          message: 'Conflicts found',
          conflicts,
        });
      } else {
        res.status(200).json({
          message: 'No conflicts found',
        });
      }
    } catch (error) {
      console.error('Error checking for conflicts:', error);
      res.status(500).send('Error checking for conflicts');
    }
  }
);