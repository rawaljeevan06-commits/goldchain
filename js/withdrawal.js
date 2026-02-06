import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  collection, query, where, orderBy, limit, getDocs,
  addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const statusMsg = document.getElementById("statusMsg");
const withdrawForm = document.getElementById("withdrawForm");
const logoutBtn = document.getElementById("logoutBtn");

function planWithdrawDays(planName = "") {
  const p = planName.toLowerCase();
  if (p.includes("basic") || p.includes("350")) return 45;
  if (p.includes("growth") || p.includes("700")) return 30;
  if (p.includes("pro") || p.includes("1000")) return 15;
  if (p.includes("vip") || p.includes("5000") || p.includes("above")) return 7;
  return 45;
}

function toDateSafe(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();
  const d = new Date(ts);
  return isNaN(d.getTime()) ? null : d;
}

function daysBetween(a, b) {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

logoutBtn.addEventListener("click", async () => {
  try { await signOut(auth); } catch(e) {}
  window.location.replace("login.html");
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  statusMsg.textContent = "Checking payment status…";

  try {
    // Get the latest payment for this user
    const q = query(
      collection(db, "payments"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      statusMsg.textContent = "❌ No payment found. Please complete payment first.";
      return;
    }

    const pay = snap.docs[0].data();
    const st = (pay.status || "").toLowerCase();

    if (st !== "verified") {
      statusMsg.textContent = "⏳ Payment not verified yet. Please wait for admin verification.";
      return;
    }

    const planName = pay.planName || "";
    const createdAt = toDateSafe(pay.createdAt) || new Date();
    const days = Math.max(0, daysBetween(createdAt, new Date()));
    const needDays = planWithdrawDays(planName);
    const remaining = Math.max(0, needDays - days);

    if (remaining > 0) {
      statusMsg.textContent = `✅ Verified, but withdrawal locked for ${remaining} more day(s) (plan rule).`;
      return;
    }

    statusMsg.textContent = "✅ Verified + Eligible. You can request a withdrawal now.";
    withdrawForm.style.display = "";

    withdrawForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const wallet = document.getElementById("wallet").value.trim();
      const amount = Number(document.getElementById("amount").value);
      const note = document.getElementById("note").value.trim();

      if (!wallet || !amount || amount <= 0) {
        statusMsg.textContent = "❌ Please fill wallet and a valid amount.";
        return;
      }

      statusMsg.textContent = "Submitting request…";

      await addDoc(collection(db, "withdrawals"), {
        uid: user.uid,
        email: user.email || "",
        wallet,
        amount,
        note,
        planName: planName || "",
        status: "pending",
        createdAt: serverTimestamp()
      });

      statusMsg.textContent = "✅ Withdrawal request submitted (pending).";
      withdrawForm.reset();
    });

  } catch (e) {
    console.error(e);
    statusMsg.textContent = "❌ Error checking payment/eligibility. (Check rules + index).";
  }
});
