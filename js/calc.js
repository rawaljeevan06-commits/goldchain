// GoldChain Profit Calculator (FINAL v5)
(function () {
  function byId(id) { return document.getElementById(id); }

  // Your 4 plans:
  // 350 / 700 / 1000 => 16% monthly
  // 5000+ => 18% monthly (profit weekly = 18%/4 = 4.5%)
  function getPlan(amount) {
    if (amount >= 5000) return { name: "Premium", monthlyRate: 0.18 };
    if (amount >= 1000) return { name: "Pro", monthlyRate: 0.16 };
    if (amount >= 700)  return { name: "Growth", monthlyRate: 0.16 };
    if (amount >= 350)  return { name: "Starter", monthlyRate: 0.16 };
    return null;
  }

  function init() {
    // Support BOTH ID versions (so no mess)
    const input  = byId("amountInput") || byId("investAmount");
    const btn    = byId("calcBtn");
    const result = byId("resultEl") || byId("calcResult");

    console.log("✅ calc.js FINAL v5 loaded", {
      inputFound: !!input, btnFound: !!btn, resultFound: !!result
    });

    if (!input || !btn || !result) return;

    function runCalc() {
      const amount = Number(input.value || 0);

      // show result area if it's hidden
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
      const weeklyEstimate = amount * (plan.monthlyRate / 4);

      // Withdrawal text (your rules)
      let withdrawText = "";
      if (amount >= 5000) {
        withdrawText = "Profit withdraw after 7 days, capital + full 18% after 30 days";
      } else if (amount >= 1000) {
        withdrawText = "Withdraw after 15 days";
      } else if (amount >= 700) {
        withdrawText = "Withdraw after 1 month";
      } else {
        withdrawText = "Withdraw after 45 days";
      }

      result.innerHTML =
        `<b>Plan:</b> ${plan.name}<br>` +
        `<b>Monthly Profit (${(plan.monthlyRate * 100).toFixed(0)}%):</b> $${monthlyProfit.toFixed(2)}<br>` +
        `<b>Weekly Estimate:</b> $${weeklyEstimate.toFixed(2)}<br>` +
        `<span class="small"><b>Withdraw Policy:</b> ${withdrawText}</span>`;
    }

    btn.addEventListener("click", runCalc);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") runCalc(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
