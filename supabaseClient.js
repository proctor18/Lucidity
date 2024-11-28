import { createClient } from '@supabase/supabase-js';

import AsyncStorage from '@react-native-async-storage/async-storage';
const supabaseUrl = 'https://tqtqpftsctrshouqpcej.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHFwZnRzY3Ryc2hvdXFwY2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4OTE1NDMsImV4cCI6MjA0NDQ2NzU0M30.qp73iaUwV5XCYOcbSkyc3cCL2q9NK1XSzIY_nB__tkM' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // For React Native session persistence
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // For mobile apps
  },
});