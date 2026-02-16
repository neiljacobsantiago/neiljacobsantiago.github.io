// --- Component Loader ---
async function loadComponents() {
  const includes = document.querySelectorAll('[data-include]');
  
  for (const el of includes) {
    const file = el.getAttribute('data-include');
    try {
      const response = await fetch(file);
      if (response.ok) {
        el.innerHTML = await response.text();
      } else {
        console.error(`Error loading ${file}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Fetch error for ${file}:`, error);
    }
  }

  // Dispatch an event so the rest of the script knows the DOM is fully built
  document.dispatchEvent(new Event('componentsLoaded'));
}

// 1. Typing Animation
const textElement = document.getElementById('typed-text');
const phrases = ["UI/UX Designer", "Network Administrator", "Multimedia Producer", "PC Hardware Enthusiast"];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function type() {
  if (!textElement) return; // safety check
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

// 3. Lively 3D Tilt Effect (Desktop Only)
document.addEventListener('mousemove', (e) => {
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

// 4. Apple-Style Lightbox Logic
function initLightbox() {
  const photoItems = document.querySelectorAll('.photo-item');
  if (photoItems.length === 0) return; // Only run if photos exist on the page

  // Create the Lightbox DOM Elements dynamically
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-close">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </div>
    <div class="lightbox-content">
      <img id="lightbox-img" class="lightbox-img" src="" alt="Enlarged view">
      <div id="lightbox-caption" class="lightbox-caption-text"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('#lightbox-img');
  const lightboxCaption = lightbox.querySelector('#lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  // Add click events to all photos
  photoItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4').innerText;
      
      lightboxImg.src = img.src;
      lightboxCaption.innerText = title;
      lightbox.classList.add('active');
      document.body.classList.add('lightbox-open'); // Stops background scrolling
    });
  });

  // Close Logic
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    // Clear image after fade out so it doesn't flash the old image next time
    setTimeout(() => { if (!lightbox.classList.contains('active')) lightboxImg.src = ''; }, 400);
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    // Close if they click the dark background outside the image
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox(); // Close on Esc key
  });
}

// --- Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
  // 1. Start animations
  type();
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
  // 2. Initialize Lightbox
  initLightbox();

  // 3. Load the modular components
  loadComponents();
});

// --- Initialize scripts that target the injected Nav/Footer ---
document.addEventListener('componentsLoaded', () => {
  
  // Theme Toggle Logic
  const themeBtn = document.getElementById('theme-toggle');
  
  if (themeBtn) {
    const html = document.documentElement;

    // Check LocalStorage on load
    if (localStorage.getItem('theme') === 'dark') {
      html.setAttribute('data-theme', 'dark');
    }

    // Handle Click
    themeBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Mobile Menu Logic
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
});