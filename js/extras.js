// ===================== TOAST =====================
function toast(msg, dur = 3500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

// ===================== KONAMI =====================
const K = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let ki = 0;
let matrixActive = false;       // prevents double-trigger
let matrixInterval = null;      // tracked so it's always clearable
window.konamiInProgress = false; // read by pages.js to block arrow nav

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

// ===================== CLICK NAME EASTER EGG =====================
let nc = 0;
document.querySelector('.line1').addEventListener('click', () => {
  nc++;
  if (nc === 7) {
    nc = 0;
    document.body.style.transition = 'filter .5s';
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => document.body.style.filter = '', 2000);
    toast('okay okay stop touching me!');
  }
});
