import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://fiytszrmqeiwhfqjcwzn.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpeXRzenJtcWVpd2hmcWpjd3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTQxNzUsImV4cCI6MjA1MjI3MDE3NX0.xUTI3UnT4Qp2K1DX55nvKXXylouUbzTZoN50jGVXLxI";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public'
  }
});

// Test connection and log any errors
supabase.auth.getSession().catch((error) => {
  console.error("Error connecting to Supabase:", error.message);
});