document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");

  if (!signupForm) return;

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone, plan: "basic" },
        },
      });

      if (error) {
        msg.textContent = "SUPABASE ERROR: " + error.message;
        msg.style.color = "#ff3b3b";
        return;
      }

      // If email confirmation is ON
      if (!data?.session) {
        msg.textContent = "Account created ✅ Check your email to confirm.";
        msg.style.color = "#7CFFB3";
        return;
      }

      // If email confirmation is OFF
      msg.textContent = "Account created ✅ Redirecting to home...";
      msg.style.color = "#7CFFB3";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);

    } catch (err) {
      msg.textContent = "NETWORK ERROR: " + (err?.message || err);
      msg.style.color = "#ff3b3b";
      console.error(err);
    }
  });
});
