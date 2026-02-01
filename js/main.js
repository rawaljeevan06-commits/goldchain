(function () {
  // Smooth scroll for internal hash links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
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

  // Active nav highlight by current page
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
})();
