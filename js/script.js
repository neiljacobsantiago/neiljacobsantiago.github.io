async function loadComponents() {
  const includes = document.querySelectorAll('[data-include]');
  for (const el of includes) {
    const file = el.getAttribute('data-include');
    try {
      const response = await fetch(file);
      if (response.ok) {
        el.innerHTML = await response.text();
      } else {
        console.error(`error loading ${file}: ${response.status}`);
      }
    } catch (error) {
      console.error(`fetch error for ${file}:`, error);
    }
  }
  document.dispatchEvent(new Event('componentsLoaded'));
}

const textElement = document.getElementById('typed-text');
const phrases = ["UI/UX Designer", "Network Administrator", "Multimedia Producer", "PC Hardware Enthusiast"];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function type() {
  if (!textElement) return;
  const currentPhrase = phrases[phraseIndex];
  textElement.textContent = currentPhrase.substring(0, charIndex + (isDeleting ? -1 : 1));
  charIndex += isDeleting ? -1 : 1;

  let speed = isDeleting ? 50 : 100;
  if (!isDeleting && charIndex === currentPhrase.length) { speed = 2000; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; speed = 500; }
  setTimeout(type, speed);
}

function reveal() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 50) el.classList.add('active');
  });
}

function initNav() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('nav-links');
  if (btn && nav) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      nav.classList.toggle('is-open');
      const icon = btn.querySelector('i');
      if (icon) {
        if (nav.classList.contains('is-open')) {
          icon.classList.remove('ph-list');
          icon.classList.add('ph-x');
        } else {
          icon.classList.remove('ph-x');
          icon.classList.add('ph-list');
        }
      }
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.classList.remove('ph-x');
          icon.classList.add('ph-list');
        }
      });
    });
  }
}

async function fetchLastUpdate() {
  const timestampEl = document.querySelector('#github-timestamp span');
  if (!timestampEl) return;

  try {
    // Fetching the latest commit from your specific repository
    const response = await fetch('https://api.github.com/repos/neiljacobsantiago/neiljacobsantiago.github.io/commits?per_page=1');
    if (!response.ok) throw new Error('Failed to fetch API');
    
    const data = await response.json();
    const commitDate = new Date(data[0].commit.committer.date);
    
    // Formatting to match: "Feb 23, 2026, 11:15 AM"
    const formattedDate = commitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = commitDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    timestampEl.textContent = `Last updated: ${formattedDate}, ${formattedTime}`;
  } catch (error) {
    console.error("Error fetching last commit:", error);
    // Fallback text if the API limit is reached or network fails
    timestampEl.textContent = "Last updated: Recently"; 
  }
}

function initializeScripts() {
  if (textElement && textElement.textContent === '') type();
  window.addEventListener('scroll', reveal);
  reveal();
  initNav();
  fetchLastUpdate();
}

document.addEventListener('DOMContentLoaded', loadComponents);
document.addEventListener('componentsLoaded', initializeScripts);