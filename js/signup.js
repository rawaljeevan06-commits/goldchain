import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      msg.textContent = "Creating account...";

      const name = document.getElementById("suName").value.trim();
      const email = document.getElementById("suEmail").value.trim();
      const phone = document.getElementById("suPhone").value.trim();
      const plan = document.getElementById("suPlan").value;
      const password = document.getElementById("suPass").value;
      const refCode = document.getElementById("refCode").value.trim().toUpperCase();

      if (!plan) {
        msg.textContent = "Please select a plan.";
        return;
      }

      // Create auth user
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      if (name) {
        await updateProfile(userCred.user, { displayName: name });
      }

      const uid = userCred.user.uid;

      // Generate referral code
      const myReferralCode = ("GC" + uid.slice(0, 8)).toUpperCase();

      // Save user in Firestore
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        phone,
        plan,
        balance: 0,
        referralCode: myReferralCode,
        referredBy: null,
        referralEarnings: 0,
        totalDeposits: 0,
        referredUsersCount: 0,
        createdAt: serverTimestamp()
      });

      msg.textContent = "✅ Account created successfully!";
      window.location.href = "dashboard.html";

    } catch (err) {
      console.error(err);
      msg.textContent = err.message || "Signup failed.";
    }
  });

});
