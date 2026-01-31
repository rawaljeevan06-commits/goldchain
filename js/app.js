// Helper: smooth scroll to section id (on same page)
function smoothScrollToId(id) {
  const target = document.querySelector(id);
  if (!target) return;
  const y = target.getBoundingClientRect().top + window.pageYOffset - 85;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

// MOBILE MENU
function toggleMenu() {
  const nav = document.getElementById('navMenu');
  if (!nav) return;
  nav.classList.toggle('active');
}
window.toggleMenu = toggleMenu;

// Close menu after clicking any link (mobile)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navMenu')?.classList.remove('active');
    });
  });
});

// SECTION FADE-IN (only if sections exist)
function revealSections() {
  const sections = document.querySelectorAll('.section');
  if (!sections.length) return;
  sections.forEach(sec => {
    if (sec.getBoundingClientRect().top < window.innerHeight - 120) {
      sec.classList.add('active');
    }
  });
}
window.addEventListener('scroll', revealSections);
window.addEventListener('load', () => {
  revealSections();
  document.getElementById('home')?.classList.add('active');
});

// NAV: Smooth scroll for same-page anchors only (#...)
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('#navMenu a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      // If it's a section link like "#plans", handle smooth scroll.
      if (href.startsWith('#')) {
        e.preventDefault();
        smoothScrollToId(href);
      }
      // If it's a page link like "login.html", let browser navigate normally.
    });
  });
});

// ACTIVE NAV HIGHLIGHT (only for #section links on index.html)
window.addEventListener('scroll', () => {
  const navLinks = document.querySelectorAll('#navMenu a');
  if (!navLinks.length) return;

  let fromTop = window.scrollY + 120;
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return; // don't highlight page links here

    const section = document.querySelector(href);
    if (!section) return;

    if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// BACKGROUND SLIDER (only if bgSlider exists)
document.addEventListener('DOMContentLoaded', () => {
  const bgSlider = document.getElementById('bgSlider');
  if (!bgSlider) return;

  const bgImages = ['images/bg1.jpg', 'images/bg2.jpg', 'images/bg3.jpg'];
  let bgIndex = 0;
  setInterval(() => {
    bgIndex = (bgIndex + 1) % bgImages.length;
    bgSlider.style.backgroundImage = `url('${bgImages[bgIndex]}')`;
  }, 8000);
});

// GOLD PARTICLES (only if canvas exists)
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('goldParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particlesArray = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  class Particle {
    constructor() { this.reset(); }
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
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
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
    particlesArray.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
});

// FAQ ACCORDION (works on index and any page that has faq-item)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const ans = item.querySelector('.faq-answer');
      ans?.classList.toggle('active');
    });
  });
});

// PLAN DYNAMIC PROFIT (only where plan exists)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.plan').forEach(plan => {
    const input = plan.querySelector('.invest-amount');
    const profitDisplay = plan.querySelector('.profit');
    const rate = parseFloat(plan.getAttribute('data-rate')) / 100;
    const min = parseFloat(plan.getAttribute('data-min'));
    if (!input || !profitDisplay || !rate || !min) return;

    function update() {
      let amount = parseFloat(input.value || min);
      if (amount < min) amount = min;
      input.value = amount;
      profitDisplay.innerText = (amount * rate).toFixed(2);
    }
    input.addEventListener('input', update);
    update();
  });
});

// PROGRESS BARS
function animateProgressBars() {
  document.querySelectorAll('.progress-bar').forEach(bar => {
    const top = bar.getBoundingClientRect().top;
    if (top < window.innerHeight - 120 && !bar.dataset.animated) {
      const rate = parseFloat(bar.getAttribute('data-rate'));
      bar.style.width = Math.min(rate * 25, 100) + '%';
      bar.dataset.animated = "1";
    }
  });
}
window.addEventListener('scroll', animateProgressBars);
window.addEventListener('load', animateProgressBars);

// BACK TO TOP (only if exists)
window.addEventListener('scroll', () => {
  const backTop = document.getElementById('backTop');
  if (!backTop) return;
  backTop.style.display = window.scrollY > 400 ? 'block' : 'none';
});

// TradingView: load script only if chart container exists
document.addEventListener('DOMContentLoaded', () => {
  const chart = document.getElementById('tv_chart');
  if (!chart) return;

  const s = document.createElement('script');
  s.src = 'https://s3.tradingview.com/tv.js';
  s.onload = () => {
    if (typeof TradingView === 'undefined') return;
    new TradingView.widget({
      width: "100%",
      height: window.innerWidth < 600 ? 300 : 420,
      symbol: "OANDA:XAUUSD",
      interval: "60",
      theme: "dark",
      container_id: "tv_chart"
    });
  };
  document.body.appendChild(s);
});
