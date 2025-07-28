// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  nav.classList.toggle('nav-open');
});

const filterButtons = document.querySelectorAll('.filter-btn');
const templatesGrid = document.querySelector('.templates-grid');
const searchInput = document.getElementById('template-search');

function filterTemplates() {
  const filter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';

  if (!templatesGrid) return;

  const templates = templatesGrid.querySelectorAll('.template-card');
  templates.forEach(template => {
    const category = template.getAttribute('data-category');
    const title = template.querySelector('.template-title')?.textContent.toLowerCase() || '';

    const matchesFilter = filter === 'all' || category === filter;

    if (matchesFilter) {
      template.style.display = 'block';
      // Animate fade in
      template.style.opacity = 0;
      setTimeout(() => {
        template.style.opacity = 1;
        template.style.transition = 'opacity 0.4s ease';
      }, 10);
    } else {
      // Animate fade out
      template.style.opacity = 0;
      setTimeout(() => {
        template.style.display = 'none';
      }, 300);
    }
  });
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    filterTemplates();
  });
});

// Template modal elements
const modal = document.getElementById('template-modal');
const modalCloseBtn = modal ? modal.querySelector('.modal-close') : null;
const modalImage = modal ? modal.querySelector('.modal-image') : null;
const modalTitle = modal ? modal.querySelector('.modal-title') : null;
const modalDescription = modal ? modal.querySelector('.modal-description') : null;
const modalPrice = modal ? modal.querySelector('.modal-price') : null;
const modalAnnouncement = document.getElementById('modal-announcement');

function trapFocus(element) {
  const focusableElements = element.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleFocus(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }

  element.addEventListener('keydown', handleFocus);
  return () => element.removeEventListener('keydown', handleFocus);
}

let removeFocusTrap = null;

function openModal(template) {
  if (!modal || !modalImage || !modalTitle || !modalDescription || !modalPrice) return;

  const imgSrc = template.querySelector('img').src;
  const title = template.querySelector('.template-title').textContent;
  const price = template.querySelector('.template-price').textContent;

  modalImage.src = imgSrc;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modalDescription.textContent = "This is a premium digital template perfect for your project. Customize it easily and get professional results.";
  modalPrice.textContent = price;

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (modalCloseBtn) modalCloseBtn.focus();

  if (modalAnnouncement) modalAnnouncement.textContent = `Opened modal for ${title}`;

  // Setup focus trap
  removeFocusTrap = trapFocus(modal);
}

function closeModal() {
  if (!modal) return;

  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (modalAnnouncement) modalAnnouncement.textContent = 'Modal closed';

  // Clear modal content
  if (modalImage) {
    modalImage.src = '';
    modalImage.alt = '';
  }
  if (modalTitle) modalTitle.textContent = '';
  if (modalDescription) modalDescription.textContent = '';
  if (modalPrice) modalPrice.textContent = '';

  // Remove focus trap
  if (removeFocusTrap) {
    removeFocusTrap();
    removeFocusTrap = null;
  }
}

// Event delegation for buy button clicks
if (templatesGrid) {
  templatesGrid.addEventListener('click', e => {
    const buyBtn = e.target.closest('.buy-btn');
    if (buyBtn) {
      e.preventDefault();
      const templateCard = buyBtn.closest('.template-card');
      if (templateCard) {
        const imgSrc = templateCard.querySelector('img').src;
        const title = templateCard.querySelector('.template-title').textContent;
        const price = templateCard.querySelector('.template-price').textContent;
        const params = new URLSearchParams({ imgSrc, title, price });
        window.location.href = `payment.html?${params.toString()}`;
      }
    }
  });
}

// Open modal on template click or keyboard enter
if (templatesGrid) {
  templatesGrid.querySelectorAll('.template-card').forEach(template => {
    template.addEventListener('click', () => openModal(template));
    template.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(template);
      }
    });
  });
}

  
// Open live demo on preview button click
document.querySelectorAll('.preview-btn').forEach(button => {
  button.addEventListener('click', e => {
    e.stopPropagation(); // Prevent triggering the card click event
    const templateCard = button.closest('.template-card');
    if (templateCard) {
      const demoUrl = templateCard.getAttribute('data-demo-url');
      if (demoUrl) {
        window.open(demoUrl, '_blank', 'noopener,noreferrer');
      } else {
        // If no demo URL, open modal as fallback
        openModal(templateCard);
      }
    }
  });
});

// Close modal on Escape key
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
    closeModal();
  }
});

// FAQ accordion toggle
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const expanded = question.getAttribute('aria-expanded') === 'true';
    question.setAttribute('aria-expanded', !expanded);
    const answer = question.nextElementSibling;
    if (expanded) {
      answer.hidden = true;
    } else {
      answer.hidden = false;
    }
  });
});

// Smooth scroll for nav links
document.querySelectorAll('.nav-link, .footer-link, .cta-btn, .hero-cta').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      // Close mobile nav if open
      if (nav.classList.contains('nav-open')) {
        nav.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Newsletter form validation and feedback
const newsletterForm = document.getElementById('newsletter-form');
const newsletterFeedback = document.getElementById('newsletter-feedback');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[name="email"]');
    const email = emailInput.value.trim();

    if (!email) {
      newsletterFeedback.textContent = 'Please enter your email address.';
      newsletterFeedback.hidden = false;
      emailInput.focus();
      return;
    }

    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newsletterFeedback.textContent = 'Please enter a valid email address.';
      newsletterFeedback.hidden = false;
      emailInput.focus();
      return;
    }

    // Simulate successful subscription
    newsletterFeedback.textContent = 'Thank you for subscribing!';
    newsletterFeedback.hidden = false;
    newsletterForm.reset();
  });
}
