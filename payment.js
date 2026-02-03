document.addEventListener("DOMContentLoaded", async () => {
  // -------- Load selected plan --------
  const planBox = document.getElementById("selectedPlanBox");

  const planStr = localStorage.getItem("goldchain_selected_plan");

  if (!planStr) {
    if (planBox) {
      planBox.innerHTML = "❌ No plan selected. Please choose a plan first.";
    }
    return;
  }

  let plan;
  try {
    plan = JSON.parse(planStr);
  } catch (e) {
    if (planBox) {
      planBox.innerHTML = "❌ Failed to load plan data.";
    }
    return;
  }

  if (planBox) {
    planBox.innerHTML = `
      <b>${plan.plan}</b><br>
      ${plan.rate}% Weekly<br>
      ${plan.withdraw}
    `;
  }

  // -------- Supabase login check --------
  if (!window.sb) {
    console.error("Supabase not loaded");
    return;
  }

  const { data } = await window.sb.auth.getUser();
  if (!data?.user) {
    // remember where to come back
    localStorage.setItem("goldchain_after_login", "payment.html");
    window.location.href = "login.html";
    return;
  }

  // -------- Demo payment button --------
  const payBtn = document.getElementById("payNowBtn");
  if (payBtn) {
    payBtn.addEventListener("click", () => {
      alert("✅ Demo payment successful!");
      window.location.href = "dashboard.html";
    });
  }
});
