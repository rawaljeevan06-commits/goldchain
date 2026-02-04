document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const msg = document.getElementById("signupMsg");

  if (!signupForm) return;

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("suName")?.value?.trim();
    const email = document.getElementById("suEmail")?.value?.trim();
    const phone = document.getElementById("suPhone")?.value?.trim();
    const plan = document.getElementById("suPlan")?.value;
    const password = document.getElementById("suPass")?.value;

    if (!email || !password) {
      msg.textContent = "Email and password are required.";
      msg.style.color = "#ff3b3b";
      return;
    }

    // ✅ This must match whatever you use in firebase.js
    // Example:
    // const auth = window.auth;

    try {
      msg.textContent = "Creating account...";
      msg.style.color = "#ffd36b";

      const { createUserWithEmailAndPassword, updateProfile } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");

      const userCred = await createUserWithEmailAndPassword(window.auth, email, password);

      // Optional: save display name
      if (name) await updateProfile(userCred.user, { displayName: name });

      msg.textContent = "Account created ✅ Redirecting...";
      msg.style.color = "#7CFFB3";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);

    } catch (err) {
      msg.textContent = "Firebase error: " + (err?.message || err);
      msg.style.color = "#ff3b3b";
      console.error(err);
    }
  });
});
