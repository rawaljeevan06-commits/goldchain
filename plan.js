// Redirect user when clicking a plan

document.addEventListener("DOMContentLoaded", () => {
  const planButtons = document.querySelectorAll(".choose-plan");

  planButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Save selected plan info
      const plan = btn.dataset.plan;
      const rate = btn.dataset.rate;
      const withdraw = btn.dataset.withdraw;

      localStorage.setItem("selectedPlan", plan);
      localStorage.setItem("selectedRate", rate);
      localStorage.setItem("selectedWithdraw", withdraw);

      // Redirect to login page
      window.location.href = "login.html";
    });
  });
});
