import { supabase } from '../lib/supabase';

/**
 * Assigns at least one session per week to each available tutor.
 * Ensures engagement and learning continuity.
 */

export const ensureMinimumWeeklySessions = async () => {
    try {
        console.log("Ensuring minimum weekly sessions...");

        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date();
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // Fetch all qualified tutors
        const { data: tutors, error: tutorsError } = await supabase
            .from('tutors')
            .select('tutor_id, is_qualified, topics')
            .eq('is_qualified', true);

        if (tutorsError) throw new Error(`Error fetching tutors: ${tutorsError.message}`);

        // Fetch all students
        const { data: students, error: studentsError } = await supabase
            .from('students')
            .select('student_id, topics');

        if (studentsError) throw new Error(`Error fetching students: ${studentsError.message}`);

        // Fetch all sessions for the current week
        const { data: weeklySessions, error: sessionsError } = await supabase
            .from('sessions')
            .select('tutor_id, student_id, session_date, start_time, end_time')
            .gte('session_date', startOfWeek.toISOString())
            .lte('session_date', endOfWeek.toISOString());

        if (sessionsError) throw new Error(`Error fetching weekly sessions: ${sessionsError.message}`);

        // Map to track assigned sessions and prevent conflicts
        const assignedSessions = new Map();
        weeklySessions.forEach(session => {
            const key = `${session.student_id}-${session.session_date}-${session.start_time}`;
            assignedSessions.set(key, true);
        });

        // Track students who are already assigned this week
        const assignedStudents = new Set(weeklySessions.map(session => session.student_id));

        for (const tutor of tutors) {
            const { tutor_id, topics: tutorTopics } = tutor;

            // Skip tutors who already have a session this week
            if (weeklySessions.some(session => session.tutor_id === tutor_id)) {
                console.log(`Tutor ${tutor_id} already has sessions this week.`);
                continue;
            }

            let sessionAssigned = false;

            // Iterate through all students to find a match
            for (const student of students) {
                const { student_id, topics: studentTopics } = student;

                // Check if topics overlap
                const sharedTopics = studentTopics.filter(topic => tutorTopics.includes(topic));
                if (sharedTopics.length === 0) {
                    console.log(`No shared topics between Tutor ${tutor_id} and Student ${student_id}.`);
                    continue;
                }

                // Find an available slot for the student
                const availableSlot = findAvailableSlot(assignedSessions, weeklySessions, student_id, startOfWeek, endOfWeek);
                if (!availableSlot) {
                    console.log(`No available slots for Student ${student_id}.`);
                    continue;
                }

                // Prevent duplicate sessions (exact date and time conflict)
                const sessionKey = `${student_id}-${availableSlot.date}-${availableSlot.startTime}`;
                if (assignedSessions.has(sessionKey)) {
                    console.log(`Conflict: Student ${student_id} already has a session on ${availableSlot.date} at ${availableSlot.startTime}.`);
                    continue;
                }

                // Assign session
                const newSession = {
                    tutor_id,
                    student_id,
                    subject: sharedTopics[0],
                    session_date: availableSlot.date,
                    start_time: availableSlot.startTime,
                    end_time: availableSlot.endTime,
                    session_notes: 'Scheduled session.',
                };

                const { error: insertError } = await supabase
                    .from('sessions')
                    .insert([newSession]);

                if (insertError) {
                    console.error(`Error assigning session for Tutor ${tutor_id}: ${insertError.message}`);
                    continue;
                }

                console.log(`Assigned Student ${student_id} to Tutor ${tutor_id} on ${availableSlot.date} at ${availableSlot.startTime}.`);

                // Update maps and sets
                assignedSessions.set(sessionKey, true);
                assignedStudents.add(student_id);
                sessionAssigned = true;
                break;
            }

            // If no match is found, allow matching with students who already have sessions
            if (!sessionAssigned) {
                console.warn(`No unmatched students for Tutor ${tutor_id}. Searching for students with existing sessions.`);

                for (const student of students) {
                    const { student_id, topics: studentTopics } = student;

                    // Check if topics overlap
                    const sharedTopics = studentTopics.filter(topic => tutorTopics.includes(topic));
                    if (sharedTopics.length === 0) {
                        console.log(`No shared topics between Tutor ${tutor_id} and Student ${student_id}.`);
                        continue;
                    }

                    // Find an available slot for the student
                    const availableSlot = findAvailableSlot(assignedSessions, weeklySessions, student_id, startOfWeek, endOfWeek);
                    if (!availableSlot) {
                        console.log(`No available slots for Student ${student_id}.`);
                        continue;
                    }

                    // Prevent duplicate sessions (exact date and time conflict)
                    const sessionKey = `${student_id}-${availableSlot.date}-${availableSlot.startTime}`;
                    if (assignedSessions.has(sessionKey)) {
                        console.log(`Conflict: Student ${student_id} already has a session on ${availableSlot.date} at ${availableSlot.startTime}.`);
                        continue;
                    }

                    // Assign session
                    const newSession = {
                        tutor_id,
                        student_id,
                        subject: sharedTopics[0],
                        session_date: availableSlot.date,
                        start_time: availableSlot.startTime,
                        end_time: availableSlot.endTime,
                        session_notes: 'Scheduled session with shared student.',
                    };

                    const { error: insertError } = await supabase
                        .from('sessions')
                        .insert([newSession]);

                    if (insertError) {
                        console.error(`Error assigning session for Tutor ${tutor_id}: ${insertError.message}`);
                        continue;
                    }

                    console.log(`Assigned Student ${student_id} to Tutor ${tutor_id} on ${availableSlot.date} at ${availableSlot.startTime}.`);

                    // Update maps and sets
                    assignedSessions.set(sessionKey, true);
                    sessionAssigned = true;
                    break;
                }
            }

            if (!sessionAssigned) {
                console.warn(`No suitable students for Tutor ${tutor_id}. Assigning placeholder session.`);

                const availableSlot = findAvailableSlotForTutor(assignedSessions, startOfWeek, endOfWeek);
                if (availableSlot) {
                    const placeholderSession = {
                        tutor_id,
                        student_id: null,
                        subject: 'General Training',
                        session_date: availableSlot.date,
                        start_time: availableSlot.startTime,
                        end_time: availableSlot.endTime,
                        session_notes: 'Placeholder session.',
                    };

                    const { error: insertError } = await supabase
                        .from('sessions')
                        .insert([placeholderSession]);

                    if (insertError) {
                        console.error(`Error assigning placeholder session for Tutor ${tutor_id}: ${insertError.message}`);
                    } else {
                        console.log(`Assigned placeholder session for Tutor ${tutor_id}.`);
                    }
                }
            }
        }

        console.log("Weekly session assignment completed.");
    } catch (error) {
        console.error("Error in ensureMinimumWeeklySessions:", error.message);
    }
};

/**
 * Finds an available time slot for a student, avoiding conflicts on both date and time.
 */
const findAvailableSlot = (assignedSessions, weeklySessions, studentId, startOfWeek, endOfWeek) => {
    const slotsPerDay = [
        { startTime: '09:00:00', endTime: '09:30:00' },
        { startTime: '10:00:00', endTime: '10:30:00' },
        { startTime: '11:00:00', endTime: '11:30:00' },
        { startTime: '14:00:00', endTime: '14:30:00' },
        { startTime: '15:00:00', endTime: '15:30:00' },
    ];

    for (let day = 0; day <= 6; day++) {
        const currentDate = new Date(startOfWeek.getTime() + day * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];

        for (const slot of slotsPerDay) {
            const sessionKey = `${studentId}-${currentDate}-${slot.startTime}`;
            if (!assignedSessions.has(sessionKey)) {
                const conflict = weeklySessions.some(session =>
                    session.student_id === studentId &&
                    session.session_date === currentDate &&
                    session.start_time === slot.startTime
                );
                if (!conflict) {
                    return { date: currentDate, startTime: slot.startTime, endTime: slot.endTime };
                }
            }
        }
    }

    return null; // No available slots
};

/**
 * Finds an available time slot for a tutor if no students are matched.
 */
const findAvailableSlotForTutor = (assignedSessions, startOfWeek, endOfWeek) => {
    const slotsPerDay = [
        { startTime: '09:00:00', endTime: '09:30:00' },
        { startTime: '10:00:00', endTime: '10:30:00' },
        { startTime: '11:00:00', endTime: '11:30:00' },
        { startTime: '14:00:00', endTime: '14:30:00' },
        { startTime: '15:00:00', endTime: '15:30:00' },
    ];

    for (let day = 0; day <= 6; day++) {
        const currentDate = new Date(startOfWeek.getTime() + day * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];

        for (const slot of slotsPerDay) {
            const sessionKey = `${currentDate}-${slot.startTime}-${slot.endTime}`;
            if (!assignedSessions.has(sessionKey)) {
                return { date: currentDate, startTime: slot.startTime, endTime: slot.endTime };
            }
        }
    }

    return null; // No available slots
};
