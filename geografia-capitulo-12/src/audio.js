/* Camada sonora.
   - Trilha instrumental e efeitos: sintetizados em tempo real (Web Audio API).
   - Ambientes naturais: gravações reais do Wikimedia Commons (vento, pássaros,
     tucanos, fogo). Se não carregarem (sem internet, bloqueio), um ambiente
     sintetizado equivalente assume, e a apresentação continua normalmente.
   - Começa silenciado; só toca depois de um gesto do usuário. */
(function () {
  "use strict";
  const MEDIA = window.MEDIA_AUDIO || {};
  const UP = "https://upload.wikimedia.org/wikipedia/commons/";

  const A = {
    ctx: null, enabled: false, volume: 0.7, sfxOn: true, musicOn: true, ambOn: true,
    mood: null, failed: {}, onStatus: null
  };
  let master, sfxBus, musicBus, ambBus, reverb, reverbSend, noiseBuf;
  const real = {};      // gravações: { el, gain, ok }
  const synthAmb = {};  // ambientes sintetizados: { gain, nodes }
  let musicTimer = null, pluckTimer = null, chordIdx = 0;

  const now = () => A.ctx.currentTime;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function ramp(param, v, t = 0.4) {
    if (!A.ctx) return;
    const n = now();
    param.cancelScheduledValues(n);
    param.setValueAtTime(param.value, n);
    param.linearRampToValueAtTime(v, n + t);
  }

  /* ---------- inicialização (precisa de gesto do usuário) ---------- */
  A.init = function () {
    if (A.ctx) { A.ctx.resume && A.ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { status("Este navegador não oferece suporte a áudio interativo."); return false; }
    try { A.ctx = new AC(); } catch (e) { status("Não foi possível iniciar o áudio."); return false; }
    const c = A.ctx;
    master = c.createGain(); master.gain.value = 0;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 18; comp.ratio.value = 4; comp.attack.value = 0.01; comp.release.value = 0.3;
    master.connect(comp).connect(c.destination);
    sfxBus = c.createGain(); musicBus = c.createGain(); ambBus = c.createGain();
    sfxBus.gain.value = 0.9; musicBus.gain.value = 0.42; ambBus.gain.value = 0.75;
    [sfxBus, musicBus, ambBus].forEach((b) => b.connect(master));
    reverb = c.createConvolver(); reverb.buffer = impulse(3.2, 2.6);
    reverbSend = c.createGain(); reverbSend.gain.value = 0.6;
    reverbSend.connect(reverb).connect(master);
    noiseBuf = makeNoise(4);
    primeRecordings();
    applyGains();
    return true;
  };

  function impulse(sec, decay) {
    const c = A.ctx, len = Math.floor(c.sampleRate * sec), b = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  }
  function makeNoise(sec) {
    const c = A.ctx, len = Math.floor(c.sampleRate * sec), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = w * 0.6 + last * 3.2; }
    return b;
  }
  function noiseSrc() { const s = A.ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.loopStart = rnd(0, 3); return s; }

  function status(msg) { A.statusMsg = msg; if (A.onStatus) A.onStatus(msg); }

  function applyGains() {
    if (!A.ctx) return;
    ramp(master.gain, A.enabled ? A.volume : 0, 0.5);
    ramp(sfxBus.gain, A.sfxOn ? 0.9 : 0, 0.2);
    ramp(musicBus.gain, A.musicOn ? 0.42 : 0, 1.2);
    ramp(ambBus.gain, A.ambOn ? 0.75 : 0, 1.2);
    if (A.enabled) { A.ctx.resume && A.ctx.resume(); if (!musicTimer) startMusic(); refreshAmbience(); }
    else pauseRecordings();
  }

  A.setEnabled = (b) => { A.enabled = !!b; if (b && !A.ctx) A.init(); if (b) unlockIOS(); applyGains(); };
  /* iOS exige um gesto para cada elemento de áudio: tocamos e pausamos de imediato */
  let unlocked = false;
  function unlockIOS() {
    if (unlocked || !A.ctx) return;
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (!ios) return;
    unlocked = true;
    Object.values(real).forEach((r) => { const p = r.el.play(); if (p && p.then) p.then(() => { if (!r.want) r.el.pause(); }, () => {}); });
  }
  A.setVolume = (v) => { A.volume = Math.max(0, Math.min(1, v)); applyGains(); };
  A.setSfx = (b) => { A.sfxOn = !!b; applyGains(); };
  A.setMusic = (b) => { A.musicOn = !!b; applyGains(); };
  A.setAmb = (b) => { A.ambOn = !!b; applyGains(); };
  const live = () => A.ctx && A.enabled;
  const fx = () => live() && A.sfxOn;

  /* ---------- gravações reais (Wikimedia Commons) ---------- */
  function urlFor(key, mp3) {
    const m = MEDIA[key]; if (!m) return null;
    return mp3 ? UP + "transcoded/" + m.h + "/" + m.f + "/" + m.f + ".mp3" : UP + m.h + "/" + m.f;
  }
  function primeRecordings() {
    const probe = document.createElement("audio");
    const ogg = probe.canPlayType && probe.canPlayType('audio/ogg; codecs="vorbis"');
    Object.keys(MEDIA).forEach((key) => {
      const el = new Audio();
      el.crossOrigin = "anonymous"; el.loop = true; el.preload = "none";
      const g = A.ctx.createGain(); g.gain.value = 0; g.connect(ambBus);
      const rec = { el, gain: g, ok: true, connected: false, tried: ogg ? "ogg" : "mp3" };
      el.src = urlFor(key, !ogg);
      el.addEventListener("error", () => {
        if (rec.tried === "ogg") { rec.tried = "mp3"; el.src = urlFor(key, true); if (rec.want) el.play().catch(() => {}); return; }
        rec.ok = false; A.failed[key] = true;
        status("Sem acesso às gravações do Wikimedia Commons: os sons da natureza estão sendo sintetizados no navegador.");
        refreshAmbience();
      });
      try { const src = A.ctx.createMediaElementSource(el); src.connect(g); rec.connected = true; } catch (e) { rec.connected = false; }
      real[key] = rec;
    });
  }
  function setRecording(key, level) {
    const rec = real[key]; if (!rec) return false;
    if (!rec.ok) return false;
    rec.want = level > 0;
    if (level > 0) {
      if (rec.el.paused) {
        const p = rec.el.play();
        if (p && p.catch) p.catch((err) => { if (err && err.name === "NotAllowedError") { rec.ok = false; refreshAmbience(); } });
      }
      ramp(rec.gain.gain, level, 2.2);
      if (!rec.connected) rec.el.volume = Math.min(1, level * A.volume);
    } else {
      ramp(rec.gain.gain, 0, 1.8);
      clearTimeout(rec.pt); rec.pt = setTimeout(() => { if (!rec.want) rec.el.pause(); }, 2000);
    }
    return true;
  }
  function pauseRecordings() { Object.values(real).forEach((r) => { r.want = false; r.el.pause(); }); }

  /* ---------- ambientes sintetizados ---------- */
  function ensureSynth(name) {
    if (synthAmb[name]) return synthAmb[name];
    const c = A.ctx, out = c.createGain(); out.gain.value = 0; out.connect(ambBus);
    const nodes = [];
    if (name === "wind" || name === "breeze") {
      const n = noiseSrc(), bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = name === "wind" ? 520 : 380; bp.Q.value = 0.7;
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = name === "wind" ? 0.11 : 0.06; lg.gain.value = name === "wind" ? 320 : 160;
      lfo.connect(lg).connect(bp.frequency);
      const amp = c.createGain(); amp.gain.value = 0.5; const lfo2 = c.createOscillator(), lg2 = c.createGain(); lfo2.frequency.value = 0.07; lg2.gain.value = 0.35; lfo2.connect(lg2).connect(amp.gain);
      n.connect(bp).connect(amp).connect(out); n.start(); lfo.start(); lfo2.start(); nodes.push(n, lfo, lfo2);
    } else if (name === "drone") {
      [55, 82.41, 110, 164.81].forEach((f, i) => {
        const o = c.createOscillator(); o.type = i % 2 ? "triangle" : "sine"; o.frequency.value = f; o.detune.value = rnd(-6, 6);
        const g = c.createGain(); g.gain.value = [0.22, 0.12, 0.08, 0.04][i];
        o.connect(g).connect(out); o.connect(reverbSend); o.start(); nodes.push(o);
      });
      const n = noiseSrc(), lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 600;
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.05; lg.gain.value = 420; lfo.connect(lg).connect(lp.frequency);
      const g = c.createGain(); g.gain.value = 0.12; n.connect(lp).connect(g).connect(out); n.start(); lfo.start(); nodes.push(n, lfo);
    } else if (name === "insects") {
      const n = noiseSrc(), bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 5200; bp.Q.value = 9;
      const am = c.createGain(); am.gain.value = 0; const lfo = c.createOscillator(); lfo.type = "square"; lfo.frequency.value = 17; const lg = c.createGain(); lg.gain.value = 0.12;
      lfo.connect(lg).connect(am.gain); const slow = c.createOscillator(), sg = c.createGain(); slow.frequency.value = 0.3; sg.gain.value = 0.06; slow.connect(sg).connect(am.gain);
      n.connect(bp).connect(am).connect(out); n.start(); lfo.start(); slow.start(); nodes.push(n, lfo, slow);
    } else if (name === "water") {
      const n = noiseSrc(), hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 700;
      const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200;
      const g = c.createGain(); g.gain.value = 0.25; const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.4; lg.gain.value = 0.08; lfo.connect(lg).connect(g.gain);
      n.connect(hp).connect(lp).connect(g).connect(out); n.start(); lfo.start(); nodes.push(n, lfo);
    } else if (name === "fire") {
      const n = noiseSrc(), lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 260; const g = c.createGain(); g.gain.value = 0.5;
      n.connect(lp).connect(g).connect(out); n.start(); nodes.push(n);
      const crackle = () => {
        if (!synthAmb.fire) return;
        const t = now(), s = c.createBufferSource(); s.buffer = noiseBuf; const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = rnd(1500, 4000);
        const eg = c.createGain(); eg.gain.setValueAtTime(rnd(0.2, 0.6), t); eg.gain.exponentialRampToValueAtTime(0.001, t + rnd(0.01, 0.05));
        s.connect(hp).connect(eg).connect(out); s.start(t, rnd(0, 3), 0.08);
        synthAmb.fire.tm = setTimeout(crackle, rnd(30, 260));
      };
      setTimeout(crackle, 50);
    } else if (name === "birds") {
      const chirp = () => {
        if (!synthAmb.birds) return;
        const t0 = now(), k = Math.floor(rnd(2, 6)), f0 = rnd(2200, 3600);
        for (let i = 0; i < k; i++) {
          const t = t0 + i * rnd(0.09, 0.16), o = c.createOscillator(), eg = c.createGain();
          o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * rnd(1.2, 1.6), t + 0.04); o.frequency.exponentialRampToValueAtTime(f0 * 0.9, t + 0.08);
          eg.gain.setValueAtTime(0, t); eg.gain.linearRampToValueAtTime(0.05, t + 0.01); eg.gain.exponentialRampToValueAtTime(0.0008, t + 0.09);
          const pan = c.createStereoPanner ? c.createStereoPanner() : null;
          if (pan) { pan.pan.value = rnd(-0.8, 0.8); o.connect(eg).connect(pan).connect(out); } else o.connect(eg).connect(out);
          eg.connect(reverbSend); o.start(t); o.stop(t + 0.1);
        }
        synthAmb.birds.tm = setTimeout(chirp, rnd(1400, 5200));
      };
      setTimeout(chirp, 600);
    }
    synthAmb[name] = { gain: out, nodes };
    return synthAmb[name];
  }

  /* receitas de ambiente por cena: [gravação, nível] e [sintetizado, nível] */
  const RECIPES = {
    space:     { synth: { drone: 0.55 } },
    tropical:  { real: { toucans: 0.55 }, synth: { insects: 0.25 }, fallback: { birds: 0.6, insects: 0.4, water: 0.15 } },
    conifer:   { real: { wind: 0.3 }, synth: { breeze: 0.35 }, fallback: { wind: 0.4 } },
    tundra:    { real: { wind: 0.6 }, synth: { wind: 0.35 }, fallback: { wind: 0.7 } },
    temperate: { real: { birds: 0.6 }, synth: { breeze: 0.25 }, fallback: { birds: 0.7, breeze: 0.25 } },
    grass:     { synth: { breeze: 0.45, insects: 0.35 } },
    impact:    { real: { fire: 0.55 }, synth: { drone: 0.25 }, fallback: { fire: 0.6, drone: 0.25 } },
    restore:   { real: { birds: 0.35 }, synth: { water: 0.3 }, fallback: { birds: 0.45, water: 0.35 } },
    quiz:      { synth: { drone: 0.2 } }
  };

  function refreshAmbience() {
    if (!live()) return;
    const r = RECIPES[A.mood] || RECIPES.space;
    const synthLevels = Object.assign({}, r.synth);
    const realLevels = {};
    let realFailed = false;
    for (const k in (r.real || {})) { if (real[k] && real[k].ok) realLevels[k] = r.real[k]; else realFailed = true; }
    if (realFailed && r.fallback) Object.assign(synthLevels, r.fallback);
    Object.keys(real).forEach((k) => setRecording(k, A.ambOn ? (realLevels[k] || 0) : 0));
    const names = new Set([...Object.keys(synthAmb), ...Object.keys(synthLevels)]);
    names.forEach((n) => { const lv = synthLevels[n] || 0; if (lv > 0 || synthAmb[n]) ramp(ensureSynth(n).gain.gain, lv, 2.4); });
  }

  /* ---------- trilha generativa ---------- */
  const CHORDS = {
    space:     [[45, 52, 57, 59, 64], [41, 48, 57, 60, 64], [43, 50, 55, 59, 62], [40, 47, 55, 59, 64]],
    tropical:  [[50, 57, 62, 66, 69], [47, 54, 59, 62, 66], [43, 50, 55, 59, 62], [45, 52, 57, 61, 64]],
    conifer:   [[38, 45, 52, 57, 62], [41, 48, 55, 60, 64], [36, 43, 52, 55, 60]],
    tundra:    [[38, 45, 50, 57], [36, 43, 50, 55], [41, 48, 53, 57]],
    temperate: [[48, 55, 60, 64, 67], [45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [43, 50, 55, 59, 62]],
    grass:     [[43, 50, 57, 62, 66], [45, 52, 57, 64], [41, 48, 55, 60, 64]],
    impact:    [[38, 45, 48, 53], [37, 44, 49, 52], [34, 41, 46, 50]],
    restore:   [[48, 55, 62, 64, 67], [53, 60, 65, 69, 72], [45, 52, 59, 64, 67], [50, 57, 62, 66]],
    quiz:      [[48, 55, 60, 64], [45, 52, 57, 64], [41, 48, 57, 60], [43, 50, 55, 62]]
  };
  function playChord() {
    if (!live()) return;
    const set = CHORDS[A.mood] || CHORDS.space, notes = set[chordIdx % set.length]; chordIdx++;
    const c = A.ctx, t = now(), dur = 9.5;
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(A.mood === "impact" ? 480 : 900, t); lp.frequency.linearRampToValueAtTime(A.mood === "impact" ? 700 : 1500, t + dur * 0.5); lp.Q.value = 0.6;
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.11, t + 3); g.gain.linearRampToValueAtTime(0.09, t + dur - 3); g.gain.linearRampToValueAtTime(0, t + dur + 1.5);
    lp.connect(g); g.connect(musicBus); g.connect(reverbSend);
    notes.forEach((m) => {
      ["sawtooth", "triangle"].forEach((type, j) => {
        const o = c.createOscillator(); o.type = type; o.frequency.value = mtof(m); o.detune.value = j ? 7 : -7;
        const og = c.createGain(); og.gain.value = type === "sawtooth" ? 0.05 : 0.11;
        o.connect(og).connect(lp); o.start(t); o.stop(t + dur + 2);
      });
    });
  }
  function pluck() {
    if (!live()) return;
    const set = CHORDS[A.mood] || CHORDS.space, chord = set[(chordIdx + set.length - 1) % set.length];
    const m = chord[Math.floor(Math.random() * chord.length)] + (Math.random() < 0.5 ? 24 : 12);
    const c = A.ctx, t = now(), o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o2.type = "sine"; o.frequency.value = mtof(m); o2.frequency.value = mtof(m) * 2.01;
    const g2 = c.createGain(); g2.gain.value = 0.25;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0005, t + 2.6);
    o.connect(g); o2.connect(g2).connect(g); g.connect(musicBus); g.connect(reverbSend);
    o.start(t); o2.start(t); o.stop(t + 2.8); o2.stop(t + 2.8);
  }
  function startMusic() {
    playChord();
    musicTimer = setInterval(playChord, 8000);
    const loop = () => { if (Math.random() < (A.mood === "impact" ? 0.25 : 0.65)) pluck(); pluckTimer = setTimeout(loop, rnd(1300, 3600)); };
    loop();
  }

  A.setMood = function (mood) {
    if (mood === A.mood) return;
    A.mood = mood;
    if (live()) refreshAmbience();
  };

  /* ---------- efeitos ---------- */
  function env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  const S = {};
  S.whoosh = (dur = 0.9, opts = {}) => {
    if (!fx()) return;
    const c = A.ctx, t = now(), n = noiseSrc(), bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = opts.q || 1.1;
    bp.frequency.setValueAtTime(opts.from || 280, t); bp.frequency.exponentialRampToValueAtTime(opts.to || 2600, t + dur * 0.7); bp.frequency.exponentialRampToValueAtTime((opts.to || 2600) * 0.5, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(opts.gain || 0.45, t + dur * 0.55); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let last = g;
    if (c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.setValueAtTime(opts.panFrom ?? -0.6, t); p.pan.linearRampToValueAtTime(opts.panTo ?? 0.6, t + dur); g.connect(p); last = p; }
    n.connect(bp).connect(g); last.connect(sfxBus); last.connect(reverbSend);
    n.start(t); n.stop(t + dur + 0.1);
  };
  S.impact = (gain = 0.9) => {
    if (!fx()) return;
    const c = A.ctx, t = now(), o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(78, t); o.frequency.exponentialRampToValueAtTime(32, t + 1.1);
    env(g, t, 0.01, gain, 1.4); o.connect(g).connect(sfxBus); g.connect(reverbSend); o.start(t); o.stop(t + 1.6);
    const n = noiseSrc(), lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(2200, t); lp.frequency.exponentialRampToValueAtTime(120, t + 0.6);
    const ng = c.createGain(); env(ng, t, 0.005, gain * 0.5, 0.7); n.connect(lp).connect(ng).connect(sfxBus); ng.connect(reverbSend); n.start(t); n.stop(t + 1);
  };
  S.riser = (dur = 2.2) => {
    if (!fx()) return;
    const c = A.ctx, t = now(), n = noiseSrc(), hp = c.createBiquadFilter(); hp.type = "bandpass"; hp.Q.value = 2;
    hp.frequency.setValueAtTime(300, t); hp.frequency.exponentialRampToValueAtTime(5200, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32, t + dur); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.08);
    n.connect(hp).connect(g).connect(sfxBus); g.connect(reverbSend); n.start(t); n.stop(t + dur + 0.2);
    const o = c.createOscillator(), og = c.createGain(); o.type = "triangle"; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(440, t + dur);
    og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(0.08, t + dur); og.gain.linearRampToValueAtTime(0.0001, t + dur + 0.1);
    o.connect(og).connect(sfxBus); o.start(t); o.stop(t + dur + 0.2);
  };
  S.tick = (f = 1800, gain = 0.12) => {
    if (!fx()) return;
    const c = A.ctx, t = now(), o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f;
    env(g, t, 0.003, gain, 0.06); o.connect(g).connect(sfxBus); o.start(t); o.stop(t + 0.1);
  };
  S.shimmer = (gain = 0.1) => {
    if (!fx()) return;
    const c = A.ctx, t = now();
    [1, 1.5, 2, 3].forEach((k, i) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = 660 * k * (1 + rnd(-0.003, 0.003));
      env(g, t + i * 0.05, 0.02, gain / (i + 1), 2.6); o.connect(g); g.connect(sfxBus); g.connect(reverbSend); o.start(t); o.stop(t + 3);
    });
  };
  S.glitch = () => {
    if (!fx()) return;
    const c = A.ctx, t0 = now();
    for (let i = 0; i < 6; i++) {
      const t = t0 + i * rnd(0.03, 0.06), o = c.createOscillator(), g = c.createGain();
      o.type = "square"; o.frequency.value = rnd(70, 240); env(g, t, 0.002, 0.08, 0.03);
      o.connect(g).connect(sfxBus); o.start(t); o.stop(t + 0.06);
    }
  };
  S.correct = () => {
    if (!fx()) return;
    const c = A.ctx, t = now();
    [[659.25, 0], [987.77, 0.11]].forEach(([f, d]) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f;
      env(g, t + d, 0.01, 0.16, 1.2); o.connect(g); g.connect(sfxBus); g.connect(reverbSend); o.start(t + d); o.stop(t + d + 1.4);
    });
  };
  S.wrong = () => {
    if (!fx()) return;
    const c = A.ctx, t = now(), o = c.createOscillator(), g = c.createGain(), lp = c.createBiquadFilter();
    o.type = "triangle"; o.frequency.setValueAtTime(220, t); o.frequency.linearRampToValueAtTime(185, t + 0.3); lp.type = "lowpass"; lp.frequency.value = 900;
    env(g, t, 0.01, 0.2, 0.4); o.connect(lp).connect(g).connect(sfxBus); o.start(t); o.stop(t + 0.5);
  };
  A.sfx = S;

  A.transition = function (type) {
    if (!fx()) return;
    switch (type) {
      case "organic": S.whoosh(1.2, { from: 200, to: 1800, gain: 0.35 }); setTimeout(() => S.shimmer(0.06), 250); break;
      case "fog": S.whoosh(1.8, { from: 160, to: 900, gain: 0.3, q: 0.6 }); break;
      case "wind": S.whoosh(2.2, { from: 400, to: 3200, gain: 0.32, q: 0.5, panFrom: 0.8, panTo: -0.8 }); break;
      case "season": S.whoosh(1.1, { from: 300, to: 2200, gain: 0.3 }); S.shimmer(0.05); break;
      case "pan": S.whoosh(1.3, { from: 250, to: 2000, gain: 0.4, panFrom: 0.9, panTo: -0.9 }); break;
      case "cut": S.impact(0.95); S.glitch(); break;
      case "iris": S.whoosh(1.1, { from: 400, to: 3000, gain: 0.35 }); setTimeout(() => S.tick(2400, 0.08), 500); break;
      case "zoom": S.whoosh(1.4, { from: 180, to: 2600, gain: 0.4 }); setTimeout(() => S.impact(0.4), 700); break;
      default: S.whoosh(0.9, { gain: 0.3 });
    }
  };

  window.Sound = A;
})();
