// GoldChain demo auth (browser-only)
const STORAGE_USER = "goldchain_user";
const STORAGE_LOGGED = "goldchain_logged_in";

function getUser(){
  const raw = localStorage.getItem(STORAGE_USER);
  return raw ? JSON.parse(raw) : null;
}
function isLoggedIn(){
  return localStorage.getItem(STORAGE_LOGGED) === "true";
}
function setLoggedIn(val){
  if(val) localStorage.setItem(STORAGE_LOGGED, "true");
  else localStorage.removeItem(STORAGE_LOGGED);
}

function updateAuthUI(){
  // Welcome bar
  const bar = document.getElementById("userBar");
  const txt = document.getElementById("welcomeText");

  // Optional: links
  const loginLink = document.getElementById("navLogin");
  const signupLink = document.getElementById("navSignup");

  const user = getUser();
  const logged = isLoggedIn();

  if(bar && txt){
    if(logged && user){
      bar.style.display = "block";
      txt.textContent = `Welcome, ${user.name}`;
    }else{
      bar.style.display = "none";
      txt.textContent = "";
    }
  }

  // Hide login/signup when logged in (optional but clean)
  if(loginLink) loginLink.style.display = (logged ? "none" : "");
  if(signupLink) signupLink.style.display = (logged ? "none" : "");
}

function logoutNow(){
  setLoggedIn(false);
  updateAuthUI();
  alert("Logged out.");
}

// Signup handler (for signup.html)
function handleSignup(){
  const name = document.getElementById("su-name").value.trim();
  const email = document.getElementById("su-email").value.trim();
  const pass = document.getElementById("su-pass").value;
  const conf = document.getElementById("su-conf").value;

  if(!name || !email || !pass || !conf){
    alert("Please fill all fields.");
    return;
  }
  if(pass.length < 6){
    alert("Password must be at least 6 characters.");
    return;
  }
  if(pass !== conf){
    alert("Passwords do not match.");
    return;
  }

  localStorage.setItem(STORAGE_USER, JSON.stringify({name,email,password:pass}));
  setLoggedIn(false);

  alert("Signup successful. Now login.");
  window.location.href = "login.html";
}

// Login handler (for login.html)
function handleLogin(){
  const email = document.getElementById("li-email").value.trim();
  const pass = document.getElementById("li-pass").value;

  const user = getUser();
  if(!user){
    alert("No account found. Please sign up first.");
    return;
  }

  if(email !== user.email || pass !== user.password){
    alert("Invalid email or password.");
    return;
  }

  setLoggedIn(true);
  alert("Login successful!");
  window.location.href = "index.html";
}
