const overlay = document.getElementById('popup-overlay');
const closeBtn = document.getElementById('popup-close');

setTimeout(() => {
  if (overlay && !sessionStorage.getItem('marvinPopupClosed')) {
    overlay.classList.remove('hidden');
  }
}, 2500);

function closePopup() {
  if (overlay) overlay.classList.add('hidden');
  sessionStorage.setItem('marvinPopupClosed', 'true');
}

if (closeBtn) closeBtn.addEventListener('click', closePopup);
if (overlay) {
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closePopup();
  });
}

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.querySelectorAll('span').forEach((span) => {
        span.style.transform = '';
        span.style.opacity = '';
      });
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function onAnchorClick(event) {
    const href = this.getAttribute('href');
    const target = href ? document.querySelector(href) : null;
    if (target) {
      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .process-card, .blog-card, .area-item, .why-item').forEach((element) => {
  element.classList.add('fade-in');
  observer.observe(element);
});

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form && status) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Sending...';

    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      form.reset();
      status.textContent = 'Message received. Marvin will follow up soon.';
    } else {
      status.textContent = 'Something went wrong. Please message Marvin on WhatsApp.';
    }
  });
}
