// js/plans.js
console.log("✅ plans.js loaded");

function saveSelectedPlan(plan) {
  const raw = JSON.stringify(plan);
  localStorage.setItem("selectedPlan", raw);
  sessionStorage.setItem("selectedPlan", raw); // helps Safari
}

document.querySelectorAll(".pay-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
   const plan = {
  name: btn.dataset.name,
  amount: Number(btn.dataset.amount),
  percent: Number(btn.dataset.percent),
  withdraw: btn.dataset.withdraw,
};

const raw = JSON.stringify(plan);

localStorage.setItem("selectedPlan", raw);
sessionStorage.setItem("selectedPlan", raw);

alert(`✅ Plan selected: ${plan.name}`);
window.location.href = "dashboard.html";

    saveSelectedPlan(plan);

    alert(`✅ Plan selected: ${plan.name}`);
    window.location.href = "dashboard.html";
  });
});

const resetBtn = document.getElementById("resetPlanBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    localStorage.removeItem("selectedPlan");
    sessionStorage.removeItem("selectedPlan");
    alert("✅ Selected plan cleared");
  });
}
