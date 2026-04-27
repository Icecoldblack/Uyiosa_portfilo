// ===================== TOAST =====================
function toast(msg, dur = 3500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

// ===================== KONAMI =====================
const K = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
// Mobile swipe sequence mirrors keyboard (no 'b','a' — 8 swipes only)
const KS = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right'];
let ki = 0;
let ksi = 0; // swipe index
let matrixActive = false;       // prevents double-trigger
let matrixInterval = null;      // tracked so it's always clearable
window.konamiInProgress = false; // read by pages.js to block arrow nav

// ── Keyboard Konami ──
document.addEventListener('keydown', e => {
  // Don't track sequence if the terminal is open or matrix is already showing
  if (document.getElementById('term-ov').classList.contains('show')) return;
  if (matrixActive) return;

  if (e.key === K[ki]) {
    ki++;
    // Signal to pages.js that Konami arrow-keys should NOT navigate pages
    window.konamiInProgress = ki > 0;
    if (ki === K.length) {
      ki = 0;
      window.konamiInProgress = false;
      triggerMatrix();
    }
  } else {
    ki = 0;
    window.konamiInProgress = false;
  }
});

// ── Swipe Konami (mobile) ──
let _sx = null, _sy = null;
document.addEventListener('touchstart', e => {
  _sx = e.touches[0].clientX;
  _sy = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
  if (_sx === null || matrixActive) return;
  if (document.getElementById('term-ov').classList.contains('show')) return;
  const dx = e.changedTouches[0].clientX - _sx;
  const dy = e.changedTouches[0].clientY - _sy;
  _sx = null; _sy = null;

  // Need at least 40px of movement to count as a swipe
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 40) return;

  let dir;
  if (Math.abs(dy) > Math.abs(dx)) {
    dir = dy < 0 ? 'up' : 'down';
  } else {
    dir = dx < 0 ? 'left' : 'right';
  }

  if (dir === KS[ksi]) {
    ksi++;
    window.konamiInProgress = ksi > 0; // block page-swipe nav mid-sequence
    if (ksi === KS.length) {
      ksi = 0;
      window.konamiInProgress = false;
      triggerMatrix();
    }
  } else {
    ksi = 0;
    window.konamiInProgress = false;
  }
}, { passive: true });

function triggerMatrix() {
  if (matrixActive) return; // hard guard against rapid double-call
  matrixActive = true;

  const ov = document.getElementById('mat-ov');
  const cv = document.getElementById('mat-cv');
  const ctx = cv.getContext('2d');
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;

  // Always clear any leftover interval before starting a new one
  if (matrixInterval) { clearInterval(matrixInterval); matrixInterval = null; }
  ctx.clearRect(0, 0, cv.width, cv.height);

  ov.classList.add('show');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオ0123456789';
  const cols = Math.floor(cv.width / 16);
  const drops = Array(cols).fill(1);

  matrixInterval = setInterval(() => {
    ctx.fillStyle = 'rgba(9,10,20,.05)';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = '14px JetBrains Mono,monospace';
    drops.forEach((y, i) => {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, y * 16);
      if (y * 16 > cv.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    });
  }, 33);

  // Use a named function so onclick isn't re-assigned on every trigger
  ov.onclick = closeMatrix;
  toast(' Konami activated — click to close');
}

function closeMatrix() {
  const ov = document.getElementById('mat-ov');
  const cv = document.getElementById('mat-cv');
  const ctx = cv.getContext('2d');
  ov.classList.remove('show');
  clearInterval(matrixInterval);
  matrixInterval = null;
  matrixActive = false;
  ctx.clearRect(0, 0, cv.width, cv.height);
  ov.onclick = null;
}

// ===================== CLICK / TAP NAME EASTER EGG =====================
let nc = 0;
function onNameActivate() {
  nc++;
  if (nc === 7) {
    nc = 0;
    document.body.style.transition = 'filter .5s';
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => document.body.style.filter = '', 2000);
    toast('okay okay stop touching me!');
  }
}
document.querySelector('.line1').addEventListener('click', onNameActivate);
// Touch devices: touchend fires 'click' on mobile anyway, but be explicit
document.querySelector('.line1').addEventListener('touchend', e => {
  // Prevent the ghost click that would double-count
  e.preventDefault();
  onNameActivate();
}, { passive: false });

// ===================== LONG-PRESS → TERMINAL (mobile) =====================
let _lpTimer = null;
const _lpTarget = document.querySelector('.line1');
_lpTarget.addEventListener('touchstart', e => {
  _lpTimer = setTimeout(() => {
    _lpTimer = null;
    const termOv = document.getElementById('term-ov');
    termOv.classList.toggle('show');
    if (termOv.classList.contains('show')) {
      document.getElementById('t-inp').focus();
      toast(' long-press unlocked — terminal open');
    }
  }, 1000); // 1-second hold
}, { passive: true });
_lpTarget.addEventListener('touchend', () => {
  if (_lpTimer) { clearTimeout(_lpTimer); _lpTimer = null; }
});
_lpTarget.addEventListener('touchmove', () => {
  if (_lpTimer) { clearTimeout(_lpTimer); _lpTimer = null; }
});
