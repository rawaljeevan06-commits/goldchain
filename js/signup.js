import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");

  if (!signupForm) return;

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("suName").value.trim();
    const email = document.getElementById("suEmail").value.trim();
    const phone = document.getElementById("suPhone").value.trim();
    const plan = document.getElementById("suPlan").value;
    const password = document.getElementById("password").value;

    msg.textContent = "Creating account...";
    msg.style.color = "#ffd54f";

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // save display name
      await updateProfile(userCred.user, {
        displayName: name,
      });

      msg.textContent = "Account created ✅ Redirecting...";
      msg.style.color = "#7CFFB3";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);

    } catch (error) {
      msg.textContent = error.message;
      msg.style.color = "#ff3b3b";
      console.error(error);
    }
  });
});
