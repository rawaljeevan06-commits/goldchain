// ===================== GoldChain Shared App =====================

// Helper: smooth scroll to section id (on same page)
function smoothScrollToId(id) {
  const target = document.querySelector(id);
  if (!target) return;
  const y = target.getBoundingClientRect().top + window.pageYOffset - 85;
  window.scrollTo({ top: y, behavior: "smooth" });
}

// ===================== MOBILE MENU =====================
function toggleMenu() {
  const nav = document.getElementById("navMenu");
  if (!nav) return;
  nav.classList.toggle("active");
}
window.toggleMenu = toggleMenu;

// Close menu after clicking any link (mobile)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#navMenu a").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("navMenu")?.classList.remove("active");
    });
  });
});

// ===================== SECTION FADE-IN (index sections) =====================
function revealSections() {
  const sections = document.querySelectorAll(".section");
  if (!sections.length) return;
  sections.forEach((sec) => {
    if (sec.getBoundingClientRect().top < window.innerHeight - 120) {
      sec.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealSections);
window.addEventListener("load", () => {
  revealSections();
  document.getElementById("home")?.classList.add("active");
});

// Smooth scroll for #section links only
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("#navMenu a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (href.startsWith("#")) {
        e.preventDefault();
        smoothScrollToId(href);
      }
    });
  });
});

// Active nav highlight (only for #section links)
window.addEventListener("scroll", () => {
  const navLinks = document.querySelectorAll("#navMenu a");
  if (!navLinks.length) return;

  let fromTop = window.scrollY + 120;
  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return;

    const section = document.querySelector(href);
    if (!section) return;

    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// ===================== BACKGROUND SLIDER (if exists) =====================
document.addEventListener("DOMContentLoaded", () => {
  const bgSlider = document.getElementById("bgSlider");
  if (!bgSlider) return;

  const bgImages = ["images/bg1.jpg", "images/bg2.jpg", "images/bg3.jpg"];
  let bgIndex = 0;

  setInterval(() => {
    bgIndex = (bgIndex + 1) % bgImages.length;
    bgSlider.style.backgroundImage = `url('${bgImages[bgIndex]}')`;
  }, 8000);
});

// ===================== GOLD PARTICLES (if exists) =====================
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("goldParticles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particlesArray = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.speedY = Math.random() * 0.8 - 0.4;
      this.opacity = Math.random() * 0.8 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (
        this.x < 0 ||
        this.x > canvas.width ||
        this.y < 0 ||
        this.y > canvas.height
      ) {
        this.reset();
      }
    }
    draw() {
      ctx.fillStyle = `rgba(255,215,0,${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    const count = Math.floor((canvas.width * canvas.height) / 16000);
    for (let i = 0; i < count; i++) particlesArray.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
});

// ===================== FAQ ACCORDION =====================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      const ans = item.querySelector(".faq-answer");
      ans?.classList.toggle("active");
    });
  });
});

// ===================== PLAN PROFIT CALC (if exists) =====================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".plan").forEach((plan) => {
    const input = plan.querySelector(".invest-amount");
    const profitDisplay = plan.querySelector(".profit");
    const rate = parseFloat(plan.getAttribute("data-rate")) / 100;
    const min = parseFloat(plan.getAttribute("data-min"));
    if (!input || !profitDisplay || !rate || !min) return;

    function update() {
      let amount = parseFloat(input.value || min);
      if (amount < min) amount = min;
      input.value = amount;
      profitDisplay.innerText = (amount * rate).toFixed(2);
    }

    input.addEventListener("input", update);
    update();
  });
});

// ===================== PROGRESS BARS =====================
function animateProgressBars() {
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    const top = bar.getBoundingClientRect().top;
    if (top < window.innerHeight - 120 && !bar.dataset.animated) {
      const rate = parseFloat(bar.getAttribute("data-rate"));
      bar.style.width = Math.min(rate * 25, 100) + "%";
      bar.dataset.animated = "1";
    }
  });
}
window.addEventListener("scroll", animateProgressBars);
window.addEventListener("load", animateProgressBars);

// ===================== BACK TO TOP =====================
window.addEventListener("scroll", () => {
  const backTop = document.getElementById("backTop");
  if (!backTop) return;
  backTop.style.display = window.scrollY > 400 ? "block" : "none";
});

// ===================== TRADINGVIEW (only if chart exists) =====================
document.addEventListener("DOMContentLoaded", () => {
  const chart = document.getElementById("tv_chart");
  if (!chart) return;

  const s = document.createElement("script");
  s.src = "https://s3.tradingview.com/tv.js";
  s.onload = () => {
    if (typeof TradingView === "undefined") return;
    new TradingView.widget({
      width: "100%",
      height: window.innerWidth < 600 ? 300 : 420,
      symbol: "OANDA:XAUUSD",
      interval: "60",
      theme: "dark",
      container_id: "tv_chart",
    });
  };
  document.body.appendChild(s);
});

// ===================== DEMO AUTH (REAL CHECK) =====================
// NOTE: Works only in the same browser (localStorage), no backend.
const GC_AUTH_KEY = "goldchain_demo_user";

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(GC_AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem(GC_AUTH_KEY, JSON.stringify(user));
}

// SIGNUP
document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signupBtn");
  if (!signupBtn) return;

  signupBtn.addEventListener("click", () => {
    const name = document.getElementById("su-name")?.value.trim() || "";
    const email = document.getElementById("su-email")?.value.trim() || "";
    const pass = document.getElementById("su-password")?.value || "";
    const confirm = document.getElementById("su-confirm")?.value || "";

    if (!name || !email || !pass || !confirm) return alert("Please fill in all fields.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Please enter a valid email.");
    if (pass.length < 6) return alert("Password must be at least 6 characters.");
    if (pass !== confirm) return alert("Passwords do not match.");

    saveUser({ name, email, pass });

    alert("Sign up successful. Now login.");
    window.location.href = "login.html";
  });
});

// LOGIN
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (!loginBtn) return;

  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("li-email")?.value.trim() || "";
    const pass = document.getElementById("li-password")?.value || "";

    if (!email || !pass) return alert("Please enter email and password.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Invalid email format.");

    const user = getSavedUser();
    if (!user) {
      alert("No account found. Please sign up first.");
      window.location.href = "signup.html";
      return;
    }

    if (email === user.email && pass === user.pass) {
      alert(`Login successful. Welcome, ${user.name}!`);
      window.location.href = "index.html";
    } else {
      alert("Wrong email or password.");
    }
  });
});
