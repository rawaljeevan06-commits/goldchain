document.addEventListener("DOMContentLoaded", async () => {
  if (!window.sb) {
    console.error("Supabase client not loaded");
    return;
  }

  // ✅ must be logged in to pay
  const { data, error } = await window.sb.auth.getUser();
  if (error || !data?.user) {
    // send back to login, then return to payment after login
    localStorage.setItem("goldchain_after_login", "payment.html");
    window.location.href = "login.html";
    return;
  }

  // read selected plan from homepage plan.js
  const plan = localStorage.getItem("selectedPlan");
  const rate = localStorage.getItem("selectedRate");
  const withdraw = localStorage.getItem("selectedWithdraw");

  const box = document.getElementById("selectedPlanBox");
  const emailEl = document.getElementById("payUserEmail");

  if (emailEl) emailEl.textContent = data.user.email;

  if (!plan || !rate || !withdraw) {
    box.innerHTML = `
      <p class="small">❌ No plan selected. Please go back and choose a plan.</p>
      <a class="btn btn-primary" href="index.html#plans" style="margin-top:10px;">Choose Plan</a>
    `;
    return;
  }

  // show plan
  box.innerHTML = `
    <h3>${plan}</h3>
    <p class="small"><b>Weekly Rate:</b> ${rate}%</p>
    <p class="small"><b>Withdraw:</b> ${withdraw}</p>
  `;

  // DEMO payment button
  const payBtn = document.getElementById("payDemoBtn");
  const payMsg = document.getElementById("payMsg");

  if (payBtn) {
    payBtn.addEventListener("click", () => {
      // ✅ save to dashboard format (so dashboard can show it)
      const dashPlan = {
        plan: plan,
        rate: rate,
        withdraw: withdraw,
      };
      localStorage.setItem("goldchain_selected_plan", JSON.stringify(dashPlan));

      // optional: clear temporary selected plan
      // localStorage.removeItem("selectedPlan");
      // localStorage.removeItem("selectedRate");
      // localStorage.removeItem("selectedWithdraw");

      if (payMsg) payMsg.textContent = "✅ Payment successful (demo). Plan activated!";
      setTimeout(() => (window.location.href = "dashboard.html"), 900);
    });
  }
});
