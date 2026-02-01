// Navbar toggle (mobile)
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
if (navToggle && nav) {
  navToggle.addEventListener("click", () => nav.classList.toggle("open"));
}

// Active navbar highlighting on scroll
const links = document.querySelectorAll(".nav-link");
const sections = [...links]
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

function setActiveLink() {
  let current = sections[0];
  for (const s of sections) {
    const rect = s.getBoundingClientRect();
    if (rect.top <= 120) current = s;
  }
  links.forEach(a => a.classList.remove("active"));
  const active = document.querySelector(`.nav-link[href="#${current.id}"]`);
  if (active) active.classList.add("active");
}
window.addEventListener("scroll", setActiveLink);
setActiveLink();

// Back to top button
const backTop = document.getElementById("backTop");
if (backTop) {
  window.addEventListener("scroll", () => {
    backTop.style.display = window.scrollY > 500 ? "block" : "none";
  });
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// FAQ expand animation
const faqs = document.querySelectorAll(".faq-q");
faqs.forEach((btn) => {
  btn.addEventListener("click", () => {
    const ans = btn.nextElementSibling;
    if (!ans) return;
    const open = ans.style.display === "block";
    // close all
    document.querySelectorAll(".faq-a").forEach(a => (a.style.display = "none"));
    ans.style.display = open ? "none" : "block";
  });
});

// Offer modal
const offerModal = document.getElementById("offerModal");
const openOffer = document.getElementById("openOffer");
const closeOffer = document.getElementById("closeOffer");

if (openOffer && offerModal) {
  openOffer.addEventListener("click", () => {
    offerModal.style.display = "flex";
    offerModal.setAttribute("aria-hidden", "false");
  });
}
if (closeOffer && offerModal) {
  closeOffer.addEventListener("click", () => {
    offerModal.style.display = "none";
    offerModal.setAttribute("aria-hidden", "true");
  });
}
if (offerModal) {
  offerModal.addEventListener("click", (e) => {
    if (e.target === offerModal) {
      offerModal.style.display = "none";
      offerModal.setAttribute("aria-hidden", "true");
    }
  });
}

// Simple live chart for dashboard (no library)
const canvas = document.getElementById("chart");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let data = Array.from({ length: 40 }, () => 100 + Math.random() * 30);

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // grid
    ctx.globalAlpha = 0.25;
    for (let i = 0; i <= 8; i++) {
      const y = (h / 8) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // line
    const max = Math.max(...data), min = Math.min(...data);
    const pad = 20;
    const scaleY = (v) => pad + (h - pad * 2) * (1 - (v - min) / (max - min + 0.0001));
    const stepX = w / (data.length - 1);

    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * stepX;
      const y = scaleY(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // label
    ctx.fillText(`Live Value: ${data[data.length - 1].toFixed(2)}`, 12, 18);
  }

  function tick() {
    const last = data[data.length - 1];
    const next = last + (Math.random() - 0.5) * 6;
    data.push(Math.max(60, next));
    data.shift();
    draw();
  }

  draw();
  setInterval(tick, 2000);
}
