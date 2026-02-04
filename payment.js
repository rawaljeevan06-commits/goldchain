import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// UI elements
const emailEl = document.getElementById("payUserEmail");
const planBox = document.getElementById("selectedPlanBox");
const payBtn = document.getElementById("payNowBtn");
const payMsg = document.getElementById("payMsg");
const logoutBtn = document.getElementById("logoutBtn");

// 1) Protect payment page (must be logged in)
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }
  emailEl.textContent = user.email || "(no email)";
});

// 2) Load selected plan (from localStorage)
function renderPlan() {
  // You can store this from plans page later:
  // localStorage.setItem("selectedPlan", JSON.stringify({ name, amount, percent, withdraw }))
  const raw = localStorage.getItem("selectedPlan");

  if (!raw) {
    planBox.innerHTML = `<p class="small">No plan selected yet. Please choose a plan first.</p>`;
    return;
  }

  try {
    const plan = JSON.parse(raw);
    planBox.innerHTML = `
      <h3>${plan.name || "Selected Plan"}</h3>
      <p class="small"><b>Amount:</b> $${plan.amount || "-"}</p>
      <p class="small"><b>Return:</b> ${plan.percent || "-"}% weekly</p>
      <p class="small"><b>Withdraw:</b> ${plan.withdraw || "-"}</p>
    `;
  } catch (e) {
    planBox.innerHTML = `<p class="small">Plan data is corrupted. Please select your plan again.</p>`;
  }
}
renderPlan();

// 3) Demo payment button
payBtn.addEventListener("click", () => {
  payMsg.textContent = "✅ Demo payment successful. (Real gateway can be added.)";
});

// 4) Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("login.html");
});
