document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".choose-plan");
  if (!buttons.length) return;

  async function goAfterPlanSave(planObj) {
    // Save locally first (always)
    localStorage.setItem("goldchain_selected_plan", JSON.stringify(planObj));

    // If not logged in → go login, then dashboard after login
    const { data } = await window.sb.auth.getSession();
    if (!data?.session) {
      localStorage.setItem("goldchain_after_login", "dashboard.html");
      window.location.href = "login.html";
      return;
    }

    // If logged in → dashboard now
    window.location.href = "dashboard.html";
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      const planObj = {
        plan: btn.dataset.plan,
        rate: btn.dataset.rate,
        withdraw: btn.dataset.withdraw,
        savedAt: new Date().toISOString(),
      };

      await goAfterPlanSave(planObj);
    });
  });
});
