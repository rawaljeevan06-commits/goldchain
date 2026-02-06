// js/login.js
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// ✅ PUT YOUR ADMIN UID(S) HERE (same as dashboard/admin)
const ADMIN_UIDS = ["40B1eYKROIXFAZLpelBhjjFTDm72"];

// Elements
const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMsg");
const resetMsg = document.getElementById("resetMsg");

const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

const forgotPasswordLink = document.getElementById("forgotPasswordLink");

// Helpers
function setMsg(el, text) {
  if (!el) return;
  el.textContent = text || "";
}

function goAfterLogin(user) {
  if (!user) return;
  // ✅ Admin -> admin.html
  if (ADMIN_UIDS.includes(user.uid)) {
    window.location.replace("admin.html");
    return;
  }
  // ✅ Normal -> dashboard.html
  window.location.replace("dashboard.html");
}

// Navbar toggle (optional safe)
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
navToggle?.addEventListener("click", () => {
  nav?.classList.toggle("open");
});

// LOGIN submit
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg(loginMsg, "");
  setMsg(resetMsg, "");

  const email = document.getElementById("loginEmail")?.value?.trim();
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    setMsg(loginMsg, "Please enter email and password.");
    return;
  }

  try {
    setMsg(loginMsg, "Logging in...");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    setMsg(loginMsg, "✅ Logged in");
    goAfterLogin(cred.user);
  } catch (err) {
    console.error(err);
    setMsg(loginMsg, `❌ ${err?.message || "Login failed"}`);
  }
});

// Forgot password
forgotPasswordLink?.addEventListener("click", async (e) => {
  e.preventDefault();
  setMsg(resetMsg, "");
  setMsg(loginMsg, "");

  const email = document.getElementById("loginEmail")?.value?.trim();
  if (!email) {
    setMsg(resetMsg, "Type your email first, then click Forgot password.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    setMsg(resetMsg, "✅ Password reset email sent. Check your inbox.");
  } catch (err) {
    console.error(err);
    setMsg(resetMsg, `❌ ${err?.message || "Could not send reset email"}`);
  }
});

// Header logout button (if shown)
logoutBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
  } catch (err) {}
  window.location.replace("login.html");
});

// Keep header buttons correct
onAuthStateChanged(auth, (user) => {
  if (user) {
    logoutBtn && (logoutBtn.style.display = "inline-block");
    loginBtn && (loginBtn.style.display = "none");
    signupBtn && (signupBtn.style.display = "none");
    // If user already logged in and still on login page, send them
    goAfterLogin(user);
  } else {
    logoutBtn && (logoutBtn.style.display = "none");
    loginBtn && (loginBtn.style.display = "inline-block");
    signupBtn && (signupBtn.style.display = "inline-block");
  }
});
