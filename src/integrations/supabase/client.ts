import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://icxfettvfhpklcmmyzkz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeGZldHR2Zmhwa2xjbW15emt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NjgyNzIsImV4cCI6MjA2ODI0NDI3Mn0.5JNpeSZzVCpESUIU1bxkxplbF_I3fr9cl5OIBf864nA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)