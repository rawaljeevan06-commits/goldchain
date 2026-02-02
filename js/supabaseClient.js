// js/supabaseClient.js
// Creates ONE global Supabase client (window.sb)

const SUPABASE_URL = "https://isyavausunsombknvhsz.supabase.co";
const SUPABASE_ANON_KEY = "PASTE_YOUR_ANON_KEY_HERE"; // put your real anon key

window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
