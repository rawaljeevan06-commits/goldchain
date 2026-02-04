// js/signup.js
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");

  if (!form || !msg) {
    console.log("❌ signupForm or signupMsg not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    msg.textContent = "Creating account...";
    msg.style.color = "#fff";

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // optional: store displayName
      if (name) {
        await updateProfile(userCred.user, { displayName: name });
      }

      msg.textContent = "Account created ✅ Redirecting to login...";
      msg.style.color = "#7CFFB3";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);

    } catch (err) {
      console.error("❌ SIGNUP ERROR:", err);
      msg.textContent = "ERROR: " + (err?.message || err);
      msg.style.color = "#ff3b3b";
    }
  });
});
