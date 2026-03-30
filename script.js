/* ── Navbar: scroll shadow + active link ── */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id], .section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  // shadow on scroll
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // highlight active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
});

/* ── Mobile nav toggle ── */
const navToggle = document.getElementById('navToggle');
const navLinksList = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
});

// close menu on link click
navLinksList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinksList.classList.remove('open'));
});

/* ── Scroll-reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Skills tool info ── */
let activeLogoItem = null;

function highlightTool(name, bulletString) {
  const box = document.getElementById('tool-info-box');
  const title = document.getElementById('tool-info-title');
  const list = document.getElementById('tool-info-list');

  // toggle off if same item clicked twice
  if (activeLogoItem && activeLogoItem.dataset.tool === name && !box.hidden) {
    box.hidden = true;
    activeLogoItem.classList.remove('active');
    activeLogoItem = null;
    return;
  }

  // update active state
  document.querySelectorAll('.logo-item').forEach(el => el.classList.remove('active'));
  const clicked = [...document.querySelectorAll('.logo-item')].find(
    el => el.dataset.tool === name
  );
  if (clicked) { clicked.classList.add('active'); activeLogoItem = clicked; }

  // populate content
  title.textContent = name;
  list.innerHTML = bulletString
    .split('\n')
    .filter(Boolean)
    .map(line => `<li>${line.replace(/^•\s*/, '')}</li>`)
    .join('');

  box.hidden = false;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Scroll Progress Bar ── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
}, { passive: true });

/* ── Hero Canvas: Particle Network ── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COUNT = 75, MAX_DIST = 150, RGB = '100, 255, 218';
  let particles = [], mouse = { x: -9999, y: -9999 };

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class P {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.55;
      this.vy = (Math.random() - 0.5) * 0.55;
      this.r  = Math.random() * 1.5 + 1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      const dx = mouse.x - this.x, dy = mouse.y - this.y;
      const d = Math.hypot(dx, dy);
      if (d < 160) { this.x += dx * 0.013; this.y += dy * 0.013; }
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${RGB}, 0.85)`;
      ctx.fill();
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < MAX_DIST) {
          ctx.strokeStyle = `rgba(${RGB}, ${(1 - dist / MAX_DIST) * 0.32})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(tick);
  }

  const hero = document.getElementById('home');
  hero.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  }, { passive: true });
  hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener('resize', () => { resize(); particles = Array.from({ length: COUNT }, () => new P()); }, { passive: true });

  resize();
  particles = Array.from({ length: COUNT }, () => new P());
  tick();
}());

/* ── Typewriter Tagline ── */
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const roles = [
    'Sr Cloud DevOps Engineer',
    'MLOps · Platform Engineering',
    'AI Infrastructure Engineer',
    'Cloud & K8s Architect',
    'GenAI Platform Engineer',
  ];
  let ri = 0, ci = 0, del = false;
  function type() {
    const cur = roles[ri];
    if (!del) {
      el.textContent = cur.slice(0, ci + 1);
      ci++;
      if (ci === cur.length) { del = true; setTimeout(type, 2000); return; }
    } else {
      el.textContent = cur.slice(0, ci - 1);
      ci--;
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, del ? 45 : 85);
  }
  type();
}());

/* ── 3D Perspective Tilt on Cards ── */
function addTilt(selector, maxDeg, persp) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transition = 'none';
      el.style.transform  = `perspective(${persp}px) rotateX(${-y * maxDeg}deg) rotateY(${x * maxDeg}deg) translateZ(8px)`;
    }, { passive: true });
    el.addEventListener('mouseleave', () => {
      el.style.transition = '';
      el.style.transform  = '';
    });
  });
}
addTilt('.project-card', 12, 700);
addTilt('.logo-item', 10, 500);

/* ── Animated Stat Counters ── */
(function () {
  function runCounter(el) {
    const raw   = el.textContent.trim();
    const match = raw.match(/^([\d.]+)(.*)$/);
    if (!match) return;
    const target = parseFloat(match[1]);
    const suffix = match[2];
    const isFloat = match[1].includes('.');
    let t0 = null;
    const dur = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const v = (1 - Math.pow(1 - p, 3)) * target;
      el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-num').forEach(el => obs.observe(el));
}());
