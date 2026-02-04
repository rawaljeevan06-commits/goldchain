// js/signup.js
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");

  if (!signupForm) return;

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      // Create user
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Set display name (Firebase supports displayName)
      await updateProfile(userCred.user, { displayName: name });

      // Save extra fields locally (optional)
      // If you want to store phone + plan in database, we will add Firestore next
      localStorage.setItem(
        "goldchain_profile",
        JSON.stringify({ name, phone, plan: "basic", email })
      );

      msg.textContent = "Account created ✅ Redirecting to home...";
      msg.style.color = "#7CFFB3";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);

    } catch (err) {
      msg.textContent = "ERROR: " + (err?.message || err);
      msg.style.color = "#ff3b3b";
      console.error(err);
    }
  });
});
