document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const logoutBtn = document.getElementById("logoutBtn");

  // ✅ Always use window.sb
  if (!window.sb) {
    console.error("Supabase client not loaded (window.sb missing)");
    return;
  }

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      const msg = document.getElementById("loginMsg");
      if (msg) msg.textContent = "Logging in...";

      const { error } = await window.sb.auth.signInWithPassword({ email, password });

      if (error) {
        if (msg) msg.textContent = error.message;
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

      const msg = document.getElementById("signupMsg");
      if (msg) msg.textContent = "Creating account...";

      const { error } = await window.sb.auth.signUp({ email, password });

      if (error) {
        if (msg) msg.textContent = error.message;
        return;
      }

      if (msg) msg.textContent = "Signup successful ✅ Please login.";
    });
  }

  // LOGOUT
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await window.sb.auth.signOut();
      window.location.href = "login.html";
    });
  }
});
