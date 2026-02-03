document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!window.sb) {
    console.error("Supabase client not loaded");
    return;
  }

  // =========================
  // LOGIN
  // =========================
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const msg = document.getElementById("loginMsg");

      if (msg) msg.textContent = "Logging in...";

      const { error } = await window.sb.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (msg) msg.textContent = error.message;
        return;
      }

      const next =
        localStorage.getItem("goldchain_after_login") || "dashboard.html";
      localStorage.removeItem("goldchain_after_login");
      window.location.href = next;
    });
  }

  // =========================
  // SIGNUP
  // =========================
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

  // =========================
  // DASHBOARD ONLY
  // =========================
  const isDashboard = window.location.pathname
    .toLowerCase()
    .includes("dashboard");

  if (isDashboard) {
    const { data, error } = await window.sb.auth.getUser();
    if (error || !data?.user) {
      window.location.href = "login.html";
      return;
    }

    const userId = data.user.id;

    // show email
    const userEmailEl = document.getElementById("userEmail");
    if (userEmailEl) {
      userEmailEl.textContent = "Logged in as: " + data.user.email;
    }

    // load plan
    const planNameEl = document.getElementById("dashPlanName");
    const planInfoEl = document.getElementById("dashPlanInfo");
    const weeklyProfitEl = document.getElementById("weeklyProfitValue");

    const savedPlanStr = localStorage.getItem("goldchain_selected_plan");
    let savedPlan = null;

    if (savedPlanStr) {
      try {
        savedPlan = JSON.parse(savedPlanStr);
        if (planNameEl) planNameEl.textContent = savedPlan.plan;
        if (planInfoEl)
          planInfoEl.textContent = `${savedPlan.rate}% weekly • ${savedPlan.withdraw}`;
      } catch {}
    } else {
      if (planNameEl) planNameEl.textContent = "Not selected";
      if (weeklyProfitEl) weeklyProfitEl.textContent = "$0.00";
    }

    // =========================
    // PROFIT CALCULATOR
    // =========================
    const dashAmount = document.getElementById("dashAmount");
    const dashCalcBtn = document.getElementById("dashCalcBtn");
    const dashCalcResult = document.getElementById("dashCalcResult");

    if (dashCalcBtn && dashAmount && dashCalcResult) {
      dashCalcBtn.addEventListener("click", () => {
        dashCalcResult.style.display = "block";

        if (!savedPlan) {
          dashCalcResult.innerHTML = "❌ Please select a plan first.";
          return;
        }

        const amount = Number(dashAmount.value);
        if (!amount || amount <= 0) {
          dashCalcResult.innerHTML = "❌ Enter a valid amount.";
          return;
        }

        const weeklyProfit = amount * (Number(savedPlan.rate) / 100);
const weeklyProfitEl = document.getElementById("weeklyProfitValue");
if (weeklyProfitEl) {
  weeklyProfitEl.textContent = `$${weeklyProfit.toFixed(2)}`;
}
        dashCalcResult.innerHTML = `
          ✅ <b>Plan:</b> ${savedPlan.plan}<br>
          ✅ <b>Weekly Rate:</b> ${savedPlan.rate}%<br>
          ✅ <b>Weekly Profit:</b> $${weeklyProfit.toFixed(2)}<br>
          ✅ <b>Withdraw:</b> ${savedPlan.withdraw}
        `;

        if (weeklyProfitEl) {
          weeklyProfitEl.textContent = `$${weeklyProfit.toFixed(2)}`;
        }
      });
    }

    // =========================
    // CLEAR PLAN
    // =========================
    const clearPlanBtn = document.getElementById("clearPlanBtn");
    if (clearPlanBtn) {
      clearPlanBtn.addEventListener("click", () => {
        localStorage.removeItem("goldchain_selected_plan");
        if (planNameEl) planNameEl.textContent = "Not selected";
        if (planInfoEl) planInfoEl.textContent = "";
        if (weeklyProfitEl) weeklyProfitEl.textContent = "$0.00";
        if (dashCalcResult) dashCalcResult.style.display = "none";
        if (dashAmount) dashAmount.value = "";
      });
    }
  }

  // =========================
  // LOGOUT
  // =========================
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await window.sb.auth.signOut();
      window.location.href = "login.html";
    });
  }
});
