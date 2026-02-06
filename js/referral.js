// js/referral.js
import { db } from "./firebase.js";
import {
  doc, setDoc, getDoc, collection, query, where, getDocs,
  addDoc, serverTimestamp, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Simple referral code generator (unique enough for small projects)
export function makeReferralCode(uid) {
  return ("GC" + uid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)).toUpperCase();
}

export async function createUserProfile(uid, email, referredCode = "") {
  // If already exists, do nothing
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) return;

  const myCode = makeReferralCode(uid);

  let referredByUid = null;

  // If user entered a referral code, find who owns it
  if (referredCode && referredCode.trim()) {
    const code = referredCode.trim().toUpperCase();
    const q = query(collection(db, "users"), where("referralCode", "==", code));
    const qs = await getDocs(q);
    if (!qs.empty) {
      referredByUid = qs.docs[0].id; // referrer UID is the doc ID
    }
  }

  await setDoc(userRef, {
    email,
    referralCode: myCode,
    referredBy: referredByUid,      // uid of referrer or null
    createdAt: serverTimestamp(),
    totalDeposits: 0,
    referralEarnings: 0,
    referredUsersCount: 0
  });

  // Increase referrer stats if there is a referrer
  if (referredByUid) {
    await updateDoc(doc(db, "users", referredByUid), {
      referredUsersCount: increment(1)
    });
  }
}

// Call this AFTER a deposit is confirmed
export async function recordDepositAndPayReferral(uid, amount) {
  const amt = Number(amount);
  if (!amt || amt <= 0) return;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const userData = userSnap.data();

  // 1) save deposit record
  await addDoc(collection(db, "deposits"), {
    uid,
    amount: amt,
    createdAt: serverTimestamp()
  });

  // 2) update user's total deposits
  await updateDoc(userRef, {
    totalDeposits: increment(amt)
  });

  // 3) referral commission (only if user was referred)
  const refUid = userData.referredBy;
  if (!refUid) return;

  // Minimum deposit condition
  const MIN_DEPOSIT = 350; // change this if your minimum is different
  if (amt < MIN_DEPOSIT) return;

  // Commission rules:
  // - 7% if >= 5000
  // - 1% otherwise
  const commissionRate = (amt >= 5000) ? 0.07 : 0.01;
  const commission = amt * commissionRate;

  await addDoc(collection(db, "referral_commissions"), {
    refUid,
    fromUid: uid,
    depositAmount: amt,
    rate: commissionRate,
    commission,
    createdAt: serverTimestamp()
  });

  await updateDoc(doc(db, "users", refUid), {
    referralEarnings: increment(commission)
  });
}
