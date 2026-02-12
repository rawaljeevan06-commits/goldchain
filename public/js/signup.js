// js/signup.js
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Make a short referral code for the user
function makeReferralCode(uid) {
  return ("GC" + String(uid).slice(0, 8)).toUpperCase();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const msgEl = document.getElementById("signupMsg");

  if (!form) return;

  // ✅ If already logged in, logout so signup always creates new account
  onAuthStateChanged(auth, async (u) => {
    try {
      if (u) await signOut(auth);
    } catch (e) {}
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msgEl) msgEl.textContent = "Creating account...";

    const name = (document.getElementById("suName")?.value || "").trim();
    const email = (document.getElementById("suEmail")?.value || "").trim();
    const phone = (document.getElementById("suPhone")?.value || "").trim();
    const plan = (document.getElementById("suPlan")?.value || "").trim();
    const pass = document.getElementById("suPass")?.value || "";

    const refCodeInput = (document.getElementById("refCode")?.value || "")
      .trim()
      .toUpperCase();

    if (!name || !email || !plan || !pass) {
      if (msgEl) msgEl.textContent = "Please fill all required fields.";
      return;
    }

    try {
      // ✅ Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);

      // ✅ Update display name
      await updateProfile(userCred.user, { displayName: name });

      const uid = userCred.user.uid;
      const myReferralCode = makeReferralCode(uid);

      // ✅ Referral lookup (2 levels)
      let referredByUid = null;   // Level 1 referrer UID
      let referredByUid2 = null;  // Level 2 referrer UID

      if (refCodeInput) {
        const qRef = query(
          collection(db, "users"),
          where("referralCode", "==", refCodeInput)
        );
        const refSnap = await getDocs(qRef);

        if (!refSnap.empty) {
          const refDoc = refSnap.docs[0];
          referredByUid = refDoc.id;

          const refData = refDoc.data();
          // If referrer himself was referred by someone, that's level 2
          if (refData?.referredByUid) {
            referredByUid2 = refData.referredByUid;
          }
        }
      }

      // ✅ Create user profile in Firestore
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        phone: phone || "",
        plan, // store plan amount string like "350", "700"
        balance: 0,
        paymentVerified: false,

        referralCode: myReferralCode,
        referralEarnings: 0,

        // ✅ referral links
        referredByUid: referredByUid || null,
        referredByUid2: referredByUid2 || null,

        createdAt: serverTimestamp()
      });

      if (msgEl) msgEl.textContent = "✅ Account created! Redirecting...";

      // Go dashboard
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error(err);
      if (msgEl) msgEl.textContent = "❌ " + (err?.message || "Signup failed");
    }
  });
});
