import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  doc, getDoc,
  collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

function money(n) {
  return Number(n || 0).toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {

  const myRefCode = document.getElementById("myRefCode");
  const myRefLink = document.getElementById("myRefLink");
  const refEarn = document.getElementById("refEarn");
  const joinedList = document.getElementById("joinedList");
  const commissionList = document.getElementById("commissionList");

  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      window.location.replace("login.html");
      return;
    }

    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) return;

    const data = userSnap.data();
    const code = data.referralCode || "";

    // Referral code + link
    myRefCode.value = code;
    myRefLink.value = `${window.location.origin}/signup.html?ref=${code}`;
    refEarn.textContent = money(data.referralEarnings);

    // -----------------------
    // Joined users
    // -----------------------
    const qJoined = query(
      collection(db, "users"),
      where("referredBy", "==", user.uid)
    );

    const joinedSnap = await getDocs(qJoined);

    if (joinedSnap.empty) {
      joinedList.innerHTML = "No referrals yet.";
    } else {
      let html = "";
      joinedSnap.forEach(d => {
        const u = d.data();
        html += `• ${u.email || "user"} (Plan: $${u.plan || "-"})<br>`;
      });
      joinedList.innerHTML = html;
    }

    // -----------------------
    // Commission history
    // -----------------------
    const qCom = query(
      collection(db, "referral_commissions"),
      where("refUid", "==", user.uid)
    );

    const comSnap = await getDocs(qCom);

    if (comSnap.empty) {
      commissionList.innerHTML = "No commissions yet.";
    } else {
      let html = "";
      comSnap.forEach(d => {
        const c = d.data();
        html += `• +$${money(c.commission)} from $${money(c.depositAmount)} deposit (${(c.rate*100).toFixed(0)}%)<br>`;
      });
      commissionList.innerHTML = html;
    }

  });

});
