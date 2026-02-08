// js/header-auth.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth } from "./firebase.js";

// These IDs must exist on the page header
const loginLink = document.getElementById("loginLink");
const signupLink = document.getElementById("signupLink");
const dashLink = document.getElementById("dashLink");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Logged in ✅
    if (loginLink) loginLink.style.display = "none";
    if (signupLink) signupLink.style.display = "none";
    if (dashLink) dashLink.style.display = "inline-flex";
  } else {
    // Logged out ✅
    if (loginLink) loginLink.style.display = "inline-flex";
    if (signupLink) signupLink.style.display = "inline-flex";
    if (dashLink) dashLink.style.display = "none";
  }
});
