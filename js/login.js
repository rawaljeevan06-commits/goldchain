import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
const loginForm = document.getElementById("loginForm");
console.log("✅ login.js loaded");
console.log("auth exists?", !!auth);
const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");
const logoutBtn = document.getElementById("logoutBtn");
// ---------- FORGOT PASSWORD ----------
import {
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const forgotLink = document.getElementById("forgotPasswordLink");
const resetMsg = document.getElementById("resetMsg");

if (forgotLink) {
  forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("loginEmail");
    const email = emailInput ? emailInput.value.trim() : "";

    if (!email) {
      if (resetMsg) resetMsg.textContent = "❌ Enter your email first.";
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      if (resetMsg) {
        resetMsg.textContent =
          "✅ Password reset email sent. Check inbox / spam.";
      }
    } catch (err) {
      console.error(err);
      if (resetMsg) {
        resetMsg.textContent = "❌ Failed to send reset email.";
      }
    }
  });
}
if (!form || !msg) {
  console.error("❌ Missing #loginForm or #loginMsg in login.html");
} else {
  // If already logged in, go dashboard
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (logoutBtn) logoutBtn.style.display = "inline-block";
      window.location.replace("dashboard.html");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;

    if (!email || !password) {
      msg.textContent = "Please enter email and password.";
      return;
    }

    msg.textContent = "Logging in...";
    console.log("Attempting login:", email);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      msg.textContent = "✅ Logged in!";
      window.location.replace("dashboard.html");
    } catch (err) {
      console.error("❌ Login error:", err);
      msg.textContent = err?.message || "Login failed.";
    }
  });
}
