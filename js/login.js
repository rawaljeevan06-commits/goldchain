// js/login.js (MODULE)
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  if (!form || !msg) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    msg.textContent = "Logging in...";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      msg.textContent = "Login successful ✅ Redirecting...";
      setTimeout(() => window.location.replace("dashboard.html"), 300);
    } catch (err) {
      msg.textContent = "ERROR: " + (err?.message || err);
    }
  });
});
