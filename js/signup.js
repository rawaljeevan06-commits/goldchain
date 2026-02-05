import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");

  // Safety: if script loads on another page
  if (!form || !msg) {
    console.warn("signup.js loaded but signup form elements not found.");
    return;
  }

  // If already logged in, go dashboard
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.replace("dashboard.html");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("suName");
    const emailEl = document.getElementById("suEmail");
    const phoneEl = document.getElementById("suPhone");
    const planEl = document.getElementById("suPlan");
    const passEl = document.getElementById("suPass");

    if (!emailEl || !passEl) {
      msg.textContent = "HTML IDs mismatch: suEmail / suPass not found.";
      msg.style.color = "#ff3b3b";
      return;
    }

    const name = nameEl ? nameEl.value.trim() : "";
    const email = emailEl.value.trim();
    const phone = phoneEl ? phoneEl.value.trim() : "";
    const plan = planEl ? planEl.value : "";
    const password = passEl.value;

    if (!email || !password) {
      msg.textContent = "Email and password are required.";
      msg.style.color = "#ff3b3b";
      return;
    }

    try {
      msg.textContent = "Creating account...";
      msg.style.color = "#ffd36b";

      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      if (name) {
        await updateProfile(userCred.user, { displayName: name });
      }

      // Optional: save extra signup info locally (not secure, but ok for demo UI)
      try {
        localStorage.setItem("signupProfile", JSON.stringify({ name, email, phone, plan }));
      } catch (e) {}

      msg.textContent = "Account created ✅ Redirecting...";
      msg.style.color = "#7CFFB3";

      setTimeout(() => {
        window.location.replace("login.html");
      }, 800);
    } catch (err) {
      msg.textContent = err?.message || "Signup failed. Try again.";
      msg.style.color = "#ff3b3b";
      console.error(err);
    }
  });
});
