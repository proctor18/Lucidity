// Command to run = npx jest matching.test.js
import { findMatchingTutors } from '../scheduling/matching.js';
import { supabase } from '../lib/supabase';

// Mock the supabase client
jest.mock('../lib/supabase');

describe('findMatchingTutors', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return sorted tutors with matching topics', async () => {
    // Mock student data
    supabase.from.mockImplementation((table) => {
      if (table === 'students') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { topics: ['Math', 'Science'] },
            error: null
          })
        };
      }
      if (table === 'tutors') {
        return {
          select: jest.fn().mockReturnThis(),
          not: jest.fn().mockResolvedValue({
            data: [
              { tutor_id: 1, name: 'Alice', topics: ['Math', 'History'] },
              { tutor_id: 2, name: 'Bob', topics: ['Science', 'Math'] },
              { tutor_id: 3, name: 'Charlie', topics: ['History'] }
            ],
            error: null
          })
        };
      }
    });

    const result = await findMatchingTutors(1);

    expect(result).toEqual([
      {
        tutor_id: 2,
        name: 'Bob',
        topics: ['Science', 'Math'],
        matchingScore: 2,
        commonTopics: ['Science', 'Math']
      },
      {
        tutor_id: 1,
        name: 'Alice',
        topics: ['Math', 'History'],
        matchingScore: 1,
        commonTopics: ['Math']
      }
    ]);
  });

  it('should return an empty array if no matching tutors found', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'students') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { topics: ['Art'] },
            error: null
          })
        };
      }
      if (table === 'tutors') {
        return {
          select: jest.fn().mockReturnThis(),
          not: jest.fn().mockResolvedValue({
            data: [
              { tutor_id: 1, name: 'Alice', topics: ['Math', 'History'] },
              { tutor_id: 2, name: 'Bob', topics: ['Science', 'Math'] },
              { tutor_id: 3, name: 'Charlie', topics: ['History'] }
            ],
            error: null
          })
        };
      }
    });

    const result = await findMatchingTutors(1);
    expect(result).toEqual([]);
  });

  it('should return an empty array if student topics are not found', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'students') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: 'Error fetching student topics'
          })
        };
      }
    });

    const result = await findMatchingTutors(1);
    expect(result).toEqual([]);
  });

  it('should return an empty array if there is an error fetching tutors', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'students') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { topics: ['Math', 'Science'] },
            error: null
          })
        };
      }
      if (table === 'tutors') {
        return {
          select: jest.fn().mockReturnThis(),
          not: jest.fn().mockResolvedValue({
            data: null,
            error: 'Error fetching tutors'
          })
        };
      }
    });

    const result = await findMatchingTutors(1);
    expect(result).toEqual([]);
  });
});