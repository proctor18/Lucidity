import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://tqtqpftsctrshouqpcej.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHFwZnRzY3Ryc2hvdXFwY2VqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODg5MTU0MywiZXhwIjoyMDQ0NDY3NTQzfQ.2h9rCohCCLwl1AGT8Kg8CXjp7fw87jYSV3zz6qRtKxs';
export default const supabase = createClient(supabaseUrl, supabaseAnonKey);
