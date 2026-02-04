<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = "https://isyavausunsombknvhsz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzeWFhdnVzdW5zb21ia252aHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDExOTEsImV4cCI6MjA4NTUxNzE5MX0.SrOKP_Xm2Joi9QPStyAYFGmziavkXvpXbgGfG1LtEfA";

  window.sb = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log("Supabase client ready:", !!window.sb);

