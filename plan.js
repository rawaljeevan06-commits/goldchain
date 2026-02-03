document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".choose-plan");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = btn.dataset.plan;
      const rate = btn.dataset.rate;
      const withdraw = btn.dataset.withdraw;

      // Save selection locally
      localStorage.setItem(
        "goldchain_selected_plan",
        JSON.stringify({ plan, rate, withdraw, savedAt: new Date().toISOString() })
      );

      // Go to dashboard
      window.location.href = "dashboard.html";
    });
  });
});
