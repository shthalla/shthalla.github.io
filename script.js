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
