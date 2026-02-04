// js/plans.js

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".pay-btn");
  const resetBtn = document.getElementById("resetPlanBtn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = {
        name: btn.dataset.name,
        amount: btn.dataset.amount,
        percent: btn.dataset.percent,
        withdraw: btn.dataset.withdraw,
      };

      // ✅ Save ONLY to localStorage (works on Safari + Chrome)
      localStorage.setItem("selectedPlan", JSON.stringify(plan));

      // ✅ Go dashboard
      window.location.href = "dashboard.html";
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem("selectedPlan");
      alert("Selected plan cleared");
    });
  }
});
