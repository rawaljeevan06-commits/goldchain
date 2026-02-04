document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ✅ These IDs MUST exist in signup.html
    const nameEl = document.getElementById("suName");
    const emailEl = document.getElementById("suEmail");
    const phoneEl = document.getElementById("suPhone");
    const planEl = document.getElementById("suPlan");
    const passEl = document.getElementById("suPass");

    // ✅ If any is missing, show clear error
    if (!emailEl || !passEl) {
      msg.textContent = "HTML IDs mismatch: suEmail / suPass not found.";
      msg.style.color = "#ff3b3b";
      return;
    }

    const name = nameEl ? nameEl.value.trim() : "";
    const email = emailEl.value.trim();
    const phone = phoneEl ? phoneEl.value.trim() : "";
    const plan = planEl ? planEl.value : "";
    const password = passEl.value;

    if (!email || !password) {
      msg.textContent = "Email and password are required.";
      msg.style.color = "#ff3b3b";
      return;
    }

    try {
      msg.textContent = "Creating account...";
      msg.style.color = "#ffd36b";

      const { createUserWithEmailAndPassword, updateProfile } =
        await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");

      const userCred = await createUserWithEmailAndPassword(window.auth, email, password);

      if (name) {
        await updateProfile(userCred.user, { displayName: name });
      }

      msg.textContent = "Account created ✅ Redirecting...";
      msg.style.color = "#7CFFB3";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);

    } catch (err) {
      msg.textContent = err.message;
      msg.style.color = "#ff3b3b";
      console.error(err);
    }
  });
});
