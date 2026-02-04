console.log("✅ payment.js loaded");
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// UI elements
const emailEl = document.getElementById("payUserEmail");
const planBox = document.getElementById("selectedPlanBox");
const payBtn = document.getElementById("payNowBtn");
const payMsg = document.getElementById("payMsg");
const logoutBtn = document.getElementById("logoutBtn");

// 1) Protect payment page + show user email
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  emailEl.textContent = user.email || "(no email)";
  loadPlan(); // load plan AFTER user is confirmed
});

// 2) Load selected plan from localStorage
function loadPlan() {
  const raw = localStorage.getItem("selectedPlan");

  if (!raw) {
    planBox.innerHTML =
      `<p class="small">No plan selected. Please go back and choose a plan.</p>`;
    return;
  }

  const plan = JSON.parse(raw);

  planBox.innerHTML = `
    <h3>${plan.name}</h3>
    <p class="small"><b>Investment:</b> $${plan.amount}</p>
    <p class="small"><b>Weekly Return:</b> ${plan.percent}%</p>
    <p class="small"><b>Withdrawal:</b> ${plan.withdraw}</p>
  `;
}

// 3) Demo payment
payBtn.addEventListener("click", () => {
  payMsg.textContent = "✅ Demo payment successful.";
});

// 4) Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("login.html");
});
