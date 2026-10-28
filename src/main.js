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
// Fraction of viewport height measured from the top; .5 is the screen center.
const SERVICE_TRIGGER_RATIO = .52;
const SERVICE_ANIMATION_MS = 420;
const SERVICE_EASING = 'cubic-bezier(.22, 1, .36, 1)';
const serviceAnimations = new Map();
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

function animateService(index, expanded) {
  const service = services[index];
  const panel = service.querySelector('.service-panel');
  // Capture the current animated height so a quick reversal continues without a jump.
  const startHeight = service.getBoundingClientRect().height;
  const previous = serviceAnimations.get(service);
  if (previous) {
    previous.onfinish = null;
    previous.cancel();
    serviceAnimations.delete(service);
  }
  summaries[index].setAttribute('aria-expanded', String(expanded));
  panel.inert = !expanded;
  panel.setAttribute('aria-hidden', String(!expanded));
  service.classList.toggle('is-closing', !expanded);

  function finish() {
    service.open = expanded;
    service.style.removeProperty('height');
    service.classList.remove('is-animating', 'is-closing');
    serviceAnimations.delete(service);
  }
  if (reducedMotion.matches || !service.animate || (!expanded && !service.open)) {
    finish();
    return;
  }
  service.style.height = `${startHeight}px`;
  service.classList.add('is-animating');
  // Keep native content rendered during collapse; hide it only once the animation ends.
  service.open = true;
  const borderHeight = service.offsetHeight - service.clientHeight;
  const endHeight = summaries[index].getBoundingClientRect().height + borderHeight
    + (expanded ? panel.getBoundingClientRect().height : 0);
  const animation = service.animate(
    [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
    { duration: SERVICE_ANIMATION_MS, easing: SERVICE_EASING },
  );
  serviceAnimations.set(service, animation);
  animation.onfinish = finish;
}

function openService(index) {
  if (activeService === index) return;
  const previousIndex = activeService;
  activeService = index;
  if (previousIndex >= 0) animateService(previousIndex, false);
  if (index >= 0) animateService(index, true);
}
summaries.forEach((summary, index) => {
  // JS manages exclusivity so the browser does not hide the closing panel prematurely.
  services[index].removeAttribute('name');
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
  const line = innerHeight * SERVICE_TRIGGER_RATIO;
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
const stories = [...document.querySelectorAll('.stories .story')];
if (!reducedMotion.matches) {
  stories.forEach(story => story.classList.add('is-pending'));
  const storyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.30) return;
      entry.target.classList.remove('is-pending');
      entry.target.classList.add('animate__animated', 'animate__fadeIn');
      storyObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -20% 0px', threshold: 0.30 });
  stories.forEach(story => storyObserver.observe(story));
}
let pointerX = 0, pointerY = 0, frame = 0;
let easedPointerX = 0, easedPointerY = 0, previousMotionTime = 0;
// Time constant in milliseconds: larger values make the mouse follow/return softer.
const POINTER_EASE_MS = 160;
function updateMotion(now) {
  if (reducedMotion.matches || document.hidden) {
    previousMotionTime = 0;
    return false;
  }
  let easing = false;
  const rect = hero.getBoundingClientRect();
  if (rect.bottom > 0 && rect.top < innerHeight) {
    const delta = previousMotionTime ? Math.min(now - previousMotionTime, 64) : 1000 / 60;
    const blend = 1 - Math.exp(-delta / POINTER_EASE_MS);
    easedPointerX += (pointerX - easedPointerX) * blend;
    easedPointerY += (pointerY - easedPointerY) * blend;
    if (Math.abs(pointerX - easedPointerX) < .001) easedPointerX = pointerX;
    if (Math.abs(pointerY - easedPointerY) < .001) easedPointerY = pointerY;
    easing = easedPointerX !== pointerX || easedPointerY !== pointerY;
    previousMotionTime = easing ? now : 0;
    const travel = Math.max(-30, Math.min(45, -rect.top * (mobile.matches ? .025 : .15)));
    cubes.forEach(cube => {
      const depth = Number(cube.dataset.depth);
      cube.style.setProperty('--px', `${mobile.matches ? 0 : easedPointerX * depth * 7}px`);
      cube.style.setProperty('--py', `${(travel + (mobile.matches ? 0 : easedPointerY * 5)) * depth}px`);
    });
  } else {
    easedPointerX = pointerX;
    easedPointerY = pointerY;
    previousMotionTime = 0;
  }
  const aboutRect = about.getBoundingClientRect();
  if (aboutRect.bottom > 0 && aboutRect.top < innerHeight) {
    const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - aboutRect.top - aboutRect.height / 2) / innerHeight));
    aboutCube.style.setProperty('--float', `${progress * 10}px`);
    aboutCube.style.setProperty('--rotation', `${progress * 2}deg`);
  }
  return easing;
}
function render(now) {
  frame = 0;
  const easing = updateMotion(now);
  if (Math.abs(window.scrollY - lastScrollY) > 1) updateServices();
  lastScrollY = window.scrollY;
  // Keep drawing only until the mouse offset reaches its target, including on exit.
  if (easing) requestRender();
}
function requestRender() { if (!frame) frame = requestAnimationFrame(render); }
window.addEventListener('scroll', requestRender, { passive: true });
window.addEventListener('resize', requestRender, { passive: true });
window.addEventListener('resize', () => {
  serviceAnimations.forEach(animation => animation.finish());
}, { passive: true });
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
    services.forEach((service, index) => {
      if (serviceAnimations.has(service)) animateService(index, index === activeService);
    });
    pointerX = pointerY = easedPointerX = easedPointerY = previousMotionTime = 0;
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
