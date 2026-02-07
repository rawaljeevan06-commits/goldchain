// js/plansConfig.js
export const PLANS = {
  starter: { name: "Starter Plan", amount: 350, monthlyPercent: 16, withdraw: "Withdraw after 45 days" },
  growth:  { name: "Growth Plan",  amount: 700, monthlyPercent: 16, withdraw: "Withdraw after 1 month" },
  gold:    { name: "Gold Plan",    amount: 1000, monthlyPercent: 16, withdraw: "Withdraw after 15 days" },
  vip:     { name: "VIP Plan",     amount: 5000, monthlyPercent: 18, withdraw: "Withdraw weekly" }
};

export function formatPlanText(planKey){
  const p = PLANS[planKey];
  if (!p) return "No plan selected";
  return `${p.name} ($${p.amount}) — ${p.monthlyPercent}% monthly — ${p.withdraw}`;
}

export function calcMonthlyProfit(amount, planKey){
  const p = PLANS[planKey];
  if (!p) return 0;
  return Number(amount || 0) * (p.monthlyPercent / 100);
}
