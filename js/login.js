// js/login.js
import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
document.addEventListener("DOMContentLoaded", async () => {
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const msg = document.getElementById("loginMsg");

  const forgotLink = document.getElementById("forgotPasswordLink");
  const resetMsg = document.getElementById("resetMsg");

  // ---------------- LOGIN ----------------
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        msg.textContent = "❌ Email and password required.";
        return;
      }

      msg.textContent = "⏳ Logging in...";

      try {
        const userCredential =
          await signInWithEmailAndPassword(auth, email, password);

        console.log("✅ Logged in:", userCredential.user.email);
        msg.textContent = "✅ Logged in";

        window.location.replace("dashboard.html");

      } catch (err) {
        console.error("❌ Login error:", err);
        msg.textContent = err.message || "Login failed.";
      }
    });
  }

  // ---------------- FORGOT PASSWORD ----------------
  if (forgotLink) {
    forgotLink.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      if (!email) {
        resetMsg.textContent = "❌ Enter your email first.";
        return;
      }

      resetMsg.textContent = "⏳ Sending reset email...";

      try {
        await sendPasswordResetEmail(auth, email);
        resetMsg.textContent = "✅ Reset email sent. Check inbox.";
      } catch (err) {
        console.error("❌ Reset error:", err);
        resetMsg.textContent = err.message || "Reset failed.";
      }
    });
  }

});
});
