// js/authSupabase.js
// Works on login.html + signup.html + index.html (logout + header state)

function $(sel) {
  return document.querySelector(sel);
}

async function setHeaderState() {
  const loginBtn = $("#loginBtn");
  const signupBtn = $("#signupBtn");
  const logoutBtn = $("#logoutBtn");

  const { data } = await window.sb.auth.getSession();
  const loggedIn = !!data.session;

  if (loginBtn) loginBtn.style.display = loggedIn ? "none" : "";
  if (signupBtn) signupBtn.style.display = loggedIn ? "none" : "";
  if (logoutBtn) logoutBtn.style.display = loggedIn ? "" : "none";
}

// Logout
async function bindLogout() {
  const logoutBtn = $("#logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await window.sb.auth.signOut();
    window.location.href = "index.html";
  });
}

// Login page
async function bindLogin() {
  const form =
    $("#loginForm") || $("form[data-auth='login']") || $("form");

  if (!form) return;

  const emailEl = $("#loginEmail") || $("#email") || form.querySelector("input[type='email']");
  const passEl = $("#loginPassword") || $("#password") || form.querySelector("input[type='password']");
  const msg = $("#loginMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailEl?.value?.trim();
    const password = passEl?.value;

    if (!email || !password) {
      if (msg) msg.textContent = "Please enter email and password.";
      return;
    }

    const { error } = await window.sb.auth.signInWithPassword({ email, password });

    if (error) {
      if (msg) msg.textContent = error.message;
      return;
    }

    window.location.href = "index.html";
  });
}

// Signup page
async function bindSignup() {
  const form =
    $("#signupForm") || $("form[data-auth='signup']") || $("form");

  if (!form) return;

  const nameEl = $("#fullName") || form.querySelector("input[name='full_name']");
  const phoneEl = $("#phone") || form.querySelector("input[name='phone']");
  const emailEl = $("#signupEmail") || $("#email") || form.querySelector("input[type='email']");
  const passEl = $("#signupPassword") || $("#password") || form.querySelector("input[type='password']");
  const msg = $("#signupMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const full_name = nameEl?.value?.trim() || "";
    const phone = phoneEl?.value?.trim() || "";
    const email = emailEl?.value?.trim();
    const password = passEl?.value;

    if (!email || !password) {
      if (msg) msg.textContent = "Please enter email and password.";
      return;
    }

    const { error } = await window.sb.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, phone },
        emailRedirectTo: "https://rawaljeevan06-commits.github.io/goldchain/"
      }
    });

    if (error) {
      if (msg) msg.textContent = error.message;
      return;
    }

    if (msg) msg.textContent = "Signup successful. You can login now.";
    setTimeout(() => (window.location.href = "login.html"), 900);
  });
}

(async function init() {
  await setHeaderState();
  await bindLogout();

  // Detect page
  const path = window.location.pathname.toLowerCase();
  if (path.includes("login")) await bindLogin();
  if (path.includes("signup")) await bindSignup();

  // Update header on auth changes
  window.sb.auth.onAuthStateChange(() => setHeaderState());
})();
