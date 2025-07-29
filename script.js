document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navOverlay = document.querySelector('.nav-overlay');

  function toggleNav() {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
    navToggle.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('open');
    navOverlay.classList.toggle('active');
  }

  navToggle.addEventListener('click', toggleNav);
  navOverlay.addEventListener('click', toggleNav);
});
