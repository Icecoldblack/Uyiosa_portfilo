// ===================== PAGES =====================
const pages = ['page-welcome', 'page-experience', 'page-contact'];
let current = 0;
const dots = document.querySelectorAll('.dot-btn');

function goTo(idx) {
  if (idx === current || idx < 0 || idx >= pages.length) return;
  const prev = current;
  const forward = idx > prev;
  const fromEl = document.getElementById(pages[prev]);
  const toEl = document.getElementById(pages[idx]);
  current = idx;

  fromEl.classList.remove('active');
  fromEl.classList.add(forward ? 'exit-up' : 'exit-down');
  toEl.style.opacity = 0;
  toEl.classList.add(forward ? 'enter-up' : 'enter-down');

  setTimeout(() => {
    fromEl.classList.remove('exit-up', 'exit-down');
    toEl.classList.remove('enter-up', 'enter-down');
    toEl.classList.add('active');
    toEl.style.opacity = '';
  }, 700);

  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

// Nav dots
dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.page))));

// Keyboard nav
document.addEventListener('keydown', e => {
  if (document.getElementById('term-ov').classList.contains('show')) return;
  // Block page nav while the user is entering the Konami sequence
  if (window.konamiInProgress) return;
  if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(current + 1);
  if (e.key === 'ArrowUp' || e.key === 'PageUp') goTo(current - 1);
});

// Scroll
let wheelLock = false;
document.addEventListener('wheel', e => {
  if (wheelLock) return;
  wheelLock = true;
  setTimeout(() => wheelLock = false, 800);
  if (e.deltaY > 0) goTo(current + 1);
  else goTo(current - 1);
}, { passive: true });
