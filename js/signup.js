import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

console.log("✅ signup.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM loaded");

  const form = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");

  console.log("FORM FOUND?", !!form);
  console.log("MSG FOUND?", !!msg);

  if (!form || !msg) {
    alert("Signup form or signupMsg ID not found. Check IDs in signup.html");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value;

    msg.textContent = "Creating account...";
    console.log("Submitting:", email);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ CREATED:", userCred.user.uid);

      msg.textContent = "Account created ✅ Redirecting...";
      setTimeout(() => (window.location.href = "login.html"), 800);

    } catch (err) {
      console.error("❌ SIGNUP ERROR:", err);
      msg.textContent = "ERROR: " + err.message;
    }
  });
});
