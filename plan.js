document.addEventListener("DOMContentLoaded", () => {
  const planButtons = document.querySelectorAll(".choose-plan");

  planButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const planData = {
        plan: btn.dataset.plan,
        rate: btn.dataset.rate,
        withdraw: btn.dataset.withdraw
      };

      // ✅ Save plan in ONE object (important)
      localStorage.setItem(
        "goldchain_selected_plan",
        JSON.stringify(planData)
      );

      // ✅ Tell login where to go after login
      localStorage.setItem(
        "goldchain_after_login",
        "payment.html"
      );

      // ✅ Redirect to login
      window.location.href = "login.html";
    });
  });
});
