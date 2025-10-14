import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtcoxihxkcsvwaovgwvd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0Y294aWh4a2Nzdndhb3Znd3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNzUxNzQsImV4cCI6MjA3NTg1MTE3NH0.4nBijQDZqsmbBAdksahbelnkNH6zK8k17uusQl4mIqE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
