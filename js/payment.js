// js/payment.js
// Payment proof submission -> Firestore (so Admin & Dashboard can see it)
// If Firestore not available, fallback to localStorage

import { db, auth } from "./firebase.js"; 
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const selectedPlanText = document.getElementById("selectedPlanText");
const payMsg = document.getElementById("payMsg");

const cryptoSelect = document.getElementById("cryptoSelect");
const payNetwork = document.getElementById("payNetwork");
const walletAddress = document.getElementById("walletAddress");
const payAmount = document.getElementById("payAmount");
const qrImg = document.getElementById("qrImg");

const copyAddrBtn = document.getElementById("copyAddrBtn");
const txidInput = document.getElementById("txidInput");
const noteInput = document.getElementById("noteInput");
const submitProofBtn = document.getElementById("submitProofBtn");

// -------------------------
// 1) Load selected plan safely
// -------------------------
function loadSelectedPlan() {
  let raw = null;

  try { raw = localStorage.getItem("selectedPlan"); } catch (e) {}
  if (!raw) {
    try { raw = sessionStorage.getItem("selectedPlan"); } catch (e) {}
  }

  // URL fallback: payment.html?plan=700&roi=16
  if (!raw) {
    const url = new URL(window.location.href);
    const plan = url.searchParams.get("plan");
    const roi = url.searchParams.get("roi");
    if (plan) {
      raw = JSON.stringify({ amount: Number(plan), roi: roi ? String(roi) : "" });
    }
  }

  if (!raw) return null;

  try {
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : null;
  } catch (e) {
    return null;
  }
}

// -------------------------
// 2) Wallet config
// -------------------------
const WALLETS = {
  USDT_TRC20: {
    label: "USDT (TRC20)",
    network: "TRON (TRC20)",
    address: "TCqayESg8BwzJGFtSydc84NSvxkGHhtyz8",
    qr: "images/qr/usdt-trc20.png"
  },
  BTC: {
    label: "BTC",
    network: "Bitcoin",
    address: "13sU6KbrP8x3G4T8STs7ESeqSxM1VF3EyZ",
    qr: "images/qr/btc.png"
  },
  ETH: {
    label: "ETH",
    network: "Ethereum (ERC20)",
    address: "0x1a803ebbc60b6bbc70dfcbb60cf60099d96717e9",
    qr: "images/qr/eth.png"
  }
};

// -------------------------
// 3) UI helpers
// -------------------------
function setMsg(text, ok = true) {
  if (!payMsg) return;
  payMsg.textContent = text;
  payMsg.style.color = ok ? "#9ef0b8" : "#ff9aa2";
}

function formatMoney(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return `$${num.toLocaleString()}`;
}

function updateCryptoUI() {
  const key = cryptoSelect.value;
  const cfg = WALLETS[key];

  if (!cfg) {
    payNetwork.textContent = "—";
    walletAddress.textContent = "—";
    qrImg.removeAttribute("src");
    return;
  }

  payNetwork.textContent = cfg.network;
  walletAddress.textContent = cfg.address;
  qrImg.src = cfg.qr;
}

// -------------------------
// 4) Copy address
// -------------------------
async function copyAddress() {
  const addr = walletAddress.textContent.trim();
  if (!addr || addr === "—") {
    setMsg("Wallet address not available.", false);
    return;
  }

  try {
    await navigator.clipboard.writeText(addr);
    setMsg("Address copied ✅", true);
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = addr;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    setMsg("Address copied ✅", true);
  }
}

// -------------------------
// 5) Submit proof
// -------------------------
function validateTxid(txid) {
  const t = (txid || "").trim();
  return t.length >= 10;
}

// local fallback (only if Firestore fails)
function saveProofLocally(payload) {
  try {
    const key = "paymentProofs";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.unshift(payload);
    localStorage.setItem(key, JSON.stringify(existing));
    return true;
  } catch (e) {
    return false;
  }
}

async function submitProof() {
  const planObj = loadSelectedPlan();
  const amount = planObj?.amount ?? null;

  const cryptoKey = cryptoSelect.value;
  const cfg = WALLETS[cryptoKey];

  const txid = txidInput.value.trim();
  const note = noteInput.value.trim();

  if (!amount) {
    setMsg("Plan not found. Please select a plan again from Dashboard.", false);
    return;
  }
  if (!validateTxid(txid)) {
    setMsg("Please enter a valid TXID / Transaction Hash.", false);
    return;
  }
  if (!cfg) {
    setMsg("Please choose a crypto option.", false);
    return;
  }

  submitProofBtn.disabled = true;
  submitProofBtn.textContent = "Submitting...";

  const user = auth?.currentUser || null;

  const payload = {
    amount: Number(amount),
    roi: planObj?.roi || "",
    method: cryptoKey,
    network: cfg.network,
    address: cfg.address,
    txid,
    note: note || "",
    status: "pending",
    uid: user?.uid || null,
    email: user?.email || null,
    createdAtISO: new Date().toISOString()
  };

  try {
    // ✅ Write to Firestore
    await addDoc(collection(db, "payments"), {
      ...payload,
      createdAt: serverTimestamp()
    });

    setMsg("Proof submitted ✅ Now waiting for admin approval.", true);
    txidInput.value = "";
    noteInput.value = "";
  } catch (err) {
    console.error("Firestore submit failed:", err);

    // fallback local
    const ok = saveProofLocally(payload);
    if (ok) {
      setMsg("Saved locally ✅ (Firebase issue). Admin won't see this until Firebase works.", false);
    } else {
      setMsg("Could not submit proof. Please try again.", false);
    }
  }

  submitProofBtn.disabled = false;
  submitProofBtn.textContent = "Submit Proof";
}

// -------------------------
// 6) Init page
// -------------------------
(function init() {
  const planObj = loadSelectedPlan();

  if (!planObj || !planObj.amount) {
    selectedPlanText.textContent = "No plan selected. Go back to Dashboard and select a plan.";
    payAmount.textContent = "—";
    setMsg("Plan not found. Please select again.", false);
  } else {
    const roiText = planObj.roi ? ` • ${planObj.roi}%` : "";
    selectedPlanText.textContent = `Selected Plan: ${formatMoney(planObj.amount)}${roiText}`;
    payAmount.textContent = formatMoney(planObj.amount);
  }

  updateCryptoUI();
  cryptoSelect.addEventListener("change", updateCryptoUI);
  copyAddrBtn.addEventListener("click", copyAddress);
  submitProofBtn.addEventListener("click", submitProof);
})();
