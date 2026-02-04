// js/login.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  if (!form || !msg) {
    console.log("❌ loginForm or loginMsg not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    msg.textContent = "Logging in...";
    msg.style.color = "#fff";

    try {
      await signInWithEmailAndPassword(auth, email, password);

      msg.textContent = "Login successful ✅ Redirecting...";
      msg.style.color = "#7CFFB3";

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);

    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);
      msg.textContent = "ERROR: " + (err?.message || err);
      msg.style.color = "#ff3b3b";
    }
  });
});
