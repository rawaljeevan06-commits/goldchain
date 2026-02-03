// GoldChain Profit Calculator (strong version)
(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function getPlan(amount) {
    if (amount >= 5000) return { name: "Premium", rate: 0.04, withdraw: "Withdraw weekly" };
    if (amount >= 1000) return { name: "Pro", rate: 0.03, withdraw: "Withdraw after 15 days" };
    if (amount >= 700)  return { name: "Growth", rate: 0.02, withdraw: "Withdraw after 1 month" };
    if (amount >= 350)  return { name: "Starter", rate: 0.015, withdraw: "Withdraw after 45 days" };
    return null;
  }

  function init() {
    const input = byId("investAmount");
    const btn = byId("calcBtn");
    const result = byId("calcResult");

    // If these are null, the HTML ids are not matching
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

      const weeklyProfit = amount * plan.rate;

      result.innerHTML =
        `✅ <b>Plan:</b> ${plan.name}<br>` +
        `✅ <b>Weekly Rate:</b> ${(plan.rate * 100).toFixed(1)}%<br>` +
        `✅ <b>Weekly Profit:</b> $${weeklyProfit.toFixed(2)}<br>` +
        `✅ <b>Withdraw Policy:</b> ${plan.withdraw}`;
    }

    btn.addEventListener("click", runCalc);

    // Also allow Enter key
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runCalc();
    });

    console.log("Calculator ready ✅");
  }

  // Works even if script loads before HTML
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
