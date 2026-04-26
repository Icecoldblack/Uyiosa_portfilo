// ===================== CURSOR =====================
const cur = document.getElementById('cur');
const curR = document.getElementById('cur-r');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animC() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
  curR.style.left = rx + 'px';
  curR.style.top = ry + 'px';
  requestAnimationFrame(animC);
})();
