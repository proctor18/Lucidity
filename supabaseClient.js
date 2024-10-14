import { createClient } from '@supabase/supabase-js';

import AsyncStorage from '@react-native-async-storage/async-storage';
const supabaseUrl = 'https://aakgaenurbacahwntkhy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFha2dhZW51cmJhY2Fod250a2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc1NjYxMDEsImV4cCI6MjA0MzE0MjEwMX0.stLw2UKDivomYHuTYd0_QDtl7o_pF_QVtvrzaW50VUc' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // For React Native session persistence
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // For mobile apps
  },
});
