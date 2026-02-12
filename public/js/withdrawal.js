// js/withdrawal.js

document.addEventListener("DOMContentLoaded", () => {
  const planData = JSON.parse(localStorage.getItem("activePlan"));

  const statusEl = document.getElementById("withdrawStatus");
  const balanceEl = document.getElementById("availableBalance");

  if (!planData) {
    statusEl.textContent = "No active investment found.";
    return;
  }

  const now = new Date().getTime();
  const startDate = new Date(planData.startDate).getTime();

  if (!startDate || isNaN(startDate)) {
    statusEl.textContent = "Investment date missing.";
    return;
  }

  const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

  let lockDays = 0;
  let availableBalance = 0;

  switch (planData.amount) {
    case 350:
      lockDays = 45;
      availableBalance = daysPassed >= 45 ? 350 : 0;
      break;

    case 700:
      lockDays = 30;
      availableBalance = daysPassed >= 30 ? 700 : 0;
      break;

    case 1000:
      lockDays = 15;
      availableBalance = daysPassed >= 15 ? 1000 : 0;
      break;

    case 5000:
      // PREMIUM PLAN
      const weeklyRate = 0.045; // 4.5% weekly
      const monthlyDays = 30;

      const weeksPassed = Math.floor(daysPassed / 7);
      const weeklyProfit = planData.amount * weeklyRate;

      const totalProfit = weeklyProfit * weeksPassed;

      if (daysPassed >= monthlyDays) {
        // After 30 days → capital + profit available
        availableBalance = planData.amount + (planData.amount * 0.18);
        statusEl.textContent = "Capital + full 18% profit unlocked ✅";
      } else if (daysPassed >= 7) {
        // After 7 days → profit only
        availableBalance = totalProfit;
        statusEl.textContent = "Weekly profit unlocked ✅";
      } else {
        const remaining = 7 - daysPassed;
        statusEl.textContent = `Withdrawal locked. Available after ${remaining} days.`;
        availableBalance = 0;
      }

      balanceEl.textContent = `$${availableBalance.toFixed(2)}`;
      return;

    default:
      statusEl.textContent = "Unknown plan.";
      return;
  }

  const daysRemaining = lockDays - daysPassed;

  if (daysRemaining > 0) {
    statusEl.textContent = `Withdrawal locked. Available after ${daysRemaining} days.`;
  } else {
    statusEl.textContent = "Capital unlocked ✅";
  }

  balanceEl.textContent = `$${availableBalance.toFixed(2)}`;
});
