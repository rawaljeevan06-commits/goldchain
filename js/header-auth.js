// js/header-auth.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth } from "./firebase.js";

const loginLink = document.getElementById("loginLink");
const signupLink = document.getElementById("signupLink");
const dashLink = document.getElementById("dashLink");

// Optional: hero dashboard button on some pages
const heroDashBtn = document.getElementById("heroDashBtn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // ✅ logged in
    if (loginLink) loginLink.style.display = "none";
    if (signupLink) signupLink.style.display = "none";
    if (dashLink) dashLink.style.display = "inline-flex";

    if (heroDashBtn) heroDashBtn.href = "dashboard.html";
  } else {
    // ✅ logged out
    if (loginLink) loginLink.style.display = "inline-flex";
    if (signupLink) signupLink.style.display = "inline-flex";
    if (dashLink) dashLink.style.display = "none";

    if (heroDashBtn) heroDashBtn.href = "login.html";
  }
});
