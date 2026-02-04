// js/plans.js
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".pay-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedPlan = {
        name: btn.dataset.name,
        amount: Number(btn.dataset.amount),
        percent: Number(btn.dataset.percent),
        withdraw: btn.dataset.withdraw
      };

      const value = JSON.stringify(selectedPlan);

      // Safari-safe storage
      localStorage.setItem("selectedPlan", value);
      sessionStorage.setItem("selectedPlan", value);

      // tiny delay helps Safari commit storage
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 200);
    });
  });

  const resetBtn = document.getElementById("resetPlanBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem("selectedPlan");
      sessionStorage.removeItem("selectedPlan");
      alert("✅ Selected plan cleared");
    });
  }
});
