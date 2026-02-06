import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  doc, setDoc, serverTimestamp,
  collection, query, where, getDocs,
  updateDoc, increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ signup.js loaded");

  const form = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");

  if (!form) {
    console.log("❌ signupForm not found");
    return;
  }

  // IMPORTANT: If already logged in, logout so new signup can happen
  try {
    if (auth.currentUser) {
      await signOut(auth);
      console.log("✅ Logged out existing user for signup");
    }
  } catch (e) {
    console.log("Logout ignore:", e?.message);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      if (msg) msg.textContent = "Creating account...";

      const name = document.getElementById("suName")?.value.trim() || "";
      const email = document.getElementById("suEmail")?.value.trim() || "";
      const phone = document.getElementById("suPhone")?.value.trim() || "";
      const plan = document.getElementById("suPlan")?.value || "";
      const password = document.getElementById("suPass")?.value || "";
      const refCode = (document.getElementById("refCode")?.value || "").trim().toUpperCase();

      if (!email || !password) {
        if (msg) msg.textContent = "Email and password are required.";
        return;
      }
      if (!plan) {
        if (msg) msg.textContent = "Please select a plan.";
        return;
      }

      // 1) Create Firebase Auth user
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // 2) Update display name
      if (name) await updateProfile(userCred.user, { displayName: name });

      const uid = userCred.user.uid;

      // 3) Generate referral code for THIS user
      const myReferralCode = ("GC" + uid.slice(0, 8)).toUpperCase();

      // 4) Find referrer UID if referral code entered
      let referredBy = null;
      if (refCode) {
        const q = query(collection(db, "users"), where("referralCode", "==", refCode));
        const qs = await getDocs(q);
        if (!qs.empty) referredBy = qs.docs[0].id;
      }

      // 5) Save user profile in Firestore
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        phone,
        plan,
        balance: 0,
        referralCode: myReferralCode,
        referredBy,
        referralEarnings: 0,
        totalDeposits: 0,
        referredUsersCount: 0,
        createdAt: serverTimestamp()
      });

      // 6) If referred, increase referrer count
      if (referredBy) {
        await updateDoc(doc(db, "users", referredBy), {
          referredUsersCount: increment(1)
        });
      }

      if (msg) msg.textContent = "✅ Account created!";
      console.log("✅ Signup success:", uid);

      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("❌ Signup error:", err);
      if (msg) msg.textContent = err?.message || "Signup failed.";
      else alert(err?.message || "Signup failed.");
    }
  });
});
