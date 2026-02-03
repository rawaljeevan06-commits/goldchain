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

      window.location.href = "dashboard.html";
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
