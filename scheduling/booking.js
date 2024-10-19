import {syncGoogleCalendar, checkForOverlap, addEventToDatabase} from 'calendar.js'

// EXAMPLE USAGE OF BELOW FUNCTIONS:
// How using the below functions in our frontend could be used to book a session (example code, should flesh it out if used)
async function handleBooking(studentId, tutorId, timeSlot, studentAccessToken, tutorAccessToken) {
    // Validate availability
    const validation = await validateBooking(studentId, tutorId, timeSlot, studentAccessToken, tutorAccessToken);
    
    if (!validation.available) {
      console.log('Booking failed due to conflict:', validation.conflict);
      return;
    }
  
    // Book the session
    await bookSession(studentId, tutorId, timeSlot, studentAccessToken);
  
    console.log('Session successfully booked');
  }

/**
 * Function to check if the requested time falls within any of the tutor's availability slots for requested day
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
  
    // Check if the requested time fits within any of the tutors available slots
    for (let slot of availability) {
      const startTime = new Date(`1970-01-01T${slot.start_time}`);
      const endTime = new Date(`1970-01-01T${slot.end_time}`);
  
      if (requestedStartTime >= startTime && requestedEndTime <= endTime) {
        return true;
      }
    }
  
    // If no availability slot matches, return false
    return false;
  }


/**
 * Function that will check if the specified time slot for a student and a tutor 
 * This checks only the SPECIFIED time slot for conflict, rather than the entirety of the users' schedules
 * (can use the checkForScheduleConflicts function in calendar.js to check for conflicts in entire calendar)
*/
async function validateBooking(studentId, tutorId, timeSlot, studentAccessToken, tutorAccessToken) {
    // Get day of the week (should prob change this to date instead of day_of_week in database)
    const dayOfWeek = new Date(timeSlot.startDateTime).toLocaleString('en-US', { weekday: 'long' });

    // Check if the tutor is available during requested time
    const available = await tutorAvailability(tutorId, dayOfWeek, timeSlot);
    if (!available) {
        return { available: false, conflict: 'Tutor is not available during the requested time' };
     }

    // Need to sync both users calendars before checking for conflicts
    await syncGoogleCalendar(studentId, studentAccessToken);
    await syncGoogleCalendar(tutorId, tutorAccessToken);
  
    // Create temporary events for conflict checking
    const tempEvent = {
      event_start: timeSlot.startDateTime,
      event_end: timeSlot.endDateTime,
    };
  
    // Fetch the tutor and student's schedules
    const studentEvents = await fetchUserEvents(studentId);
    const tutorEvents = await fetchUserEvents(tutorId);
  
    // Check if the session conflicts with any existing events
    for (let studentEvent of studentEvents) {
      if (checkForOverlap(studentEvent, tempEvent)) {
        return { available: false, conflict: 'Student has a conflict' };
      }
    }
    
    for (let tutorEvent of tutorEvents) {
      if (checkForOverlap(tutorEvent, tempEvent)) {
        return { available: false, conflict: 'Tutor has a conflict' };
      }
    }
  
    // If no conflicts found, return true
    return { available: true };
  }


/**
 * Function that allows for a session to be booked AFTER a timeslot has been validated
*/  
async function bookSession(studentId, tutorId, timeSlot, googleAccessToken) {
  try {
    // Add the session to the database for both student and tutor
    const sessionDetails = {
      title: 'Tutoring Session',
      description: `Tutoring session between student ${studentId} and tutor ${tutorId}`,
      startDateTime: timeSlot.startDateTime,
      endDateTime: timeSlot.endDateTime,
      location: 'Online',  // Replace with actual location or platform info
    };

    // Add to student's schedule
    await addEventToDatabase(studentId, sessionDetails, googleAccessToken);

    // Add to tutor's schedule
    await addEventToDatabase(tutorId, sessionDetails, googleAccessToken);

    console.log('Tutoring session successfully booked and saved to database');
  } catch (error) {
    console.error('Error booking tutoring session:', error);
  }
}

export {
    bookSession,
    validateBooking
}