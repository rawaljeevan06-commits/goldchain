// js/plans.js
document.addEventListener("DOMContentLoaded", () => {
  // Plan buttons
  document.querySelectorAll(".pay-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedPlan = {
        name: btn.dataset.name,
        amount: Number(btn.dataset.amount || 0),
        percent: Number(btn.dataset.percent || 0),
        withdraw: btn.dataset.withdraw || ""
      };

      const raw = JSON.stringify(selectedPlan);

      // ✅ Save in BOTH (Safari + Chrome stable)
      localStorage.setItem("selectedPlan", raw);
      sessionStorage.setItem("selectedPlan", raw);

      // ✅ Save history (optional, keeps last 20)
      const historyRaw = localStorage.getItem("planHistory");
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      history.unshift({ ...selectedPlan, time: new Date().toISOString() });
      localStorage.setItem("planHistory", JSON.stringify(history.slice(0, 20)));

      // ✅ Small delay helps Safari commit storage
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 200);
    });
  });

  // Clear selected plan
  const resetBtn = document.getElementById("resetPlanBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem("selectedPlan");
      sessionStorage.removeItem("selectedPlan");
      alert("✅ Selected plan cleared");
    });
  }
});
