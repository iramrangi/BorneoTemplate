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

  // FAQ toggle functionality
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const expanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !expanded);
      const answer = question.nextElementSibling;
      if (answer) {
        if (expanded) {
          answer.setAttribute('hidden', '');
        } else {
          answer.removeAttribute('hidden');
        }
      }
    });
  });
});
