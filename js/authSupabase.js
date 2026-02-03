document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const logoutBtn = document.getElementById("logoutBtn");

  // ✅ Always use window.sb
  if (!window.sb) {
    console.error("Supabase client not loaded (window.sb missing)");
    return;
  }

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      const msg = document.getElementById("loginMsg");
      if (msg) msg.textContent = "Logging in...";

      const { error } = await window.sb.auth.signInWithPassword({ email, password });

      if (error) {
        if (msg) msg.textContent = error.message;
        return;
      }

     const next = localStorage.getItem("goldchain_after_login") || "dashboard.html";
localStorage.removeItem("goldchain_after_login");
window.location.href = next;
      // ================================
  // DASHBOARD: protect + show plan
  // ================================
  const isDashboard = window.location.pathname.toLowerCase().includes("dashboard");

  if (isDashboard) {
    // Protect dashboard (must be logged in)
    const { data, error } = await window.sb.auth.getUser();

    if (error || !data?.user) {
      window.location.href = "login.html";
      return;
    }
    // ================================
// DB SYNC: load + save user investments
// ================================
async function loadInvestmentFromDB(userId) {
  const { data, error } = await window.sb
    .from("user_investments")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log("DB load error:", error.message);
    return null;
  }
  return data || null;
}

async function saveInvestmentToDB(userId, payload) {
  const row = {
    user_id: userId,
    ...payload,
    updated_at: new Date().toISOString(),
  };

  const { error } = await window.sb.from("user_investments").upsert(row);
  if (error) console.log("DB save error:", error.message);
}

// Run DB load once
const userId = data.user.id;
const dbRow = await loadInvestmentFromDB(userId);

// Merge logic: prefer localStorage if exists
let localPlan = null;
let savedPlanStr = localStorage.getItem("goldchain_selected_plan");
if (savedPlanStr) {
  try { localPlan = JSON.parse(savedPlanStr); } catch {}
}

if (dbRow) {
  // If DB has plan and local missing → restore local from DB
  if (!localPlan && dbRow.plan) {
    const restored = {
      plan: dbRow.plan,
      rate: String(dbRow.rate ?? ""),
      withdraw: dbRow.withdraw ?? "",
      savedAt: dbRow.updated_at ?? new Date().toISOString(),
    };
    localStorage.setItem("goldchain_selected_plan", JSON.stringify(restored));

    const planNameEl = document.getElementById("dashPlanName");
    const planInfoEl = document.getElementById("dashPlanInfo");
    if (planNameEl) planNameEl.textContent = restored.plan;
    if (planInfoEl) planInfoEl.textContent = `${restored.rate}% weekly • ${restored.withdraw}`;
  }

  // If DB has amount → fill dashboard input (if exists)
  const dashAmount = document.getElementById("dashAmount");
  if (dashAmount && dbRow.amount) dashAmount.value = dbRow.amount;
}

// If local plan exists → ensure DB matches (upsert)
if (localPlan) {
  await saveInvestmentToDB(userId, {
    plan: localPlan.plan,
    rate: Number(localPlan.rate),
    withdraw: localPlan.withdraw,
  });
}

// When user calculates profit → save amount to DB too
const dashCalcBtn = document.getElementById("dashCalcBtn");
const dashAmountEl = document.getElementById("dashAmount");

if (dashCalcBtn && dashAmountEl) {
  dashCalcBtn.addEventListener("click", async () => {
    const amt = Number(dashAmountEl.value);
    if (!amt || amt <= 0) return;
    await saveInvestmentToDB(userId, { amount: amt });
  });
}
// ================================
// CLEAR PLAN + RESET DASHBOARD UI
// ================================
const clearPlanBtn = document.getElementById("clearPlanBtn");
const planNameEl2 = document.getElementById("dashPlanName");
const planInfoEl2 = document.getElementById("dashPlanInfo");
const weeklyProfitEl2 = document.getElementById("weeklyProfitValue");
const dashAmount2 = document.getElementById("dashAmount");
const dashCalcResult2 = document.getElementById("dashCalcResult");

function renderPlanFromStorage() {
  const saved = localStorage.getItem("goldchain_selected_plan");
  if (!saved) {
    if (planNameEl2) planNameEl2.textContent = "Not selected";
    if (planInfoEl2) planInfoEl2.textContent = "";
    if (weeklyProfitEl2) weeklyProfitEl2.textContent = "$0.00";
    return null;
  }

  try {
    const plan = JSON.parse(saved);
    if (planNameEl2) planNameEl2.textContent = plan.plan || "Selected";
    if (planInfoEl2) planInfoEl2.textContent = `${plan.rate}% weekly • ${plan.withdraw}`;
    return plan;
  } catch (e) {
    if (planNameEl2) planNameEl2.textContent = "Not selected";
    if (planInfoEl2) planInfoEl2.textContent = "";
    return null;
  }
}

// Run once on dashboard load
renderPlanFromStorage();

// Clear plan button
if (clearPlanBtn) {
  clearPlanBtn.addEventListener("click", () => {
    localStorage.removeItem("goldchain_selected_plan");

    // Reset UI
    if (planNameEl2) planNameEl2.textContent = "Not selected";
    if (planInfoEl2) planInfoEl2.textContent = "";
    if (weeklyProfitEl2) weeklyProfitEl2.textContent = "$0.00";
    if (dashCalcResult2) {
      dashCalcResult2.style.display = "none";
      dashCalcResult2.innerHTML = "";
    }
    if (dashAmount2) dashAmount2.value = "";
  });
}
    // Show user email (if element exists)
    const userEmailEl = document.getElementById("userEmail");
    if (userEmailEl) {
      userEmailEl.textContent = "Logged in as: " + data.user.email;
    }

    // Show selected plan from localStorage
    const planNameEl = document.getElementById("dashPlanName");
    const planInfoEl = document.getElementById("dashPlanInfo");
    const savedPlan = localStorage.getItem("goldchain_selected_plan");

    if (savedPlan && planNameEl && planInfoEl) {
      try {
        const plan = JSON.parse(savedPlan);
        planNameEl.textContent = plan.plan || "Selected";
        planInfoEl.textContent = `${plan.rate}% weekly • ${plan.withdraw}`;
      } catch (e) {
        planNameEl.textContent = "Not selected";
        planInfoEl.textContent = "";
      }
      // ================================
  // DASHBOARD PROFIT CALCULATOR
  // ================================
  const dashAmount = document.getElementById("dashAmount");
  const dashCalcBtn = document.getElementById("dashCalcBtn");
  const dashCalcResult = document.getElementById("dashCalcResult");
    
  const weeklyProfitEl = document.getElementById("weeklyProfitValue");

  // Weekly Profit card value
  const weeklyProfitEl = document.querySelector(
    '.card h3:contains("Weekly Profit")'
  ) || document.querySelector(".card:last-child .big");

  if (dashAmount && dashCalcBtn && dashCalcResult) {
    dashCalcBtn.addEventListener("click", () => {
      const amount = Number(dashAmount.value);
      const saved = localStorage.getItem("goldchain_selected_plan");

      dashCalcResult.style.display = "block";

      if (!amount || amount <= 0) {
        dashCalcResult.innerHTML = "❌ Please enter a valid amount.";
        return;
      }

      if (!saved) {
        dashCalcResult.innerHTML = "❌ No plan selected.";
        return;
      }

      const plan = JSON.parse(saved);
      const rate = Number(plan.rate) / 100;
      const weeklyProfit = amount * rate;
      if (weeklyProfitEl) {
  weeklyProfitEl.textContent = `$${weeklyProfit.toFixed(2)}`;
}

      dashCalcResult.innerHTML = `
        ✅ <b>Plan:</b> ${plan.plan}<br>
        ✅ <b>Weekly Rate:</b> ${plan.rate}%<br>
        ✅ <b>Weekly Profit:</b> $${weeklyProfit.toFixed(2)}<br>
        ✅ <b>Withdraw:</b> ${plan.withdraw}
      `;

      // Update Weekly Profit card
      if (weeklyProfitEl) {
        weeklyProfitEl.textContent = `$${weeklyProfit.toFixed(2)}`;
      }
    });
  }
    }
  }
    });
  }

  // SIGNUP
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("suEmail").value.trim();
      const password = document.getElementById("suPass").value;

      const msg = document.getElementById("signupMsg");
      if (msg) msg.textContent = "Creating account...";

      const { error } = await window.sb.auth.signUp({ email, password });

      if (error) {
        if (msg) msg.textContent = error.message;
        return;
      }

      if (msg) msg.textContent = "Signup successful ✅ Please login.";
    });
  }

  // LOGOUT
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await window.sb.auth.signOut();
      window.location.href = "login.html";
    });
  }
});
