// public/js/withdrawal.js
import { db, auth } from "./firebase.js?v=6";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/* ---------- UI elements (from withdrawal.html) ---------- */
const backBtn     = document.getElementById("backBtn");
const logoutBtn   = document.getElementById("logoutBtn");
const userEmailEl = document.getElementById("userEmail");

const statusText  = document.getElementById("statusText");
const planText    = document.getElementById("planText");
const profitText  = document.getElementById("profitText");
const availableEl = document.getElementById("availableText");
const lockInfo    = document.getElementById("lockInfo");

const walletInput = document.getElementById("wallet");
const amountInput = document.getElementById("amount");
const noteInput   = document.getElementById("note");
const submitBtn   = document.getElementById("submitBtn");
const msgEl       = document.getElementById("msg");

function money(n) {
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseRoiPercent(roi) {
  // roi examples: "16%", "18% monthly", 16, "16"
  if (roi === null || roi === undefined) return 0;
  const s = String(roi).trim();
  const m = s.match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}

function daysBetweenMs(msFuture) {
  const now = Date.now();
  return Math.ceil((msFuture - now) / (24 * 60 * 60 * 1000));
}

function setMsg(text, ok = true) {
  if (!msgEl) return;
  msgEl.textContent = text;
  msgEl.style.color = ok ? "#35ff9b" : "#ff6b6b";
}

/* ---------- CORE: read verified payments per user ---------- */
async function loadVerifiedPayments(uid) {
  // payments are created by payment.js into collection "payments"
  // with fields: uid, status, amount, roi, lockDays, createdAtMs, lockUntilMs
  const paymentsRef = collection(db, "payments");
  const q = query(
    paymentsRef,
    where("uid", "==", uid),
    where("status", "==", "verified"),
    orderBy("createdAtMs", "desc"),
    limit(50)
  );

  const snap = await getDocs(q);
  const arr = [];
  snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
  return arr;
}

function computeWithdrawable(payments) {
  const now = Date.now();

  const unlocked = [];
  const locked = [];

  for (const p of payments) {
    const amount = Number(p.amount || 0);
    const roiPct = parseRoiPercent(p.roi);
    const lockUntilMs =
      (typeof p.lockUntilMs === "number" && p.lockUntilMs) ?
        p.lockUntilMs :
        (Number(p.createdAtMs || 0) + Number(p.lockDays || 0) * 24 * 60 * 60 * 1000);

    const profit = amount * (roiPct / 100);

    const item = {
      id: p.id,
      amount,
      roiPct,
      profit,
      lockUntilMs,
      createdAtMs: Number(p.createdAtMs || 0),
      txid: p.txid || p.txidInput || "",
      method: p.method || ""
    };

    if (now >= lockUntilMs) unlocked.push(item);
    else locked.push(item);
  }

  // totals
  const unlockedPrincipal = unlocked.reduce((s, x) => s + x.amount, 0);
  const unlockedProfit    = unlocked.reduce((s, x) => s + x.profit, 0);

  // next unlock info
  const nextUnlock = locked
    .map(x => x.lockUntilMs)
    .filter(Boolean)
    .sort((a, b) => a - b)[0] || null;

  return { unlocked, locked, unlockedPrincipal, unlockedProfit, nextUnlock };
}

/* ---------- submit withdraw request ---------- */
async function submitWithdrawal(user, maxWithdrawable) {
  const wallet = (walletInput?.value || "").trim();
  const amount = Number(amountInput?.value || 0);
  const note   = (noteInput?.value || "").trim();

  if (!wallet) return setMsg("Enter wallet address.", false);
  if (!amount || amount <= 0) return setMsg("Enter withdrawal amount.", false);

  if (amount > maxWithdrawable) {
    return setMsg(`Amount exceeds withdrawable balance ($${money(maxWithdrawable)}).`, false);
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    await addDoc(collection(db, "withdrawals"), {
      uid: user.uid,
      email: user.email || null,
      amount: amount,
      wallet: wallet,
      note: note,
      status: "pending",
      createdAtMs: Date.now(),
      createdAtISO: new Date().toISOString(),
      createdAt: serverTimestamp()
    });

    setMsg("Withdrawal request submitted ✅ Waiting for admin approval.", true);
    amountInput.value = "";
    noteInput.value = "";
  } catch (e) {
    console.error(e);
    setMsg("Failed to submit withdrawal. Try again.", false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit request";
  }
}

/* ---------- wiring ---------- */
if (backBtn) backBtn.addEventListener("click", () => history.back());

// If you already handle logout elsewhere, keep it. If not, just reload.
if (logoutBtn) logoutBtn.addEventListener("click", async () => {
  try { await auth.signOut(); } catch {}
  location.href = "login.html";
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    if (userEmailEl) userEmailEl.textContent = "";
    if (statusText) statusText.textContent = "Please login first.";
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  if (userEmailEl) userEmailEl.textContent = user.email || user.uid;

  // UI defaults
  if (statusText) statusText.textContent = "Loading your verified deposits...";
  if (planText) planText.textContent = "-";
  if (profitText) profitText.textContent = "-";
  if (availableEl) availableEl.textContent = "$0.00";
  if (lockInfo) lockInfo.textContent = "";
  setMsg("");

  try {
    const payments = await loadVerifiedPayments(user.uid);

    if (!payments.length) {
      if (statusText) statusText.textContent = "No verified deposits yet.";
      if (submitBtn) submitBtn.disabled = true;
      return;
    }

    const { unlocked, locked, unlockedPrincipal, unlockedProfit, nextUnlock } =
      computeWithdrawable(payments);

    const withdrawableTotal = unlockedPrincipal + unlockedProfit;

    // Show summary
    if (statusText) {
      statusText.textContent = unlocked.length
        ? "✅ Verified — You can request withdrawal"
        : "⏳ Verified — But all deposits are still locked";
    }

    if (planText) {
      // show unlocked deposits list
      const unlockedStr = unlocked.length
        ? unlocked.map(x => `$${money(x.amount)} (${x.roiPct}%)`).join(" + ")
        : "None unlocked yet";
      planText.textContent = unlockedStr;
    }

    if (profitText) {
      profitText.textContent = `$${money(unlockedProfit)} (profit unlocked)`;
    }

    if (availableEl) {
      availableEl.textContent = `$${money(withdrawableTotal)}`;
    }

    // Lock info
    if (lockInfo) {
      if (!unlocked.length && nextUnlock) {
        lockInfo.textContent =
          `Withdrawal locked. Next unlock in ${daysBetweenMs(nextUnlock)} day(s).`;
      } else if (locked.length && nextUnlock) {
        lockInfo.textContent =
          `Some deposits still locked. Next unlock in ${daysBetweenMs(nextUnlock)} day(s).`;
      } else {
        lockInfo.textContent = "";
      }
    }

    // Enable submit only if something is withdrawable
    if (submitBtn) submitBtn.disabled = withdrawableTotal <= 0;

    // Submit handler
    if (submitBtn) {
      submitBtn.onclick = () => submitWithdrawal(user, withdrawableTotal);
    }
  } catch (e) {
    console.error(e);
    if (statusText) statusText.textContent = "Error loading deposits.";
    if (submitBtn) submitBtn.disabled = true;
    setMsg("Could not load deposits. Check console / Firebase rules.", false);
  }
});