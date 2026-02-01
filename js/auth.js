import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ✅ 1) PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI elements
const welcomeText = document.getElementById("welcomeText");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Protect dashboard
function protectDashboard(user) {
  if (location.pathname.endsWith("dashboard.html") && !user) {
    window.location.href = "login.html";
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (welcomeText) welcomeText.textContent = `Welcome, ${user.displayName || user.email}`;
    if (signupBtn) signupBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";

    const emailEl = document.getElementById("userEmail");
    if (emailEl) emailEl.textContent = user.email;

  } else {
    if (welcomeText) welcomeText.textContent = "Welcome to GoldChain";
    if (signupBtn) signupBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }

  protectDashboard(user);
});

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}

// Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: fullName });

      // store basic user record
      await setDoc(doc(db, "users", cred.user.uid), {
        fullName,
        email,
        createdAt: Date.now()
      });

      if (msg) msg.textContent = "Account created! Redirecting...";
      window.location.href = "dashboard.html";
    } catch (err) {
      if (msg) msg.textContent = err.message;
    }
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (msg) msg.textContent = "Login successful! Redirecting...";
      window.location.href = "dashboard.html";
    } catch (err) {
      if (msg) msg.textContent = err.message;
    }
  });
}
