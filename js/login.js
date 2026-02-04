// js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  if (!form) return;

  if (!window.fbAuth) {
    msg.textContent = "Firebase not loaded. Check script order.";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    msg.textContent = "Logging in...";

    try {
      const res = await window.fbAuth.signInWithEmailAndPassword(email, password);
      msg.textContent = "Login successful ✅";

      // redirect
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 600);

    } catch (err) {
      console.error(err);
      msg.textContent = err?.message || "Login failed";
    }
  });
});
