import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

console.log("✅ signup.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");
  if (!form || !msg) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("suName")?.value.trim() || "";
    const email = document.getElementById("suEmail")?.value.trim();
    const phone = document.getElementById("suPhone")?.value.trim() || "";
    const password = document.getElementById("suPass")?.value;

    if (!email || !password) {
      msg.textContent = "Email and password are required.";
      return;
    }

    msg.textContent = "Creating account...";

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(userCred.user, { displayName: name });

      // demo: store extras locally
      try { localStorage.setItem("signupProfile", JSON.stringify({ name, email, phone })); } catch (e) {}

      msg.textContent = "Account created ✅ Redirecting...";
      setTimeout(() => window.location.replace("login.html"), 700);
    } catch (err) {
      msg.textContent = err?.message || "Signup failed.";
      console.error(err);
    }
  });
});
