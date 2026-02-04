// js/login.js
import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    msg.textContent = "Logging in...";
    msg.style.color = "#ffffff";

    try {
      await signInWithEmailAndPassword(auth, email, password);

      msg.textContent = "Login successful ✅";
      msg.style.color = "#7CFFB3";

      // redirect after login
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);

    } catch (err) {
      msg.textContent = err.message;
      msg.style.color = "#ff3b3b";
      console.error(err);
    }
  });
});
