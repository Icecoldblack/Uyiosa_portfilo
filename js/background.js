// ===================== WEBGL GRAVITY GRID =====================
(function () {
  const canvas = document.getElementById('bg');
  const gl = canvas.getContext('webgl');
  if (!gl) return;

  const VS = `
    attribute vec2 a_pos;
    attribute vec3 a_col;
    uniform vec2 u_res;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform vec2 u_clicks[5];
    uniform float u_click_ages[5];
    varying vec3 v_col;

    void main() {
      vec2 pos = a_pos;
      vec2 toMouse = u_mouse - pos;
      float dist = length(toMouse);
      float gravity = 9000.0 / (dist * dist + 800.0);
      pos -= normalize(toMouse) * gravity;

      for(int i=0;i<5;i++){
        if(u_click_ages[i]>0.0){
          vec2 toClick = pos - u_clicks[i];
          float cd = length(toClick);
          float age = u_click_ages[i];
          float wave = sin(age*0.08 - cd*0.025)*60.0*(1.0-age/120.0);
          float falloff = max(0.0, 1.0 - cd/350.0);
          pos += normalize(toClick)*wave*falloff;
        }
      }

      vec2 clip = (pos / u_res)*2.0-1.0;
      clip.y *= -1.0;
      gl_Position = vec4(clip, 0.0, 1.0);
      gl_PointSize = 2.5;
      v_col = a_col;
    }
  `;
  const FS = `
    precision mediump float;
    varying vec3 v_col;
    void main(){
      vec2 c = gl_PointCoord - .5;
      if(length(c)>.5) discard;
      gl_FragColor = vec4(v_col, 0.9);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uClicks = gl.getUniformLocation(prog, 'u_clicks');
  const uClickAges = gl.getUniformLocation(prog, 'u_click_ages');
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  const aCol = gl.getAttribLocation(prog, 'a_col');

  let W, H, positions, colors, count;
  const SPACING = 22;
  const COLORS = [[1, .15, .15], [.15, 1, .15], [.15, .4, 1]];

  function build() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    gl.viewport(0, 0, W, H);
    const cols = Math.ceil(W / SPACING) + 2;
    const rows = Math.ceil(H / SPACING) + 2;
    count = cols * rows;
    positions = new Float32Array(count * 2);
    colors = new Float32Array(count * 3);
    let idx = 0, ci = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions[idx++] = c * SPACING;
        positions[idx++] = r * SPACING;
        const col = COLORS[(c * 3 + r) % 3];
        colors[ci++] = col[0]; colors[ci++] = col[1]; colors[ci++] = col[2];
      }
    }
  }

  window.addEventListener('resize', build);
  build();

  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  const colBuf = gl.createBuffer();

  const MAX_CLICKS = 5;
  const clickPositions = new Float32Array(MAX_CLICKS * 2);
  const clickAges = new Float32Array(MAX_CLICKS);
  let clickSlot = 0;

  document.addEventListener('click', e => {
    if (document.getElementById('term-ov').classList.contains('show')) return;
    if (document.getElementById('mat-ov').classList.contains('show')) return;
    clickPositions[clickSlot * 2] = e.clientX;
    clickPositions[clickSlot * 2 + 1] = e.clientY;
    clickAges[clickSlot] = 1;
    clickSlot = (clickSlot + 1) % MAX_CLICKS;
  });

  let mouseX = W / 2, mouseY = H / 2;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  let t = 0;
  function render() {
    t++;
    for (let i = 0; i < MAX_CLICKS; i++) {
      if (clickAges[i] > 0) clickAges[i] += 1;
      if (clickAges[i] > 120) clickAges[i] = 0;
    }

    gl.clearColor(0.035, 0.04, 0.075, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aCol);
    gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);

    gl.uniform2f(uRes, W, H);
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.uniform1f(uTime, t);
    gl.uniform2fv(uClicks, clickPositions);
    gl.uniform1fv(uClickAges, clickAges);

    gl.drawArrays(gl.POINTS, 0, count);
    requestAnimationFrame(render);
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  render();
})();
