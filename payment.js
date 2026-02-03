document.addEventListener("DOMContentLoaded", () => {
  const plan = localStorage.getItem("selectedPlan");
  const rate = localStorage.getItem("selectedRate");
  const withdraw = localStorage.getItem("selectedWithdraw");

  const box = document.getElementById("selectedPlanBox");
  if (!plan) {
    box.innerHTML = `<p class="small">No plan selected. Please go back and choose a plan.</p>
                     <a class="btn btn-primary" href="index.html#plans" style="margin-top:10px;">Choose Plan</a>`;
    return;
  }

  box.innerHTML = `
    <h3>${plan}</h3>
    <p class="small"><b>Weekly Rate:</b> ${rate}%</p>
    <p class="small"><b>Withdraw:</b> ${withdraw}</p>
  `;

  document.getElementById("payDemoBtn").addEventListener("click", () => {
    document.getElementById("payMsg").textContent = "✅ Payment successful (demo). Your plan will be activated.";
    // later: redirect or mark paid
    setTimeout(() => window.location.href = "dashboard.html", 1000);
  });
});
