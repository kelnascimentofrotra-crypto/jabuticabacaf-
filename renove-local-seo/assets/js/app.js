/* Renove Serralheria — interações (sem dependências) */
(() => {
  "use strict";

  const C = window.SITE_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
  const mqFine = matchMedia("(hover: hover) and (pointer: fine)");
  const mqDesk = matchMedia("(min-width: 900px)");
  const reduced = () => mqReduce.matches;
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const onView = (els, cb, opts = { threshold: 0.2 }) => {
    if (!("IntersectionObserver" in window)) { els.forEach(cb); return; }
    const io = new IntersectionObserver((ens) => ens.forEach((en) => { if (en.isIntersecting) { cb(en.target); io.unobserve(en.target); } }), opts);
    els.forEach((el) => io.observe(el));
  };
  let scrollHandlers = [];
  const onScroll = (fn) => scrollHandlers.push(fn);
  let ticking = false;
  const runScroll = () => { ticking = false; scrollHandlers.forEach((fn) => fn()); };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } }, { passive: true });
  addEventListener("resize", () => requestAnimationFrame(runScroll));

  /* ------------------------------------------------------------------ config */
  const emp = C.empresa || {};
  const loc = C.local || {};
  const ct = C.contato || {};
  const brand = emp.nome || "Renove";
  const fullName = emp.nomeCompleto || [emp.nome, emp.descritor].filter(Boolean).join(" ") || "Renove Serralheria";
  const digits = (ct.whatsapp || "").replace(/\D/g, "");
  const waLink = (msg) => (digits ? `https://wa.me/${digits}?text=${encodeURIComponent(msg)}` : null);
  const place = [loc.cidade, loc.uf].filter(Boolean).join("/");

  function applyConfig() {
    $$("[data-brand-name]").forEach((el) => (el.textContent = brand));
    $$("[data-brand-desc]").forEach((el) => (el.textContent = emp.descritor || "Serralheria"));
    $$("[data-brand-full]").forEach((el) => (el.textContent = fullName));
    $$(".brand").forEach((el) => el.setAttribute("aria-label", `${fullName} — início`));
    if (loc.cidade) {
      document.title = `Serralheria em ${loc.cidade} | ${fullName}: portões e estruturas metálicas`;
      const k = $("[data-hero-kicker]");
      if (k) k.innerHTML = `Serralheria em ${esc(loc.cidade)}<span class="k-extra"> · Portões · Estruturas metálicas</span>`;
    } else if (brand !== "Renove") {
      document.title = document.title.replace("Renove Serralheria", fullName);
    }
    const area = loc.regiao || loc.cidade;
    const areaTxt = area ? `Atendemos ${area}${loc.bairros && loc.bairros.length ? `, incluindo ${loc.bairros.join(", ")}` : ""}.` : "";
    $$("[data-area-text]").forEach((el) => (el.textContent = areaTxt));
    $$("[data-footer-area]").forEach((el) => (el.textContent = place ? `Serralheria em ${place}.` : ""));
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
    const note = $("[data-demo-note]");
    if (note && C.site && C.site.avisoImagensIlustrativas === false) note.hidden = true;

    // quote buttons: WhatsApp when configured, otherwise the contact form
    const generic = `Olá! Vim pelo site da ${fullName} e gostaria de um orçamento.`;
    $$("[data-quote]").forEach((a) => {
      const href = waLink(generic);
      if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener"; }
    });
    // review CTA
    const rc = $("[data-review-cta]");
    if (rc) {
      const g = C.avaliacoes && C.avaliacoes.googleUrl;
      if (g) { rc.href = g; rc.target = "_blank"; rc.rel = "noopener"; $("span", rc).textContent = "Avaliar no Google"; }
      else if (digits) { rc.href = waLink(`Olá! Quero deixar uma avaliação sobre o serviço da ${fullName}.`); rc.target = "_blank"; rc.rel = "noopener"; }
    }
    renderChannels();
    renderNumbers();
    renderReviews();
    renderProjects();
    injectSchema();
  }

  const ICON = {
    wa: '<svg viewBox="0 0 24 24"><path d="M4 20l1.3-4A8.5 8.5 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .9c-1-.4-1.9-1.3-2.3-2.3l.9-1-1-2z"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path d="M3 6h18v12H3z"/><path d="M3 7l9 6 9-6"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  };

  function renderChannels() {
    const ul = $("[data-channels]");
    const foot = $("[data-footer-contact]");
    const items = [];
    const end = ct.endereco || {};
    const addr = [end.rua, end.bairro, place].filter(Boolean).join(" — ");
    if (digits) items.push({ ico: ICON.wa, label: "WhatsApp", value: ct.telefoneWhatsapp || formatPhone(digits), href: waLink(`Olá! Vim pelo site da ${fullName}.`), ext: true });
    if (ct.telefone) items.push({ ico: ICON.phone, label: "Telefone", value: ct.telefone, href: `tel:${ct.telefone.replace(/[^\d+]/g, "")}` });
    if (ct.email) items.push({ ico: ICON.mail, label: "E-mail", value: ct.email, href: `mailto:${ct.email}` });
    if (ct.instagram) items.push({ ico: ICON.ig, label: "Instagram", value: "@" + ct.instagram.replace(/^@/, ""), href: `https://instagram.com/${ct.instagram.replace(/^@/, "")}`, ext: true });
    if (end.rua) items.push({ ico: ICON.pin, label: "Endereço", value: addr, href: ct.googleMaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`, ext: true });
    if (ct.horario && ct.horario.length) items.push({ ico: ICON.clock, label: "Horário", value: ct.horario.map((h) => h.rotulo).filter(Boolean).join(" · ") });
    if (ul) {
      ul.innerHTML = items.map((it) => {
        const inner = `${it.ico}<div><b>${esc(it.label)}</b><span>${esc(it.value)}</span></div>${it.href ? '<i class="go" aria-hidden="true">→</i>' : ""}`;
        return `<li>${it.href ? `<a href="${esc(it.href)}"${it.ext ? ' target="_blank" rel="noopener"' : ""}>${inner}</a>` : `<div>${inner}</div>`}</li>`;
      }).join("");
    }
    if (foot && items.length) {
      foot.innerHTML = items.map((it) => `<li>${it.href ? `<a href="${esc(it.href)}"${it.ext ? ' target="_blank" rel="noopener"' : ""}>${esc(it.value)}</a>` : esc(it.value)}</li>`).join("");
    }
    const map = $("[data-map]");
    if (map && end.rua && loc.cidade) {
      map.hidden = false;
      map.innerHTML = `<iframe title="Mapa: ${esc(addr)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed"></iframe>`;
    }
  }

  function formatPhone(d) {
    const n = d.startsWith("55") ? d.slice(2) : d;
    if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
    if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
    return "+" + d;
  }

  function renderNumbers() {
    const ul = $("[data-numbers]");
    const list = (C.numeros || []).filter((n) => n && n.rotulo && Number.isFinite(+n.valor));
    if (!ul || !list.length) return;
    ul.innerHTML = list.map((n) => `<li><b class="num-val">${esc(n.prefixo || "")}<span data-count="${+n.valor}">${+n.valor}</span><em>${esc(n.sufixo || "")}</em></b><span class="num-label">${esc(n.rotulo)}</span></li>`).join("");
    ul.style.setProperty("--n", Math.min(list.length, 4));
  }

  function renderReviews() {
    const box = $("[data-reviews]");
    const list = ((C.avaliacoes && C.avaliacoes.lista) || []).filter((r) => r && r.texto && r.nome);
    if (!box || !list.length) return;
    const stars = (n) => `<div class="rev-stars" role="img" aria-label="${n} de 5 estrelas">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "" : "off"}"></i>`).join("")}</div>`;
    box.innerHTML = `<div class="rev-track" tabindex="0" aria-label="Avaliações de clientes">${list.map((r) => `
      <article class="rev-card">${stars(clamp(Math.round(+r.nota || 5), 1, 5))}
        <blockquote>“${esc(r.texto)}”</blockquote>
        <footer><b>${esc(r.nome)}</b>${r.servico ? `<span>${esc(r.servico)}</span>` : ""}</footer></article>`).join("")}</div>`;
    const lead = $("[data-reviews-lead]");
    if (lead) lead.textContent = "Avaliações reais, publicadas com autorização de quem avaliou.";
  }

  function renderProjects() {
    const grid = $("[data-projects]");
    const list = (C.projetos || []).filter((p) => p && p.imagem && p.titulo);
    if (!grid || !list.length) return;
    const cls = ["proj-a", "proj-b", "proj-c", "proj-d", "proj-e", "proj-f"];
    grid.innerHTML = list.slice(0, 12).map((p, i) => `
      <figure class="proj ${cls[i % cls.length]}">
        <button class="proj-open" type="button" aria-label="Ampliar: ${esc(p.titulo)}"><picture class="proj-img"><img src="${esc(p.imagem)}" alt="${esc(p.alt || p.titulo)}" loading="lazy" decoding="async"></picture></button>
        <figcaption>${p.categoria ? `<span class="mono">${esc(p.categoria)}</span>` : ""}<h3>${esc(p.titulo)}</h3></figcaption>
      </figure>`).join("");
  }

  function injectSchema() {
    const url = (C.site && C.site.url) || location.href.split("#")[0];
    const org = { "@type": "Organization", "@id": url + "#org", name: fullName, url, logo: url + "assets/favicon.svg" };
    const same = [];
    if (ct.instagram) same.push(`https://instagram.com/${ct.instagram.replace(/^@/, "")}`);
    if (ct.googleMaps) same.push(ct.googleMaps);
    if (same.length) org.sameAs = same;
    const area = loc.cidade ? { "@type": "City", name: place || loc.cidade } : undefined;
    const services = ["Portões sob medida", "Portões automáticos", "Estruturas metálicas", "Grades de proteção", "Corrimãos e guarda-corpos", "Coberturas metálicas", "Soldagem", "Manutenção e conserto de portões"];
    const graph = [
      org,
      { "@type": "WebSite", "@id": url + "#website", url, name: fullName, inLanguage: "pt-BR", publisher: { "@id": url + "#org" } },
      { "@type": "WebPage", "@id": url + "#webpage", url, name: document.title, isPartOf: { "@id": url + "#website" }, about: { "@id": url + "#org" }, inLanguage: "pt-BR" },
      ...services.map((s, i) => Object.assign({ "@type": "Service", "@id": `${url}#servico-${i + 1}`, name: s, serviceType: "Serralheria", provider: { "@id": url + "#org" } }, area ? { areaServed: area } : {})),
    ];
    const end = ct.endereco || {};
    const tel = ct.telefone || (digits ? "+" + digits : "");
    if (tel && end.rua && loc.cidade) {
      const lb = {
        "@type": "HomeAndConstructionBusiness", "@id": url + "#local", name: fullName, url, telephone: tel,
        image: url + "assets/img/hero-oficina-1920.webp",
        address: { "@type": "PostalAddress", streetAddress: end.rua, addressLocality: loc.cidade, addressRegion: loc.uf || undefined, postalCode: end.cep || undefined, addressCountry: "BR" },
        parentOrganization: { "@id": url + "#org" },
      };
      if (area) lb.areaServed = loc.regiao ? [area, loc.regiao] : area;
      if (same.length) lb.sameAs = same;
      const hrs = (ct.horario || []).filter((h) => h.dias && h.abre && h.fecha);
      if (hrs.length) lb.openingHoursSpecification = hrs.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.dias.map((d) => "https://schema.org/" + ({ Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" }[d] || d)), opens: h.abre, closes: h.fecha }));
      graph.push(lb);
    }
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------ nav */
  function initNav() {
    const nav = $("[data-nav]");
    const bar = $(".scroll-progress span");
    const links = $$(".nav-links a");
    const targets = links.map((a) => [a, document.getElementById(a.getAttribute("href").slice(1))]).filter(([, el]) => el);
    let active = null;
    onScroll(() => {
      const y = scrollY;
      nav.classList.toggle("scrolled", y > 24);
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
      const mid = innerHeight * 0.4;
      let hit = null;
      for (const [a, el] of targets) { const r = el.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) hit = a; }
      if (hit !== active) {
        active = hit;
        links.forEach((l) => { l.classList.toggle("active", l === hit); l === hit ? l.setAttribute("aria-current", "location") : l.removeAttribute("aria-current"); });
      }
    });
    // mobile menu
    const btn = $(".menu-btn");
    const menu = $("#menu");
    $$("nav a", menu).forEach((a, i) => a.style.setProperty("--i", i));
    const close = (focus = true) => {
      btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", "Abrir menu");
      menu.classList.remove("open"); document.body.classList.remove("menu-open");
      setTimeout(() => { if (!menu.classList.contains("open")) menu.hidden = true; }, 380);
      if (focus) btn.focus();
    };
    const open = () => {
      menu.hidden = false; requestAnimationFrame(() => menu.classList.add("open"));
      btn.setAttribute("aria-expanded", "true"); btn.setAttribute("aria-label", "Fechar menu");
      document.body.classList.add("menu-open");
      setTimeout(() => $("a", menu)?.focus(), 80);
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
    addEventListener("resize", () => { if (innerWidth >= 1180 && !menu.hidden) close(false); });
  }

  /* ------------------------------------------------------------------ pointer */
  function initPointer() {
    if (!mqFine.matches) return;
    const glow = $(".cursor-light");
    let tx = -999, ty = -999, x = tx, y = ty, raf = 0;
    const loop = () => {
      x = lerp(x, tx, 0.2); y = lerp(y, ty, 0.2);
      glow.style.setProperty("--cx", x.toFixed(1) + "px"); glow.style.setProperty("--cy", y.toFixed(1) + "px");
      raf = Math.abs(x - tx) + Math.abs(y - ty) > 0.4 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      document.documentElement.classList.add("has-cursor");
      tx = e.clientX; ty = e.clientY;
      if (!raf && !reduced()) raf = requestAnimationFrame(loop);
      glow.classList.toggle("hot", !!e.target.closest?.("a, button, [data-magnetic], .gate, .proj"));
      const s = e.target.closest?.(".spot");
      if (s) { const r = s.getBoundingClientRect(); s.style.setProperty("--sx", e.clientX - r.left + "px"); s.style.setProperty("--sy", e.clientY - r.top + "px"); }
    }, { passive: true });
    document.addEventListener("pointerleave", () => document.documentElement.classList.remove("has-cursor"));
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        if (reduced()) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px");
        el.style.setProperty("--my", ((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1) + "px");
      });
      el.addEventListener("pointerleave", () => { el.style.setProperty("--mx", "0px"); el.style.setProperty("--my", "0px"); });
    });
  }

  /* ------------------------------------------------------------------ hero */
  function initHero() {
    const hero = $(".hero");
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("in")));
    const media = $("[data-hero-media]");
    const plate = $(".hero-plate", hero);
    const img = $(".hero-pic img", hero);
    const canvas = $(".hero-sparks", hero);
    const arc = $(".hero-arc", hero);
    const W = { desk: (hero.dataset.weldDesk || "0.72,0.62").split(",").map(Number), mob: (hero.dataset.weldMob || "0.55,0.6").split(",").map(Number) };
    const nat = { desk: [2400, 1350], mob: [1080, 1560] };
    let weld = { x: 0, y: 0 };
    const place = () => {
      const mob = matchMedia("(max-aspect-ratio: 1/1)").matches;
      const [iw, ih] = img.naturalWidth ? [img.naturalWidth, img.naturalHeight] : mob ? nat.mob : nat.desk;
      const [wx, wy] = mob ? W.mob : W.desk;
      const cs = getComputedStyle(img).objectPosition.split(" ").map((v) => parseFloat(v) / 100);
      const pw = plate.clientWidth, ph = plate.clientHeight;
      const s = Math.max(pw / iw, ph / ih);
      const dw = iw * s, dh = ih * s;
      const ox = (pw - dw) * (cs[0] || 0.5), oy = (ph - dh) * (cs[1] || 0.5);
      weld = { x: ox + wx * dw, y: oy + wy * dh };
      arc.style.setProperty("--wx", (weld.x / pw).toFixed(4));
      arc.style.setProperty("--wy", (weld.y / ph).toFixed(4));
      sparks.resize(pw, ph);
    };
    // parallax (mouse) + scroll
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const loop = () => {
      x = lerp(x, tx, 0.07); y = lerp(y, ty, 0.07);
      hero.style.setProperty("--px", x.toFixed(4)); hero.style.setProperty("--py", y.toFixed(4));
      raf = Math.abs(x - tx) + Math.abs(y - ty) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    if (mqFine.matches) {
      hero.addEventListener("pointermove", (e) => {
        if (reduced()) return;
        const r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
        hero.style.setProperty("--lx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        hero.style.setProperty("--ly", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
        if (!raf) raf = requestAnimationFrame(loop);
      });
      hero.addEventListener("pointerleave", () => { tx = ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    }
    $$(".hero-lines g", hero).forEach((g) => g.style.setProperty("--d", g.dataset.depth || 10));
    $$(".hero-tags li", hero).forEach((li) => li.style.setProperty("--d", li.dataset.depth || 20));
    onScroll(() => {
      const p = clamp(scrollY / innerHeight, 0, 1);
      hero.style.setProperty("--sy", p.toFixed(3));
      sparks.visible = p < 0.98;
    });

    // spark system (2D, additive)
    const sparks = {
      ctx: canvas.getContext("2d"), list: [], w: 0, h: 0, dpr: 1, visible: true, running: false, last: 0, acc: 0, burst: 0,
      resize(w, h) {
        this.dpr = Math.min(devicePixelRatio || 1, mqDesk.matches ? 1.5 : 1.25);
        this.w = w; this.h = h;
        canvas.width = Math.round(w * this.dpr); canvas.height = Math.round(h * this.dpr);
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        this.scale = clamp(Math.min(w, h) / 900, 0.45, 1.4);
      },
      spawn(n) {
        const s = this.scale;
        for (let i = 0; i < n; i++) {
          const up = Math.random() < 0.82;
          const a = up ? (-Math.PI / 2 + (Math.random() - 0.5) * 2.6) : (Math.random() * Math.PI);
          const sp = (140 + Math.random() * 520) * s;
          this.list.push({ x: weld.x + (Math.random() - 0.5) * 3, y: weld.y + (Math.random() - 0.5) * 3, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: 0.35 + Math.random() * 0.9, w: 0.7 + Math.random() * 1.3, b: 0 });
        }
      },
      step(dt) {
        const g = 980 * this.scale, floor = weld.y + 6 * this.scale;
        const max = mqDesk.matches ? 320 : 140;
        this.acc += dt;
        this.burst -= dt;
        if (this.burst < -Math.random() * 1.2) this.burst = 0.08 + Math.random() * 0.18;
        const rate = (this.burst > 0 ? 520 : 90) * (mqDesk.matches ? 1 : 0.5);
        const n = Math.floor(this.acc * rate);
        if (n > 0) { this.acc -= n / rate; if (this.list.length < max) this.spawn(Math.min(n, max - this.list.length)); }
        const c = this.ctx;
        c.clearRect(0, 0, this.w, this.h);
        c.globalCompositeOperation = "lighter";
        c.lineCap = "round";
        const keep = [];
        for (const p of this.list) {
          p.life += dt;
          if (p.life >= p.max) continue;
          const px = p.x, py = p.y;
          p.vy += g * dt; p.vx *= 1 - 0.6 * dt; p.vy *= 1 - 0.25 * dt;
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.y > floor && p.vy > 0 && p.b < 2) { p.y = floor; p.vy *= -0.32; p.vx *= 0.7; p.b++; }
          const t = p.life / p.max;
          const r = 255, gg = Math.round(lerp(236, 90, t)), bb = Math.round(lerp(190, 20, Math.min(1, t * 1.5)));
          const al = (1 - t) * (1 - t) * 0.95;
          const tail = 0.034;
          c.strokeStyle = `rgba(${r},${gg},${bb},${al.toFixed(3)})`;
          c.lineWidth = p.w * 1.15 * (1 - t * 0.5);
          c.beginPath(); c.moveTo(p.x - p.vx * tail, p.y - p.vy * tail); c.lineTo(p.x, p.y); c.stroke();
          keep.push(p);
        }
        this.list = keep;
        // hot core
        const gr = c.createRadialGradient(weld.x, weld.y, 0, weld.x, weld.y, 26 * this.scale);
        gr.addColorStop(0, `rgba(255,245,230,${0.75 + Math.random() * 0.25})`); gr.addColorStop(0.25, "rgba(255,170,90,.35)"); gr.addColorStop(1, "rgba(255,120,40,0)");
        c.fillStyle = gr; c.beginPath(); c.arc(weld.x, weld.y, 26 * this.scale, 0, 7); c.fill();
        c.globalCompositeOperation = "source-over";
      },
      start() {
        if (this.running || reduced()) return;
        this.running = true; this.last = performance.now();
        const tick = (now) => {
          if (!this.running) return;
          const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
          if (this.visible && !document.hidden) this.step(dt);
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
    };
    const ready = () => { place(); sparks.start(); };
    if (img.complete) ready(); else img.addEventListener("load", ready, { once: true });
    addEventListener("resize", () => requestAnimationFrame(place));
    img.addEventListener("load", () => requestAnimationFrame(place));
    if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => (sparks.visible = en.isIntersecting)).observe(hero);
  }

  /* ------------------------------------------------------------------ marquee */
  function initMarquee() {
    const tr = $(".marquee-track");
    if (!tr) return;
    tr.innerHTML += tr.innerHTML;
    let lastY = scrollY, skew = 0, raf = 0;
    const decay = () => { skew = lerp(skew, 0, 0.08); tr.style.setProperty("--skew", skew.toFixed(2) + "deg"); raf = Math.abs(skew) > 0.02 ? requestAnimationFrame(decay) : 0; };
    onScroll(() => {
      if (reduced()) return;
      const v = scrollY - lastY; lastY = scrollY;
      skew = clamp(skew + v * -0.04, -8, 8);
      if (!raf) raf = requestAnimationFrame(decay);
    });
  }

  /* ------------------------------------------------------------------ reveals */
  function initReveals() {
    const titles = $$(".reveal-lines");
    onView(titles.map((t) => t.parentElement), (p) => $$(":scope > .reveal-lines", p).forEach((t) => t.classList.add("in")), { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    onView($$(".principles li"), (el) => el.classList.add("in"), { threshold: 0.4 });
    onView($$(".tile"), (el) => el.classList.add("in"), { threshold: 0.2 });
    // clip-path hides the tiles from IntersectionObserver, so reveal them from their layout box instead
    const revealProjects = () => {
      const projs = $$(".proj:not(.in)");
      if (!projs.length) return;
      let k = 0;
      projs.forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight * 0.9) { el.style.transitionDelay = (k++ % 3) * 110 + "ms"; el.classList.add("in"); }
      });
    };
    onScroll(revealProjects);
  }

  /* ------------------------------------------------------------------ about (scroll-scrubbed image) */
  function initAbout() {
    const media = $("[data-about-media]");
    if (!media) return;
    const frame = $(".about-frame", media);
    onScroll(() => {
      if (reduced()) { frame.style.setProperty("--r", 1); return; }
      const r = frame.getBoundingClientRect();
      const p = clamp((innerHeight - r.top) / (innerHeight * 0.9), 0, 1);
      frame.style.setProperty("--r", (1 - Math.pow(1 - p, 3)).toFixed(3));
      frame.style.setProperty("--ay", ((r.top + r.height / 2 - innerHeight / 2) * -0.06).toFixed(1));
    });
  }

  /* ------------------------------------------------------------------ services */
  function initServices() {
    const items = $$(".svc");
    items.forEach((li) => {
      const num = $(".svc-num", li);
      const v = num.dataset.roll;
      num.innerHTML = `<span>${v}</span>`;
      const head = $(".svc-head", li);
      head.addEventListener("click", () => {
        const open = !li.classList.contains("open");
        items.forEach((o) => { if (o !== li) { o.classList.remove("open"); $(".svc-head", o).setAttribute("aria-expanded", "false"); } });
        li.classList.toggle("open", open);
        head.setAttribute("aria-expanded", String(open));
      });
    });
    // desktop: hover expands and a cursor-following image reveals the service
    const float = $(".svc-float");
    if (!float || !mqFine.matches) return;
    const src = $("source", float), im = $("img", float);
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, raf = 0, on = false, cur = "";
    const loop = () => {
      const nx = lerp(x, tx, 0.14), ny = lerp(y, ty, 0.14);
      vx = nx - x; x = nx; y = ny;
      float.style.setProperty("--fx", (x + 28).toFixed(1) + "px");
      float.style.setProperty("--fy", (y - float.offsetHeight / 2).toFixed(1) + "px");
      float.style.setProperty("--fr", clamp(vx * 0.35, -6, 6).toFixed(2) + "deg");
      raf = on || Math.abs(x - tx) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    items.forEach((li) => {
      li.addEventListener("pointerenter", (e) => {
        if (!mqDesk.matches || reduced()) return;
        const slug = li.dataset.float;
        if (slug !== cur) { cur = slug; src.srcset = `assets/img/${slug}-960.avif`; im.src = `assets/img/${slug}-960.webp`; }
        if (!on) { x = tx = e.clientX; y = ty = e.clientY; }
        on = true; float.classList.add("on");
        if (!raf) raf = requestAnimationFrame(loop);
      });
      li.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
      li.addEventListener("pointerleave", () => { on = false; float.classList.remove("on"); });
    });
  }

  /* ------------------------------------------------------------------ gates */
  function initGates() {
    const rail = $("[data-gates]");
    if (!rail) return;
    const gates = $$(".gate", rail);
    const idx = $("[data-gate-index]");
    const set = (g) => { gates.forEach((o) => o.classList.toggle("is-active", o === g)); if (idx) idx.textContent = String(gates.indexOf(g) + 1).padStart(2, "0"); };
    set(gates[0]);
    gates.forEach((g) => {
      g.addEventListener("pointerenter", () => { if (mqDesk.matches) set(g); });
      g.addEventListener("focus", () => set(g));
      g.addEventListener("click", () => set(g));
      g.addEventListener("keydown", (e) => {
        const i = gates.indexOf(g);
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const n = gates[(i + (e.key === "ArrowRight" ? 1 : -1) + gates.length) % gates.length]; n.focus(); }
      });
    });
    rail.addEventListener("scroll", () => {
      if (mqDesk.matches) return;
      const c = rail.scrollLeft + rail.clientWidth / 2;
      let best = gates[0], bd = 1e9;
      gates.forEach((g) => { const d = Math.abs(g.offsetLeft + g.offsetWidth / 2 - c); if (d < bd) { bd = d; best = g; } });
      if (idx) idx.textContent = String(gates.indexOf(best) + 1).padStart(2, "0");
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ fabrication story */
  function initFab() {
    const sec = $(".fab");
    const track = $("[data-fab]");
    if (!sec || !track) return;
    const frames = $$(".fab-frame", track);
    const names = frames.map((f) => $("h3", f).textContent);
    const stepEl = $("[data-fab-step]"), nameEl = $("[data-fab-name]");
    let dist = 0, enabled = false;
    const layout = () => {
      enabled = mqDesk.matches && !reduced();
      sec.classList.toggle("h-scroll", enabled);
      if (!enabled) { sec.style.height = ""; track.style.removeProperty("--tx"); return; }
      dist = Math.max(0, track.scrollWidth - innerWidth);
      sec.style.height = innerHeight + dist + "px";
      update();
    };
    const update = () => {
      if (!enabled) return;
      const r = sec.getBoundingClientRect();
      const p = dist ? clamp(-r.top / dist, 0, 1) : 0;
      const tx = -p * dist;
      track.style.setProperty("--tx", tx.toFixed(1) + "px");
      sec.style.setProperty("--fp", p.toFixed(4));
      const cx = innerWidth / 2;
      let best = 0, bd = 1e9;
      frames.forEach((f, i) => {
        const c = f.offsetLeft + f.offsetWidth / 2 + tx;
        const d = (c - cx) / (innerWidth * 0.62);
        f.style.setProperty("--dist", clamp(Math.abs(d), 0, 1).toFixed(3));
        f.style.setProperty("--side", clamp(d, -1, 1).toFixed(3));
        if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; }
      });
      stepEl.textContent = String(best + 1).padStart(2, "0");
      nameEl.textContent = names[best];
    };
    onScroll(update);
    addEventListener("resize", layout);
    mqReduce.addEventListener?.("change", layout);
    layout();
    // layout again once the images give the track its final width
    $$("img", track).forEach((im) => im.addEventListener("load", () => requestAnimationFrame(layout), { once: true }));
  }

  /* ------------------------------------------------------------------ process line */
  function initProcess() {
    const proc = $("[data-proc]");
    if (!proc) return;
    const steps = $$(".proc-step", proc);
    const counter = $("[data-count-to]", proc);
    let counted = false;
    onScroll(() => {
      const r = proc.getBoundingClientRect();
      const horizontal = matchMedia("(min-width: 1000px)").matches;
      const p = reduced() ? 1 : clamp((innerHeight * 0.75 - r.top) / (r.height * (horizontal ? 0.9 : 1)), 0, 1);
      proc.style.setProperty("--fill", p.toFixed(3));
      steps.forEach((s, i) => {
        const at = horizontal ? (i + 0.35) / steps.length : (s.offsetTop + 20) / r.height;
        const on = p >= at;
        s.classList.toggle("on", on);
        if (on && i === 1 && !counted && counter) { counted = true; countTo(counter, +counter.dataset.countTo, 1400, (v) => v.toLocaleString("pt-BR")); }
      });
    });
  }

  function countTo(el, to, dur, fmt = (v) => String(v)) {
    if (reduced()) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = (now) => {
      const t = clamp((now - t0) / dur, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(Math.round(to * e));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------ counters */
  function initCounters() {
    const els = $$("[data-count]");
    onView(els, (el) => countTo(el, +el.dataset.count, 1600, (v) => (+el.dataset.count < 100 ? String(v).padStart(2, "0") : v.toLocaleString("pt-BR"))), { threshold: 0.6 });
  }

  /* ------------------------------------------------------------------ faq */
  function initFaq() {
    $$(".acc-item").forEach((it) => {
      const b = $("button", it);
      b.addEventListener("click", () => {
        const open = b.getAttribute("aria-expanded") !== "true";
        b.setAttribute("aria-expanded", String(open));
        it.classList.toggle("open", open);
      });
    });
  }

  /* ------------------------------------------------------------------ CTA */
  function initCta() {
    const title = $(".cta-title");
    if (title) {
      const words = title.textContent.trim().split(/\s+/);
      const lines = [words.slice(0, 2), words.slice(2, 4), words.slice(4)].filter((l) => l.length);
      title.setAttribute("aria-label", title.textContent.trim());
      title.innerHTML = lines.map((l, i) => `<span class="ln" aria-hidden="true"><span style="--i:${i}">${l.join(" ")}</span></span>`).join("");
      onView([title], (el) => el.classList.add("in"), { threshold: 0.4 });
    }
    const sec = $(".cta");
    onScroll(() => {
      const r = sec.getBoundingClientRect();
      sec.style.setProperty("--cp", clamp(1 - r.top / innerHeight, 0, 1).toFixed(3));
    });
    const cv = $(".cta-embers");
    if (!cv || reduced()) return;
    const c = cv.getContext("2d");
    let w = 0, h = 0, run = false, parts = [];
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 1.5);
      w = cv.clientWidth; h = cv.clientHeight; cv.width = w * d; cv.height = h * d; c.setTransform(d, 0, 0, d, 0, 0);
      const n = mqDesk.matches ? 70 : 30;
      parts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, v: 12 + Math.random() * 40, s: 0.6 + Math.random() * 1.8, ph: Math.random() * 6.28, a: 0.25 + Math.random() * 0.6 }));
    };
    size(); addEventListener("resize", size);
    let last = 0;
    const tick = (now) => {
      if (!run) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
      c.clearRect(0, 0, w, h);
      c.globalCompositeOperation = "lighter";
      for (const p of parts) {
        p.y -= p.v * dt; p.ph += dt * 2; p.x += Math.sin(p.ph) * 8 * dt;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        const fl = 0.7 + Math.sin(p.ph * 3) * 0.3;
        c.fillStyle = `rgba(255,${120 + Math.round(p.s * 30)},50,${(p.a * fl).toFixed(3)})`;
        c.beginPath(); c.arc(p.x, p.y, p.s, 0, 7); c.fill();
      }
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => { if (en.isIntersecting && !run) { run = true; last = performance.now(); requestAnimationFrame(tick); } else if (!en.isIntersecting) run = false; }).observe(sec);
    }
  }

  /* ------------------------------------------------------------------ contact form */
  function initContact() {
    const form = $("[data-quote-form]");
    if (!form) return;
    const note = $("[data-quote-note]");
    $$("[data-service]").forEach((a) => a.addEventListener("click", () => {
      const v = a.dataset.service;
      const opt = Array.from(form.servico.options).find((o) => o.text === v);
      if (opt) form.servico.value = opt.text;
      setTimeout(() => form.nome.focus({ preventScroll: true }), 700);
    }));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const s = form.servico.value, n = form.nome.value.trim();
      form.servico.setAttribute("aria-invalid", String(!s)); form.nome.setAttribute("aria-invalid", String(!n));
      if (!s || !n) { note.textContent = "Escolha o serviço e informe seu nome."; note.classList.add("warn"); (!s ? form.servico : form.nome).focus(); return; }
      const lines = [`Olá! Gostaria de um orçamento com a ${fullName}.`, `Serviço: ${s}`, `Nome: ${n}`];
      if (form.local.value.trim()) lines.push(`Local: ${form.local.value.trim()}`);
      if (form.mensagem.value.trim()) lines.push(`Projeto: ${form.mensagem.value.trim()}`);
      const href = waLink(lines.join("\n"));
      if (!href) { note.textContent = "O envio pelo WhatsApp ainda não foi configurado neste site."; note.classList.add("warn"); return; }
      note.classList.remove("warn");
      note.innerHTML = `Abrindo o WhatsApp… Se não abrir, <a href="${esc(href)}" target="_blank" rel="noopener">toque aqui</a>.`;
      window.open(href, "_blank", "noopener");
    });
  }

  /* ------------------------------------------------------------------ lightbox */
  function initLightbox() {
    const dlg = $("[data-lightbox]");
    if (!dlg || typeof dlg.showModal !== "function") return;
    const im = $("img", dlg), cap = $("figcaption", dlg);
    document.addEventListener("click", (e) => {
      const b = e.target.closest(".proj-open");
      if (!b) return;
      const src = $("img", b);
      const set = $("source[type='image/webp']", b);
      const big = set ? set.getAttribute("srcset").split(",").pop().trim().split(" ")[0] : src.currentSrc || src.src;
      im.src = big; im.alt = src.alt;
      const fig = b.closest("figure");
      cap.textContent = [$("figcaption span", fig)?.textContent, $("figcaption h3", fig)?.textContent].filter(Boolean).join(" · ") + (fig.hasAttribute("data-demo") ? " · Ilustração" : "");
      dlg.showModal();
    });
    $(".lb-close", dlg).addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }

  const safe = (fn) => { try { fn(); } catch (err) { console.error(err); } };
  const boot = () => {
    [applyConfig, initNav, initPointer, initHero, initMarquee, initReveals, initAbout, initServices, initGates, initFab, initProcess, initCounters, initFaq, initCta, initContact, initLightbox].forEach(safe);
    runScroll();
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();
