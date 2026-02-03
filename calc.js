document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("investAmount");
  const btn = document.getElementById("calcBtn");
  const result = document.getElementById("calcResult");

  if (!input || !btn || !result) return;

  function getPlan(amount) {
    if (amount >= 5000) {
      return { name: "Premium", rate: 0.04, withdraw: "Withdraw weekly" };
    }
    if (amount >= 1000) {
      return { name: "Pro", rate: 0.03, withdraw: "Withdraw after 15 days" };
    }
    if (amount >= 700) {
      return { name: "Growth", rate: 0.02, withdraw: "Withdraw after 1 month" };
    }
    if (amount >= 350) {
      return { name: "Starter", rate: 0.015, withdraw: "Withdraw after 45 days" };
    }
    return null;
  }

  btn.addEventListener("click", () => {
    const amount = Number(input.value);

    if (!amount || amount <= 0) {
      result.style.display = "block";
      result.innerHTML = "❌ Please enter a valid amount.";
      return;
    }

    const plan = getPlan(amount);

    if (!plan) {
      result.style.display = "block";
      result.innerHTML = "❌ Minimum investment is <b>$350</b>.";
      return;
    }

    const weeklyProfit = amount * plan.rate;

    result.style.display = "block";
    result.innerHTML = `
      ✅ <b>Plan:</b> ${plan.name}<br>
      ✅ <b>Weekly Rate:</b> ${(plan.rate * 100).toFixed(1)}%<br>
      ✅ <b>Weekly Profit:</b> $${weeklyProfit.toFixed(2)}<br>
      ✅ <b>Withdraw Policy:</b> ${plan.withdraw}
    `;
  });
});
