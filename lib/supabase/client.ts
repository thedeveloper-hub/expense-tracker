import { createClient } from '@supabase/supabase-js';

// Use placeholder values if env vars are not set to prevent errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MTYxNjE2MTYsImV4cCI6MTkzMTczNzYxNn0.placeholder';

// Check if real credentials are provided
const hasRealCredentials =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

if (!hasRealCredentials) {
    console.log('ℹ️ Supabase not configured. App will use localStorage mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
    return hasRealCredentials;
};
