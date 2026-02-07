// GoldChain Profit Calculator (FINAL — matches your 4 plans)
(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  // Detect plan by amount (your 4 plans)
  function getPlan(amount) {
    if (amount >= 5000) return { name: "Premium", monthlyRate: 0.18, withdraw: "Profit withdraw after 7 days, capital + full 18% after 30 days" };
    if (amount >= 1000) return { name: "Pro",     monthlyRate: 0.16, withdraw: "Withdraw after 15 days" };
    if (amount >= 700)  return { name: "Growth",  monthlyRate: 0.16, withdraw: "Withdraw after 1 month" };
    if (amount >= 350)  return { name: "Starter", monthlyRate: 0.16, withdraw: "Withdraw after 45 days" };
    return null;
  }

  function init() {
    // Your index.html uses these IDs:
    const input  = byId("amountInput") || byId("investAmount"); // supports both
    const btn    = byId("calcBtn");
    const result = byId("resultEl") || byId("calcResult");      // supports both

    if (!input || !btn || !result) {
      console.log("Calculator elements missing:", { input, btn, result });
      return;
    }

    function runCalc() {
      const amount = Number(input.value);

      result.style.display = "block";

      if (!amount || amount <= 0) {
        result.innerHTML = "❌ Please enter a valid amount.";
        return;
      }

      const plan = getPlan(amount);
      if (!plan) {
        result.innerHTML = "❌ Minimum investment is <b>$350</b>.";
        return;
      }

      const monthlyProfit = amount * plan.monthlyRate;
      const weeklyRate = plan.monthlyRate / 4; // weekly estimate
      const weeklyEstimate = amount * weeklyRate;

      result.innerHTML =
        `<b>Plan:</b> ${plan.name}<br>` +
        `<b>Monthly Profit (${(plan.monthlyRate * 100).toFixed(0)}%):</b> $${monthlyProfit.toFixed(2)}<br>` +
        `<b>Weekly Estimate:</b> $${weeklyEstimate.toFixed(2)}<br>` +
        `<span class="small"><b>Withdraw Policy:</b> ${plan.withdraw}</span>`;
    }

    btn.addEventListener("click", runCalc);

    // Enter key
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runCalc();
    });

    console.log("Calculator ready ✅");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
