// js/login.js (MODULE)
import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

console.log("✅ login.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM ready");

  const form = document.getElementById("loginForm");
  const emailEl = document.getElementById("loginEmail");
  const passEl = document.getElementById("loginPassword");
  const msg = document.getElementById("loginMsg");

  const forgotLink = document.getElementById("forgotPasswordLink");
  const resetMsg = document.getElementById("resetMsg");

  // If already logged in, go dashboard
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("✅ already logged in:", user.email);
      window.location.href = "dashboard.html";
    }
  });

  // Hard checks (so you see what is missing)
  if (!form || !emailEl || !passEl || !msg) {
    console.error("❌ Missing IDs in login.html", { form, emailEl, passEl, msg });
    if (msg) msg.textContent = "❌ Error: login form IDs missing (check loginForm/loginEmail/loginPassword/loginMsg).";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailEl.value.trim();
    const password = passEl.value;

    console.log("➡️ submit clicked", { email });

    if (!email || !password) {
      msg.textContent = "❌ Please enter email and password.";
      return;
    }

    msg.textContent = "⏳ Logging in...";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ login success -> redirect");
      msg.textContent = "✅ Logged in. Redirecting...";
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("❌ login error:", err);
      msg.textContent = err?.message || "❌ Login failed.";
    }
  });

  // Forgot password
  if (forgotLink && resetMsg) {
    forgotLink.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = emailEl.value.trim();
      if (!email) {
        resetMsg.textContent = "❌ Enter your email first.";
        return;
      }

      resetMsg.textContent = "⏳ Sending reset email...";

      try {
        await sendPasswordResetEmail(auth, email);
        resetMsg.textContent = "✅ Reset email sent. Check inbox/spam.";
      } catch (err) {
        console.error("❌ reset error:", err);
        resetMsg.textContent = err?.message || "❌ Reset failed.";
      }
    });
  } else {
    console.log("ℹ️ Forgot password elements not found (ok if you didn’t add them).");
  }
});
