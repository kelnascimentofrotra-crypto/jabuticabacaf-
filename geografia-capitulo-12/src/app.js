/* Controlador da apresentação: cenas, transições, abertura cinematográfica,
   imagens com carregamento gradual, partículas, interações, quiz e HUD. */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const html = document.documentElement, body = document.body;
  const IMG = window.MEDIA_IMAGES || {}, AUD = window.MEDIA_AUDIO || {};
  const BIOMES = window.BIOMES || [], TEX = window.EARTH_TEX || {};
  const Sound = window.Sound, Globe = window.Globe;
  const COMMONS = "https://commons.wikimedia.org/wiki/";
  const UP = "https://upload.wikimedia.org/wikipedia/commons/";

  /* ---------- preferências (armazenamento local opcional) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("cap12:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("cap12:" + k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } }
  };

  /* ---------- movimento reduzido ---------- */
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  let reduceMotion = store.get("reduce", mqReduce.matches);
  function applyMotion() {
    html.classList.toggle("reduce-motion", reduceMotion);
    html.classList.toggle("force-motion", !reduceMotion && mqReduce.matches);
    $("#swMotion").setAttribute("aria-checked", String(reduceMotion));
  }

  /* ---------- tempo: timers agrupados por dono ---------- */
  const timers = {};
  function later(owner, ms, fn) { (timers[owner] = timers[owner] || []).push(setTimeout(fn, ms)); }
  function clearLater(owner) { (timers[owner] || []).forEach(clearTimeout); timers[owner] = []; }

  /* ---------- texto dividido em letras/palavras ---------- */
  function splitText(el) {
    const mode = el.dataset.split;
    let i = 0;
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    const walk = (node) => {
      Array.from(node.childNodes).forEach((ch) => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            if (mode === "letters") {
              const word = document.createElement("span");
              word.style.cssText = "display:inline-block;white-space:nowrap";
              word.setAttribute("aria-hidden", "true");
              Array.from(part).forEach((c) => {
                const s = document.createElement("span"); s.className = "ch"; s.textContent = c; s.style.setProperty("--i", i++); word.appendChild(s);
              });
              frag.appendChild(word);
            } else {
              const s = document.createElement("span"); s.className = "wd"; s.textContent = part; s.style.setProperty("--i", i++); s.setAttribute("aria-hidden", "true"); frag.appendChild(s);
            }
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1) walk(ch);
      });
    };
    walk(el);
    el.classList.add("split");
  }

  /* ---------- imagens: carregamento gradual com alternativas ---------- */
  function imgCandidates(key, size) {
    const m = IMG[key]; if (!m) return [];
    const orig = UP + m.h + "/" + m.f;
    const list = [];
    if (m.w && m.w <= size) list.push(orig);
    else if (m.w) list.push(UP + "thumb/" + m.h + "/" + m.f + "/" + size + "px-" + m.f);
    list.push(COMMONS + "Special:FilePath/" + m.f + "?width=" + size);
    list.push(orig);
    return Array.from(new Set(list));
  }
  const unknown = (s) => !s || /ver página/i.test(s);
  function creditText(m) {
    const parts = [];
    if (!unknown(m.by)) parts.push(m.by);
    if (!unknown(m.lic)) parts.push(m.lic);
    parts.push("Wikimedia Commons");
    return "Foto: " + parts.join(" · ");
  }
  function fallbackSVG() {
    return '<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<path d="M0 175 Q 70 140 140 165 T 280 150 T 400 168 V240 H0Z" fill="rgba(255,255,255,.07)"/>' +
      '<path d="M0 200 Q 90 178 190 196 T 400 190 V240 H0Z" fill="rgba(0,0,0,.25)"/>' +
      '<g fill="rgba(255,255,255,.12)"><path d="M60 170 l12 -40 l12 40z"/><path d="M84 172 l9 -30 l9 30z"/><path d="M300 160 l14 -46 l14 46z"/><path d="M328 164 l10 -32 l10 32z"/></g>' +
      '<circle cx="330" cy="58" r="18" fill="rgba(255,255,255,.1)"/></svg>';
  }
  function prepPh(el) {
    if (el.dataset.ready) return;
    el.dataset.ready = "1";
    const key = el.dataset.img, m = IMG[key];
    const img = document.createElement("img");
    img.alt = m ? m.alt : "";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer-when-downgrade";
    el.appendChild(img);
    const sh = document.createElement("div"); sh.className = "shimmer"; el.appendChild(sh);
    const fb = document.createElement("div"); fb.className = "fallback";
    fb.innerHTML = fallbackSVG() + "<b>Imagem indisponível agora</b><span></span>";
    fb.querySelector("span").textContent = m ? m.alt : "";
    el.appendChild(fb);
    if (m && el.dataset.credit !== "none") {
      const a = document.createElement("a");
      a.className = "credit"; a.href = COMMONS + "File:" + m.f; a.target = "_blank"; a.rel = "noopener";
      a.textContent = creditText(m); a.title = "Ver autor e licença no Wikimedia Commons";
      el.appendChild(a);
    }
  }
  function loadPh(el) {
    prepPh(el);
    if (el.dataset.state) return;
    el.dataset.state = "loading";
    const img = el.querySelector("img");
    const list = imgCandidates(el.dataset.img, Number(el.dataset.size) || 1280);
    let i = 0;
    const tryNext = () => {
      if (i >= list.length) { el.dataset.state = "failed"; el.classList.add("is-failed"); return; }
      img.src = list[i++];
    };
    img.onload = () => {
      const done = () => { el.dataset.state = "loaded"; el.classList.add("is-loaded"); };
      if (img.decode) img.decode().then(done, done); else done();
    };
    img.onerror = tryNext;
    tryNext();
  }
  function loadImagesIn(root) { if (root) $$(".ph[data-img]", root).forEach(loadPh); }

  /* ---------- fundo topográfico gerado ---------- */
  function topoBackground() {
    const W = 1600, H = 1000; let paths = "";
    [[360, 300], [1240, 720], [1320, 170], [700, 860]].forEach(([cx, cy], ci) => {
      for (let k = 1; k <= 12; k++) {
        const r = k * 32 + ci * 8, ph = Math.random() * 6.28, ph2 = Math.random() * 6.28;
        let d = "";
        for (let a = 0; a <= 72; a++) {
          const t = (a / 72) * Math.PI * 2;
          const rr = r * (1 + 0.12 * Math.sin(3 * t + ph) + 0.06 * Math.sin(5 * t + ph2 + k * 0.3));
          d += (a ? "L" : "M") + (cx + Math.cos(t) * rr * 1.3).toFixed(1) + " " + (cy + Math.sin(t) * rr).toFixed(1);
        }
        paths += '<path d="' + d + 'Z"/>';
      }
    });
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#6dffa0" stroke-width="1" opacity=".5">' + paths + "</g></svg>";
    $("#topo").style.backgroundImage = 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")';
  }

  /* ---------- partículas por ambiente ---------- */
  const FX = (function () {
    const cv = $("#fx"), ctx = cv.getContext("2d");
    let W = 0, H = 0, dpr = 1, mode = "space", parts = [], mx = 0, my = 0;
    let leafPalette = ["#ff8a3d", "#ffb43d", "#e8562e"];
    const COUNT = { space: 70, tropical: 60, conifer: 110, tundra: 150, temperate: 34, grass: 55, impact: 95, restore: 55, quiz: 26 };
    const rnd = (a, b) => a + Math.random() * (b - a);
    function resize() { dpr = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    addEventListener("resize", resize); resize();
    addEventListener("pointermove", (e) => { mx = e.clientX / W - 0.5; my = e.clientY / H - 0.5; }, { passive: true });

    function spawn(m, anywhere) {
      const p = { m, a: 0, life: 0, z: rnd(0.3, 1) };
      p.x = rnd(0, W); p.y = anywhere ? rnd(0, H) : 0;
      switch (m) {
        case "tropical": case "restore":
          if (!anywhere) p.y = H + 10; p.vx = rnd(-0.15, 0.15); p.vy = rnd(-0.55, -0.18); p.s = rnd(0.8, 2.6);
          p.c = m === "tropical" ? (Math.random() < 0.5 ? "217,255,122" : "109,255,160") : (Math.random() < 0.6 ? "125,255,173" : "200,255,220"); break;
        case "conifer":
          if (!anywhere) p.y = -10; p.vx = rnd(-0.2, 0.2); p.vy = rnd(0.25, 0.85) * p.z; p.s = rnd(0.8, 2.8) * p.z; p.c = "235,245,250"; break;
        case "tundra":
          p.x = anywhere ? rnd(0, W) : -20; p.y = rnd(0, H); p.vx = rnd(3.5, 9) * p.z; p.vy = rnd(0.2, 1); p.s = rnd(0.6, 1.8); p.c = "240,248,255"; break;
        case "temperate":
          if (!anywhere) p.y = -20; p.vx = rnd(-0.6, 0.6); p.vy = rnd(0.5, 1.3); p.s = rnd(4, 8) * p.z; p.rot = rnd(0, 6.28); p.vr = rnd(-0.04, 0.04);
          p.col = leafPalette[Math.floor(Math.random() * leafPalette.length)]; break;
        case "grass":
          p.x = anywhere ? rnd(0, W) : -10; p.y = rnd(H * 0.2, H); p.vx = rnd(0.3, 1.1) * p.z; p.vy = rnd(-0.1, 0.1); p.s = rnd(0.8, 2.2); p.c = Math.random() < 0.7 ? "241,207,107" : "255,240,200"; break;
        case "impact":
          if (!anywhere) p.y = H + 10; p.vx = rnd(-0.4, 0.4); p.vy = rnd(-1.8, -0.5); p.s = rnd(0.8, 2.6); p.c = Math.random() < 0.7 ? "255,120,50" : "255,200,90"; p.max = rnd(220, 520); break;
        default:
          p.vx = rnd(-0.08, 0.08); p.vy = rnd(-0.06, 0.04); p.s = rnd(0.5, 1.8); p.c = Math.random() < 0.6 ? "170,255,200" : "150,210,255";
      }
      return p;
    }
    function setMode(m) {
      if (m === mode && parts.length) return;
      mode = m;
      parts.forEach((p) => { if (p.m !== m) p.dying = true; });
      const n = COUNT[m] || 40;
      for (let i = 0; i < n; i++) parts.push(spawn(m, true));
    }
    function setLeaves(pal) { leafPalette = pal; parts.forEach((p) => { if (p.m === "temperate") p.col = pal[Math.floor(Math.random() * pal.length)]; }); }
    function burst(x, y, n, rgb) {
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * 6.28, sp = rnd(1.5, 7);
        parts.push({ m: "burst", x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, s: rnd(0.8, 2.4), c: rgb || "140,255,180", a: 1, life: 0, z: 1, max: rnd(60, 140) });
      }
    }
    function frame() {
      requestAnimationFrame(frame);
      ctx.clearRect(0, 0, W, H);
      if (html.classList.contains("reduce-motion") || document.hidden) return;
      const target = COUNT[mode] || 40;
      let alive = 0;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life++;
        if (p.m === "burst") { p.vx *= 0.96; p.vy *= 0.96; p.a = 1 - p.life / p.max; if (p.a <= 0) { parts.splice(i, 1); continue; } }
        else if (p.dying) { p.a -= 0.02; if (p.a <= 0) { parts.splice(i, 1); continue; } }
        else { alive++; p.a = Math.min(1, p.a + 0.02); }
        p.x += p.vx; p.y += p.vy;
        if (p.m === "tropical" || p.m === "restore") p.x += Math.sin((p.life + p.y) * 0.01) * 0.3;
        if (p.m === "conifer") p.x += Math.sin(p.life * 0.02 + p.z * 10) * 0.35;
        if (p.m === "temperate") { p.x += Math.sin(p.life * 0.03 + p.z * 9) * 0.8; p.rot += p.vr; }
        if (p.m === "grass") p.y += Math.sin(p.life * 0.02 + p.z * 7) * 0.25;
        if (p.m === "impact") { p.x += Math.sin(p.life * 0.08) * 0.3; if (p.life > p.max) p.dying = true; }
        const out = p.y < -30 || p.y > H + 30 || p.x < -40 || p.x > W + 40;
        if (out && p.m !== "burst") {
          if (p.m === "space") { p.x = (p.x + W) % W; p.y = (p.y + H) % H; }
          else { parts.splice(i, 1); continue; }
        }
        const ox = mx * 26 * (p.z || 1), oy = my * 18 * (p.z || 1);
        if (p.m === "temperate") {
          ctx.save(); ctx.translate(p.x + ox, p.y + oy); ctx.rotate(p.rot);
          ctx.globalAlpha = p.a * 0.85; ctx.fillStyle = p.col;
          ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.45, 0, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = p.a * 0.4; ctx.strokeStyle = "rgba(0,0,0,.6)"; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(-p.s, 0); ctx.lineTo(p.s, 0); ctx.stroke();
          ctx.restore(); continue;
        }
        let tw = 1;
        if (p.m === "space") tw = 0.55 + 0.45 * Math.sin(p.life * 0.05 + p.z * 20);
        if (p.m === "impact") tw = 0.6 + 0.4 * Math.sin(p.life * 0.3 + p.z * 30);
        ctx.globalAlpha = 1;
        if (p.m === "tundra") {
          ctx.strokeStyle = "rgba(" + p.c + "," + (0.55 * p.a) + ")"; ctx.lineWidth = p.s;
          ctx.beginPath(); ctx.moveTo(p.x + ox, p.y + oy); ctx.lineTo(p.x + ox - p.vx * 3.2, p.y + oy - p.vy * 3); ctx.stroke(); continue;
        }
        ctx.fillStyle = "rgba(" + p.c + "," + (0.75 * p.a * tw) + ")";
        ctx.beginPath(); ctx.arc(p.x + ox, p.y + oy, p.s, 0, Math.PI * 2); ctx.fill();
        if (p.m !== "conifer" && p.s > 1.4) {
          ctx.fillStyle = "rgba(" + p.c + "," + (0.12 * p.a * tw) + ")";
          ctx.beginPath(); ctx.arc(p.x + ox, p.y + oy, p.s * 3.5, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (alive < target) for (let k = 0; k < Math.min(3, target - alive); k++) parts.push(spawn(mode, false));
    }
    requestAnimationFrame(frame);
    return { setMode, setLeaves, burst };
  })();

  /* ---------- cenas ---------- */
  const scenes = $$("#stage > .scene");
  const N = scenes.length;
  const indexOf = (id) => scenes.findIndex((s) => s.id === id);
  const sectionOrder = [];
  scenes.forEach((s) => { if (!sectionOrder.includes(s.dataset.section)) sectionOrder.push(s.dataset.section); });
  const NAMES = window.SECTION_NAMES || {};
  let cur = -1;
  const leaveTimers = new Map();
  const hooks = {};

  function flash(kind) { const f = $("#flash"); f.className = ""; void f.offsetWidth; f.className = "go-" + kind; }

  function go(i, opts = {}) {
    i = clamp(i, 0, N - 1);
    if (i === cur && !opts.force) return;
    const from = cur >= 0 ? scenes[cur] : null, to = scenes[i];
    const dir = i >= cur ? 1 : -1;
    const trans = to.dataset.trans || "fade";
    closeOverlays();
    if (from && from !== to) {
      if (hooks[from.id] && hooks[from.id].leave) hooks[from.id].leave(from);
      clearLater(from.id);
      from.className = from.className.replace(/\btr-\S+/g, "").trim();
      from.classList.remove("is-active");
      from.classList.add("is-leaving", "tr-" + trans);
      from.dataset.dir = dir;
      from.setAttribute("aria-hidden", "true"); from.inert = true;
      clearTimeout(leaveTimers.get(from));
      leaveTimers.set(from, setTimeout(() => { from.classList.remove("is-leaving"); from.className = from.className.replace(/\btr-\S+/g, "").trim(); }, 2400));
    }
    clearTimeout(leaveTimers.get(to));
    to.className = to.className.replace(/\btr-\S+/g, "").trim();
    to.classList.remove("is-leaving", "is-active");
    void to.offsetWidth;
    to.classList.add("is-active", "tr-" + trans);
    to.dataset.dir = dir;
    to.removeAttribute("aria-hidden"); to.inert = false;
    to.scrollTop = 0;
    cur = i;

    const mood = to.dataset.mood || "space";
    body.dataset.mood = mood;
    FX.setMode(mood);
    Sound.setMood(mood);
    if (to.id !== "opening") Globe.pose(to.dataset.globe || "off");
    body.classList.toggle("is-opening", to.id === "opening");
    if (from && from.id === "opening" && to.id !== "opening") Opening.stop();
    if (to.id === "opening") Opening.start();
    if (from) {
      if (trans === "cut") flash("red");
      if (trans === "zoom" && from.id === "opening") { /* o zoom da abertura já tem som próprio */ }
      else Sound.transition(trans);
    }

    loadImagesIn(to);
    setTimeout(() => { loadImagesIn(scenes[i + 1]); loadImagesIn(scenes[i - 1]); }, 700);
    countUp(to);
    updateHUD();
    if (hooks[to.id] && hooks[to.id].enter) hooks[to.id].enter(to);
    $("#announcer").textContent = to.dataset.title || "";
  }
  const next = () => { if (cur === 0 && Opening.running) Opening.next(); else go(cur + 1); };
  const prev = () => { if (cur > 0) go(cur - 1); };

  function countUp(scene) {
    $$("[data-count]", scene).forEach((el) => {
      const target = Number(el.dataset.count), node = el.firstChild;
      if (!node || node.nodeType !== 3) return;
      if (html.classList.contains("reduce-motion")) { node.textContent = String(target); return; }
      const t0 = performance.now(), dur = 1500;
      const step = (t) => {
        const k = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
        node.textContent = String(Math.round(target * e));
        if (k < 1) requestAnimationFrame(step);
      };
      node.textContent = "0";
      setTimeout(() => requestAnimationFrame(step), 500);
    });
  }

  /* ---------- HUD ---------- */
  const segs = {};
  function buildHUD() {
    const track = $("#progressTrack");
    sectionOrder.forEach((sec) => {
      const list = scenes.filter((s) => s.dataset.section === sec);
      const b = document.createElement("button");
      b.type = "button"; b.className = "progress-seg"; b.style.setProperty("--n", list.length);
      b.setAttribute("aria-label", "Ir para: " + (NAMES[sec] || sec));
      b.title = NAMES[sec] || sec;
      b.innerHTML = "<i></i>";
      b.addEventListener("click", () => go(indexOf(list[0].id)));
      track.appendChild(b);
      segs[sec] = { el: b, list };
    });
    $("#hudTotal").textContent = pad(N);
    const menu = $("#menuList");
    sectionOrder.forEach((sec, k) => {
      const list = segs[sec].list;
      const li = document.createElement("li");
      li.innerHTML = '<button type="button" data-sec="' + sec + '"><span class="n">' + pad(k) + '</span><span class="t"></span><span class="c">' + list.length + (list.length > 1 ? " cenas" : " cena") + "</span></button>";
      li.querySelector(".t").textContent = NAMES[sec] || sec;
      li.querySelector("button").addEventListener("click", () => { closeOverlays(); go(indexOf(list[0].id)); });
      menu.appendChild(li);
    });
  }
  function updateHUD() {
    const s = scenes[cur], sec = s.dataset.section, k = sectionOrder.indexOf(sec);
    sectionOrder.forEach((name, j) => {
      const seg = segs[name];
      const p = j < k ? 1 : j > k ? 0 : (seg.list.indexOf(s) + 1) / seg.list.length;
      seg.el.firstChild.style.setProperty("--p", p);
    });
    const secName = NAMES[sec] || "";
    $("#hudSection").innerHTML = "";
    const b = document.createElement("b"); b.textContent = pad(k);
    $("#hudSection").append(b, " · " + secName + (s.dataset.title && s.dataset.title !== secName ? " — " + s.dataset.title : ""));
    $("#hudIndex").textContent = pad(cur + 1);
    $("#hudCoords").textContent = s.dataset.coord || "";
    $("#btnPrev").disabled = cur <= 0;
    $("#btnNext").disabled = cur >= N - 1;
    $$("#menuList button").forEach((btn) => btn.classList.toggle("is-current", btn.dataset.sec === sec));
  }

  /* ---------- abertura cinematográfica ---------- */
  const Opening = (function () {
    const el = $("#opening");
    const DUR = [1500, 2700, 7000, 5600, 6400, 7400, 4000];
    let beat = 0, running = false, coordRAF = 0, alt = 35786, altTarget = 35786;
    let lat = 0, lon = 0;
    const OWN = "opening-beats";
    function dms(v, pos, neg, w) {
      const a = Math.abs(v), d = Math.floor(a), m = Math.floor((a - d) * 60), s = Math.floor(((a - d) * 60 - m) * 60);
      return pad(d, w) + "°" + pad(m) + "′" + pad(s) + "″ " + (v >= 0 ? pos : neg);
    }
    function coords() {
      const tl = -3.1, tg = -60.02;
      lat += (tl - lat) * 0.03 + (Math.random() - 0.5) * 0.8 * (beat < 6 ? 1 : 0.1);
      lon += (tg - lon) * 0.03 + (Math.random() - 0.5) * 1.6 * (beat < 6 ? 1 : 0.1);
      alt += (altTarget - alt) * 0.04;
      $("#opCoordL").textContent = dms(lat, "N", "S", 2) + " · " + dms(lon, "L", "O", 3);
      $("#opCoordR").textContent = "ALT " + Math.round(alt).toLocaleString("pt-BR") + " KM";
      coordRAF = requestAnimationFrame(coords);
    }
    function setBeat(b) {
      beat = b; el.dataset.beat = String(b);
      clearLater(OWN);
      const S = Sound.sfx;
      switch (b) {
        case 0:
          body.classList.add("op-black");
          el.classList.remove("zooming", "reveal-forest");
          Globe.pose("op-dark", { instant: true });
          break;
        case 1:
          Globe.pose("op-stars", { damp: 0.8 });
          later(OWN, 900, () => S.shimmer(0.07));
          break;
        case 2: {
          body.classList.remove("op-black");
          Globe.pose("op-grow", { damp: 1.0 });
          FX.burst(innerWidth / 2, innerHeight / 2, 90, "150,255,190");
          S.riser(2.2);
          later(OWN, 2200, () => S.whoosh(1.4, { from: 200, to: 2400, gain: 0.4 }));
          later(OWN, 1300, () => Globe.set({ coast: 1 }, { damp: 1.4 }));
          later(OWN, 2800, () => { Globe.set({ reveal: 1 }, { damp: 0.75 }); S.shimmer(0.08); });
          later(OWN, 5200, () => Globe.set({ green: 1 }));
          loadImagesIn(el);
          if (!coordRAF) coords();
          altTarget = 35786;
          break;
        }
        case 3:
          Globe.pose("op-school", { damp: 1.1 });
          altTarget = 20000;
          S.impact(0.55);
          later(OWN, 1300, () => S.shimmer(0.07));
          break;
        case 4:
          Globe.pose("op-team", { damp: 0.9 });
          altTarget = 9000;
          S.whoosh(1.2, { from: 300, to: 2200, gain: 0.35, panFrom: 0.7, panTo: -0.7 });
          [1300, 1700, 2100].forEach((t, k) => later(OWN, t + 200, () => S.tick(1500 + k * 300, 0.1)));
          break;
        case 5:
          Globe.pose("op-title", { damp: 1.2 });
          altTarget = 2500;
          S.riser(0.9);
          later(OWN, 950, () => S.impact(0.85));
          later(OWN, 1950, () => S.impact(0.5));
          later(OWN, 3700, () => { el.classList.add("reveal-forest"); S.whoosh(1.6, { from: 160, to: 1800, gain: 0.4 }); S.shimmer(0.08); });
          break;
        case 6:
          el.classList.remove("reveal-forest");
          Globe.pose("op-chapter", { damp: 1.5 });
          altTarget = 400;
          later(OWN, 700, () => S.impact(0.7));
          break;
      }
      if (b < 6) later(OWN, DUR[b], () => setBeat(b + 1));
      else later(OWN, DUR[6], finish);
    }
    function finish() {
      clearLater(OWN);
      el.classList.add("zooming");
      Globe.pose("op-zoom", { damp: 1.6 });
      altTarget = 0;
      Sound.sfx.riser(1.2);
      later(OWN, 1250, () => { flash("green"); Sound.sfx.impact(0.7); running = false; go(1); });
    }
    return {
      get running() { return running; },
      start() { running = true; lat = (Math.random() - 0.5) * 120; lon = (Math.random() - 0.5) * 300; setBeat(0); },
      stop() { running = false; clearLater(OWN); cancelAnimationFrame(coordRAF); coordRAF = 0; body.classList.remove("op-black"); },
      next() { if (beat < 6) { if (beat < 2) body.classList.remove("op-black"); setBeat(beat + 1); } else finish(); },
      skip() { this.stop(); go(1); }
    };
  })();

  /* ---------- interações das cenas ---------- */

  // Mapa de faixas de latitude
  const pinIndex = {};
  BIOMES.forEach((b) => b.pins.forEach(([n, lo, la]) => { pinIndex[n] = { lon: lo, lat: la, color: b.color }; }));
  const xPct = (lon) => ((lon + 180) / 360) * 100, yPct = (lat) => ((90 - lat) / 180) * 100;

  function buildLatMap() {
    const map = $("#latmap"); $("#latmapImg").src = TEX.day;
    [[0, "Equador", "eq"], [23.44, "Trópico de Câncer"], [-23.44, "Trópico de Capricórnio"], [66.56, "Círculo Polar Ártico"], [-66.56, "Círculo Polar Antártico"]].forEach(([lat, name, cls]) => {
      const g = document.createElement("div"); g.className = "gl" + (cls ? " " + cls : ""); g.style.top = yPct(lat) + "%";
      g.innerHTML = "<span></span>"; g.firstChild.textContent = name; map.appendChild(g);
    });
    const btns = $("#bandBtns");
    (window.LAT_BANDS || []).forEach((band) => {
      band.ranges.forEach(([a, b]) => {
        const d = document.createElement("div"); d.className = "band"; d.dataset.band = band.id;
        d.style.setProperty("--bc", band.color);
        d.style.top = yPct(Math.max(a, b)) + "%"; d.style.height = (Math.abs(b - a) / 180) * 100 + "%";
        map.appendChild(d);
      });
      const pins = band.pins.map((n) => [n, pinIndex[n]]).concat((band.extra || []).map(([n]) => [n, pinIndex[n]]));
      pins.forEach(([n, p]) => {
        if (!p) return;
        const pin = document.createElement("div"); pin.className = "pin"; pin.dataset.band = band.id;
        pin.style.cssText = "left:" + xPct(p.lon) + "%;top:" + yPct(p.lat) + "%;--bc:" + band.color;
        pin.innerHTML = "<span></span>"; pin.firstChild.textContent = n;
        if (p.lon > 100) pin.firstChild.style.cssText = "left:auto;right:14px";
        map.appendChild(pin);
      });
      const b = document.createElement("button");
      b.type = "button"; b.className = "band-btn"; b.dataset.band = band.id; b.style.setProperty("--bc", band.color);
      b.setAttribute("aria-pressed", "false"); b.innerHTML = "<i></i><span></span>"; b.lastChild.textContent = band.name;
      b.addEventListener("click", () => { LatMap.auto = false; LatMap.select(band.id); Sound.sfx.tick(); });
      btns.appendChild(b);
    });
  }
  const LatMap = {
    auto: true, idx: 0,
    select(id) {
      const band = (window.LAT_BANDS || []).find((b) => b.id === id); if (!band) return;
      $$("#latmap .band, #latmap .pin").forEach((e) => e.classList.toggle("on", e.dataset.band === id));
      $$("#bandBtns .band-btn").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.band === id)));
      const info = $("#bandInfo"); info.innerHTML = "";
      const tag = document.createElement("p"); tag.className = "tag"; tag.style.color = band.color; tag.textContent = band.name;
      const p = document.createElement("p"); p.className = "body"; p.style.marginTop = "6px"; p.textContent = band.text;
      info.append(tag, p);
      if (band.from) {
        const btn = document.createElement("button"); btn.type = "button"; btn.className = "pill"; btn.style.marginTop = "12px";
        btn.innerHTML = 'Abrir ficha <svg aria-hidden="true"><use href="#i-right"/></svg>';
        btn.addEventListener("click", () => openBiome(band.from, btn));
        info.append(btn);
      }
      this.idx = (window.LAT_BANDS || []).indexOf(band);
    }
  };
  hooks["s01-d"] = {
    enter() {
      LatMap.auto = true; LatMap.select(LAT_BANDS[0].id);
      const cycle = () => { if (!LatMap.auto) return; LatMap.select(LAT_BANDS[(LatMap.idx + 1) % LAT_BANDS.length].id); later("s01-d", 3400, cycle); };
      later("s01-d", 3600, cycle);
    }
  };

  // Mini-mapas de localização
  function buildMinimap(el, id) {
    const b = BIOMES.find((x) => x.id === id); if (!b) return;
    el.innerHTML = "";
    const img = document.createElement("img"); img.src = TEX.day; img.alt = ""; el.appendChild(img);
    el.style.setProperty("--bc", b.color);
    b.pins.forEach(([n, lo, la], k) => {
      const pin = document.createElement("div"); pin.className = "pin" + (lo > 100 ? " l" : "");
      pin.style.cssText = "left:" + xPct(lo) + "%;top:" + yPct(la) + "%;--i:" + k;
      pin.innerHTML = "<span></span>"; pin.firstChild.textContent = n;
      el.appendChild(pin);
    });
    el.setAttribute("role", "img");
  }

  // Cartões dos biomas
  function buildCards() {
    const track = $("#cardsTrack");
    BIOMES.forEach((b) => {
      const art = document.createElement("article");
      art.className = "bcard"; art.style.setProperty("--bc", b.color);
      art.innerHTML =
        '<div class="ph" data-img="' + b.img + '" data-size="960" data-credit="none"></div>' +
        '<span class="badge"></span>' +
        '<div class="body2"><h3></h3><p class="desc"></p><dl>' +
        "<div><dt>Clima</dt><dd data-f=\"clima\"></dd></div><div><dt>Vegetação</dt><dd data-f=\"veg\"></dd></div><div><dt>Onde</dt><dd data-f=\"local\"></dd></div>" +
        '</dl><button class="pill" type="button">Explorar bioma <svg aria-hidden="true"><use href="#i-right"/></svg></button></div>';
      art.querySelector(".badge").textContent = b.badge;
      art.querySelector("h3").textContent = b.name;
      art.querySelector(".desc").textContent = b.desc;
      ["clima", "veg", "local"].forEach((f) => (art.querySelector('[data-f="' + f + '"]').textContent = b[f]));
      const btn = art.querySelector("button");
      btn.setAttribute("aria-label", "Explorar bioma: " + b.name);
      btn.addEventListener("click", () => openBiome(b.id, btn));
      art.addEventListener("click", (e) => { if (!e.target.closest("button, a")) openBiome(b.id, btn); });
      track.appendChild(art);
    });
    $$("[data-track]").forEach((b) => b.addEventListener("click", () => {
      const card = track.querySelector(".bcard"); const w = card ? card.getBoundingClientRect().width + 16 : 300;
      track.scrollBy({ left: Number(b.dataset.track) * w * 2, behavior: reduceMotion ? "auto" : "smooth" });
    }));
  }

  // Modal de bioma
  let lastFocus = null;
  function openBiome(id, trigger) {
    const b = BIOMES.find((x) => x.id === id); if (!b) return;
    lastFocus = trigger || document.activeElement;
    const modal = $("#modal"), card = $("#modalCard");
    modal.style.setProperty("--bc", b.color);
    const li = (t) => "<li>" + esc(t) + "</li>";
    card.innerHTML =
      '<div class="modal-hero"><div class="ph" data-img="' + b.img + '" data-size="1920"></div>' +
      '<button class="icon-btn modal-close" type="button" data-close="modal" aria-label="Voltar"><svg aria-hidden="true"><use href="#i-x"/></svg></button>' +
      '<div class="modal-title"><span class="tag">' + esc(b.badge) + '</span><h2 id="modalTitle">' + esc(b.name) + '</h2><p class="lead">' + esc(b.intro) + "</p></div></div>" +
      '<div class="modal-body"><div class="cols">' +
      '<section><h3>Clima</h3><div class="climate-strip">' + b.strip.map(([k, v]) => "<div><span>" + esc(k) + "</span><b>" + esc(v) + "</b></div>").join("") + "</div></section>" +
      "<section><h3>Vegetação predominante</h3><ul>" + b.vegList.map(li).join("") + "</ul></section>" +
      "<section><h3>Adaptações</h3><ul>" + b.adapt.map(li).join("") + "</ul></section>" +
      '</div><div class="cols">' +
      '<section><h3>Onde ocorre</h3><div class="minimap" data-modal-map aria-label="Mapa com exemplos de onde ocorre"></div></section>' +
      "<section><h3>Fauna associada</h3><p>" + esc(b.fauna) + "</p></section>" +
      "<section><h3>Ameaças</h3><p>" + esc(b.threats) + "</p></section>" +
      "<section><h3>Você sabia?</h3><p>" + esc(b.fun) + "</p></section>" +
      "</div></div>" +
      '<div class="modal-foot"><button class="pill" type="button" data-close="modal"><svg aria-hidden="true"><use href="#i-left"/></svg>Voltar</button>' +
      '<button class="pill pill--glow" type="button" data-goto="' + b.goto + '">Ir para a seção <svg aria-hidden="true"><use href="#i-right"/></svg></button></div>';
    buildMinimap($("[data-modal-map]", card), b.id);
    loadImagesIn(card);
    modal.hidden = false;
    card.scrollTop = 0;
    $(".modal-close", card).focus({ preventScroll: true });
    Sound.sfx.whoosh(0.8, { from: 300, to: 2400, gain: 0.3 }); Sound.sfx.shimmer(0.06);
  }
  function closeModal() {
    const m = $("#modal"); if (m.hidden) return;
    m.hidden = true; Sound.sfx.whoosh(0.6, { from: 2000, to: 300, gain: 0.2 });
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  // Estratos da floresta tropical
  function strataSet(layer) {
    $("#strata").dataset.on = layer;
    $$("#strataList .strata-btn").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.layer === layer)));
  }
  let strataAuto = true;
  $$("#strataList .strata-btn").forEach((b) => b.addEventListener("click", () => { strataAuto = false; strataSet(b.dataset.layer); Sound.sfx.tick(); }));
  $$("#strata .layer-hit").forEach((g) => g.addEventListener("click", () => { strataAuto = false; strataSet(g.dataset.layer); Sound.sfx.tick(); }));
  hooks["s02-c"] = {
    enter() {
      strataAuto = true; delete $("#strata").dataset.on;
      const order = ["emergente", "dossel", "subbosque", "chao"]; let k = 0;
      const step = () => { if (!strataAuto) return; strataSet(order[k++ % 4]); later("s02-c", 2600, step); };
      later("s02-c", 1600, step);
    }
  };

  // Adaptações das coníferas
  function adaptSet(k) {
    const d = (window.ADAPT || {})[k]; if (!d) return;
    $$("#adaptList button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === k)));
    $$(".hotspot").forEach((h) => h.setAttribute("aria-pressed", String(h.dataset.k === k)));
    const card = $("#adaptCard"); card.innerHTML = "";
    const t = document.createElement("p"); t.className = "tag"; t.textContent = "Adaptação";
    const h = document.createElement("h3"); h.className = "h-3"; h.style.margin = "6px 0 8px"; h.textContent = d[0];
    const p = document.createElement("p"); p.className = "body"; p.textContent = d[1];
    card.append(t, h, p);
  }
  $$("#adaptList button").forEach((b) => b.addEventListener("click", () => { adaptSet(b.dataset.k); Sound.sfx.tick(); }));
  $$(".hotspot").forEach((h) => {
    h.addEventListener("click", () => { adaptSet(h.dataset.k); Sound.sfx.tick(); });
    h.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); adaptSet(h.dataset.k); Sound.sfx.tick(); } });
  });
  adaptSet("cone");

  // Permafrost
  let permaUser = false;
  function permaSet(s) {
    $("#perma").dataset.season = s;
    $$("[data-perma]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.perma === s)));
  }
  $$("[data-perma]").forEach((b) => b.addEventListener("click", () => { permaUser = true; permaSet(b.dataset.perma); Sound.sfx.whoosh(0.8, { from: 300, to: 1600, gain: 0.25 }); }));
  hooks["s04-c"] = { enter() { permaUser = false; permaSet("winter"); later("s04-c", 2200, () => { if (!permaUser) permaSet("summer"); }); } };

  // Estações da floresta temperada
  const Seasons = {
    order: ["primavera", "verao", "outono", "inverno"], idx: 0, auto: true, cycle: 5200,
    palettes: { primavera: ["#f6c6d8", "#ffffff", "#c8f08a"], verao: ["#2fbf6b", "#4fd47f", "#1f9a52"], outono: ["#ff8a3d", "#ffb43d", "#e8562e", "#c43d24"], inverno: ["#ffffff", "#e6f0f8", "#cfe0ee"] },
    set(name, user) {
      const s = window.SEASONS[name]; if (!s) return;
      this.idx = this.order.indexOf(name);
      $$("#seasonStage .ph").forEach((p) => p.classList.toggle("on", p.dataset.season === name));
      $$("#seasonSwitch button").forEach((b) => {
        const on = b.dataset.season === name; b.setAttribute("aria-pressed", String(on));
        const t = b.querySelector(".t"); t.classList.remove("run"); void t.offsetWidth;
        if (on && this.auto) { t.style.setProperty("--cycle", this.cycle + "ms"); t.classList.add("run"); }
      });
      $("#seasonNote").textContent = s.text;
      const m = IMG[s.img];
      $("#seasonCredit").innerHTML = "";
      if (m) { const a = document.createElement("a"); a.href = COMMONS + "File:" + m.f; a.target = "_blank"; a.rel = "noopener"; a.style.color = "inherit"; a.textContent = creditText(m) + " — " + m.alt; $("#seasonCredit").append(a); }
      body.style.setProperty("--season", s.color);
      FX.setLeaves(this.palettes[name]);
      if (user) { this.auto = false; clearLater("seasons"); Sound.sfx.shimmer(0.05); }
    },
    start() {
      this.auto = true; this.set(this.order[0]);
      const step = () => { if (!this.auto) return; this.set(this.order[(this.idx + 1) % 4]); later("seasons", this.cycle, step); };
      later("seasons", this.cycle, step);
    },
    stop() { clearLater("seasons"); }
  };
  $$("#seasonSwitch button").forEach((b) => b.addEventListener("click", () => Seasons.set(b.dataset.season, true)));
  hooks["s05-a"] = { enter() { Seasons.start(); }, leave() { Seasons.stop(); } };

  // Folha que muda de cor
  const leafStops = [[0, [47, 191, 107]], [35, [140, 196, 64]], [55, [242, 190, 52]], [78, [255, 122, 47]], [100, [205, 52, 40]]];
  function leafColor(t) {
    for (let i = 1; i < leafStops.length; i++) {
      const [t1, c1] = leafStops[i], [t0, c0] = leafStops[i - 1];
      if (t <= t1) { const k = (t - t0) / (t1 - t0); return "rgb(" + c0.map((v, j) => Math.round(v + (c1[j] - v) * k)).join(",") + ")"; }
    }
    return "rgb(205,52,40)";
  }
  function leafSet(t) {
    $("#leafShape").setAttribute("fill", leafColor(t));
    const chl = Math.max(0, Math.round(100 - t * 1.15)), ant = clamp(Math.round((t - 55) * 2.2), 0, 100);
    $("#pgC").textContent = chl + "%"; $("#barC").style.setProperty("--v", Math.max(chl, 1) + "%");
    $("#pgR").textContent = ant + "%"; $("#barR").style.setProperty("--v", Math.max(ant, 1) + "%");
    $("#leafWrap").style.transform = t >= 96 ? "translate(18px, 40px) rotate(24deg)" : "none";
    $("#leafState").textContent = t < 30 ? "Dias longos: a folha está cheia de clorofila." : t < 60 ? "Os dias encurtam: a clorofila começa a se desfazer." : t < 92 ? "O verde some, aparecem os carotenoides e, em algumas espécies, as antocianinas." : "Fim do outono: a folha se solta do galho.";
  }
  let leafUser = false, leafRAF = 0;
  $("#leafRange").addEventListener("input", (e) => { leafUser = true; cancelAnimationFrame(leafRAF); leafSet(Number(e.target.value)); });
  hooks["s05-c"] = {
    enter() {
      leafUser = false; const r = $("#leafRange"); r.value = 0; leafSet(0);
      if (reduceMotion) { r.value = 70; leafSet(70); return; }
      later("s05-c", 1200, () => {
        const t0 = performance.now();
        const step = (t) => { if (leafUser) return; const v = clamp((t - t0) / 6000, 0, 1) * 100; r.value = v; leafSet(v); if (v < 100) leafRAF = requestAnimationFrame(step); };
        leafRAF = requestAnimationFrame(step);
      });
    },
    leave() { cancelAnimationFrame(leafRAF); }
  };

  // Espectro herbáceas × arbustivas
  function buildSpectrum() {
    const root = $("#spectrum");
    (window.SPECTRUM || []).forEach((s, k) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "mk" + (k % 2 ? " low" : ""); b.style.left = s.at + "%";
      b.setAttribute("aria-pressed", "false"); b.innerHTML = "<span></span><i></i>"; b.firstChild.textContent = s.name;
      b.addEventListener("click", () => { spectrumSet(s.name); Sound.sfx.tick(); });
      root.appendChild(b);
    });
    spectrumSet("Savana");
  }
  function spectrumSet(name) {
    const s = (window.SPECTRUM || []).find((x) => x.name === name); if (!s) return;
    $$("#spectrum .mk").forEach((b) => b.setAttribute("aria-pressed", String(b.textContent === name)));
    const info = $("#spectrumInfo"); info.innerHTML = "";
    const t = document.createElement("p"); t.className = "tag"; t.textContent = name;
    const p = document.createElement("p"); p.className = "body"; p.style.marginTop = "6px"; p.textContent = s.text;
    info.append(t, p);
  }

  // Panorama horizontal
  $$("[data-pano]").forEach((b) => b.addEventListener("click", () => {
    const pano = $("#pano"), panel = pano.querySelector(".pano-panel");
    pano.scrollBy({ left: Number(b.dataset.pano) * (panel.getBoundingClientRect().width + 16), behavior: reduceMotion ? "auto" : "smooth" });
    Sound.sfx.whoosh(0.7, { from: 300, to: 1500, gain: 0.2, panFrom: Number(b.dataset.pano), panTo: -Number(b.dataset.pano) });
  }));
  hooks["s06-c"] = { enter() { $("#pano").scrollLeft = 0; } };
  hooks["s01-f"] = { enter() { $("#cardsTrack").scrollLeft = 0; } };

  // Comparador antes/depois
  let cmpUser = false, cmpRAF = 0;
  function cmpSet(v) { $("#compare").style.setProperty("--cut", v + "%"); $("#compareRange").value = v; }
  $("#compareRange").addEventListener("input", (e) => { cmpUser = true; cancelAnimationFrame(cmpRAF); cmpSet(Number(e.target.value)); });
  hooks["s07-e"] = {
    enter() {
      cmpUser = false; cmpSet(50);
      if (reduceMotion) return;
      later("s07-e", 1200, () => {
        const t0 = performance.now();
        const step = (t) => {
          if (cmpUser) return;
          const k = clamp((t - t0) / 3600, 0, 1);
          cmpSet(Math.round(50 + Math.sin(k * Math.PI * 2) * 35));
          if (k < 1) cmpRAF = requestAnimationFrame(step);
        };
        cmpRAF = requestAnimationFrame(step);
      });
    },
    leave() { cancelAnimationFrame(cmpRAF); }
  };

  // Contrastes
  $$(".contrast").forEach((c) => c.addEventListener("click", () => {
    const open = c.getAttribute("aria-expanded") !== "true";
    c.setAttribute("aria-expanded", String(open));
    c.querySelector(".hint").textContent = open ? "Toque para recolher" : "Toque para comparar";
    Sound.sfx.tick(open ? 1200 : 900);
  }));

  // Encerramento
  hooks["s09"] = {
    enter() {
      const items = $$("#finalSeq > *"); items.forEach((e) => e.classList.remove("on"));
      [900, 3300, 5200].forEach((t, k) => later("s09", reduceMotion ? 0 : t, () => {
        items[k].classList.add("on");
        if (k === 0) { Sound.sfx.shimmer(0.09); FX.burst(innerWidth / 2, innerHeight / 2, 70, "140,255,190"); }
        if (k === 1) { Sound.sfx.impact(0.35); Globe.set({ alpha: 0.32, cy: 0.56, r: 0.5 }, { damp: 0.9 }); }
      }));
    }
  };
  hooks["s01-a"] = { enter() { if (!Opening.running) FX.burst(innerWidth * 0.74, innerHeight * 0.5, 40, "140,255,190"); } };

  /* ---------- quiz ---------- */
  const Quiz = (function () {
    const root = $("#quiz"), Q = window.QUIZ || [];
    let i = 0, score = 0, answers = [];
    function dots() {
      return '<div class="quiz-dots" aria-hidden="true">' + Q.map((_, k) => {
        const c = answers[k] === undefined ? (k === i ? "cur" : "") : answers[k] === Q[k].a ? "ok" : "bad";
        return '<i class="' + c + '"></i>';
      }).join("") + "</div>";
    }
    function render() {
      if (i >= Q.length) return result();
      const q = Q[i];
      root.innerHTML =
        '<div class="quiz-top">' + dots() + '<p class="quiz-score">Pergunta <b>' + (i + 1) + "</b> de " + Q.length + " · Acertos: <b>" + score + "</b></p></div>" +
        '<div class="quiz-card" role="group" aria-labelledby="quizQ"><p class="tag">Questão ' + pad(i + 1) + '</p><h3 class="quiz-q" id="quizQ">' + esc(q.q) + "</h3>" +
        '<div class="quiz-opts">' + q.o.map((o, k) => '<button class="opt" type="button" data-k="' + k + '"><span class="l">' + "ABCD"[k] + "</span><span>" + esc(o) + '</span><span class="st"></span></button>').join("") + "</div>" +
        '<div class="quiz-feedback" aria-live="polite"></div></div>';
      $$(".opt", root).forEach((b) => b.addEventListener("click", () => answer(Number(b.dataset.k))));
    }
    function answer(k) {
      if (i >= Q.length || answers[i] !== undefined) return;
      const q = Q[i], ok = k === q.a;
      answers[i] = k; if (ok) score++;
      $$(".opt", root).forEach((b) => {
        const j = Number(b.dataset.k); b.disabled = true;
        if (j === q.a) { b.classList.add("is-right"); b.querySelector(".st").textContent = "Correta"; }
        else if (j === k) { b.classList.add("is-wrong"); b.querySelector(".st").textContent = "Sua resposta"; }
        else b.classList.add("is-dim");
      });
      const fb = $(".quiz-feedback", root);
      fb.innerHTML = '<div class="quiz-exp' + (ok ? "" : " bad") + '"><strong>' + (ok ? "Correto!" : "Não foi dessa vez.") + "</strong> " +
        (ok ? "" : "A resposta certa é a <strong>" + "ABCD"[q.a] + "</strong>. ") + esc(q.e) + "</div>" +
        '<div class="quiz-actions" style="margin-top:14px"><button class="pill pill--glow" type="button" data-qnext>' + (i < Q.length - 1 ? "Próxima pergunta" : "Ver resultado") + ' <svg aria-hidden="true"><use href="#i-right"/></svg></button></div>';
      $(".quiz-top", root).outerHTML = '<div class="quiz-top">' + dots() + '<p class="quiz-score">Pergunta <b>' + (i + 1) + "</b> de " + Q.length + " · Acertos: <b>" + score + "</b></p></div>";
      const nb = $("[data-qnext]", root);
      nb.addEventListener("click", () => { i++; render(); Sound.sfx.whoosh(0.6, { gain: 0.2 }); const f = $(".opt", root) || $("button", root); if (f) f.focus({ preventScroll: true }); });
      nb.focus({ preventScroll: true });
      fb.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
      if (ok) Sound.sfx.correct(); else Sound.sfx.wrong();
    }
    function result() {
      const pct = Math.round((score / Q.length) * 100), C = 2 * Math.PI * 70;
      const msg = score === Q.length ? "Perfeito! Você domina a cobertura verde do planeta azul." : score >= 7 ? "Muito bem! Revise as questões em que errou." : score >= 4 ? "Bom começo. Volte às seções e tente de novo." : "Que tal rever o capítulo e tentar outra vez?";
      root.innerHTML =
        '<div class="quiz-card quiz-result">' + dots() +
        '<svg class="score-ring" viewBox="0 0 180 180" role="img" aria-label="' + score + " acertos de " + Q.length + '"><circle class="bg" cx="90" cy="90" r="70"/><circle class="fg" cx="90" cy="90" r="70" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/><text x="90" y="104" text-anchor="middle">' + score + "/" + Q.length + "</text></svg>" +
        '<h3 class="h-2">' + pct + "% de acertos</h3><p class=\"lead\" style=\"text-align:center;margin-inline:auto\">" + msg + "</p>" +
        '<div class="row" style="justify-content:center"><button class="pill" type="button" data-qreset><svg aria-hidden="true"><use href="#i-restart"/></svg>Refazer o quiz</button>' +
        '<button class="pill pill--glow" type="button" data-qend>Ir para o encerramento <svg aria-hidden="true"><use href="#i-right"/></svg></button></div></div>';
      requestAnimationFrame(() => requestAnimationFrame(() => { const fg = $(".score-ring .fg", root); if (fg) fg.style.strokeDashoffset = String(C * (1 - score / Q.length)); }));
      $("[data-qreset]", root).addEventListener("click", reset);
      $("[data-qend]", root).addEventListener("click", () => go(indexOf("s09")));
      Sound.sfx.shimmer(0.1); if (score >= 7) Sound.sfx.correct();
    }
    function reset() { i = 0; score = 0; answers = []; render(); }
    return { reset, key(n) { if (i < Q.length && answers[i] === undefined && n < Q[i].o.length) answer(n); } };
  })();

  /* ---------- sobreposições: menu, painel de áudio ---------- */
  function closeOverlays(except) {
    if (except !== "modal") closeModal();
    if (except !== "menu" && !$("#menu").hidden) { $("#menu").hidden = true; $("#btnMenu").setAttribute("aria-expanded", "false"); }
    if (except !== "audio" && !$("#audioPanel").hidden) { $("#audioPanel").hidden = true; $("#btnAudio").setAttribute("aria-expanded", "false"); }
  }
  function openMenu(showCredits) {
    closeOverlays("menu");
    const m = $("#menu"); m.hidden = false; $("#btnMenu").setAttribute("aria-expanded", "true");
    $("#creditsBox").hidden = !showCredits;
    if (showCredits) $("#creditsBox").scrollIntoView({ block: "start" }); else m.scrollTop = 0;
    const first = showCredits ? $("#mediaCredits a") : $("#menuList .is-current") || $("#menuList button");
    if (first) first.focus({ preventScroll: !!showCredits });
  }
  function buildCredits() {
    const ul = $("#mediaCredits");
    const add = (m, kind) => {
      const li = document.createElement("li");
      const a = document.createElement("a"); a.href = COMMONS + "File:" + m.f; a.target = "_blank"; a.rel = "noopener";
      a.textContent = decodeURIComponent(m.f).replace(/_/g, " ");
      const by = unknown(m.by) ? "autor na página do arquivo" : m.by, lic = unknown(m.lic) ? "licença na página do arquivo" : m.lic;
      li.append(kind + ": ", a, " — " + by + " · " + lic);
      ul.appendChild(li);
    };
    Object.values(IMG).forEach((m) => add(m, "Imagem"));
    Object.values(AUD).forEach((m) => add(m, "Som"));
  }

  /* ---------- áudio: controles ---------- */
  const prefs = { vol: store.get("vol", 0.7), sfx: store.get("sfx", true), music: store.get("music", true), amb: store.get("amb", true) };
  function syncAudioUI() {
    $("#btnAudio").setAttribute("aria-pressed", String(Sound.enabled));
    $("#btnAudio").setAttribute("aria-label", Sound.enabled ? "Som ligado — abrir controles" : "Som desligado — abrir controles");
    $("#swMaster").setAttribute("aria-checked", String(Sound.enabled));
    $("#swSfx").setAttribute("aria-checked", String(Sound.sfxOn));
    $("#swMusic").setAttribute("aria-checked", String(Sound.musicOn));
    $("#swAmb").setAttribute("aria-checked", String(Sound.ambOn));
    $("#volRange").value = Math.round(Sound.volume * 100);
    $("#volVal").textContent = Math.round(Sound.volume * 100) + "%";
  }
  function setAudio(on) {
    if (on && !Sound.ctx && !Sound.init()) { syncAudioUI(); return; }
    Sound.setEnabled(on); syncAudioUI();
    if (on) Sound.sfx.tick(1400, 0.1);
  }
  Sound.volume = prefs.vol; Sound.sfxOn = prefs.sfx; Sound.musicOn = prefs.music; Sound.ambOn = prefs.amb;
  Sound.onStatus = (msg) => { $("#audioStatus").textContent = msg; };
  $("#btnAudio").addEventListener("click", (e) => {
    e.stopPropagation();
    const p = $("#audioPanel"), open = p.hidden;
    closeOverlays("audio"); p.hidden = !open; $("#btnAudio").setAttribute("aria-expanded", String(open));
    if (open) $("#swMaster").focus({ preventScroll: true });
  });
  $("#audioPanel").addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", () => { if (!$("#audioPanel").hidden) { $("#audioPanel").hidden = true; $("#btnAudio").setAttribute("aria-expanded", "false"); } });
  $("#swMaster").addEventListener("click", () => setAudio(!Sound.enabled));
  $("#swSfx").addEventListener("click", () => { Sound.setSfx(!Sound.sfxOn); store.set("sfx", Sound.sfxOn); syncAudioUI(); });
  $("#swMusic").addEventListener("click", () => { Sound.setMusic(!Sound.musicOn); store.set("music", Sound.musicOn); syncAudioUI(); });
  $("#swAmb").addEventListener("click", () => { Sound.setAmb(!Sound.ambOn); store.set("amb", Sound.ambOn); syncAudioUI(); });
  $("#volRange").addEventListener("input", (e) => { Sound.setVolume(Number(e.target.value) / 100); store.set("vol", Sound.volume); syncAudioUI(); });
  $("#swMotion").addEventListener("click", () => { reduceMotion = !reduceMotion; store.set("reduce", reduceMotion); applyMotion(); });
  document.addEventListener("visibilitychange", () => { if (!Sound.ctx) return; if (document.hidden) Sound.ctx.suspend(); else if (Sound.enabled) Sound.ctx.resume(); });

  /* ---------- tela cheia ---------- */
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  const canFS = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  if (!canFS) $("#btnFull").hidden = true;
  function toggleFS() {
    if (!canFS) return;
    if (fsEl()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else { const r = (html.requestFullscreen || html.webkitRequestFullscreen).call(html); if (r && r.catch) r.catch(() => {}); }
  }
  ["fullscreenchange", "webkitfullscreenchange"].forEach((ev) => document.addEventListener(ev, () => {
    const on = !!fsEl(); $("#btnFull").setAttribute("aria-pressed", String(on)); $("#btnFull").setAttribute("aria-label", on ? "Sair da tela cheia" : "Tela cheia");
  }));
  $("#btnFull").addEventListener("click", toggleFS);

  /* ---------- reiniciar ---------- */
  function restart() {
    closeOverlays();
    Quiz.reset();
    $$(".contrast").forEach((c) => { c.setAttribute("aria-expanded", "false"); c.querySelector(".hint").textContent = "Toque para comparar"; });
    go(0, { force: true });
  }
  $("#btnRestart").addEventListener("click", restart);
  $$('[data-action="restart"]').forEach((b) => b.addEventListener("click", restart));
  $$('[data-action="credits"]').forEach((b) => b.addEventListener("click", () => openMenu(true)));
  $("#btnMenu").addEventListener("click", () => { if ($("#menu").hidden) openMenu(false); else closeOverlays(); });

  /* delegação: fechar, ir para seção, abrir ficha */
  document.addEventListener("click", (e) => {
    const close = e.target.closest("[data-close]");
    if (close) { if (close.dataset.close === "modal") closeModal(); else closeOverlays(); return; }
    const gotoBtn = e.target.closest("[data-goto]");
    if (gotoBtn) { const id = gotoBtn.dataset.goto; closeModal(); go(indexOf(id)); return; }
    const bio = e.target.closest("[data-biome]");
    if (bio) openBiome(bio.dataset.biome, bio);
  });

  /* ---------- teclado ---------- */
  function trapFocus(e, root) {
    const f = $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', root).filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  document.addEventListener("keydown", (e) => {
    if (body.classList.contains("is-gate")) return;
    const modalOpen = !$("#modal").hidden, menuOpen = !$("#menu").hidden;
    if (e.key === "Escape") { closeOverlays(); return; }
    if (e.key === "Tab") { if (modalOpen) trapFocus(e, $("#modal")); else if (menuOpen) trapFocus(e, $("#menu")); return; }
    if (modalOpen || menuOpen || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target, tag = t.tagName;
    const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable;
    if (typing && t.type === "range" && /Arrow|Home|End|Page/.test(e.key)) return;
    if (e.key === "m" || e.key === "M") { setAudio(!Sound.enabled); return; }
    if (e.key === "f" || e.key === "F") { toggleFS(); return; }
    if (scenes[cur] && scenes[cur].id === "s08" && /^[1-4]$/.test(e.key)) { Quiz.key(Number(e.key) - 1); return; }
    const onControl = tag === "BUTTON" || tag === "A" || t.getAttribute("role") === "button";
    switch (e.key) {
      case "ArrowRight": case "PageDown": e.preventDefault(); next(); break;
      case "ArrowLeft": case "PageUp": e.preventDefault(); prev(); break;
      case " ": if (!onControl) { e.preventDefault(); next(); } break;
      case "Home": e.preventDefault(); go(1); break;
      case "End": e.preventDefault(); go(N - 1); break;
    }
  });

  /* ---------- toque (deslizar) ---------- */
  let sx = 0, sy = 0, st = 0, swipeOK = false;
  $("#stage").addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse") return;
    swipeOK = !e.target.closest("[data-noswipe], input, .compare, .pano, .cards-track, .seg, .season-switch");
    sx = e.clientX; sy = e.clientY; st = performance.now();
  }, { passive: true });
  $("#stage").addEventListener("pointerup", (e) => {
    if (e.pointerType === "mouse" || !swipeOK) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4 && performance.now() - st < 900) { if (dx < 0) next(); else prev(); }
  }, { passive: true });

  /* ---------- navegação pelos botões ---------- */
  $("#btnNext").addEventListener("click", next);
  $("#btnPrev").addEventListener("click", prev);
  $("#skipOpening").addEventListener("click", () => Opening.skip());

  /* ---------- tela inicial ---------- */
  function begin(withSound) {
    const gate = $("#gate");
    if (gate.classList.contains("is-leaving")) return;
    Sound.init();
    Sound.setEnabled(withSound);
    syncAudioUI();
    gate.classList.add("is-leaving");
    setTimeout(() => {
      gate.classList.add("is-done");
      body.classList.remove("is-gate");
      gate.setAttribute("aria-hidden", "true");
      go(0, { force: true });
      $("#stage").focus && $("#stage").focus({ preventScroll: true });
    }, reduceMotion ? 200 : 900);
  }
  $("#startSound").addEventListener("click", () => begin(true));
  $("#startMute").addEventListener("click", () => begin(false));

  /* ---------- inicialização ---------- */
  applyMotion();
  topoBackground();
  $$("[data-split]").forEach(splitText);
  $$(".ph[data-img]").forEach(prepPh);
  $$("[data-minimap]").forEach((el) => buildMinimap(el, el.dataset.minimap));
  buildLatMap();
  buildCards();
  buildSpectrum();
  buildHUD();
  buildCredits();
  Quiz.reset();
  syncAudioUI();
  scenes.forEach((s) => { s.setAttribute("aria-hidden", "true"); s.inert = true; });
  $("#stage").tabIndex = -1;
  FX.setMode("space");
  $("#startSound").focus({ preventScroll: true });
})();
