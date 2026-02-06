import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  doc, getDoc,
  collection, query, where, getDocs, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

function money(n) {
  return Number(n || 0).toFixed(2);
}

function formatTime(ts) {
  try {
    if (!ts) return "-";
    if (typeof ts.toDate === "function") return ts.toDate().toLocaleString();
    return new Date(ts).toLocaleString();
  } catch {
    return "-";
  }
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
        html += `
          <div style="padding:6px 0; border-bottom:1px solid rgba(255,255,255,.08);">
            • ${u.email || "user"}
            <br>
            <small>Plan: $${u.plan || "-"}</small>
          </div>
        `;
      });
      joinedList.innerHTML = html;
    }

    // -----------------------
    // Commission history (NOW SHOWS LEVEL)
    // -----------------------
    const qCom = query(
      collection(db, "referral_commissions"),
      where("refUid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const comSnap = await getDocs(qCom);

    if (comSnap.empty) {
      commissionList.innerHTML = "No commissions yet.";
    } else {
      let html = "";
      comSnap.forEach(d => {
        const c = d.data();

        const level = c.level || 1;
        const percent = (Number(c.rate || 0) * 100).toFixed(2);

        html += `
          <div style="padding:8px 0; border-bottom:1px solid rgba(255,255,255,.08);">
            <b>+$${money(c.commission)}</b>
            <br>
            <small>
              Level ${level} • ${percent}%  
              <br>
              Deposit: $${money(c.depositAmount)}  
              <br>
              ${formatTime(c.createdAt)}
            </small>
          </div>
        `;
      });
      commissionList.innerHTML = html;
    }

  });

});
