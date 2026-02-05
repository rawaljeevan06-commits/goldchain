console.log("✅ plans.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const PLAN_KEY = "selectedPlan";

  function saveSelectedPlan(plan) {
    const raw = JSON.stringify(plan);
    localStorage.setItem(PLAN_KEY, raw);
    sessionStorage.setItem(PLAN_KEY, raw); // Safari helper
  }

  document.querySelectorAll(".pay-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = {
        name: btn.dataset.name,
        amount: Number(btn.dataset.amount || 0),
        percent: Number(btn.dataset.percent || 0),
        withdraw: btn.dataset.withdraw || "",
      };

      saveSelectedPlan(plan);
      alert(`✅ Plan selected: ${plan.name}`);
      window.location.href = "dashboard.html";
    });
  });

  const resetBtn = document.getElementById("resetPlanBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem(PLAN_KEY);
      sessionStorage.removeItem(PLAN_KEY);
      alert("✅ Selected plan cleared");
    });
  }
});
