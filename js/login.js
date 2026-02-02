document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  if (!window.sb) {
    msg.textContent = "Supabase client not loaded.";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    msg.textContent = "Logging in...";

    const { error } = await window.sb.auth.signInWithPassword({ email, password });

    if (error) {
      msg.textContent = error.message;
      return;
    }

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  });
});
