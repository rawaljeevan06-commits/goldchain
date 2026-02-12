// js/nav-auth.js (MODULE)
// Shows Login/Signup when logged out, shows Dashboard when logged in

import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const loginLink = document.getElementById("loginLink");
const signupLink = document.getElementById("signupLink");
const dashLink = document.getElementById("dashLink");

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginLink) loginLink.style.display = "none";
    if (signupLink) signupLink.style.display = "none";
    if (dashLink) dashLink.style.display = "inline-flex";
  } else {
    if (loginLink) loginLink.style.display = "inline-flex";
    if (signupLink) signupLink.style.display = "inline-flex";
    if (dashLink) dashLink.style.display = "none";
  }
});
