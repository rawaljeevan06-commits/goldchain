document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("suName").value.trim();
    const email = document.getElementById("suEmail").value.trim();
    const phone = document.getElementById("suPhone").value.trim();
    const plan = document.getElementById("suPlan").value;
    const password = document.getElementById("suPass").value;

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

      const userCred = await createUserWithEmailAndPassword(
        window.auth,
        email,
        password
      );

      await updateProfile(userCred.user, {
        displayName: name
      });

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
