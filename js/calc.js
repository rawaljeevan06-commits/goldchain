// GoldChain Calculator FINAL (v7)

document.addEventListener("DOMContentLoaded", function () {

  const input  = document.getElementById("amountInput");
  const btn    = document.getElementById("calcBtn");
  const result = document.getElementById("resultEl");

  console.log("✅ CALC V7 LOADED");

  if (!input || !btn || !result) {
    console.log("❌ Calculator elements missing");
    return;
  }

  function calculate() {

    const amount = Number(input.value);

    if (!amount || amount <= 0) {
      result.innerHTML = "❌ Enter valid amount.";
      return;
    }

    let monthlyRate = 0;
    let planName = "";
    let withdrawText = "";

    if (amount >= 5000) {
      monthlyRate = 0.18;
      planName = "Premium";
      withdrawText = "Profit withdraw after 7 days, capital + full 18% after 30 days";
    } 
    else if (amount >= 1000) {
      monthlyRate = 0.16;
      planName = "Pro";
      withdrawText = "Withdraw after 15 days";
    } 
    else if (amount >= 700) {
      monthlyRate = 0.16;
      planName = "Growth";
      withdrawText = "Withdraw after 1 month";
    } 
    else if (amount >= 350) {
      monthlyRate = 0.16;
      planName = "Starter";
      withdrawText = "Withdraw after 45 days";
    } 
    else {
      result.innerHTML = "❌ Minimum investment is $350.";
      return;
    }

    const monthlyProfit = amount * monthlyRate;
    const weeklyEstimate = amount * (monthlyRate / 4);

    result.innerHTML =
      "<b>Plan:</b> " + planName + "<br>" +
      "<b>Monthly Profit (" + (monthlyRate*100) + "%):</b> $" + monthlyProfit.toFixed(2) + "<br>" +
      "<b>Weekly Estimate:</b> $" + weeklyEstimate.toFixed(2) + "<br>" +
      "<span class='small'><b>Withdraw Policy:</b> " + withdrawText + "</span>";
  }

  btn.addEventListener("click", calculate);

});
