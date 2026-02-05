// js/login.js (MODULE)

import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

console.log("✅ login.js loaded");

const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");

const forgotLink = document.getElementById("forgotPasswordLink");
const resetMsg = document.getElementById("resetMsg");

// If already logged in, go dashboard
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ already logged in:", user.email);
    window.location.replace("dashboard.html");
  }
});

// LOGIN submit
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim();
    const pass = document.getElementById("loginPassword")?.value;

    if (!email || !pass) {
      if (msg) msg.textContent = "❌ Enter email and password.";
      return;
    }

    try {
      if (msg) msg.textContent = "⏳ Logging in...";
      await signInWithEmailAndPassword(auth, email, pass);
      console.log("✅ login success -> redirect");
      window.location.replace("dashboard.html");
    } catch (err) {
      console.error("❌ login error:", err);
      if (msg) msg.textContent = err?.message || "Login failed";
    }
  });
}

// FORGOT PASSWORD
if (forgotLink) {
  forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail")?.value.trim();

    if (!email) {
      if (resetMsg) resetMsg.textContent = "❌ Enter your email first.";
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      if (resetMsg) resetMsg.textContent = "✅ Reset link sent. Check your email.";
    } catch (err) {
      console.error("❌ reset error:", err);
      if (resetMsg) resetMsg.textContent = err?.message || "Reset failed";
    }
  });
}
