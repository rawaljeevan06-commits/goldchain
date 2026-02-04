document.addEventListener("DOMContentLoaded", async () => {
  if (!window.sb) {
    console.error("Supabase not initialized");
    return;
  }

  // LOGIN
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      const { error } = await sb.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        document.getElementById("loginMsg").textContent = error.message;
        return;
      }

      window.location.href = "dashboard.html";
    });
  }

  // SESSION CHECK (dashboard protection)
  const protectedPage = document.body.dataset.protected === "true";
  if (protectedPage) {
    const { data } = await sb.auth.getSession();
    if (!data.session) {
      window.location.href = "login.html";
    }
  }

  // LOGOUT
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await sb.auth.signOut();
      window.location.href = "login.html";
    });
  }
});
