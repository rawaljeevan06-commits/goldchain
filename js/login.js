// js/login.js  (FINAL, CLEAN, WORKING)

import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

console.log("✅ login.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOMContentLoaded");

  // ---------- ELEMENTS ----------
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const loginMsg = document.getElementById("loginMsg");

  const forgotLink = document.getElementById("forgotPasswordLink");
  const resetMsg = document.getElementById("resetMsg");

  // ---------- SAFETY CHECK ----------
  if (!loginForm || !emailInput || !passwordInput || !loginMsg) {
    console.error("❌ Missing login form elements");
    if (loginMsg) {
      loginMsg.textContent =
        "❌ Login form error. Check IDs in login.html.";
    }
    return;
  }

  // ---------- AUTO REDIRECT IF LOGGED IN ----------
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("✅ User already logged in:", user.email);
      window.location.href = "dashboard.html";
    }
  });

  // ---------- LOGIN ----------
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("➡️ Login submit clicked");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      loginMsg.textContent = "❌ Enter email and password.";
      return;
    }

    loginMsg.textContent = "⏳ Logging in...";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login success");
      loginMsg.textContent = "✅ Login successful. Redirecting...";
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("❌ Login error:", err);
      loginMsg.textContent = err.message || "❌ Login failed.";
    }
  });

  // ---------- FORGOT PASSWORD ----------
  if (forgotLink && resetMsg) {
    forgotLink.addEventListener("click", async (e) => {
      e.preventDefault();
      console.log("➡️ Forgot password clicked");

      const email = emailInput.value.trim();
      if (!email) {
        resetMsg.textContent = "❌ Enter your email first.";
        return;
      }

      resetMsg.textContent = "⏳ Sending reset email...";

      try {
        await sendPasswordResetEmail(auth, email);
        resetMsg.textContent =
          "✅ Reset email sent. Check inbox / spam.";
      } catch (err) {
        console.error("❌ Reset error:", err);
        resetMsg.textContent =
          err.message || "❌ Failed to send reset email.";
      }
    });
  }
});
