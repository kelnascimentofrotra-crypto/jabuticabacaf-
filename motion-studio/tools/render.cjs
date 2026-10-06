// Render de projetos do motion-studio (versão HTML/Chromium, no lugar do motor canvas que não veio no kit).
//
//   node tools/render.cjs <projeto> preview          -> out/preview.jpg (1 quadro a cada 30 frames, 1/3 da resolução)
//   node tools/render.cjs <projeto> board            -> out/board.png   (quadros do BOARD com título e nota)
//   node tools/render.cjs <projeto> timeline         -> out/timeline.json (SFX, BOARD, duração)
//   node tools/render.cjs <projeto> check            -> out/check.json + relatório de dead holds (tools/check.py)
//   node tools/render.cjs <projeto> full [--audio out/mix.wav]  -> out/final.mp4
// Opções: --fmt v|sq (padrão v; sq grava com sufixo -sq) · --workers N (padrão 3)
// Requer: playwright (Chromium), ffmpeg, python3 com pillow/numpy.
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const pos = [];
for (let i = 2; i < process.argv.length; i++) { if (process.argv[i].startsWith('--')) i++; else pos.push(process.argv[i]); }
const [proj, mode = 'preview'] = pos;
const arg = n => (process.argv.includes(n) ? process.argv[process.argv.indexOf(n) + 1] : null);
const fmt = arg('--fmt') || 'v';
const workers = Number(arg('--workers') || 3);
const P = path.resolve(proj);
const OUT = path.join(P, 'out');
const sfx = fmt === 'sq' ? '-sq' : '';
const TOOLS = __dirname;
fs.mkdirSync(OUT, { recursive: true });

function run(cmd, argv) {
  const p = spawn(cmd, argv, { stdio: ['pipe', 'inherit', 'inherit'] });
  p.done = new Promise((res, rej) => p.on('close', c => (c ? rej(new Error(`${cmd} saiu com código ${c}`)) : res())));
  return p;
}
async function open(browser, { scale = 1, nograin = false } = {}) {
  const H = fmt === 'sq' ? 1080 : 1920;
  const page = await browser.newPage({ viewport: { width: 1080, height: H }, deviceScaleFactor: scale });
  await page.addInitScript(([f, ng]) => { window.__RENDER__ = true; window.__FMT__ = f; window.__NOGRAIN__ = ng; }, [fmt, nograin]);
  await page.goto('file://' + path.join(P, 'motion.html'));
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    if (!document.fonts.check('800 100px "Montserrat"')) throw new Error('fonte caiu no fallback');
    if (window.__NOGRAIN__) document.getElementById('grain').style.display = 'none';
  });
  return page;
}
async function shoot(page, f, file) {
  await page.evaluate(t => window.render(t), f / 30);
  return page.screenshot(file ? { path: file } : { type: 'png' });
}

(async () => {
  const browser = await chromium.launch();
  const probe = await open(browser);
  const TL = await probe.evaluate(() => window.TIMELINE);
  const N = Math.round(TL.DURATION * TL.FPS);

  if (mode === 'timeline') {
    fs.writeFileSync(path.join(OUT, 'timeline.json'), JSON.stringify(TL, null, 1));
    console.log('ok -> out/timeline.json');
    return browser.close();
  }
  if (mode === 'preview' || mode === 'board') {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-'));
    const items = mode === 'preview' ? [...Array(Math.ceil(N / 30)).keys()].map(i => [i * 30, `f${i * 30}`, '']) : TL.BOARD;
    const files = [];
    for (const [f, title, note] of items) {
      const file = path.join(dir, `${String(f).padStart(5, '0')}.png`);
      await shoot(probe, f, file);
      files.push([file, f, title, note]);
    }
    await browser.close();
    const out = path.join(OUT, mode === 'preview' ? `preview${sfx}.jpg` : `board${sfx}.png`);
    execFileSync('python3', [path.join(TOOLS, 'sheet.py'), mode, out, JSON.stringify(files)], { stdio: 'inherit' });
    fs.rmSync(dir, { recursive: true, force: true });
    return console.log('ok ->', path.relative(process.cwd(), out));
  }
  if (mode === 'check') {
    // quadros em 1/8 da resolução, sem grão, em tons de cinza -> check.py procura regiões paradas
    const page = await open(browser, { scale: .125, nograin: true });
    const raw = path.join(os.tmpdir(), `ms-check${sfx}.raw`);
    const ff = run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-i', '-', '-vf', 'format=gray', '-f', 'rawvideo', raw]);
    for (let f = 0; f < N; f++) { const b = await shoot(page, f); if (!ff.stdin.write(b)) await new Promise(r => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await ff.done; await browser.close();
    const H = fmt === 'sq' ? 1080 : 1920;
    execFileSync('python3', [path.join(TOOLS, 'check.py'), raw, String(1080 / 8), String(H / 8), path.join(OUT, `timeline.json`), path.join(OUT, `check${sfx}.json`)], { stdio: 'inherit' });
    return fs.rmSync(raw, { force: true });
  }

  // full: abas em paralelo -> segmentos quase sem perdas -> MP4 final (2 passadas) com áudio
  await probe.close();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-render-'));
  const chunk = Math.ceil(N / workers);
  let done = 0; const t0 = Date.now(); const segs = [];
  await Promise.all([...Array(workers).keys()].map(async w => {
    const a = w * chunk, b = Math.min(N, a + chunk);
    if (a >= b) return;
    const file = path.join(tmp, `seg${w}.mp4`); segs[w] = file;
    const page = await open(browser);
    const ff = run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-preset', 'fast', '-crf', '10', '-pix_fmt', 'yuv420p', file]);
    for (let f = a; f < b; f++) {
      const buf = await shoot(page, f);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 90 === 0) console.log(`[${fmt}] frame ${done}/${N} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    ff.stdin.end(); await ff.done; await page.close();
  }));
  await browser.close();
  const list = path.join(tmp, 'list.txt');
  fs.writeFileSync(list, segs.filter(Boolean).map(s => `file '${s}'`).join('\n'));
  const master = path.join(tmp, 'master.mp4');
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', master]).done;
  fs.copyFileSync(master, path.join(OUT, `video${sfx}.mp4`));
  const audio = arg('--audio') && path.resolve(arg('--audio'));
  const log = path.join(tmp, 'x264');
  const venc = ['-c:v', 'libx264', '-preset', 'slow', '-b:v', '6000k', '-pix_fmt', 'yuv420p', '-passlogfile', log];
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', master, ...venc, '-pass', '1', '-an', '-f', 'mp4', os.devNull]).done;
  const ain = audio ? ['-i', audio] : [], aenc = audio ? ['-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest'] : [];
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', master, ...ain, ...venc, '-pass', '2', '-maxrate', '9000k', '-bufsize', '12000k', '-profile:v', 'high', ...aenc, '-movflags', '+faststart', path.join(OUT, `final${sfx}.mp4`)]).done;
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('ok ->', `out/final${sfx}.mp4`);
})().catch(e => { console.error(e); process.exit(1); });
