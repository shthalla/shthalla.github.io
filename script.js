// scroll progress bar
const progress = document.getElementById('progress');
function updateProgress() {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progress.style.width = scrolled + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// org-map node staggered reveal on scroll into view (progressive enhancement —
// nodes are visible by default via CSS; this only adds the stagger animation)
const orgNodes = document.querySelectorAll('.org-node-group[data-i]');
if (orgNodes.length && 'IntersectionObserver' in window) {
  orgNodes.forEach(n => { n.style.opacity = '0'; n.style.transition = 'opacity 0.4s ease'; });
  const orgSection = document.querySelector('.scale');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        orgNodes.forEach((n, idx) => {
          setTimeout(() => { n.style.opacity = '1'; }, idx * 90);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  if (orgSection) observer.observe(orgSection);
}
