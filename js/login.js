import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

console.log("✅ login.js loaded");

const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");

if (form && msg) {
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
      window.location.replace("dashboard.html");
    } catch (err) {
      msg.textContent = err?.message || "Login failed.";
      console.error(err);
    }
  });
}
