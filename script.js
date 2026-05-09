/* ══════════════════════════════════════
   script.js  –  Portfolio Interactions
══════════════════════════════════════ */

/* ── 1. LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
  }, 1600);
});


/* ── 2. CUSTOM CURSOR ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover states
document.querySelectorAll('a, button, .skill-card, .exp-card, .ach-card, .tl-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});


/* ── 3. NAVBAR SCROLL EFFECT ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ── 4. HAMBURGER MENU ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close on link click
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ── 5. INTERSECTION OBSERVER — reveal & skill bars ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-delay');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Staggered delay for siblings
      const siblings = [...entry.target.parentElement.children];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.08) + 's';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));


// Skill bars
const skillBars = document.querySelectorAll('.skill-bar');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));


// Section items — add reveal class dynamically to cards
const autoReveal = document.querySelectorAll(
  '.skill-card, .exp-card, .ach-card, .tl-card, .vol-item, .about-quick-info, .about-intro, .about-body, .about-proficiencies'
);

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

autoReveal.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.6s ease ${(i % 4) * 0.1}s, transform 0.6s ease ${(i % 4) * 0.1}s`;
  cardObserver.observe(el);
});


/* ── 6. ACTIVE NAV LINK on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--white)' : '';
  });
});


/* ── 7. CONTACT FORM ── */
function handleFormSubmit() {
  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-msg').value.trim();
  const feedback = document.getElementById('form-feedback');

  // Simple validation
  if (!name || !email || !message) {
    feedback.textContent = '⚠ Please fill in all fields.';
    feedback.style.color = 'var(--red)';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.textContent = '⚠ Please enter a valid email address.';
    feedback.style.color = 'var(--red)';
    return;
  }

  // Compose mailto link
  const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
  const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:ritunesa@gmail.com?subject=${subject}&body=${body}`;

  feedback.textContent = '✓ Opening your email client...';
  feedback.style.color = '#22c55e';

  // Clear form
  setTimeout(() => {
    document.getElementById('f-name').value  = '';
    document.getElementById('f-email').value = '';
    document.getElementById('f-msg').value   = '';
    feedback.textContent = '';
  }, 3000);
}


/* ── 8. SMOOTH SCROLL polyfill for older browsers ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── 9. YEAR in footer (auto-update) ── */
document.addEventListener('DOMContentLoaded', () => {
  const yr = document.querySelector('.footer-copy');
  if (yr) {
    yr.textContent = yr.textContent.replace('2026', new Date().getFullYear());
  }
});
