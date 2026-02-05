import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");

// Safety: if this script loads on a page without the form, do nothing
if (!form || !msg) {
  console.warn("login.js loaded but login form elements not found.");
} else {
  // If already logged in, go dashboard
  onAuthStateChanged(auth, (user) => {
    if (user) {
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

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // replace prevents going back to login after success
      window.location.replace("dashboard.html");
    } catch (err) {
      msg.textContent = err?.message || "Login failed. Try again.";
    }
  });
}
