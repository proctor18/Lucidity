// Command to run = npx jest calendar.test.js
const {
    checkForOverlap,
    hasSchedulingConflicts,
    tutorAvailability,
  } = require('../scheduling/calendar.js');

  // Mocking supabase client
  jest.mock('../lib/supabase.js', () => ({
    supabase: {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
    }
  }));
  
  const { supabase } = require('../lib/supabase.js');
  
  jest.mock('@react-native-google-signin/google-signin', () => ({
    GoogleSignin: {
      configure: jest.fn(),
      signIn: jest.fn(),            
      signOut: jest.fn(),          
      hasPlayServices: jest.fn(),
      getTokens: jest.fn(),         
      isSignedIn: jest.fn(),       
    }
  }));
  
describe('Calendar Functions', () => {
  describe('checkForOverlap', () => {
    test('returns true when sessions overlap', () => {
      const session1 = {
        session_date: '2024-10-15',
        start_time: '10:00:00',
        end_time: '11:00:00',
      };
      const session2 = {
        session_date: '2024-10-15',
        start_time: '10:30:00',
        end_time: '11:30:00',
      };

      expect(checkForOverlap(session1, session2)).toBe(true);
    });

    test('returns false when sessions do not overlap', () => {
      const session1 = {
        session_date: '2024-10-15',
        start_time: '09:00:00',
        end_time: '10:00:00',
      };
      const session2 = {
        session_date: '2024-10-15',
        start_time: '10:00:00',
        end_time: '11:00:00',
      };

      expect(checkForOverlap(session1, session2)).toBe(false);
    });
  });

describe('hasSchedulingConflicts', () => {
  test('returns true when there is a conflict', () => {
    const existingSessions = [
      {
        session_date: '2024-10-15',
        start_time: '10:00:00',
        end_time: '11:00:00',
      },
    ];
    const requestedSession = {
      session_date: '2024-10-15',
      start_time: '10:30:00',
      end_time: '11:30:00',
    };

    expect(hasSchedulingConflicts(existingSessions, requestedSession)).toBe(true);
  });

  test('returns false when there is no conflict', () => {
    const existingSessions = [
      {
        session_date: '2024-10-15',
        start_time: '12:00:00',
        end_time: '13:00:00',
      },
    ];
    const requestedSession = {
      session_date: '2024-10-15',
      start_time: '10:30:00',
      end_time: '11:30:00',
    };

    expect(hasSchedulingConflicts(existingSessions, requestedSession)).toBe(false);
  });
});

describe('tutorAvailability', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns true when tutor is available during requested time', async () => {
    const supabaseMock = {};
    supabaseMock.from = jest.fn(() => supabaseMock);
    supabaseMock.select = jest.fn(() => supabaseMock);
    const eqMock = jest.fn();
    supabaseMock.eq = eqMock;
    eqMock
      .mockImplementationOnce(() => supabaseMock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [{ day_of_week: 'Monday', start_time: '09:00:00', end_time: '17:00:00' }],
          error: null,
        })
      );
    supabase.from = supabaseMock.from;

    const result = await tutorAvailability('tutor123', 'Monday', {
      startDateTime: '2024-01-01T10:00:00',
      endDateTime: '2024-01-01T11:00:00',
    });

    expect(result).toBe(true);
  });

  test('returns false when tutor is not available during requested time', async () => {
    const supabaseMock = {};
    supabaseMock.from = jest.fn(() => supabaseMock);
    supabaseMock.select = jest.fn(() => supabaseMock);
  
    const eqMock = jest.fn();
    supabaseMock.eq = eqMock;
  
    eqMock
      .mockImplementationOnce(() => supabaseMock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: [
            {
              day_of_week: 'Monday',
              start_time: '12:00:00',
              end_time: '13:00:00',
            },
          ],
          error: null,
        })
      );

    supabase.from = supabaseMock.from;
  
    const result = await tutorAvailability('tutor123', 'Monday', {
      startDateTime: '2024-01-01T10:00:00',
      endDateTime: '2024-01-01T11:00:00',
    });
  
    expect(result).toBe(false);
  });

  test('returns false when tutor availability is not found', async () => {
    const supabaseMock = {};
    supabaseMock.from = jest.fn(() => supabaseMock);
    supabaseMock.select = jest.fn(() => supabaseMock);
  
    const eqMock = jest.fn();
    supabaseMock.eq = eqMock;
  
    eqMock
      .mockImplementationOnce(() => supabaseMock)
      .mockImplementationOnce(() =>
        Promise.resolve({
           // No availability data found
          data: null,
          error: 'Error fetching availability',
        })
      );
  
    supabase.from = supabaseMock.from;
  
    const result = await tutorAvailability('tutor123', 'Monday', {
      startDateTime: '2024-01-01T10:00:00',
      endDateTime: '2024-01-01T11:00:00',
    });
  
    expect(result).toBe(false);
  });
});
});