// Demo Auth (Front-end only)
// This does NOT create real accounts on a server.
// It saves a demo user in browser localStorage.

const $ = (id) => document.getElementById(id);

const signupForm = $("signupForm");
const loginForm = $("loginForm");

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = {
      name: $("suName").value.trim(),
      email: $("suEmail").value.trim().toLowerCase(),
      phone: $("suPhone").value.trim(),
      pass: $("suPass").value,
      plan: $("suPlan").value
    };

    if (!user.plan) {
      $("signupMsg").textContent = "Please select a plan.";
      return;
    }

    localStorage.setItem("gc_user", JSON.stringify(user));
    $("signupMsg").textContent = "Account created! Now you can login.";
    $("signupMsg").style.color = "#ffd66e";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 900);
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const saved = localStorage.getItem("gc_user");
    if (!saved) {
      $("loginMsg").textContent = "No account found. Please sign up first.";
      $("loginMsg").style.color = "#ffd66e";
      return;
    }

    const user = JSON.parse(saved);
    const email = $("liEmail").value.trim().toLowerCase();
    const pass = $("liPass").value;

    if (email === user.email && pass === user.pass) {
      $("loginMsg").textContent = "Login successful! (Demo)";
      $("loginMsg").style.color = "#ffd66e";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    } else {
      $("loginMsg").textContent = "Wrong email or password.";
      $("loginMsg").style.color = "#ffb3b3";
    }
  });
}