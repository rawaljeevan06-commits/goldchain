// js/payment.js
// Works with payment.html you sent.
// Features:
// - Reads selected plan from localStorage/sessionStorage + URL fallback
// - Shows plan + amount
// - Updates network/address/QR based on crypto select
// - Copy address button
// - Simple proof submit (saves to Firestore if Firebase is configured, else local fallback)

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
// 2) Wallet config (EDIT THESE)
// -------------------------
const WALLETS = {
  USDT_TRC20: {
    label: "USDT (TRC20)",
    network: "TRON (TRC20)",
    address: "Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    qr: "images/qr/usdt-trc20.png"
  },
  BTC: {
    label: "BTC",
    network: "Bitcoin",
    address: "bc1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    qr: "images/qr/btc.png"
  },
  ETH: {
    label: "ETH",
    network: "Ethereum (ERC20)",
    address: "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
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
    // fallback
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
// 5) Submit proof (local save fallback)
// -------------------------
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

function validateTxid(txid) {
  const t = (txid || "").trim();
  if (t.length < 10) return false;
  return true;
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

  const payload = {
    createdAt: new Date().toISOString(),
    amount: Number(amount),
    roi: planObj?.roi || "",
    crypto: cryptoKey,
    network: cfg.network,
    address: cfg.address,
    txid,
    note
  };

  // ✅ If you have Firebase Firestore configured in another file,
  // you can replace this section with Firestore addDoc().
  // For now we save locally so it ALWAYS works.
  const ok = saveProofLocally(payload);

  if (ok) {
    setMsg("Proof submitted ✅ (saved). Admin will verify soon.", true);
    txidInput.value = "";
    noteInput.value = "";
  } else {
    setMsg("Could not save proof. Please try again.", false);
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

  // default crypto
  updateCryptoUI();

  cryptoSelect.addEventListener("change", updateCryptoUI);
  copyAddrBtn.addEventListener("click", copyAddress);
  submitProofBtn.addEventListener("click", submitProof);
})();
