import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zjdzvtlnshonfxgyejaq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZHp2dGxuc2hvbmZ4Z3llamFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDMyMjAsImV4cCI6MjA1NTcxOTIyMH0.no10X172D_IggoljgIUmLrtfPK2PN33eWt6-nAg9jJc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const signUp = async (email, password) => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      console.error("Signup error:", error.message);
    } else {
      console.log("User signed up:", user);
    }
  };

  
  const signIn = async (email, password) => {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      console.error("Login error:", error.message);
    } else {
      console.log("User logged in:", user);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      console.log("User logged out.");
    }
  };
  