document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".choose-plan");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      // 1) Save selected plan
      const selectedPlan = {
        plan: btn.dataset.plan,
        rate: btn.dataset.rate,
        withdraw: btn.dataset.withdraw,
      };

      localStorage.setItem("goldchain_selected_plan", JSON.stringify(selectedPlan));

      // 2) Set where to go AFTER login
      localStorage.setItem("goldchain_after_login", "payment.html");

      // 3) If Supabase client exists, check login
      if (window.sb) {
        try {
          const { data } = await window.sb.auth.getUser();
          if (data?.user) {
            // already logged in
            window.location.href = "payment.html";
            return;
          }
        } catch (e) {
          // ignore and redirect to login
        }
      }

      // not logged in
      window.location.href = "login.html";
    });
  });
});
