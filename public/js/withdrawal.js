// js/withdrawal.js

document.addEventListener("DOMContentLoaded", () => {
  const planData = JSON.parse(localStorage.getItem("activePlan"));

  const statusEl = document.getElementById("withdrawStatus");
  const balanceEl = document.getElementById("availableBalance");

  if (!planData) {
    statusEl.textContent = "No active investment found.";
    return;
  }

  const now = Date.now();
  const startDate = new Date(planData.startDate).getTime();

  if (!startDate || isNaN(startDate)) {
    statusEl.textContent = "Investment date missing.";
    return;
  }

  const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

  // ✅ MAIN RULE: Capital unlocks after 60 days for ALL plans
  const CAPITAL_DAYS = 60;
  const capitalUnlocked = daysPassed >= CAPITAL_DAYS;

  // ✅ Plan profit rules (set by me)
  // - 350/700/1000 profit = 16%
  // - 5000 profit = 18% (special logic kept)
  const RULES = {
    350:  { profitUnlockDays: 45, profitPercent: 0.16 },
    700:  { profitUnlockDays: 60, profitPercent: 0.16 },
    1000: { profitUnlockDays: 15, profitPercent: 0.16 },
  };

  let availableBalance = 0;

  // -------------------------
  // ✅ $5000 PLAN (special)
  // - weekly profit after 7 days (4.5% weekly as your code)
  // - after 60 days: capital + full 18% profit
  // -------------------------
  if (planData.amount === 5000) {
    const weeklyRate = 0.045; // 4.5% weekly
    const weeksPassed = Math.floor(daysPassed / 7);
    const totalProfit = planData.amount * weeklyRate * weeksPassed;

    if (capitalUnlocked) {
      availableBalance = planData.amount + (planData.amount * 0.18);
      statusEl.textContent = "Capital + full 18% profit unlocked ✅";
    } else if (daysPassed >= 7) {
      availableBalance = totalProfit;
      const remainingCapital = CAPITAL_DAYS - daysPassed;
      statusEl.textContent = `Weekly profit unlocked ✅ (Capital unlocks in ${remainingCapital} days)`;
    } else {
      const remainingProfit = 7 - daysPassed;
      statusEl.textContent = `Withdrawal locked. Profit available after ${remainingProfit} days.`;
      availableBalance = 0;
    }

    balanceEl.textContent = `$${availableBalance.toFixed(2)}`;
    return;
  }

  // -------------------------
  // ✅ OTHER PLANS (350/700/1000)
  // Profit unlock = plan rule days
  // Capital unlock = always 60 days
  // -------------------------
  const rule = RULES[planData.amount];

  if (!rule) {
    statusEl.textContent = "Unknown plan.";
    return;
  }

  const profitUnlocked = daysPassed >= rule.profitUnlockDays;

  const profitAmount = profitUnlocked ? (planData.amount * rule.profitPercent) : 0;
  const capitalAmount = capitalUnlocked ? planData.amount : 0;

  availableBalance = profitAmount + capitalAmount;

  const remainingCapital = Math.max(0, CAPITAL_DAYS - daysPassed);
  const remainingProfit = Math.max(0, rule.profitUnlockDays - daysPassed);

  if (capitalUnlocked && profitUnlocked) {
    statusEl.textContent = "Capital + profit unlocked ✅";
  } else if (!capitalUnlocked && profitUnlocked) {
    statusEl.textContent = `Profit unlocked ✅ (Capital unlocks in ${remainingCapital} days)`;
  } else if (!capitalUnlocked && !profitUnlocked) {
    statusEl.textContent = `Withdrawal locked. Profit in ${remainingProfit} days, Capital in ${remainingCapital} days.`;
  } else {
    statusEl.textContent = `Capital unlocked ✅ (Profit unlocks in ${remainingProfit} days)`;
  }

  balanceEl.textContent = `$${availableBalance.toFixed(2)}`;
});