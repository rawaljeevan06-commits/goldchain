document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!window.sb) {
    console.error("Supabase not loaded");
    return;
  }

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      const { error } = await sb.auth.signInWithPassword({ email, password });

      if (error) {
        document.getElementById("loginMsg").textContent = error.message;
        return;
      }

      window.location.href = "dashboard.html";
    });
  }

  // SIGNUP
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("suEmail").value.trim();
      const password = document.getElementById("suPass").value;

      const { error } = await sb.auth.signUp({ email, password });

      if (error) {
        document.getElementById("signupMsg").textContent = error.message;
        return;
      }

      document.getElementById("signupMsg").textContent =
        "Signup successful. Please login.";
    });
  }

  // LOGOUT
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await sb.auth.signOut();
      window.location.href = "login.html";
    });
  }
});
