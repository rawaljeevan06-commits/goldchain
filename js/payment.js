// js/payment.js

function loadPlanSafely() {
  let raw = null;
  try { raw = localStorage.getItem("selectedPlan"); } catch (e) {}
  if (!raw) {
    try { raw = sessionStorage.getItem("selectedPlan"); } catch (e) {}
  }
  return raw;
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

function makeQrUrl(text) {
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}`;
}

document.addEventListener("DOMContentLoaded", () => {
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

  const raw = loadPlanSafely();
  if (!raw) {
    alert("No plan selected. Please choose a plan first.");
    window.location.href = "plans.html";
    return;
  }

  let plan;
  try { plan = JSON.parse(raw); } catch (e) { plan = null; }

  if (!plan || !plan.name || !plan.amount) {
    alert("Selected plan data is invalid. Please reselect your plan.");
    window.location.href = "plans.html";
    return;
  }

  selectedPlanText.textContent = `Selected plan: ${plan.name}`;
  payAmount.textContent = `$${plan.amount} USD`;

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

  // Default method
  renderCrypto(cryptoSelect.value);

  cryptoSelect.addEventListener("change", () => {
    renderCrypto(cryptoSelect.value);
    payMsg.textContent = "";
  });

  copyAddrBtn.addEventListener("click", async () => {
    const addr = walletAddress.textContent.trim();
    if (!addr || addr === "—") return;

    try {
      await navigator.clipboard.writeText(addr);
      payMsg.textContent = "✅ Address copied.";
    } catch (e) {
      payMsg.textContent = "Copy failed. Please copy manually.";
    }
  });

  submitProofBtn.addEventListener("click", () => {
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

    const proof = {
      plan,
      method,
      address: cfg.address,
      txid,
      note,
      submittedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem("paymentProof", JSON.stringify(proof));
    } catch (e) {}

    payMsg.textContent = "✅ Proof saved. We’ll verify your payment manually.";
  });
});
