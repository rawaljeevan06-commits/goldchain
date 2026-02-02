// js/authSupabase.js
// Works on login.html + signup.html + index.html (logout + header state)

function $(sel) {
  return document.querySelector(sel);
}

function setMsg(el, text, ok = false) {
  if (!el) return;
  el.textContent = text || "";
  el.style.color = ok ? "#7CFFB3" : "#ffb3b3";
}

async function setHeaderState() {
  const loginBtn = $("#loginBtn");
  const signupBtn = $("#signupBtn");
  const logoutBtn = $("#logoutBtn");

  try {
    const { data } = await window.sb.auth.getSession();
    const loggedIn = !!data.session;

    if (loginBtn) loginBtn.style.display = loggedIn ? "none" : "";
    if (signupBtn) signupBtn.style.display = loggedIn ? "none" : "";
    if (logoutBtn) logoutBtn.style.display = loggedIn ? "" : "none";
  } catch (e) {
    console.warn("setHeaderState error:", e);
  }
}

// Logout
async function bindLogout() {
  const logoutBtn = $("#logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await window.sb.auth.signOut();
    window.location.href = window.location.origin + "/goldchain/";
  });
}

// Login page
async function bindLogin() {
  const form = $("#loginForm");
  if (!form) return;

  const emailEl = $("#loginEmail") || form.querySelector("input[type='email']");
  const passEl  = $("#loginPassword") || form.querySelector("input[type='password']");
  const msg     = $("#loginMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailEl?.value?.trim()?.toLowerCase();
    const password = passEl?.value;

    if (!email || !password) {
      setMsg(msg, "Please enter email and password.");
      return;
    }

    setMsg(msg, "Logging in...", true);

    try {
      const { error } = await window.sb.auth.signInWithPassword({ email, password });
      if (error) {
        setMsg(msg, "SUPABASE ERROR: " + error.message);
        return;
      }
      setMsg(msg, "Login successful ✅ Redirecting...", true);
      setTimeout(() => (window.location.href = "index.html"), 500);
    } catch (err) {
      setMsg(msg, "NETWORK ERROR: " + (err?.message || err));
      console.error(err);
    }
  });
}

// Signup page
async function bindSignup() {
  const form = $("#signupForm");
  if (!form) return;

  const nameEl  = $("#suName") || $("#fullName") || form.querySelector("input[name='full_name']");
  const phoneEl = $("#suPhone") || $("#phone") || form.querySelector("input[name='phone']");
  const planEl  = $("#suPlan");
  const emailEl = $("#suEmail") || $("#signupEmail") || form.querySelector("input[type='email']");
  const passEl  = $("#suPass") || $("#signupPassword") || form.querySelector("input[type='password']");
  const msg     = $("#signupMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameEl?.value?.trim() || "";
    const phone = phoneEl?.value?.trim() || "";
    const plan = planEl?.value || "";
    const email = emailEl?.value?.trim()?.toLowerCase();
    const password = passEl?.value;

    if (!email || !password) {
      setMsg(msg, "Please enter email and password.");
      return;
    }
    if (password.length < 6) {
      setMsg(msg, "Password must be at least 6 characters.");
      return;
    }
    if (planEl && !plan) {
      setMsg(msg, "Please select a plan.");
      return;
    }

    setMsg(msg, "Creating account...", true);

    try {
      const { data, error } = await window.sb.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone, plan },
          // Works on localhost, GitHub Pages, Netlify, etc.
          emailRedirectTo: window.location.origin + "/"
        }
      });

      if (error) {
        setMsg(msg, "SUPABASE ERROR: " + error.message);
        return;
      }

      // If email confirmation is ON, session may be null
      if (!data?.session) {
        setMsg(msg, "Account created ✅ Check your email to confirm, then login.", true);
        return;
      }

      setMsg(msg, "Account created ✅ Redirecting...", true);
      setTimeout(() => (window.location.href = "index.html"), 700);
    } catch (err) {
      setMsg(msg, "NETWORK ERROR: " + (err?.message || err));
      console.error(err);
    }
  });
}

(async function init() {
  if (!window.sb) {
    console.error("Supabase client (window.sb) missing. Load supabaseClient.js BEFORE authSupabase.js");
    return;
  }

  await setHeaderState();
  await bindLogout();

  const path = window.location.pathname.toLowerCase();
  if (path.includes("login")) await bindLogin();
  if (path.includes("signup")) await bindSignup();

  window.sb.auth.onAuthStateChange(() => setHeaderState());
})();
