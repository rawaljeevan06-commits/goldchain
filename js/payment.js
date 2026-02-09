// js/payment.js (MODULE)

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ---------- Helpers ----------
function loadPlanSafely() {
  let raw = null;
  try { raw = localStorage.getItem("selectedPlan"); } catch (e) {}
  if (!raw) {
    try { raw = sessionStorage.getItem("selectedPlan"); } catch (e) {}
  }
  return raw;
}

function makeQrUrl(text) {
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}`;
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "-1000px";
  ta.style.left = "-1000px";
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, ta.value.length);

  let ok = false;
  try { ok = document.execCommand("copy"); } catch (e) { ok = false; }

  document.body.removeChild(ta);
  return ok;
}

// ✅ PUT YOUR REAL WALLET ADDRESSES HERE
const WALLETS = {
  USDT_TRC20: {
    label: "USDT (TRC20)",
    networkText: "Network: TRON (TRC20) — send USDT on TRC20 only",
    address: "TCqayESg8BwzJGFtSydc84NSvxkGHhtyz8"
  },
  BTC: {
    label: "Bitcoin (BTC)",
    networkText: "Network: Bitcoin (BTC)",
    address: "13sU6KbrP8x3G4T8STs7ESeqSxM1VF3EyZ"
  },
  ETH: {
    label: "Ethereum (ETH)",
    networkText: "Network: Ethereum (ERC20)",
    address: "0x1a803ebbc60b6bbc70dfcbb60cf60099d96717e9"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Elements ----------
  const selectedPlanText = document.getElementById("selectedPlanText");
  const payAmount = document.getElementById("payAmount");
  const payNetwork = document.getElementById("payNetwork");
  const walletAddress = document.getElementById("walletAddress");
  const qrImg = document.getElementById("qrImg");
  const cryptoSelect = document.getElementById("cryptoSelect");
  const copyAddrBtn = document.getElementById("copyAddrBtn");
  const txidInput = document.getElementById("txidInput");
  const noteInput = document.getElementById("noteInput");
  const submitProofBtn = document.getElementById("submitProofBtn");
  const payMsg = document.getElementById("payMsg");

  // ---------- Auth protect (FIXED) ----------
  let checked = false;

  onAuthStateChanged(auth, (user) => {
    if (checked) return;
    checked = true;

    if (!user) {
      // Small delay to avoid false logout on page load (Safari/iOS fix)
      setTimeout(() => {
        const u = auth.currentUser;
        if (!u) window.location.replace("login.html");
      }, 800);
    }
  });

  // ---------- Load plan ----------
  const raw = loadPlanSafely();
  if (!raw) {
    alert("No plan selected. Please choose a plan first.");
    window.location.href = "plans.html";
    return;
  }

  let plan = null;
  try { plan = JSON.parse(raw); } catch (e) {}

  if (!plan || !plan.name || !plan.amount) {
    alert("Selected plan data is invalid. Please reselect your plan.");
    window.location.href = "plans.html";
    return;
  }

  selectedPlanText.textContent = `Selected plan: ${plan.name}`;
  payAmount.textContent = `$${plan.amount} USD`;

  // ---------- Render crypto ----------
  function renderCrypto(key) {
    const cfg = WALLETS[key];
    if (!cfg || !cfg.address || cfg.address.includes("PASTE_")) {
      payNetwork.textContent = "Wallet not set yet. Add your address in js/payment.js";
      walletAddress.textContent = "—";
      qrImg.src = "";
      return;
    }

    payNetwork.textContent = cfg.networkText;
    walletAddress.textContent = cfg.address;

    const qrText = `${cfg.label}\nAddress: ${cfg.address}\nAmount: $${plan.amount} USD\nPlan: ${plan.name}`;
    qrImg.src = makeQrUrl(qrText);
  }

  renderCrypto(cryptoSelect.value);

  cryptoSelect.addEventListener("change", () => {
    renderCrypto(cryptoSelect.value);
    payMsg.textContent = "";
  });

  // ---------- Copy address (Safari-safe) ----------
  copyAddrBtn.addEventListener("click", async () => {
    const addr = walletAddress.textContent.trim();
    if (!addr || addr === "—") {
      payMsg.textContent = "❌ No address to copy.";
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(addr);
        payMsg.textContent = "✅ Address copied.";
        return;
      }
    } catch (e) {}

    const ok = fallbackCopy(addr);
    payMsg.textContent = ok ? "✅ Address copied." : "❌ Copy blocked. Please copy manually.";
  });

  // ---------- Submit proof ----------
  submitProofBtn.addEventListener("click", async () => {
    // Safari: permission request must happen inside user click
    if ("Notification" in window && Notification.permission === "default") {
      try { await Notification.requestPermission(); } catch (e) {}
    }

    const user = auth.currentUser;
    if (!user) {
      alert("Please login again.");
      window.location.replace("login.html");
      return;
    }

    const method = cryptoSelect.value;
    const cfg = WALLETS[method];
    const txid = (txidInput.value || "").trim();
    const note = (noteInput.value || "").trim();

    if (!cfg || !cfg.address || cfg.address.includes("PASTE_")) {
      payMsg.textContent = "❌ Wallet address not set yet. Add it in js/payment.js first.";
      return;
    }

    if (!txid || txid.length < 10) {
      payMsg.textContent = "❌ Please paste a valid TXID / transaction hash.";
      return;
    }

    // Lock button to avoid double clicks
    submitProofBtn.disabled = true;
    submitProofBtn.textContent = "Processing...";

    // ✅ Local storage (same device)
    const localProof = {
      uid: user.uid,
      email: user.email || "",
      planName: plan.name,
      amount: Number(plan.amount),
      method,
      address: cfg.address,
      txid,
      note,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    try { localStorage.setItem("paymentProof", JSON.stringify(localProof)); } catch (e) {}

    // ✅ Firestore (works on other devices)
    payMsg.textContent = "⏳ Saving payment proof...";

    try {
      await addDoc(collection(db, "payments"), {
        ...localProof,
        createdAt: serverTimestamp()
      });

      payMsg.textContent = "✅ Proof saved. Status: Pending verification.";

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Payment Submitted ✅", {
          body: "We received your TXID. Status is Pending verification.",
          icon: "images/logo.png"
        });
      }
    } catch (err) {
      console.error(err);
      payMsg.textContent = "❌ Failed to save to database. Check Firestore rules or internet.";
      submitProofBtn.disabled = false; // allow retry
      submitProofBtn.textContent = "Submit Proof";
      return;
    }

    // Keep disabled after success
    submitProofBtn.textContent = "Saved ✅";
  });
});
