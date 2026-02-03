<script>
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  if (!window.supabase) {
    msg.textContent = "Supabase client not loaded.";
    return;
  }

  // ✅ CREATE CLIENT (VERY IMPORTANT)
  const SUPABASE_URL = "https://isyaavusunsombknvhsz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzeWFhdnVzdW5zb21ia252aHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDExOTEsImV4cCI6MjA4NTUxNzE5MX0.SrOKP_Xm2Joi9QPStyAYFGmziavkXvpXbgGfG1LtEfA";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    msg.textContent = "Logging in...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      msg.textContent = error.message;
      return;
    }

    msg.textContent = "Login successful ✅";
    console.log("User:", data.user);

    // redirect if you want
    // window.location.href = "dashboard.html";
  });
});
</script>
