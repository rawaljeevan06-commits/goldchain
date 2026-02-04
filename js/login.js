// js/login.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    msg.textContent = "Logging in...";

    try {
      await signInWithEmailAndPassword(auth, email, password);

      msg.textContent = "Login successful ✅ Redirecting...";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);

    } catch (err) {
      msg.textContent = err.message;
      console.error(err);
    }
  });
});
