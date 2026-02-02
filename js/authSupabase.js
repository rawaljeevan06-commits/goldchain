function $(sel) {
  return document.querySelector(sel);
}

(async function init() {
  if (!window.sb) {
    console.error("❌ Supabase not loaded");
    return;
  }

  const path = window.location.pathname.toLowerCase();

  /* =======================
     PROTECT DASHBOARD
  ======================= */
  if (path.includes("dashboard")) {
    const { data } = await window.sb.auth.getSession();
    if (!data.session) {
      window.location.href =
        window.location.origin + "/goldchain/login.html";
      return;
    }
  }

  /* =======================
     LOGIN
  ======================= */
  const loginForm = $("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = $("#loginEmail").value.trim();
      const password = $("#loginPassword").value;
      const msg = $("#loginMsg");

      msg.textContent = "Logging in...";

      const { error } = await window.sb.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        msg.textContent = error.message;
        return;
      }

      window.location.href =
        window.location.origin + "/goldchain/dashboard.html";
    });
  }

  /* =======================
     SIGNUP
  ======================= */
  const signupForm = $("#signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const msg = $("#signupMsg");

      const email = $("#suEmail").value.trim();
      const password = $("#suPass").value;
      const name = $("#suName")?.value || "";
      const phone = $("#suPhone")?.value || "";
      const plan = $("#suPlan")?.value || "";

      msg.textContent = "Creating account...";

      const { error } = await window.sb.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone, plan },
        },
      });

      if (error) {
        msg.textContent = error.message;
        return;
      }

      msg.textContent = "Signup successful. Please login.";
      setTimeout(() => {
        window.location.href =
          window.location.origin + "/goldchain/login.html";
      }, 800);
    });
  }

  /* =======================
     LOGOUT
  ======================= */
  const logoutBtn = $("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await window.sb.auth.signOut();
      window.location.href =
        window.location.origin + "/goldchain/login.html";
    });
  }
})();
