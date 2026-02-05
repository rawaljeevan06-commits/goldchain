import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

console.log("✅ payment.js loaded");

const PLAN_KEY = "selectedPlan";

function getSelectedPlan() {
  const raw =
    sessionStorage.getItem(PLAN_KEY) ||
    localStorage.getItem(PLAN_KEY);

  if (!raw) return null;

  try { return JSON.parse(raw); } catch (e) { return raw; }
}

document.addEventListener("DOMContentLoaded", () => {
  const emailEl = document.getElementById("payUserEmail");
  const planBox = document.getElementById("selectedPlanBox");
  const payBtn = document.getElementById("payDemoBtn");
  const payMsg = document.getElementById("payMsg");

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.replace("login.html");
      return;
    }

    emailEl.textContent = user.email || "(no email)";

    const plan = getSelectedPlan();
    if (!plan) {
      planBox.innerHTML = `No plan selected. <a href="plans.html">Choose a plan</a>`;
      if (payBtn) payBtn.disabled = true;
      return;
    }

    if (typeof plan === "string") {
      planBox.textContent = plan;
    } else {
      planBox.innerHTML = `
        <b>${plan.name}</b><br>
        Investment: $${plan.amount}<br>
        Weekly Return: ${plan.percent}%<br>
        Withdrawal: ${plan.withdraw}
      `;
    }
  });

  if (payBtn) {
    payBtn.addEventListener("click", () => {
      payMsg.textContent = "✅ Demo payment successful.";
    });
  }
});
