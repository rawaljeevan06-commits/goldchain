(function () {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }

  // Close mobile nav when clicking a link
  document.querySelectorAll(".nav a").forEach(a => {
    a.addEventListener("click", () => document.body.classList.remove("nav-open"));
  });

  // Smooth scroll for internal hash links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Back to top button
  const btn = document.createElement("button");
  btn.textContent = "↑";
  btn.setAttribute("aria-label", "Back to top");
  btn.style.position = "fixed";
  btn.style.left = "16px";
  btn.style.bottom = "16px";
  btn.style.width = "48px";
  btn.style.height = "48px";
  btn.style.borderRadius = "50%";
  btn.style.border = "1px solid rgba(255,255,255,0.20)";
  btn.style.background = "rgba(255,255,255,0.08)";
  btn.style.color = "#e9eefc";
  btn.style.backdropFilter = "blur(10px)";
  btn.style.cursor = "pointer";
  btn.style.display = "none";
  btn.style.zIndex = "250";
  btn.style.fontSize = "18px";
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 400 ? "grid" : "none";
    btn.style.placeItems = "center";
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Active link highlight by current page
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
})();
