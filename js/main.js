// js/main.js
// UI-only logic (no auth, no Supabase)

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     Mobile nav toggle
  ========================= */
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    // Close menu when clicking a link (mobile)
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
      });
    });
  }

  /* =========================
     Active nav link on scroll
  ========================= */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav a");

  function setActiveLink() {
    let scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => link.classList.remove("active"));
        const active = document.querySelector('.nav a[href="#' + id + '"]');
        if (active) active.classList.add("active");
      }
    });
  }

  if (sections.length) {
    window.addEventListener("scroll", setActiveLink);
  }

  /* =========================
     Back to top button
  ========================= */
  const backToTop = document.createElement("button");
  backToTop.innerHTML = "↑";
  backToTop.className = "back-to-top";
  document.body.appendChild(backToTop);

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

});
