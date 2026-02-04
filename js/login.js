import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");

const emailInput = document.getElementById("loginEmail");
const passInput = document.getElementById("loginPassword");

if (!form || !emailInput || !passInput) {
  console.error("Login form elements not found");
} else {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passInput.value;

    msg.textContent = "Logging in...";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.replace("dashboard.html");
    } catch (err) {
      msg.textContent = `Firebase: Error (${err.code || "unknown"}).`;
    }
  });
}
