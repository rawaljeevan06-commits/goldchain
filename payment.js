document.addEventListener("DOMContentLoaded", async () => {
  const planBox = document.getElementById("selectedPlanBox");
  const payUserEmail = document.getElementById("payUserEmail");
  const payMsg = document.getElementById("payMsg");
  const payBtn = document.getElementById("payNowBtn");

  // Must have Supabase client
  if (!window.sb) {
    if (payMsg) payMsg.textContent = "❌ Supabase client not loaded.";
    return;
  }

  // 1) Must be logged in to use payment page
  const { data: userData } = await window.sb.auth.getUser();
  if (!userData?.user) {
    // send to login then come back here
    localStorage.setItem("goldchain_after_login", "payment.html");
    window.location.href = "login.html";
    return;
  }

  // show email
  if (payUserEmail) payUserEmail.textContent = userData.user.email;

  // 2) Load selected plan from localStorage
  const planStr = localStorage.getItem("goldchain_selected_plan");
  if (!planStr) {
    if (planBox) planBox.innerHTML = `<p class="small">❌ No plan selected. Please go back and choose a plan.</p>`;
    return;
  }

  let plan;
  try {
    plan = JSON.parse(planStr);
  } catch {
    if (planBox) planBox.innerHTML = `<p class="small">❌ Plan data corrupted. Please choose again.</p>`;
    return;
  }

  // show plan details
  if (planBox) {
    planBox.innerHTML = `
      <h3 style="margin-bottom:8px;">${plan.plan}</h3>
      <p class="small"><b>${plan.rate}% weekly</b> • ${plan.withdraw}</p>
    `;
  }

  // 3) Demo payment button
  if (payBtn) {
    payBtn.addEventListener("click", () => {
      localStorage.setItem("goldchain_paid", "yes");
      if (payMsg) payMsg.textContent = "✅ Payment successful (Demo). Redirecting to dashboard...";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    });
  }
});
