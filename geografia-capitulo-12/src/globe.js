/* Globo terrestre em WebGL puro: um único shader de tela cheia faz o
   traçado da esfera, a textura NASA Blue Marble, luzes noturnas, oceano
   especular, atmosfera, grade de coordenadas, contorno dos continentes,
   revelação progressiva e realce da vegetação. As "poses" são animadas
   por amortecimento, simulando movimentos de câmera. */
(function () {
  "use strict";

  const canvas = document.getElementById("globe");
  const DEG = Math.PI / 180;

  // Parâmetros animáveis: valor atual e alvo
  const P = {
    cx: 0.5, cy: 0.5, r: 0, alpha: 0, grid: 0, coast: 0, reveal: 1, green: 0,
    night: 0.9, stars: 0, atmo: 1, tilt: 0.38, lon: -50
  };
  const T = Object.assign({}, P);
  let spin = 0.05; // graus por quadro de 60 fps (≈ 3°/s)
  let damp = 2.2;  // velocidade do amortecimento
  let parX = 0, parY = 0, mx = 0, my = 0;

  const POSES = {
    off:          { alpha: 0, stars: 0 },
    right:        { cx: 0.74, cy: 0.52, r: 0.36, alpha: 1, grid: 0.25, coast: 0, reveal: 1, green: 0.85, stars: 0.6, lon: -42, tilt: 0.3, spin: 0.035 },
    "center-dim": { cx: 0.5, cy: 0.5, r: 0.46, alpha: 0.32, grid: 0.2, coast: 0, reveal: 1, green: 0.7, stars: 0.5, spin: 0.02 },
    final:        { cx: 0.5, cy: 0.5, r: 0.44, alpha: 0.55, grid: 0.15, coast: 0, reveal: 1, green: 1, stars: 1, lon: -55, tilt: 0.25, spin: 0.03 },
    // abertura
    "op-dark":    { cx: 0.5, cy: 0.5, r: 0.004, alpha: 0, grid: 1, coast: 0, reveal: 0, green: 0, stars: 0, lon: 10, tilt: 0.42, spin: 0.25 },
    "op-stars":   { alpha: 0, stars: 0.35 },
    "op-grow":    { cx: 0.5, cy: 0.5, r: 0.34, alpha: 1, grid: 1, coast: 0, reveal: 0, green: 0, stars: 1, spin: 0.22 },
    "op-school":  { cx: 0.5, cy: 0.5, r: 0.62, alpha: 0.26, grid: 0.35, coast: 0, reveal: 1, green: 0.8, stars: 0.8, spin: 0.05 },
    "op-team":    { cx: 0.5, cy: 1.32, r: 0.95, alpha: 0.55, grid: 0.5, coast: 0, reveal: 1, green: 0.9, stars: 0.8, spin: 0.04, lon: -50, tilt: 0.1 },
    "op-title":   { cx: 0.5, cy: 0.5, r: 0.5, alpha: 0.18, grid: 0.2, reveal: 1, green: 1, stars: 0.6, spin: 0.04 },
    "op-chapter": { cx: 0.5, cy: 0.5, r: 0.24, alpha: 1, grid: 0.25, reveal: 1, green: 1, stars: 1, lon: -60, tilt: 0.12, spin: 0.02 },
    "op-zoom":    { cx: 0.5, cy: 0.5, r: 3.6, alpha: 1, grid: 0, green: 0.4, stars: 0, lon: -60, tilt: 0.05, spin: 0 }
  };

  const Globe = {
    ok: false,
    pose(name, opts) {
      const p = POSES[name] || POSES.off;
      const mobile = innerWidth < 760 || innerHeight > innerWidth * 1.15;
      for (const k in p) if (k in T && k !== "lon") T[k] = p[k];
      if ("lon" in p) T.lon = P.lon + ((((p.lon - P.lon) % 360) + 540) % 360 - 180);
      if ("spin" in p) spin = p.spin;
      if (name === "right" && mobile) { T.cx = 0.5; T.cy = 0.28; T.r = 0.3; T.alpha = 0.45; }
      damp = (opts && opts.damp) || 2.2;
      if (opts && opts.instant) Object.assign(P, T);
    },
    set(vals, opts) { Object.assign(T, vals); if (opts && opts.instant) Object.assign(P, vals); if (opts && opts.damp) damp = opts.damp; },
    get(k) { return P[k]; },
    setSpin(v) { spin = v; }
  };
  window.Globe = Globe;

  addEventListener("pointermove", (e) => { mx = (e.clientX / innerWidth - 0.5); my = (e.clientY / innerHeight - 0.5); }, { passive: true });

  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" });
  if (!gl) { fallbackCSS(); return; }

  const VS = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";
  const FS = `
precision highp float;
uniform sampler2D uDay, uNight, uWater;
uniform vec2 uCenter; uniform float uRadius, uRot, uTilt, uTime;
uniform float uReveal, uGrid, uCoast, uGreen, uAlpha, uNightAmt, uStars, uAtmo, uHasTex;
uniform vec3 uSun;
const float PI = 3.14159265;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hash3(vec3 p){ return fract(sin(dot(p, vec3(17.1, 113.7, 51.3))) * 43758.5453); }
float noise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  float n000 = hash3(i), n100 = hash3(i+vec3(1,0,0)), n010 = hash3(i+vec3(0,1,0)), n110 = hash3(i+vec3(1,1,0));
  float n001 = hash3(i+vec3(0,0,1)), n101 = hash3(i+vec3(1,0,1)), n011 = hash3(i+vec3(0,1,1)), n111 = hash3(i+vec3(1,1,1));
  return mix(mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y), mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);
}
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 p = (frag - uCenter) / uRadius;
  float r = length(p);
  vec3 col = vec3(0.0); float a = 0.0;   // globo + atmosfera (pré-multiplicado)
  vec3 scol = vec3(0.0); float sa = 0.0; // estrelas

  // estrelas de fundo
  if (uStars > 0.001) {
    vec2 g = floor(frag / 2.5);
    float h = hash(g);
    if (h > 0.9965) {
      float tw = 0.55 + 0.45 * sin(uTime * (1.0 + h * 3.0) + h * 80.0);
      float s = (h - 0.9965) / 0.0035;
      vec3 sc = mix(vec3(0.75, 0.88, 1.0), vec3(0.75, 1.0, 0.85), step(0.5, fract(h * 37.0)));
      scol = sc * s * tw * uStars; sa = s * tw * uStars;
    }
  }

  float px = 1.0 / uRadius;
  if (r > 1.0 - px) {
    // atmosfera externa (halo)
    float d = (r - 1.0);
    float glow = exp(-max(d, 0.0) / 0.055) * 0.75 * uAtmo;
    vec3 gc = mix(vec3(0.25, 0.6, 1.0), vec3(0.35, 1.0, 0.6), uGreen * 0.35);
    col += gc * glow; a = max(a, glow);
  }
  if (r < 1.0 + px) {
    float z = sqrt(max(0.0, 1.0 - r * r));
    vec3 n = vec3(p, z);
    // rotação: inclinação (eixo X) e giro (eixo Y)
    float ct = cos(uTilt), st = sin(uTilt);
    vec3 n1 = vec3(n.x, n.y * ct - n.z * st, n.y * st + n.z * ct);
    float cr = cos(uRot), sr = sin(uRot);
    vec3 w = vec3(n1.x * cr + n1.z * sr, n1.y, -n1.x * sr + n1.z * cr);
    float lat = asin(clamp(w.y, -1.0, 1.0));
    float lon = atan(w.x, w.z);
    vec2 uv = vec2(lon / (2.0 * PI) + 0.5, 0.5 - lat / PI);

    vec3 dayC = uHasTex > 0.5 ? texture2D(uDay, uv).rgb : vec3(0.05, 0.16, 0.3);
    float water = uHasTex > 0.5 ? texture2D(uWater, uv).r : 1.0;
    vec3 nightC = uHasTex > 0.5 ? texture2D(uNight, uv).rgb : vec3(0.0);

    // contorno dos continentes a partir da máscara de água
    vec2 tx = vec2(1.6 / 1024.0, 1.6 / 512.0);
    float w1 = uHasTex > 0.5 ? texture2D(uWater, uv + vec2(tx.x, 0.0)).r : water;
    float w2 = uHasTex > 0.5 ? texture2D(uWater, uv + vec2(0.0, tx.y)).r : water;
    float coast = clamp((abs(water - w1) + abs(water - w2)) * 1.4, 0.0, 1.0);

    // grade de coordenadas (a cada 15°)
    float latD = lat / PI * 180.0, lonD = lon / PI * 180.0;
    float ppd = uRadius * 0.01745 * max(z, 0.18);
    float dLat = abs(fract(latD / 15.0 + 0.5) - 0.5) * 15.0 * ppd;
    float dLon = abs(fract(lonD / 15.0 + 0.5) - 0.5) * 15.0 * ppd * cos(lat);
    float grid = max(1.0 - smoothstep(0.4, 1.5, dLat), (1.0 - smoothstep(0.4, 1.5, dLon)) * smoothstep(0.98, 0.9, abs(w.y)));
    float eq = 1.0 - smoothstep(0.5, 2.2, abs(latD) * ppd);

    // iluminação
    float ndl = dot(n, normalize(uSun));
    float day = smoothstep(-0.18, 0.32, ndl);
    vec3 base = pow(dayC, vec3(0.92)) * 1.12;
    float lum = dot(base, vec3(0.299, 0.587, 0.114));
    base = mix(vec3(lum), base, 1.18);
    vec3 lit = base * (0.12 + 0.95 * day);
    lit += nightC * vec3(1.0, 0.78, 0.5) * (1.0 - day) * uNightAmt * 1.4;
    vec3 refl = reflect(-normalize(uSun), n);
    lit += vec3(0.7, 0.85, 1.0) * pow(max(refl.z, 0.0), 38.0) * water * day * 0.55;

    // realce da vegetação (pixels verdes da Blue Marble)
    float veg = clamp((dayC.g - max(dayC.r, dayC.b) * 0.92) * 7.0, 0.0, 1.0) * (1.0 - water);
    float pulse = 0.55 + 0.45 * sin(uTime * 1.3 - lat * 6.0);
    lit += vec3(0.2, 1.0, 0.45) * veg * uGreen * (0.18 + 0.32 * pulse) * (0.35 + 0.65 * day);

    // revelação progressiva (ruído) a partir do centro do disco
    float nz = noise(w * 3.2) * 0.6 + noise(w * 9.0) * 0.4;
    float f = 0.55 * nz + 0.45 * r;
    float front = uReveal * 1.35 - 0.12;
    float rv = 1.0 - smoothstep(front - 0.05, front, f);
    float edge = exp(-pow((f - front + 0.02) / 0.022, 2.0)) * step(0.001, uReveal) * step(uReveal, 0.999);

    vec3 wire = vec3(0.004, 0.02, 0.035) + vec3(0.2, 1.0, 0.55) * grid * 0.55 * uGrid + vec3(0.45, 1.0, 0.65) * coast * uCoast * 1.1;
    wire += vec3(1.0, 0.85, 0.45) * eq * uGrid * 0.35;
    vec3 surf = lit + vec3(0.25, 1.0, 0.6) * grid * uGrid * 0.12;
    vec3 c = mix(wire, surf, rv) + vec3(0.5, 1.0, 0.7) * edge * 1.4;

    // borda atmosférica (Fresnel)
    float fres = pow(1.0 - z, 2.6);
    c += mix(vec3(0.3, 0.6, 1.0), vec3(0.4, 1.0, 0.7), uGreen * 0.25) * fres * 0.75 * uAtmo;

    float inside = 1.0 - smoothstep(1.0 - px, 1.0 + px, r);
    col = mix(col, c, inside); a = max(a, inside);
  }
  float ga = clamp(a, 0.0, 1.0) * uAlpha;
  gl_FragColor = vec4(col * uAlpha + scol * (1.0 - ga), ga + sa * (1.0 - ga));
}`;

  function sh(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) { fallbackCSS(); return; }
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(prog)); fallbackCSS(); return; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  ["uDay", "uNight", "uWater", "uCenter", "uRadius", "uRot", "uTilt", "uTime", "uReveal", "uGrid", "uCoast", "uGreen", "uAlpha", "uNightAmt", "uStars", "uAtmo", "uHasTex", "uSun"].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  let texReady = 0;
  function tex(unit, src, uni) {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 30, 60, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(U[uni], unit);
    const img = new Image();
    if (!/^data:/.test(src)) img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        texReady++;
        if (texReady >= 3) Globe.ok = true;
      } catch (err) { console.warn("Textura do globo indisponível:", err); }
    };
    img.onerror = () => console.warn("Falha ao carregar textura do globo:", src);
    img.src = src;
  }
  const TEX = window.EARTH_TEX || {};
  tex(0, TEX.day, "uDay"); tex(1, TEX.night, "uNight"); tex(2, TEX.water, "uWater");
  Globe.ok = true;

  let W = 0, H = 0, dpr = 1;
  function resize() {
    const big = innerWidth * innerHeight > 2.2e6;
    dpr = Math.min(window.devicePixelRatio || 1, big ? 1.1 : 1.5);
    W = Math.round(innerWidth * dpr); H = Math.round(innerHeight * dpr);
    canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H);
  }
  addEventListener("resize", resize); resize();

  let last = performance.now(), t0 = last, cleared = false;
  const reduce = () => document.documentElement.classList.contains("reduce-motion");
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const k = 1 - Math.exp(-dt * damp);
    for (const key in T) if (key !== "lon") P[key] += (T[key] - P[key]) * k;
    if (!reduce()) T.lon -= spin * dt * 60;
    P.lon += (T.lon - P.lon) * k;
    parX += (mx - parX) * 0.04; parY += (my - parY) * 0.04;
    if (P.alpha < 0.002 && P.stars < 0.002) {
      if (!cleared) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); cleared = true; }
      return;
    }
    cleared = false;
    const m = Math.min(W, H);
    const cx = (P.cx + parX * 0.02) * W, cy = (1 - (P.cy + parY * 0.02)) * H;
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(U.uCenter, cx, cy);
    gl.uniform1f(U.uRadius, Math.max(1, P.r * m));
    gl.uniform1f(U.uRot, P.lon * DEG);
    gl.uniform1f(U.uTilt, P.tilt + parY * 0.08);
    gl.uniform1f(U.uTime, (now - t0) / 1000);
    gl.uniform1f(U.uReveal, Math.min(1, Math.max(0, P.reveal)));
    gl.uniform1f(U.uGrid, P.grid);
    gl.uniform1f(U.uCoast, P.coast);
    gl.uniform1f(U.uGreen, P.green);
    gl.uniform1f(U.uAlpha, Math.min(1, Math.max(0, P.alpha)));
    gl.uniform1f(U.uNightAmt, P.night);
    gl.uniform1f(U.uStars, Math.max(0, P.stars));
    gl.uniform1f(U.uAtmo, P.atmo);
    gl.uniform1f(U.uHasTex, texReady >= 1 ? 1 : 0);
    gl.uniform3f(U.uSun, -0.55 + parX * 0.2, 0.42, 0.72);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  requestAnimationFrame(frame);

  /* Alternativa sem WebGL: esfera em CSS com a mesma textura */
  function fallbackCSS() {
    canvas.style.display = "none";
    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = "position:fixed;z-index:1;border-radius:50%;pointer-events:none;background-size:200% 100%;background-repeat:repeat-x;transition:left 1.6s,top 1.6s,width 1.6s,height 1.6s,opacity 1.6s;box-shadow:inset -30px -20px 80px rgba(0,0,0,.85),0 0 60px rgba(80,160,255,.35)";
    el.style.backgroundImage = "url(" + ((window.EARTH_TEX || {}).day || "") + ")";
    document.body.appendChild(el);
    let x = 0;
    Globe.ok = false;
    (function loop() {
      requestAnimationFrame(loop);
      const m = Math.min(innerWidth, innerHeight), d = T.r * 2 * m;
      el.style.width = el.style.height = Math.min(d, m * 3) + "px";
      el.style.left = T.cx * innerWidth - Math.min(d, m * 3) / 2 + "px";
      el.style.top = T.cy * innerHeight - Math.min(d, m * 3) / 2 + "px";
      el.style.opacity = T.alpha;
      x -= spin * 0.6; el.style.backgroundPosition = x + "px 0";
    })();
  }
})();
