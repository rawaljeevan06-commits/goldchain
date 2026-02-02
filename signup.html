// js/signup.js

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", async () => {
  const form = $("signupForm");
  const msg = $("signupMsg");

  if (!form) return;

  msg.textContent = "Loading signup system...";
  msg.style.color = "#ffd66e";

  if (!window.sb) {
    msg.textContent = "ERROR: Supabase not loaded.";
    msg.style.color = "#ffb3b3";
    return;
  }

  // If already logged in, redirect
  try {
    const { data } = await window.sb.auth.getSession();
    if (data?.session) {
      msg.textContent = "Already logged in ✅ Redirecting...";
      msg.style.color = "#7CFFB3";
      setTimeout(() => (window.location.href = "index.html"), 400);
      return;
    }
  } catch (e) {
    console.warn("getSession error:", e);
  }

  msg.textContent = "";
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = "Creating account...";
    msg.style.color = "#ffd66e";

    const name = $("suName").value.trim();
    const email = $("suEmail").value.trim().toLowerCase();
    const phone = $("suPhone").value.trim();
    const plan = $("suPlan").value;
    const password = $("suPass").value;

    if (!plan) {
      msg.textContent = "Please select a plan.";
      msg.style.color = "#ffd66e";
      return;
    }

    try {
      const { data, error } = await window.sb.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone, plan }
        }
      });

      if (error) {
        msg.textContent = "SUPABASE ERROR: " + error.message;
        msg.style.color = "#ffb3b3";
        return;
      }

      // If email confirmations are ON, session may be null
      if (!data?.session) {
        msg.textContent = "Account created ✅ Check your email to confirm, then login.";
        msg.style.color = "#7CFFB3";
        return;
      }

      msg.textContent = "Account created ✅ Redirecting to home...";
      msg.style.color = "#7CFFB3";
      setTimeout(() => (window.location.href = "index.html"), 800);
    } catch (err) {
      msg.textContent = "NETWORK ERROR: " + (err?.message || err);
      msg.style.color = "#ffb3b3";
      console.error(err);
    }
  });
});
