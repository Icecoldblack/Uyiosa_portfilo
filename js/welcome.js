// ===================== WELCOME ANIMATION =====================
(function () {
  const el = document.getElementById('scramble-text');
  const hero = document.getElementById('hero-name');
  const btn = document.getElementById('enter-btn');
  const hint = document.getElementById('scroll-hint');
  const navDots = document.getElementById('nav-dots');
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/\\|';
  const final = 'WELCOME, FRIEND.';

  function scramble(text, el, onDone) {
    let iter = 0;
    const total = text.length * 5;
    const iv = setInterval(() => {
      el.textContent = text.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        const resolved = iter / 5 > i;
        if (resolved) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      iter++;
      if (iter > total) { clearInterval(iv); el.textContent = text; if (onDone) onDone(); }
    }, 35);
  }

  setTimeout(() => {
    scramble(final, el, () => {
      setTimeout(() => {
        // scramble out
        let iter = 0;
        const iv = setInterval(() => {
          el.textContent = final.split('').map(ch => {
            if (ch === ' ') return ' ';
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('');
          iter++;
          if (iter > 15) { clearInterval(iv); el.style.opacity = 0; }
        }, 40);

        setTimeout(() => {
          hero.classList.add('show');
          setTimeout(() => {
            btn.classList.add('show');
            hint.classList.add('show');
            navDots.classList.add('visible');
          }, 600);
        }, 700);
      }, 1200);
    });
  }, 600);
})();
