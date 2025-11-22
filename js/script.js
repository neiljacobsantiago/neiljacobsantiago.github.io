// 1. Typing Animation
const textElement = document.getElementById('typed-text');
const phrases = ["Frontend Developer", "System Administrator", "Multimedia Producer", "PC Hardware Enthusiast"];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function type() {
  const currentPhrase = phrases[phraseIndex];
  textElement.textContent = currentPhrase.substring(0, charIndex + (isDeleting ? -1 : 1));
  charIndex += isDeleting ? -1 : 1;

  let speed = isDeleting ? 50 : 100;
  if (!isDeleting && charIndex === currentPhrase.length) { speed = 2000; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; speed = 500; }
  setTimeout(type, speed);
}

// 2. Scroll Reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
}, { threshold: 0.1 });

// 3. User Control: Dark/Light Mode Toggle
const themeBtn = document.getElementById('theme-toggle');
const html = document.documentElement;
const icon = themeBtn.querySelector('.toggle-icon');

if (localStorage.getItem('theme') === 'dark') {
  html.setAttribute('data-theme', 'dark');
  icon.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  icon.textContent = newTheme === 'light' ? '🌙' : '☀️';
  localStorage.setItem('theme', newTheme);
});

// 4. Lively 3D Tilt Effect (Desktop Only)
document.addEventListener('mousemove', (e) => {
  // Check if device supports hover (desktop)
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x >= -50 && x <= rect.width + 50 && y >= -50 && y <= rect.height + 50) {
        const xCenter = rect.width / 2;
        const yCenter = rect.height / 2;
        const rotateX = ((y - yCenter) / yCenter) * -5;
        const rotateY = ((x - xCenter) / xCenter) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      } else {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
      }
    });
  }
});

// 5. Mobile Menu Logic
const mobileBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  // Close menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  type();
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});