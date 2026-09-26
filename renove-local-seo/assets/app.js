/* Renove Local SEO — interações. Sem dependências. */
(() => {
  "use strict";

  /* ============ CONFIGURAÇÃO ============
     Preencha com os dados reais de contato. Enquanto estiverem vazios,
     os botões de contato levam para a seção de diagnóstico.
     whatsapp: só dígitos com DDI e DDD (ex.: "5511999999999")        */
  const CONFIG = {
    whatsapp: "",
    email: ""
  };

  /* Cases reais (somente com autorização do cliente). Exemplo de formato:
     { cliente: "Nome", segmento: "Serralheria", cidade: "Cidade/UF", periodo: "jan–jun/2026",
       destaque: "+X% ligações pelo Perfil da Empresa", fonte: "Perfil da Empresa no Google",
       depoimento: "texto real", autor: "Nome, cargo" }                      */
  const CASES = [];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  const mqFine = matchMedia("(hover: hover) and (pointer: fine)");
  const mqDesk = matchMedia("(min-width: 900px)");
  let reduced = mqReduce.matches;
  mqReduce.addEventListener?.("change", (e) => (reduced = e.matches));
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const fmt = (n) => Math.round(n).toLocaleString("pt-BR");

  const contactHref = (msg) => {
    if (CONFIG.whatsapp) return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    if (CONFIG.email) return `mailto:${CONFIG.email}?subject=${encodeURIComponent("Diagnóstico de presença local")}&body=${encodeURIComponent(msg)}`;
    return null;
  };

  /* ---------- in-view helper ---------- */
  const onView = (els, cb, opts = { threshold: 0.2 }) => {
    if (!("IntersectionObserver" in window)) { els.forEach((el) => cb(el)); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { cb(en.target); io.unobserve(en.target); } });
    }, opts);
    els.forEach((el) => io.observe(el));
  };

  /* ============ NAV / PROGRESS ============ */
  function initNav() {
    const nav = $(".nav");
    const bar = $(".progress span");
    const links = $$(".nav-links a");
    const pill = $(".nav-pill");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = scrollY;
        nav.classList.toggle("scrolled", y > 12);
        const max = document.documentElement.scrollHeight - innerHeight;
        bar.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const movePill = (a) => {
      if (!a) { pill.style.opacity = 0; return; }
      pill.style.opacity = 1;
      pill.style.width = a.offsetWidth + "px";
      pill.style.transform = `translateX(${a.offsetLeft}px)`;
    };
    const current = () => $(".nav-links a.active");
    links.forEach((a) => {
      a.addEventListener("mouseenter", () => movePill(a));
      a.addEventListener("focus", () => movePill(a));
    });
    $(".nav-links").addEventListener("mouseleave", () => movePill(current()));

    // seção ativa: a que contém o meio da tela (nem toda seção tem link no menu)
    const targets = links.map((a) => [a, document.getElementById(a.getAttribute("href").slice(1))]).filter(([, el]) => el);
    let activeLink = null;
    const updateActive = () => {
      const mid = innerHeight * 0.45;
      const hit = targets.find(([, el]) => { const r = el.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
      const a = hit ? hit[0] : null;
      if (a === activeLink) return;
      activeLink = a;
      links.forEach((l) => { l.classList.toggle("active", l === a); l === a ? l.setAttribute("aria-current", "location") : l.removeAttribute("aria-current"); });
      movePill(a);
    };
    addEventListener("scroll", () => requestAnimationFrame(updateActive), { passive: true });
    addEventListener("resize", () => { activeLink = undefined; updateActive(); });
    updateActive();

    // mobile menu
    const btn = $(".menu-toggle");
    const menu = $("#menu-mobile");
    $$("nav a", menu).forEach((a, i) => a.style.setProperty("--i", i));
    const close = (focusBtn = true) => {
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Abrir menu");
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      setTimeout(() => { if (!menu.classList.contains("open")) menu.hidden = true; }, 350);
      if (focusBtn) btn.focus();
    };
    const open = () => {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add("open"));
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Fechar menu");
      document.body.classList.add("menu-open");
      setTimeout(() => $("a", menu)?.focus(), 60);
    };
    btn.addEventListener("click", () => (btn.getAttribute("aria-expanded") === "true" ? close() : open()));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) close(false); });
    document.addEventListener("keydown", (e) => {
      if (menu.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const f = [btn, ...$$("a", menu)];
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    addEventListener("resize", () => { if (innerWidth >= 960 && !menu.hidden) close(false); });
  }

  /* ============ CURSOR / MAGNETIC / SPOTLIGHT / TILT ============ */
  function initPointer() {
    if (!mqFine.matches) return;
    const glow = $(".cursor-glow");
    let tx = -999, ty = -999, x = tx, y = ty, raf = 0;
    const loop = () => {
      x = lerp(x, tx, 0.18); y = lerp(y, ty, 0.18);
      glow.style.setProperty("--cx", x.toFixed(1) + "px");
      glow.style.setProperty("--cy", y.toFixed(1) + "px");
      raf = Math.abs(x - tx) + Math.abs(y - ty) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      document.body.classList.add("has-cursor");
      tx = e.clientX; ty = e.clientY;
      if (!raf && !reduced) raf = requestAnimationFrame(loop);
      const hot = e.target.closest?.("a, button, [data-magnetic], .pin");
      glow.classList.toggle("hot", !!hot);
    }, { passive: true });
    document.addEventListener("pointerleave", () => document.body.classList.remove("has-cursor"));

    // magnetic
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        if (reduced) return;
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - r.left - r.width / 2) * 0.18;
        const my = (e.clientY - r.top - r.height / 2) * 0.28;
        el.style.setProperty("--mx", mx.toFixed(1) + "px");
        el.style.setProperty("--my", my.toFixed(1) + "px");
      });
      el.addEventListener("pointerleave", () => { el.style.setProperty("--mx", "0px"); el.style.setProperty("--my", "0px"); });
    });

    // spotlight (delegated)
    document.addEventListener("pointermove", (e) => {
      const s = e.target.closest?.(".spot, .svc-tab");
      if (!s) return;
      const r = s.getBoundingClientRect();
      s.style.setProperty("--sx", e.clientX - r.left + "px");
      s.style.setProperty("--sy", e.clientY - r.top + "px");
    }, { passive: true });

    // tilt
    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        if (reduced) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (px * 5).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * 5).toFixed(2) + "deg");
      });
      el.addEventListener("pointerleave", () => { el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg"); });
    });
  }

  /* ============ CITY MAP (canvas, perspectiva) ============ */
  class CityMap {
    constructor(canvas, o = {}) {
      this.c = canvas; this.ctx = canvas.getContext("2d");
      this.o = Object.assign({ horizon: 0.2, seed: 7, businesses: 34, label: true, pulseEvery: 520, highlightX: 1.6, highlightD: 5.2 }, o);
      this.mx = 0; this.my = 0; this.tmx = 0; this.tmy = 0; this.scroll = 0;
      this.routes = []; this.rings = []; this.last = 0; this.running = false; this.t0 = performance.now();
      this.mobile = !mqDesk.matches;
      this.build(); this.resize();
      addEventListener("resize", () => { this.mobile = !mqDesk.matches; this.resize(); if (!this.running) this.draw(performance.now()); });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([en]) => { en.isIntersecting ? this.start() : this.stop(); }).observe(canvas);
      } else this.start();
      document.addEventListener("visibilitychange", () => (document.hidden ? this.stop() : this.visibleStart()));
    }
    visibleStart() { const r = this.c.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) this.start(); }
    build() {
      const R = rng(this.o.seed);
      const xs = []; for (let x = -13; x <= 13; x += 0.9 + R() * 0.7) xs.push(x);
      const ds = []; for (let d = 1.05; d <= 17; d += 0.75 + R() * 0.6) ds.push(d);
      this.xs = xs; this.ds = ds;
      const wob = (a, b) => Math.sin(a * 0.5 + b * 0.9) * 0.12;
      this.P = (i, j) => [xs[i] + wob(ds[j], xs[i]), ds[j] + wob(xs[i], ds[j]) * 0.6];
      this.segs = [];
      for (let i = 0; i < xs.length; i++) for (let j = 0; j < ds.length - 1; j++) if (R() > 0.12) this.segs.push([i, j, i, j + 1]);
      for (let j = 0; j < ds.length; j++) for (let i = 0; i < xs.length - 1; i++) if (R() > 0.14) this.segs.push([i, j, i + 1, j]);
      this.blocks = [];
      for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ds.length - 1; j++) if (R() < 0.16) this.blocks.push([i, j, R()]);
      this.avenues = [
        Array.from({ length: 40 }, (_, k) => { const d = 1 + k * 0.42; return [-7 + d * 0.9, d]; }),
        Array.from({ length: 40 }, (_, k) => { const d = 1 + k * 0.42; return [5.5 + Math.sin(d * 0.35) * 2.4 - d * 0.35, d]; })
      ];
      this.river = Array.from({ length: 50 }, (_, k) => { const d = 1 + k * 0.34; return [-4.5 + Math.sin(d * 0.42) * 2.6 - d * 0.18, d]; });
      this.biz = [];
      const used = new Set();
      while (this.biz.length < this.o.businesses) {
        const i = 1 + Math.floor(R() * (xs.length - 2)), j = 1 + Math.floor(R() * (ds.length - 3));
        const k = i + ":" + j; if (used.has(k)) continue; used.add(k);
        const [X, D] = this.P(i, j);
        if (Math.abs(X) > 11) continue;
        this.biz.push({ X, D, lit: R() < 0.22, ph: R() * 6.28 });
      }
      // destaque = interseção mais próxima do ponto desejado
      let best = null, bd = 1e9;
      for (let i = 0; i < xs.length; i++) for (let j = 0; j < ds.length; j++) {
        const [X, D] = this.P(i, j); const dd = Math.hypot(X - this.o.highlightX, D - this.o.highlightD);
        if (dd < bd) { bd = dd; best = { X, D, i, j }; }
      }
      this.hi = best;
      this.R = R;
    }
    resize() {
      const r = this.c.getBoundingClientRect();
      this.w = Math.max(1, r.width); this.h = Math.max(1, r.height);
      this.dpr = Math.min(devicePixelRatio || 1, this.mobile ? 1.25 : 1.75);
      this.c.width = Math.round(this.w * this.dpr); this.c.height = Math.round(this.h * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      const n = this.mobile ? 22 : 64;
      const R = rng(99);
      this.parts = Array.from({ length: n }, () => ({ x: R() * this.w, y: R() * this.h, vx: (R() - 0.5) * 0.12, vy: -0.05 - R() * 0.15, r: 0.5 + R() * 1.2, a: 0.15 + R() * 0.35, ox: 0, oy: 0 }));
    }
    setPointer(nx, ny) { this.tmx = nx; this.tmy = ny; }
    proj(X, D) {
      const f = this.w * 0.55;
      const camX = this.mx * 1.2;
      const camZ = this.scroll * 1.6;
      const dd = D - camZ + 0.35;
      if (dd < 0.2) return null;
      const horizon = this.h * (this.o.horizon - this.scroll * 0.06) + this.my * 10;
      const k = (this.h * 0.95 - horizon) * 1.4;
      return [this.w / 2 + (f * (X - camX)) / dd, horizon + k / dd, dd];
    }
    spawnRoute() {
      const R = Math.random;
      const toHi = R() < 0.6;
      const tgt = toHi ? this.hi : this.biz[Math.floor(R() * this.biz.length)];
      const sx = tgt.X + (R() - 0.5) * 9, sd = clamp(tgt.D + (R() - 0.5) * 6, 1.2, 15);
      const pts = R() < 0.5 ? [[sx, sd], [tgt.X, sd], [tgt.X, tgt.D]] : [[sx, sd], [sx, tgt.D], [tgt.X, tgt.D]];
      this.routes.push({ pts, t: 0, dur: 1400 + R() * 900, hi: toHi, tgt });
    }
    start() {
      if (this.running) return;
      if (reduced) { this.draw(performance.now()); return; }
      this.running = true; this.last = performance.now();
      const tick = (now) => {
        if (!this.running) return;
        const dt = Math.min(64, now - this.last); this.last = now;
        this.update(dt, now); this.draw(now);
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }
    stop() { this.running = false; cancelAnimationFrame(this.raf); }
    update(dt, now) {
      this.mx = lerp(this.mx, this.tmx, 0.05); this.my = lerp(this.my, this.tmy, 0.05);
      this.pacc = (this.pacc || 0) + dt;
      const every = this.mobile ? this.o.pulseEvery * 1.8 : this.o.pulseEvery;
      if (this.pacc > every) { this.pacc = 0; if (this.routes.length < 14) this.spawnRoute(); }
      this.routes.forEach((r) => (r.t += dt / r.dur));
      this.routes = this.routes.filter((r) => {
        if (r.t >= 1 && !r.done) { r.done = true; this.rings.push({ X: r.tgt.X, D: r.tgt.D, t: 0, hi: r.hi }); }
        return r.t < 1.6;
      });
      this.rings.forEach((g) => (g.t += dt / 1200));
      this.rings = this.rings.filter((g) => g.t < 1);
      const px = this.pointerPx;
      for (const p of this.parts) {
        p.x += p.vx * dt * 0.06; p.y += p.vy * dt * 0.06;
        if (p.y < -4) { p.y = this.h + 4; p.x = Math.random() * this.w; }
        if (p.x < -4) p.x = this.w + 4; if (p.x > this.w + 4) p.x = -4;
        let tx = 0, ty = 0;
        if (px) { const dx = p.x - px[0], dy = p.y - px[1], d = Math.hypot(dx, dy); if (d < 140 && d > 0) { const f = (1 - d / 140) * 26; tx = (dx / d) * f; ty = (dy / d) * f; } }
        p.ox = lerp(p.ox, tx, 0.08); p.oy = lerp(p.oy, ty, 0.08);
      }
    }
    line(pts) {
      const c = this.ctx; let started = false;
      for (const [X, D] of pts) {
        const s = this.proj(X, D);
        if (!s) { started = false; continue; }
        if (!started) { c.moveTo(s[0], s[1]); started = true; } else c.lineTo(s[0], s[1]);
      }
    }
    draw(now) {
      const c = this.ctx, w = this.w, h = this.h;
      c.clearRect(0, 0, w, h);
      // blocos
      c.beginPath();
      for (const [i, j] of this.blocks) {
        const a = this.proj(...this.P(i, j)), b = this.proj(...this.P(i + 1, j)), d = this.proj(...this.P(i + 1, j + 1)), e = this.proj(...this.P(i, j + 1));
        if (!a || !b || !d || !e) continue;
        c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.closePath();
      }
      c.fillStyle = "rgba(255,255,255,0.022)"; c.fill();
      // ruas
      c.beginPath();
      for (const [i1, j1, i2, j2] of this.segs) {
        const a = this.proj(...this.P(i1, j1)), b = this.proj(...this.P(i2, j2));
        if (!a || !b) continue; c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]);
      }
      c.strokeStyle = "rgba(255,255,255,0.075)"; c.lineWidth = 1; c.stroke();
      // rio
      c.beginPath(); this.line(this.river);
      c.strokeStyle = "rgba(106,168,255,0.10)"; c.lineWidth = 10; c.lineJoin = "round"; c.stroke();
      c.strokeStyle = "rgba(106,168,255,0.16)"; c.lineWidth = 1.2; c.stroke();
      // avenidas
      c.beginPath(); this.avenues.forEach((a) => this.line(a));
      c.strokeStyle = "rgba(255,255,255,0.16)"; c.lineWidth = 1.6; c.stroke();

      // zona de alcance do destaque
      const hs = this.proj(this.hi.X, this.hi.D);
      if (hs) {
        const rr = this.proj(this.hi.X + 2.4, this.hi.D);
        if (rr) {
          const rx = Math.abs(rr[0] - hs[0]);
          c.beginPath(); c.ellipse(hs[0], hs[1], rx, rx * 0.42, 0, 0, Math.PI * 2);
          c.fillStyle = "rgba(62,224,161,0.035)"; c.fill();
          c.setLineDash([4, 6]); c.strokeStyle = "rgba(62,224,161,0.28)"; c.lineWidth = 1; c.stroke(); c.setLineDash([]);
        }
      }
      // rotas
      for (const r of this.routes) {
        const t = Math.min(1, r.t);
        const pts = r.pts;
        const L = [Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1])];
        const tot = L[0] + L[1];
        const at = (u) => { const s = u * tot; if (s <= L[0]) { const k = L[0] ? s / L[0] : 1; return [lerp(pts[0][0], pts[1][0], k), lerp(pts[0][1], pts[1][1], k)]; } const k = L[1] ? (s - L[0]) / L[1] : 1; return [lerp(pts[1][0], pts[2][0], k), lerp(pts[1][1], pts[2][1], k)]; };
        const tail = Math.max(0, t - 0.35);
        const fade = r.t > 1 ? 1 - (r.t - 1) / 0.6 : 1;
        const path = [at(tail)]; const steps = 10;
        for (let k = 1; k <= steps; k++) path.push(at(lerp(tail, t, k / steps)));
        c.beginPath(); this.line(path);
        c.strokeStyle = r.hi ? `rgba(62,224,161,${0.75 * fade})` : `rgba(106,168,255,${0.5 * fade})`;
        c.lineWidth = 1.6; c.stroke();
        const head = this.proj(...at(t)); const orig = this.proj(...pts[0]);
        if (head && r.t < 1) { c.beginPath(); c.arc(head[0], head[1], 2.2, 0, 7); c.fillStyle = r.hi ? "#aef5d6" : "#cfe0ff"; c.fill(); }
        if (orig) { c.beginPath(); c.arc(orig[0], orig[1], 1.8, 0, 7); c.fillStyle = `rgba(106,168,255,${0.7 * fade})`; c.fill(); }
      }
      // empresas
      const tt = now / 1000;
      for (const b of this.biz) {
        const s = this.proj(b.X, b.D); if (!s || s[1] > h + 20) continue;
        const sz = clamp(3.2 / s[2], 0.6, 3.2);
        c.beginPath(); c.arc(s[0], s[1], sz, 0, 7);
        c.fillStyle = b.lit ? `rgba(62,224,161,${0.55 + Math.sin(tt * 2 + b.ph) * 0.25})` : "rgba(220,228,232,0.55)";
        c.fill();
      }
      // anéis de chegada
      for (const g of this.rings) {
        const s = this.proj(g.X, g.D); if (!s) continue;
        const rad = (6 + g.t * 26) / Math.max(0.6, s[2] * 0.35);
        c.beginPath(); c.ellipse(s[0], s[1], rad, rad * 0.45, 0, 0, 7);
        c.strokeStyle = g.hi ? `rgba(62,224,161,${(1 - g.t) * 0.7})` : `rgba(106,168,255,${(1 - g.t) * 0.5})`; c.lineWidth = 1.2; c.stroke();
      }
      // destaque
      if (hs) {
        const pulse = (tt % 2) / 2;
        c.beginPath(); c.ellipse(hs[0], hs[1], 8 + pulse * 30, (8 + pulse * 30) * 0.45, 0, 0, 7);
        c.strokeStyle = `rgba(62,224,161,${(1 - pulse) * 0.6})`; c.lineWidth = 1.2; c.stroke();
        c.beginPath(); c.arc(hs[0], hs[1], 4.5, 0, 7); c.fillStyle = "#3ee0a1"; c.shadowColor = "rgba(62,224,161,.9)"; c.shadowBlur = 16; c.fill(); c.shadowBlur = 0;
        if (this.o.label && !this.mobile) {
          const lx = hs[0] + 14, ly = hs[1] - 30;
          c.beginPath(); c.moveTo(hs[0], hs[1] - 5); c.lineTo(lx, ly + 10); c.strokeStyle = "rgba(62,224,161,.5)"; c.lineWidth = 1; c.stroke();
          c.font = "500 10px 'Geist Mono', monospace";
          const txt = "SUA EMPRESA · VISÍVEL NO RAIO";
          const tw = c.measureText(txt).width + 16;
          c.fillStyle = "rgba(10,14,16,.85)"; c.strokeStyle = "rgba(62,224,161,.4)";
          roundRect(c, lx, ly - 8, tw, 20, 6); c.fill(); c.stroke();
          c.fillStyle = "#bff5dc"; c.fillText(txt, lx + 8, ly + 5.5);
        }
      }
      // partículas
      for (const p of this.parts) {
        c.beginPath(); c.arc(p.x + p.ox, p.y + p.oy, p.r, 0, 7);
        c.fillStyle = `rgba(200,230,220,${p.a})`; c.fill();
      }
    }
  }
  function roundRect(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }

  /* ============ HERO ============ */
  function initHero() {
    const hero = $(".hero");
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("in")));
    const canvas = $(".hero-map");
    const map = new CityMap(canvas, { horizon: 0.24 });

    // contador do anel
    const ringNum = $(".ring-val b");
    setTimeout(() => ticker(ringNum, 0, +ringNum.dataset.count, 1900), reduced ? 0 : 900);

    // parallax
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const loop = () => {
      x = lerp(x, tx, 0.08); y = lerp(y, ty, 0.08);
      hero.style.setProperty("--px", x.toFixed(3)); hero.style.setProperty("--py", y.toFixed(3));
      raf = Math.abs(x - tx) + Math.abs(y - ty) > 0.002 ? requestAnimationFrame(loop) : 0;
    };
    if (mqFine.matches) {
      hero.addEventListener("pointermove", (e) => {
        if (reduced) return;
        const r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
        map.setPointer(tx * 2, ty * 2);
        map.pointerPx = [e.clientX - r.left, e.clientY - r.top];
        if (!raf) raf = requestAnimationFrame(loop);
      });
      hero.addEventListener("pointerleave", () => { tx = ty = 0; map.setPointer(0, 0); map.pointerPx = null; if (!raf) raf = requestAnimationFrame(loop); });
    }
    $(".hero-visual").style.setProperty("--d", 6);

    // scroll: o mapa avança (sensação de expansão)
    addEventListener("scroll", () => {
      const p = clamp(scrollY / innerHeight, 0, 1);
      map.scroll = p;
      if (!map.running) map.draw(performance.now());
    }, { passive: true });
  }

  function ticker(el, from, to, dur, dec = 0, suffix = "") {
    if (reduced) { el.textContent = (dec ? to.toFixed(dec).replace(".", ",") : fmt(to)) + suffix; return; }
    const t0 = performance.now();
    const step = (now) => {
      const t = easeOut(clamp((now - t0) / dur, 0, 1));
      const v = from + (to - from) * t;
      el.textContent = (dec ? v.toFixed(dec).replace(".", ",") : fmt(v)) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ============ MAPA NARRATIVO (SVG) ============ */
  const BIZ = [
    { x: 505, y: 318, you: true, name: "Sua empresa", cat: "Serralheria", pos: 2, vis: 91 },
    { x: 250, y: 130, name: "Serralheria Ponto Forte", cat: "Serralheria", pos: 1, vis: 84 },
    { x: 760, y: 150, name: "Portões Aliança", cat: "Portões automáticos", pos: 3, vis: 72 },
    { x: 165, y: 470, name: "Ferro & Forma", cat: "Estrutura metálica", pos: 5, vis: 58 },
    { x: 830, y: 430, name: "Metal Prime", cat: "Serralheria", pos: 4, vis: 63 },
    { x: 690, y: 525, name: "Grade Forte", cat: "Grades e corrimão", pos: 7, vis: 41 },
    { x: 120, y: 250, name: "Solda Rápida", cat: "Serviço de soldagem", pos: 6, vis: 47 },
    { x: 905, y: 290, name: "Serralheria Central", cat: "Serralheria", pos: 8, vis: 36 },
    { x: 400, y: 520, name: "Estrutura Sul", cat: "Coberturas metálicas", pos: 9, vis: 30 }
  ];
  function initMapStory() {
    const box = $("[data-citymap]");
    const svg = $(".citymap-svg", box);
    const NS = "http://www.w3.org/2000/svg";
    const R = rng(21);
    const regions = [
      { n: "ZONA NORTE", p: "0,0 430,0 400,220 360,400 0,330", pat: "pA", lx: 170, ly: 150 },
      { n: "CENTRO", p: "400,220 620,280 540,420 360,400", pat: "pB", lx: 440, ly: 300 },
      { n: "DISTRITO INDUSTRIAL", p: "0,330 360,400 540,420 560,600 0,600", pat: "pC", lx: 60, ly: 560 },
      { n: "JARDIM LESTE", p: "430,0 1000,0 1000,260 620,280 400,220", pat: "pB", lx: 640, ly: 130 },
      { n: "BAIRRO ALTO", p: "620,280 1000,260 1000,600 560,600 540,420", pat: "pA", lx: 760, ly: 360 }
    ];
    const pattern = (id, ang, gap) => `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(${ang})"><path d="M0 0H${gap}M0 0V${gap}" stroke="rgba(255,255,255,.07)" stroke-width="1"/></pattern>`;
    let html = `<defs>${pattern("pA", 12, 26)}${pattern("pB", -18, 20)}${pattern("pC", 34, 34)}
      <pattern id="gridF" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="rgba(255,255,255,.035)"/></pattern>
      <radialGradient id="glowY" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#3ee0a1" stop-opacity=".22"/><stop offset="1" stop-color="#3ee0a1" stop-opacity="0"/></radialGradient></defs>
      <rect width="1000" height="600" fill="url(#gridF)"/>`;
    regions.forEach((r) => {
      html += `<polygon class="region" points="${r.p}" fill="url(#${r.pat})" stroke="#070a0c" stroke-width="10" stroke-linejoin="round"/>`;
      html += `<polygon points="${r.p}" fill="none" stroke="rgba(255,255,255,.13)" stroke-width="1.2"/>`;
      html += `<text class="rname" x="${r.lx}" y="${r.ly}">${r.n}</text>`;
    });
    html += `<path d="M-20,470 C150,430 230,520 380,500 S620,560 760,470 S930,380 1020,420" fill="none" stroke="rgba(106,168,255,.14)" stroke-width="16" stroke-linecap="round"/>
      <path d="M-20,470 C150,430 230,520 380,500 S620,560 760,470 S930,380 1020,420" fill="none" stroke="rgba(106,168,255,.3)" stroke-width="1.2"/>`;
    const you = BIZ[0];
    html += `<circle cx="${you.x}" cy="${you.y}" r="140" fill="url(#glowY)" class="zone-glow"/>`;
    html += `<circle class="zone" cx="${you.x}" cy="${you.y}" r="95"/><circle class="zone" cx="${you.x}" cy="${you.y}" r="170"/>`;
    // consumidores e rotas
    const consumers = [];
    for (let k = 0; k < 16; k++) {
      const ang = R() * Math.PI * 2, dist = 60 + R() * 300;
      consumers.push({ x: clamp(you.x + Math.cos(ang) * dist * 1.4, 30, 970), y: clamp(you.y + Math.sin(ang) * dist * 0.8, 30, 570) });
    }
    consumers.forEach((cn, k) => {
      const tgt = k % 4 === 3 ? BIZ[1 + (k % (BIZ.length - 1))] : you;
      const mx = (cn.x + tgt.x) / 2 + (R() - 0.5) * 120, my = (cn.y + tgt.y) / 2 + (R() - 0.5) * 120;
      html += `<path class="route${tgt === you ? "" : " alt"}" d="M${cn.x.toFixed(1)},${cn.y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${tgt.x},${tgt.y}"/>`;
    });
    consumers.forEach((cn) => (html += `<circle class="consumer" cx="${cn.x.toFixed(1)}" cy="${cn.y.toFixed(1)}" r="3.2"/>`));
    svg.innerHTML = html;

    const routes = $$(".route", svg);
    routes.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p._L = L; });
    const cons = $$(".consumer", svg);
    const zones = $$(".zone, .zone-glow", svg);

    // pins acessíveis
    const pinsBox = $(".citymap-pins", box);
    const tip = $(".citymap-tip", box);
    BIZ.forEach((b, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pin" + (b.you ? " you" : "");
      btn.style.left = b.x / 10 + "%"; btn.style.top = b.y / 6 + "%";
      btn.setAttribute("aria-label", `${b.name} (${b.you ? "exemplo" : "empresa fictícia"}): ${b.cat}, posição local simulada ${b.pos}, visibilidade ${b.vis}%`);
      btn.dataset.i = i;
      if (b.you) btn.innerHTML = `<span class="pin-label" aria-hidden="true">SUA EMPRESA</span>`;
      pinsBox.appendChild(btn);
    });
    const pins = $$(".pin", pinsBox);
    const showTip = (btn) => {
      const b = BIZ[+btn.dataset.i];
      tip.innerHTML = `<b>${b.name}</b><span>${b.cat} · ${b.you ? "exemplo" : "empresa fictícia"}</span>
        <div class="row"><span>posição local simulada</span><span>#${b.pos}</span></div>
        <div class="bar" style="--v:${b.vis}%"><i></i></div><div class="row"><span>visibilidade</span><span>${b.vis}%</span></div>`;
      tip.hidden = false;
      const bw = box.clientWidth, x = (b.x / 1000) * bw;
      tip.style.left = clamp(x, 110, bw - 110) + "px";
      const y = (b.y / 600) * box.clientHeight;
      tip.style.top = y + "px";
      if (y < 150) tip.style.transform = "translate(-50%, 22px)"; else tip.style.transform = "";
    };
    const hideTip = () => (tip.hidden = true);
    pins.forEach((p) => {
      p.addEventListener("pointerenter", () => showTip(p));
      p.addEventListener("focus", () => showTip(p));
      p.addEventListener("click", () => showTip(p));
      p.addEventListener("pointerleave", hideTip);
      p.addEventListener("blur", hideTip);
    });
    box.addEventListener("keydown", (e) => { if (e.key === "Escape") hideTip(); });

    const hud = { biz: $('[data-hud="biz"]', box), search: $('[data-hud="search"]', box), links: $('[data-hud="links"]', box) };
    const caps = $$(".mapstory-captions li");
    const section = $(".mapstory");
    let lastCap = -1;

    const apply = (p) => {
      box.style.setProperty("--reveal", easeOut(seg(p, 0, 0.3)).toFixed(3));
      const pp = seg(p, 0.25, 0.5);
      pins.forEach((pin, i) => pin.classList.toggle("on", pp > (i / pins.length) * 0.9 || (pin.classList.contains("you") && p > 0.24)));
      const zp = easeOut(seg(p, 0.45, 0.62));
      zones.forEach((z) => { z.style.transform = `scale(${zp})`; z.style.opacity = zp; });
      const cp = seg(p, 0.5, 0.62);
      cons.forEach((c, i) => c.classList.toggle("on", cp > i / cons.length));
      const lp = seg(p, 0.58, 0.86);
      routes.forEach((r, i) => { const local = seg(lp, (i / routes.length) * 0.5, (i / routes.length) * 0.5 + 0.5); r.style.strokeDashoffset = (r._L * (1 - local)).toFixed(1); });
      const shown = pins.filter((x) => x.classList.contains("on")).length;
      hud.biz.textContent = shown;
      hud.search.textContent = Math.round(cp * cons.length * 12);
      hud.links.textContent = Math.round(lp * routes.length);
      const ci = p < 0.4 ? 0 : p < 0.66 ? 1 : 2;
      if (ci !== lastCap) { caps.forEach((c, i) => c.classList.toggle("on", i === ci)); lastCap = ci; }
    };

    const pinned = () => mqDesk.matches && !reduced;
    let ticking = false;
    const onScroll = () => {
      if (!pinned() || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = section.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - innerHeight), 0, 1);
        apply(p); ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", () => { if (!pinned()) apply(1); else onScroll(); });

    if (pinned()) onScroll();
    else {
      // mobile / movimento reduzido: sequência única ao entrar na tela
      apply(0.3);
      onView([box], () => {
        if (reduced) { apply(1); return; }
        const t0 = performance.now();
        const run = (now) => { const t = clamp((now - t0) / 2600, 0, 1); apply(0.3 + t * 0.7); if (t < 1 && !pinned()) requestAnimationFrame(run); };
        requestAnimationFrame(run);
      }, { threshold: 0.35 });
    }
  }

  /* ============ SIMULAÇÃO DE PESQUISA ============ */
  function initSearchSim() {
    const sim = $("[data-sim]");
    const q = $(".sim-query", sim);
    const steps = $$(".sim-steps li");
    const cursor = $(".sim-cursor", sim);
    const text = q.dataset.q;
    let timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const setStep = (n) => steps.forEach((s, i) => { s.classList.toggle("on", i === n); s.classList.toggle("done", i < n); });
    const reset = () => {
      timers.forEach(clearTimeout); timers = [];
      sim.classList.remove("loading", "results", "chosen");
      cursor.classList.remove("on", "click");
      q.textContent = ""; setStep(-1);
    };
    const run = () => {
      reset();
      if (reduced) { q.textContent = text; sim.classList.add("results", "chosen"); setStep(3); return; }
      setStep(0);
      let t = 300;
      for (let i = 1; i <= text.length; i++) { later(() => (q.textContent = text.slice(0, i)), t); t += 55 + Math.random() * 40; }
      t += 350;
      later(() => { setStep(1); sim.classList.add("loading"); }, t);
      t += 950;
      later(() => { setStep(2); sim.classList.add("results"); }, t);
      t += 1500;
      later(() => {
        setStep(3);
        const li = $(".sim-results li", sim);
        const sr = sim.getBoundingClientRect(), lr = li.getBoundingClientRect();
        cursor.style.setProperty("--x", sr.width * 0.75 + "px"); cursor.style.setProperty("--y", sr.height + "px");
        cursor.classList.add("on");
        requestAnimationFrame(() => {
          cursor.style.setProperty("--x", lr.right - sr.left - 44 + "px");
          cursor.style.setProperty("--y", lr.top - sr.top + lr.height / 2 - 11 + "px");
        });
      }, t);
      t += 1100;
      later(() => { cursor.classList.add("click"); sim.classList.add("chosen"); }, t);
      later(() => cursor.classList.remove("click"), t + 200);
      later(() => cursor.classList.remove("on"), t + 1400);
    };
    onView([sim], run, { threshold: 0.45 });
    $(".sim-replay", sim).addEventListener("click", run);
  }

  /* ============ SERP / CONCORRÊNCIA (FLIP) ============ */
  function initSerp() {
    const serp = $("[data-serp]");
    const list = $(".serp-list", serp);
    const fold = $(".serp-fold", serp);
    const segEl = $(".seg");
    const order = { before: ["a", "b", "c", "e", "you"], after: ["a", "you", "b", "c", "e"] };
    const you = $('li[data-id="you"]', list);
    const em = $("em", you), chips = $(".chips", you);
    const layout = (mode, animate) => {
      const items = $$("li", list);
      const first = new Map(items.map((li) => [li, li.getBoundingClientRect().top]));
      order[mode].forEach((id) => list.appendChild($(`li[data-id="${id}"]`, list)));
      em.textContent = em.dataset[mode];
      chips.innerHTML = chips.dataset[mode];
      $$("li", list).forEach((li, i) => { $(".serp-rank", li).textContent = i + 1; li.classList.toggle("below", i >= 3 && li !== you); });
      serp.dataset.mode = mode;
      segEl.classList.toggle("after", mode === "after");
      // linha de corte depois do 3º item
      const third = $$("li", list)[2];
      fold.style.top = third.offsetTop + third.offsetHeight + list.offsetTop + 4 + "px";
      if (!animate || reduced) return;
      $$("li", list).forEach((li) => {
        const dy = first.get(li) - li.getBoundingClientRect().top;
        if (!dy) return;
        li.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 700, easing: "cubic-bezier(.22,1,.36,1)" });
      });
    };
    const btns = $$("button", segEl);
    const set = (mode, animate = true) => {
      btns.forEach((b) => { const on = b.dataset.mode === mode; b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; });
      layout(mode, animate);
    };
    btns.forEach((b) => b.addEventListener("click", () => set(b.dataset.mode)));
    segEl.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      const next = serp.dataset.mode === "before" ? "after" : "before";
      set(next); btns.find((b) => b.dataset.mode === next).focus();
    });
    set("before", false);
    addEventListener("resize", () => layout(serp.dataset.mode, false));
    // demonstração automática uma vez
    onView([serp], () => { if (!reduced) setTimeout(() => { if (serp.dataset.mode === "before") set("after"); }, 1600); }, { threshold: 0.6 });
  }

  /* ============ DIAGNÓSTICO ============ */
  const KW_BY_CAT = {
    "Serralheria": ["serralheria em {c}", "serralheiro perto de mim", "conserto de portão {c}", "portão automático {c}", "serralheiro 24 horas", "grades para janelas {c}"],
    "Vidraçaria": ["vidraçaria em {c}", "vidraçaria perto de mim", "box para banheiro {c}", "espelho sob medida {c}"],
    "Marcenaria": ["marcenaria em {c}", "marceneiro perto de mim", "móveis planejados {c}", "cozinha planejada {c}"],
    "Eletricista": ["eletricista em {c}", "eletricista perto de mim", "eletricista 24 horas {c}", "instalação elétrica {c}"],
    "Encanador": ["encanador em {c}", "encanador perto de mim", "desentupidora {c}", "vazamento de água {c}"],
    "Oficina mecânica": ["oficina mecânica em {c}", "mecânico perto de mim", "revisão de carro {c}", "troca de óleo {c}"],
    "Clínica": ["clínica em {c}", "clínica perto de mim", "consulta particular {c}"],
    "Restaurante": ["restaurante em {c}", "restaurante perto de mim", "almoço {c}", "delivery {c}"],
    "Outra": ["{cat} em {c}", "{cat} perto de mim", "melhor {cat} {c}"]
  };
  function initDiag() {
    const form = $(".diag-form");
    const stage = $(".diag-stage");
    const idle = $(".diag-idle", stage), scan = $(".diag-scan", stage), res = $(".diag-result", stage);
    const err = $(".form-error", form);
    const pct = $("[data-scan-pct]", scan), bar = $(".scan-bar", scan);
    const items = $$(".scan-list li", scan);
    let busy = false;
    const esc = (s) => s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (busy) return;
      const nome = form.nome.value.trim(), cidade = form.cidade.value.trim(), cat = form.categoria.value;
      form.nome.setAttribute("aria-invalid", !nome); form.cidade.setAttribute("aria-invalid", !cidade);
      if (!nome || !cidade) { err.textContent = "Preencha o nome da empresa e a cidade."; err.hidden = false; (!nome ? form.nome : form.cidade).focus(); return; }
      err.hidden = true; busy = true;
      idle.hidden = true; res.hidden = true; res.classList.remove("show"); scan.hidden = false;
      items.forEach((li) => li.classList.remove("run", "ok"));
      const per = reduced ? 60 : 480;
      items.forEach((li, i) => {
        setTimeout(() => {
          items.forEach((x, k) => { if (k < i) { x.classList.remove("run"); x.classList.add("ok"); } });
          li.classList.add("run");
          const p = i / items.length; bar.style.setProperty("--p", p); pct.textContent = Math.round(p * 100) + "%";
        }, i * per);
      });
      setTimeout(() => {
        items.forEach((x) => { x.classList.remove("run"); x.classList.add("ok"); });
        bar.style.setProperty("--p", 1); pct.textContent = "100%";
      }, items.length * per);
      setTimeout(() => { showResult(nome, cidade, cat); busy = false; }, items.length * per + (reduced ? 50 : 500));
    });

    const showResult = (nome, cidade, cat) => {
      scan.hidden = true;
      const catL = cat === "Outra" ? "empresa" : cat.toLowerCase();
      $("[data-res-title]", res).textContent = `${nome} · ${cidade}`;
      const checks = [
        ["Google", `Se a ${esc(nome)} aparece quando alguém pesquisa ${esc(catL)} em ${esc(cidade)}.`],
        ["Maps", `Posição no mapa em diferentes pontos de ${esc(cidade)}, não só perto do endereço.`],
        ["Palavras-chave", `Quais pesquisas com intenção de contratar já mostram a empresa — e quais não.`],
        ["Categoria", `Se a categoria principal e as secundárias descrevem de fato o que você faz.`],
        ["Avaliações", `Volume, recência e respostas em comparação com os concorrentes da região.`],
        ["Concorrência", `Quem ocupa as três primeiras posições no seu raio e por quê.`]
      ];
      $(".res-grid", res).innerHTML = checks.map(([t, d]) => `<li><b>${t}</b><p>${d}</p></li>`).join("");
      const kws = (KW_BY_CAT[cat] || KW_BY_CAT.Outra).map((k) => k.replace("{c}", cidade).replace("{cat}", catL));
      $(".res-kw-list", res).innerHTML = kws.map((k) => `<li>${esc(k)}</li>`).join("");
      const a = $('[data-contact="diag"]', res);
      const href = contactHref(`Olá! Quero o diagnóstico real de presença local.\nEmpresa: ${nome}\nCidade: ${cidade}\nCategoria: ${cat}`);
      if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener"; a.hidden = false; }
      else a.hidden = true;
      res.hidden = false;
      requestAnimationFrame(() => res.classList.add("show"));
      res.focus({ preventScroll: true });
    };
    $("[data-reset]", res).addEventListener("click", () => {
      res.hidden = true; idle.hidden = false; form.reset(); form.nome.focus();
    });
  }

  /* ============ SERVIÇOS ============ */
  const ICONS = {
    pin: `<path class="draw" d="M16 4c-4.4 0-7.6 3.3-7.6 7.5 0 5.6 7.6 13.5 7.6 13.5s7.6-7.9 7.6-13.5C23.6 7.3 20.4 4 16 4Z"/><circle class="pulse" cx="16" cy="11.5" r="2.6" fill="currentColor" stroke="none"/><path class="draw" d="M8 28h16"/>`,
    profile: `<rect class="draw" x="5" y="5" width="22" height="22" rx="4"/><circle class="draw" cx="16" cy="13" r="3.5"/><path class="draw" d="M9.5 23c1.4-3 3.8-4.5 6.5-4.5s5.1 1.5 6.5 4.5"/>`,
    spark: `<path class="draw" d="M4 22l6-6 5 4 9-11"/><path class="draw" d="M19 9h5v5"/><circle class="pulse" cx="10" cy="16" r="1.6" fill="currentColor" stroke="none"/>`,
    key: `<circle class="draw" cx="11" cy="16" r="5"/><path class="draw" d="M16 16h12M24 16v4M28 16v3"/>`,
    doc: `<path class="draw" d="M8 4h11l5 5v19H8z"/><path class="draw" d="M12 14h8M12 18h8M12 22h5"/>`,
    tree: `<rect class="draw" x="12" y="4" width="8" height="6" rx="1.5"/><rect class="draw" x="4" y="22" width="8" height="6" rx="1.5"/><rect class="draw" x="20" y="22" width="8" height="6" rx="1.5"/><path class="draw" d="M16 10v6M8 22v-3h16v3"/>`,
    code: `<path class="draw" d="M11 9l-7 7 7 7M21 9l7 7-7 7M18 6l-4 20"/>`,
    radar: `<circle class="draw" cx="16" cy="16" r="11"/><circle class="draw" cx="16" cy="16" r="6"/><path class="draw" d="M16 16l7-7"/><circle class="pulse" cx="21" cy="12" r="1.6" fill="currentColor" stroke="none"/>`,
    pulse: `<path class="draw" d="M3 17h6l3-8 5 15 3-7h9"/>`
  };
  const SERVICES = [
    { t: "SEO Local", i: "pin", d: "A base de tudo: fazer o Google entender o que sua empresa faz, onde atende e por que ela é relevante para quem está por perto.", l: ["Definição da área de atendimento por bairro e cidade", "Nome, endereço e telefone consistentes em toda a web", "Prioridades de busca local para o seu segmento", "Plano de presença para cada região atendida"], e: "Uma serralheria que atende três bairros vizinhos organiza sua presença para ser relevante em cada um deles — não só no endereço da oficina." },
    { t: "Google Business Profile", i: "profile", d: "O Perfil da Empresa no Google é o que aparece no Maps. Deixamos ele completo, correto e ativo — dentro das diretrizes do Google.", l: ["Categoria principal e secundárias corretas", "Serviços cadastrados um a um", "Fotos reais dos trabalhos e da equipe", "Horário, área de atendimento e rotina de respostas às avaliações"], e: "Cadastrar “fabricação de portões”, “grades de proteção” e “corrimão de inox” como serviços separados, cada um com descrição própria." },
    { t: "Otimização de presença", i: "spark", d: "Sua empresa precisa ser encontrada do mesmo jeito em todos os lugares: diretórios, redes sociais, mapas e site.", l: ["Auditoria de citações locais", "Correção de dados divergentes", "Presença nos diretórios relevantes do segmento", "Padronização de nome e contatos"], e: "Endereço antigo em um diretório e telefone errado em outro confundem o Google e o cliente. Unificamos tudo." },
    { t: "Palavras-chave locais", i: "key", d: "Mapeamos as pesquisas com intenção de contratar e decidimos onde cada uma deve ser trabalhada: perfil, página do site ou conteúdo.", l: ["Pesquisa de termos por serviço e região", "Separação por intenção: urgência, orçamento, comparação", "Mapa de palavra-chave → página", "Termos que os concorrentes já ocupam"], e: "“Serralheiro 24 horas” pede uma página de atendimento emergencial; “fabricação de portões” pede fotos e prazos." },
    { t: "Estratégia de conteúdo", i: "doc", d: "Conteúdo que responde o que o cliente pergunta antes de ligar — e que mostra ao Google que você domina o assunto.", l: ["Páginas por serviço com fotos reais", "Perguntas frequentes do seu cliente", "Publicações no Perfil da Empresa", "Galeria de trabalhos com descrição útil"], e: "Uma página sobre manutenção de portões explicando sinais de desgaste, prazos e cuidados — com os seus trabalhos como exemplo." },
    { t: "Estrutura do site", i: "tree", d: "Um site rápido, claro no celular e organizado por serviço, com o botão de ligar ou chamar no WhatsApp sempre à mão.", l: ["Arquitetura de páginas por serviço e região", "Velocidade e experiência no celular", "Links internos entre serviços relacionados", "Chamadas para ação visíveis"], e: "Da página de portão automático o cliente chega em um clique à de manutenção de portões e ao WhatsApp." },
    { t: "Dados estruturados", i: "code", d: "Marcação schema.org que descreve sua empresa e seus serviços em uma linguagem que o Google lê diretamente — sempre com informações verdadeiras.", l: ["LocalBusiness com dados reais da empresa", "Service para cada serviço oferecido", "FAQ quando o conteúdo atende às diretrizes", "Validação e monitoramento de erros"], e: "Informar ao Google, de forma estruturada, que a empresa é uma serralheria, onde atende e quais serviços oferece." },
    { t: "Análise de concorrência", i: "radar", d: "Entendemos quem aparece hoje no seu raio, o que eles fazem bem e onde estão as brechas que você pode ocupar.", l: ["Quem ocupa as primeiras posições no Maps", "Categorias e serviços dos concorrentes", "Comparação de avaliações e fotos", "Oportunidades não exploradas"], e: "Se nenhum concorrente trabalha “estrutura metálica” na sua cidade, essa pode ser a porta de entrada mais rápida." },
    { t: "Monitoramento", i: "pulse", d: "Acompanhamos o que realmente importa — ligações, pedidos de rota, cliques e pesquisas — e ajustamos o plano com base nos dados.", l: ["Leitura dos dados do Perfil da Empresa", "Search Console do site", "Acompanhamento das palavras-chave prioritárias", "Relatório com o que mudou e próximos passos"], e: "Perceber que as ligações vêm de “conserto de portão” e reforçar exatamente esse serviço." }
  ];
  function initServices() {
    const list = $(".svc-list"), panel = $(".svc-panel");
    const arrow = `<svg class="ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9m-3-3 3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    list.innerHTML = SERVICES.map((s, i) => `<button type="button" role="tab" class="svc-tab" id="svc-t${i}" aria-controls="svc-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="n">${String(i + 1).padStart(2, "0")}</span><span class="t">${s.t}</span>${arrow}</button>`).join("");
    panel.id = "svc-panel";
    const tabs = $$(".svc-tab", list);
    const render = (i) => {
      const s = SERVICES[i];
      panel.setAttribute("aria-labelledby", "svc-t" + i);
      panel.innerHTML = `<span class="bgnum" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
        <div class="svc-inner swap">
          <div class="svc-icon"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[s.i]}</svg></div>
          <h3>${s.t}</h3>
          <p>${s.d}</p>
          <div class="svc-cols">
            <ul class="svc-deliver" aria-label="O que entregamos">${s.l.map((x) => `<li>${x}</li>`).join("")}</ul>
            <div class="svc-example"><span class="mono label">Na prática · serralheria</span><p>${s.e}</p></div>
          </div>
        </div>`;
    };
    const select = (i, focus) => {
      tabs.forEach((t, k) => { t.setAttribute("aria-selected", k === i); t.tabIndex = k === i ? 0 : -1; });
      render(i);
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => t.addEventListener("click", () => select(i)));
    list.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(document.activeElement); if (i < 0) return;
      const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (map[e.key]) { e.preventDefault(); select((i + map[e.key] + tabs.length) % tabs.length, true); }
      if (e.key === "Home") { e.preventDefault(); select(0, true); }
      if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
    });
    select(0);
  }

  /* ============ PALAVRAS-CHAVE ============ */
  const KW = [
    ["serralheria", "core", 1], ["serralheiro perto de mim", "prox", 1], ["portão automático", "port", 2], ["grades de proteção", "prot", 3],
    ["serralheiro 24 horas", "urg", 2], ["estrutura metálica", "estr", 2], ["fabricação de portões", "port", 3], ["corrimão de inox", "prot", 3],
    ["serralheria perto de mim", "prox", 1], ["conserto de portão", "port", 2], ["serralheria residencial", "core", 3], ["cobertura metálica", "estr", 3],
    ["guarda corpo", "prot", 2], ["serralheiro", "core", 1], ["serviço de soldagem", "core", 3], ["portão de ferro", "port", 3],
    ["serralheiro urgente", "urg", 3], ["mezanino metálico", "estr", 3], ["serralheria industrial", "core", 3], ["grades para janelas", "prot", 3],
    ["manutenção de portões", "port", 3], ["escada metálica", "estr", 3], ["serralheria sob medida", "core", 3], ["corrimão de ferro", "prot", 3],
    ["portões personalizados", "port", 3], ["serralheria de alumínio", "core", 3], ["estrutura de ferro", "estr", 3], ["solda", "core", 3]
  ];
  const INTENT = { prox: "intenção · proximidade", urg: "intenção · urgência", port: "tema · portões", prot: "tema · proteção", estr: "tema · estruturas", core: "núcleo · serralheria" };
  function initKeywords() {
    const cloud = $(".kw-cloud"), ul = $(".kw-list", cloud);
    const R = rng(5);
    ul.innerHTML = KW.map(([k, g, t], i) => {
      const a = R() * Math.PI * 2, d = 120 + R() * 220;
      return `<li class="kw t${t}" data-g="${g}" style="--tx:${(Math.cos(a) * d).toFixed(0)}px;--ty:${(Math.sin(a) * d * 0.6).toFixed(0)}px;--dl:${(i * 28).toFixed(0)}ms">${k}<span class="tip" aria-hidden="true">${INTENT[g]}</span></li>`;
    }).join("");
    onView([cloud], (el) => el.classList.add("is-in"), { threshold: 0.25 });
    const btns = $$(".kw-filters button");
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => x.setAttribute("aria-pressed", x === b));
      const f = b.dataset.f;
      cloud.classList.toggle("filtered", f !== "all");
      $$(".kw", ul).forEach((li) => li.classList.toggle("dim", f !== "all" && li.dataset.g !== f));
    }));
  }

  /* ============ COMO FUNCIONA ============ */
  function initHow() {
    const wrap = $("[data-how]");
    const steps = $$(".how-step", wrap);
    let ticking = false;
    const update = () => {
      const r = wrap.getBoundingClientRect();
      const start = innerHeight * 0.72;
      const p = reduced ? 1 : clamp((start - r.top) / r.height, 0, 1);
      wrap.style.setProperty("--fill", p.toFixed(3));
      steps.forEach((s) => {
        const sr = s.getBoundingClientRect();
        s.classList.toggle("on", reduced || sr.top + 30 < start);
      });
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ============ DASHBOARD (demonstração) ============ */
  function series(n, base, growth, seed) {
    const R = rng(seed);
    return Array.from({ length: n }, (_, i) => Math.max(0, base * (1 + growth * (i / (n - 1))) * (0.86 + R() * 0.28)));
  }
  const PERIODS = {
    7: { labels: ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"], maps: series(7, 60, 0.35, 3), busca: series(7, 38, 0.3, 4), vis: 71, pesq: 742, cli: 118, rot: 64, cha: 41, int: 263, d: [4, 9, 7, 12, 8, 6] },
    30: { labels: Array.from({ length: 30 }, (_, i) => `dia ${i + 1}`), maps: series(30, 52, 0.7, 5), busca: series(30, 30, 0.6, 6), vis: 82, pesq: 3184, cli: 507, rot: 268, cha: 176, int: 1094, d: [11, 24, 18, 21, 15, 19] },
    90: { labels: Array.from({ length: 13 }, (_, i) => `sem ${i + 1}`), maps: series(13, 300, 1.1, 7), busca: series(13, 180, 0.9, 8), vis: 93, pesq: 9870, cli: 1522, rot: 804, cha: 529, int: 3301, d: [24, 41, 33, 37, 29, 35] }
  };
  const KW_ROWS = { 7: [5, 8, 11, 6, 14], 30: [3, 6, 9, 4, 12], 90: [2, 4, 7, 3, 9] };
  const KW_DELTA = { 7: [1, 0, 2, 1, 3], 30: [3, 4, 5, 2, 6], 90: [6, 9, 8, 5, 11] };
  const KW_NAMES = ["serralheiro perto de mim", "conserto de portão", "portão automático", "serralheria residencial", "estrutura metálica"];
  function initDash() {
    const dash = $("[data-dash]");
    const kpis = $(".kpis", dash), svg = $(".chart-svg", dash), box = $(".chart-box", dash), tipEl = $(".chart-tip", dash), kwUl = $(".kw-table ul", dash);
    const names = ["Visibilidade local", "Pesquisas", "Cliques no site", "Pedidos de rota", "Chamadas", "Interações"];
    kpis.innerHTML = names.map((n) => `<div class="kpi"><span>${n}</span><b>0</b><em></em><svg viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true"><path/></svg></div>`).join("");
    const W = 600, H = 220, pad = 10;
    const path = (arr, max) => arr.map((v, i) => `${i ? "L" : "M"}${(pad + (i / (arr.length - 1)) * (W - pad * 2)).toFixed(1)},${(H - pad - (v / max) * (H - pad * 2 - 20)).toFixed(1)}`).join("");
    let cur = 30, shown = false;
    const render = (p, animate) => {
      const d = PERIODS[p];
      const vals = [d.vis, d.pesq, d.cli, d.rot, d.cha, d.int];
      $$(".kpi", kpis).forEach((k, i) => {
        const b = $("b", k);
        if (animate) ticker(b, 0, vals[i], 1400, 0, i === 0 ? "%" : ""); else b.textContent = fmt(vals[i]) + (i === 0 ? "%" : "");
        $("em", k).textContent = `↑ ${d.d[i]}%`;
        const sp = series(12, 10, 0.6 + i * 0.1, 30 + i + p);
        const mx = Math.max(...sp);
        const pth = $("path", k);
        pth.setAttribute("d", sp.map((v, j) => `${j ? "L" : "M"}${(j / 11) * 100},${24 - (v / mx) * 20}`).join(""));
        if (animate && !reduced) { pth.style.transition = "none"; pth.style.strokeDashoffset = 200; pth.getBoundingClientRect(); pth.style.transition = ""; pth.style.strokeDashoffset = 0; }
      });
      const max = Math.max(...d.maps, ...d.busca) * 1.08;
      const p1 = path(d.maps, max), p2 = path(d.busca, max);
      svg.innerHTML = `<defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3ee0a1" stop-opacity=".22"/><stop offset="1" stop-color="#3ee0a1" stop-opacity="0"/></linearGradient></defs>
        <g class="grid">${[0.25, 0.5, 0.75].map((f) => `<line x1="0" x2="${W}" y1="${H * f}" y2="${H * f}"/>`).join("")}</g>
        <path class="a1" d="${p1} L${W - pad},${H} L${pad},${H} Z"/>
        <path class="s2" d="${p2}"/><path class="s1" d="${p1}"/>
        <line class="xh" x1="0" x2="0" y1="0" y2="${H}" visibility="hidden"/>`;
      if (animate && !reduced) {
        svg.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { duration: 1600, easing: "cubic-bezier(.22,1,.36,1)" });
      }
      kwUl.innerHTML = KW_NAMES.map((n, i) => { const dl = KW_DELTA[p][i]; return `<li><span>${n}</span><b>#${KW_ROWS[p][i]}</b><em class="${dl ? "" : "flat"}">${dl ? "↑" + dl : "="}</em></li>`; }).join("");
    };
    // tooltip do gráfico
    const dots = [document.createElement("span"), document.createElement("span")];
    dots.forEach((dt, i) => { dt.className = "chart-dot"; dt.style.background = i ? "var(--blue)" : "var(--accent)"; dt.hidden = true; box.appendChild(dt); });
    box.addEventListener("pointermove", (e) => {
      const d = PERIODS[cur], r = box.getBoundingClientRect();
      const n = d.maps.length, fx = clamp((e.clientX - r.left) / r.width, 0, 1);
      const i = Math.round(((fx * W - pad) / (W - pad * 2)) * (n - 1));
      const k = clamp(i, 0, n - 1);
      const max = Math.max(...d.maps, ...d.busca) * 1.08;
      const x = ((pad + (k / (n - 1)) * (W - pad * 2)) / W) * r.width;
      const y1 = ((H - pad - (d.maps[k] / max) * (H - pad * 2 - 20)) / H) * r.height;
      const y2 = ((H - pad - (d.busca[k] / max) * (H - pad * 2 - 20)) / H) * r.height;
      const xh = $(".xh", svg); const sx = pad + (k / (n - 1)) * (W - pad * 2);
      xh.setAttribute("x1", sx); xh.setAttribute("x2", sx); xh.setAttribute("visibility", "visible");
      dots[0].hidden = dots[1].hidden = false;
      dots[0].style.left = dots[1].style.left = x + "px"; dots[0].style.top = y1 + "px"; dots[1].style.top = y2 + "px";
      tipEl.hidden = false; tipEl.style.left = clamp(x, 70, r.width - 70) + "px";
      tipEl.innerHTML = `${d.labels[k]} · Maps <b>${fmt(d.maps[k])}</b> · Busca <b>${fmt(d.busca[k])}</b>`;
    });
    box.addEventListener("pointerleave", () => { tipEl.hidden = true; dots.forEach((d) => (d.hidden = true)); $(".xh", svg)?.setAttribute("visibility", "hidden"); });

    const tabs = $$(".dash-tabs button", dash);
    tabs.forEach((b) => b.addEventListener("click", () => {
      tabs.forEach((x) => x.setAttribute("aria-selected", x === b));
      cur = +b.dataset.p; render(cur, shown);
    }));
    render(cur, false);
    onView([dash], (el) => { el.classList.add("is-in"); shown = true; render(cur, true); }, { threshold: 0.25 });
  }

  /* ============ CASES ============ */
  function initCases() {
    const box = $("[data-cases]");
    const esc = (s = "") => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
    if (CASES.length) {
      box.innerHTML = `<div class="cases-real">${CASES.map((c, i) => `<article class="case-card">
        <div class="case-top mono"><span>CASE ${String(i + 1).padStart(2, "0")}</span><span>${esc(c.segmento)}</span></div>
        <h3>${esc(c.cliente)}</h3>
        <div class="case-fields">
          <div><span>Cidade</span><b>${esc(c.cidade)}</b></div><div><span>Período</span><b>${esc(c.periodo)}</b></div>
          <div><span>Destaque</span><b>${esc(c.destaque)}</b></div><div><span>Fonte</span><b>${esc(c.fonte)}</b></div>
        </div>
        ${c.depoimento ? `<p class="case-quote">“${esc(c.depoimento)}”<br><span class="mono">— ${esc(c.autor)}</span></p>` : ""}
      </article>`).join("")}</div>`;
      return;
    }
    const card = (n, title, text) => `<article class="case-card" ${n > 1 ? 'aria-hidden="true"' : ""}>
      <div class="case-top mono"><span>CASE ${String(n).padStart(2, "0")}</span><span class="badge-demo">EM DOCUMENTAÇÃO</span></div>
      <h3>${title}</h3><p>${text}</p>
      <div class="case-fields"><div><span>Segmento</span><i></i></div><div><span>Cidade</span><i></i></div><div><span>Período</span><i></i></div><div><span>Métrica principal</span><i></i></div></div>
    </article>`;
    box.innerHTML = `<div class="case-stack">${card(1, "Os próximos cases estão sendo documentados.", "Publicamos resultados somente com autorização do cliente, período de comparação e fonte dos dados. Até lá, preferimos mostrar um espaço vazio a um número inventado.")}${card(2, "", "")}${card(3, "", "")}</div>`;
    onView([box], (el) => el.classList.add("is-in"), { threshold: 0.4 });
  }

  /* ============ FAQ ============ */
  function initFaq() {
    $$(".acc-item").forEach((item) => {
      const b = $("button", item);
      b.addEventListener("click", () => {
        const open = b.getAttribute("aria-expanded") === "true";
        b.setAttribute("aria-expanded", !open);
        item.classList.toggle("open", !open);
      });
    });
  }

  /* ============ CTA ============ */
  function initCta() {
    const h = $(".shutter");
    const words = h.textContent.trim().split(/\s+/);
    let i = 0;
    h.innerHTML = words.map((w) => `<span class="wd" aria-hidden="true">${[...w].map((ch) => `<span class="ch" style="--i:${i++};--oy:${i % 2 ? "-0.6em" : "0.6em"}">${ch}</span>`).join("")}</span>`).join(" ");
    onView([h], (el) => el.classList.add("is-in"), { threshold: 0.5 });
    new CityMap($(".cta-map"), { horizon: 0.32, seed: 13, businesses: 26, label: false, pulseEvery: 700, highlightX: 0, highlightD: 4.4 });
    const a = $('[data-contact="cta"]');
    const href = contactHref("Olá! Quero melhorar a presença local da minha empresa no Google.");
    if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener"; }
  }

  /* ============ Títulos / eyebrows ============ */
  function initReveals() {
    // clip-path zera a área do elemento para o IntersectionObserver: observa o pai
    const titles = $$(".reveal-title");
    onView(titles.map((t) => t.parentElement), (p) => $$(":scope > .reveal-title", p).forEach((t) => t.classList.add("is-in")), { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });
    onView($$(".eyebrow, .problem-statement"), (el) => el.classList.add("is-in"), { threshold: 0.35, rootMargin: "0px 0px -8% 0px" });
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  const safe = (fn) => { try { fn(); } catch (e) { console.error(e); } };
  const boot = () => [initNav, initPointer, initHero, initMapStory, initSearchSim, initSerp, initDiag, initServices, initKeywords, initHow, initDash, initCases, initFaq, initCta, initReveals].forEach(safe);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();
