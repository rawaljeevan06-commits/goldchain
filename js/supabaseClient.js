// js/supabaseClient.js
// Creates ONE global Supabase client (window.sb)

const SUPABASE_URL = "https://isyavausunsombknvhsz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzeWFhdnVzdW5zb21ia252aHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDExOTEsImV4cCI6MjA4NTUxNzE5MX0.SrOKP_Xm2Joi9QPStyAYFGmziavkXvpXbgGfG1LtEfA"; // put your real anon key

window.sb = window.supabase.createClient(https://isyavausunsombknvhsz.supabase.co, 
                                         eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzeWFhdnVzdW5zb21ia252aHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDExOTEsImV4cCI6MjA4NTUxNzE5MX0.SrOKP_Xm2Joi9QPStyAYFGmziavkXvpXbgGfG1LtEfA);
