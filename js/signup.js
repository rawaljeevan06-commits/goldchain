import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile 
       import {
  doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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
    const refCode = (document.getElementById("refCode")?.value || "").trim().toUpperCase();
    const password = document.getElementById("suPass")?.value;

    if (!email || !password) {
      msg.textContent = "Email and password are required.";
      return;
    }

    msg.textContent = "Creating account...";

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(userCred.user, { displayName: name });
      // Create user profile in Firestore
const uid = userCred.user.uid;

// Generate simple referral code for this user
const myReferralCode = ("GC" + uid.slice(0, 8)).toUpperCase();

// Find referrer by referral code (if user entered one)
let referredBy = null;
if (refCode) {
  const q = query(collection(db, "users"), where("referralCode", "==", refCode));
  const qs = await getDocs(q);
  if (!qs.empty) referredBy = qs.docs[0].id;
}

// Save user doc
await setDoc(doc(db, "users", uid), {
  name,
  email,
  phone,
  referralCode: myReferralCode,
  referredBy,              // uid of referrer or null
  referralEarnings: 0,
  totalDeposits: 0,
  referredUsersCount: 0,
  createdAt: serverTimestamp()
});

// If referred, increase referrer count
if (referredBy) {
  await updateDoc(doc(db, "users", referredBy), {
    referredUsersCount: increment(1)
  });
}

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
