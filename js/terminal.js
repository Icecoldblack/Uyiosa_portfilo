// ===================== TERMINAL (backtick) =====================
document.addEventListener('keydown', e => {
  if (e.key === '`') {
    e.preventDefault();
    document.getElementById('term-ov').classList.toggle('show');
    if (document.getElementById('term-ov').classList.contains('show')) {
      document.getElementById('t-inp').focus();
    }
  }
  if (e.key === 'Escape') closeTerm();
});

function closeTerm() {
  document.getElementById('term-ov').classList.remove('show');
}

const CMDS = {
  help: () => `Commands:\n  <span style="color:var(--cyan)">about</span>     who is this guy\n  <span style="color:var(--cyan)">projects</span>  list projects\n  <span style="color:var(--cyan)">hire</span>      reasons to hire\n  <span style="color:var(--cyan)">joke</span>      programmer humor\n  <span style="color:var(--cyan)">sudo</span>      try it 😈\n  <span style="color:var(--cyan)">clear</span>     clear terminal\n  <span style="color:var(--cyan)">exit</span>      close`,
  about: () => `Uyiosa Nehikhuere\nSoftware Engineering Student\n"Just something I made on the fly. Enjoy :)"`,
  projects: () => `1. EasePath    → github.com/Icecoldblack/EasePath\n2. PantherWatch → github.com/OfficialEseosa/panther-watch\n3. Medapath    → github.com/Icecoldblack/Medapath`,
  hire: () => `<span class="ok">COMPILING REASONS...</span>\n✓ Bro look what i made \n✓ Im begging please :( \n✓ Built this secret terminal in my portfolio :) \n<span class="ok">VERDICT: HIRE HIM IMMEDIATELY</span>`,
  joke: () => `Why do programmers prefer dark mode?\nBecause light attracts bugs. 🦟`,
  sudo: () => `<span class="err">Permission denied: Why you trying to get into my website? </span>\n<span class="err">This incident will be reported.</span>\n<span style="opacity:.4;font-size:.9em">(it won't)</span>`,
  exit: () => { closeTerm(); return null; },
  whoami: () => `curious_visitor`,
  ls: () => `welcome/  experience/  contact/  .secrets/`,
};

document.getElementById('t-inp').addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return;
  const val = this.value.trim().toLowerCase();
  this.value = '';
  const body = document.getElementById('t-body');
  const cmd = document.createElement('div');
  cmd.className = 'tl cmd';
  cmd.textContent = '~$ ' + val;
  body.appendChild(cmd);
  if (val === 'clear') { body.innerHTML = ''; return; }
  const fn = CMDS[val];
  const out = fn ? fn() : `<span class="err">command not found: ${val}</span>\nType <span style="color:var(--cyan)">help</span> for commands.`;
  if (out != null) {
    out.split('\n').forEach(l => {
      const d = document.createElement('div');
      d.className = 'tl';
      d.innerHTML = l;
      body.appendChild(d);
    });
  }
  const sp = document.createElement('div');
  sp.innerHTML = '&nbsp;';
  body.appendChild(sp);
  body.scrollTop = body.scrollHeight;
});
