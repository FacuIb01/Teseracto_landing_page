import { initContact } from './contact.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 699px)');
const navigation = document.querySelector('.navigation');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function closeMenu(restoreFocus = false) {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
navigation.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) closeMenu(true);
});
navigation.addEventListener('focusout', event => {
  if (!navigation.contains(event.relatedTarget)) closeMenu();
});
document.addEventListener('pointerdown', event => { if (!navigation.contains(event.target)) closeMenu(); });
navLinks.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
mobile.addEventListener('change', () => closeMenu());
menuButton.hidden = false;
navigation.classList.add('is-enhanced');

const accordion = document.querySelector('.accordion');
const services = [...accordion.querySelectorAll('.service')];
const summaries = services.map(service => service.querySelector('summary'));
let manualScrollPosition = null;
let keyboardNavigation = false;
let activeService = -1;
let lastAutomaticIndex = -1;
let lastScrollY = window.scrollY;
let anchorNavigation = false;
let anchorTimer;

document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  anchorNavigation = true;
  clearTimeout(anchorTimer);
  if (link.getAttribute('href') === '#servicios') openService(0);
  // Let native anchor navigation finish without changing the height above its target.
  anchorTimer = setTimeout(() => { anchorNavigation = false; }, 1200);
});

function openService(index) {
  if (activeService === index) return;
  services.forEach((service, i) => {
    service.open = i === index;
    summaries[i].setAttribute('aria-expanded', String(i === index));
  });
  activeService = index;
}
summaries.forEach((summary, index) => {
  summary.setAttribute('aria-expanded', 'false');
  summary.addEventListener('click', event => {
    event.preventDefault();
    manualScrollPosition = window.scrollY;
    openService(activeService === index ? -1 : index);
  });
  summary.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowDown') target = (index + 1) % summaries.length;
    if (event.key === 'ArrowUp') target = (index + summaries.length - 1) % summaries.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = summaries.length - 1;
    if (target !== undefined) { event.preventDefault(); summaries[target].focus(); }
  });
});
document.addEventListener('keydown', () => { keyboardNavigation = true; });
document.addEventListener('pointerdown', () => { keyboardNavigation = false; }, { passive: true });

function updateServices() {
  if (reducedMotion.matches || anchorNavigation) return;
  const rect = accordion.getBoundingClientRect();
  const line = innerHeight * .68;
  if (rect.bottom < 0 || rect.top > innerHeight) {
    manualScrollPosition = null;
    lastAutomaticIndex = -1;
    return;
  }
  // Fixed thresholds within the section avoid a feedback loop when an earlier row closes.
  // This never scrolls the page, captures wheel/touch events, or collapses a focused panel.
  const step = mobile.matches ? 230 : 190;
  const index = Math.min(2, Math.floor((line - rect.top) / step));
  if (index < 0) return;
  const focus = document.activeElement;
  if (accordion.contains(focus) && (keyboardNavigation || focus.closest('.service-panel'))) return;
  if (manualScrollPosition !== null) {
    if (Math.abs(window.scrollY - manualScrollPosition) < innerHeight * .6) return;
    manualScrollPosition = null;
  }
  if (index !== lastAutomaticIndex) {
    lastAutomaticIndex = index;
    openService(index);
  }
}

const hero = document.querySelector('.hero');
const cubes = [...document.querySelectorAll('.hero-cube')];
const about = document.querySelector('.about');
const aboutCube = document.querySelector('.about-cube');
let pointerX = 0, pointerY = 0, frame = 0;
function updateMotion() {
  if (reducedMotion.matches || document.hidden) return;
  const rect = hero.getBoundingClientRect();
  if (rect.bottom > 0 && rect.top < innerHeight) {
    const travel = Math.max(-30, Math.min(45, -rect.top * (mobile.matches ? .025 : .06)));
    cubes.forEach(cube => {
      const depth = Number(cube.dataset.depth);
      cube.style.setProperty('--px', `${mobile.matches ? 0 : pointerX * depth * 7}px`);
      cube.style.setProperty('--py', `${(travel + (mobile.matches ? 0 : pointerY * 5)) * depth}px`);
    });
  }
  const aboutRect = about.getBoundingClientRect();
  if (aboutRect.bottom > 0 && aboutRect.top < innerHeight) {
    const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - aboutRect.top - aboutRect.height / 2) / innerHeight));
    aboutCube.style.setProperty('--float', `${progress * 10}px`);
    aboutCube.style.setProperty('--rotation', `${progress * 2}deg`);
  }
}
function render() {
  frame = 0;
  updateMotion();
  if (Math.abs(window.scrollY - lastScrollY) > 1) updateServices();
  lastScrollY = window.scrollY;
}
function requestRender() { if (!frame) frame = requestAnimationFrame(render); }
window.addEventListener('scroll', requestRender, { passive: true });
window.addEventListener('resize', requestRender, { passive: true });
hero.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || reducedMotion.matches) return;
  const rect = hero.getBoundingClientRect();
  pointerX = (event.clientX - rect.left) / rect.width - .5;
  pointerY = (event.clientY - rect.top) / rect.height - .5;
  requestRender();
}, { passive: true });
hero.addEventListener('pointerleave', () => { pointerX = pointerY = 0; requestRender(); });

const brands = document.querySelector('.brands');
const marqueeButton = document.querySelector('.marquee-toggle');
let marqueePaused = false;
function syncMotionPreference() {
  brands.classList.toggle('is-static', reducedMotion.matches);
  brands.classList.toggle('is-animated', !reducedMotion.matches);
  marqueeButton.hidden = reducedMotion.matches;
  if (reducedMotion.matches) {
    cubes.forEach(cube => { cube.style.removeProperty('--px'); cube.style.removeProperty('--py'); });
    aboutCube.style.removeProperty('--float');
    aboutCube.style.removeProperty('--rotation');
  }
  requestRender();
}
marqueeButton.addEventListener('click', () => {
  marqueePaused = !marqueePaused;
  brands.classList.toggle('is-paused', marqueePaused);
  marqueeButton.setAttribute('aria-pressed', String(marqueePaused));
  marqueeButton.setAttribute('aria-label', marqueePaused ? 'Reanudar movimiento de las marcas' : 'Pausar movimiento de las marcas');
});
let brandsVisible = true;
const brandObserver = new IntersectionObserver(([entry]) => {
  brandsVisible = entry.isIntersecting;
  brands.classList.toggle('is-offscreen', !brandsVisible || document.hidden);
});
brandObserver.observe(brands);
document.addEventListener('visibilitychange', () => {
  brands.classList.toggle('is-offscreen', !brandsVisible || document.hidden);
  if (!document.hidden) requestRender();
});
reducedMotion.addEventListener('change', syncMotionPreference);
syncMotionPreference();

document.querySelector('#year').textContent = String(new Date().getFullYear());
initContact(document.querySelector('#contact-form'));
