// Renderiza motion.html quadro a quadro com o Chromium (Playwright) e codifica em MP4 com o ffmpeg.
//
//   node render.cjs --fmt v  --audio audio/mix.wav   -> jabuticaba-cafe-reels.mp4 (1080x1920)
//   node render.cjs --fmt sq --audio audio/mix.wav   -> jabuticaba-cafe-feed.mp4  (1080x1080)
//   node render.cjs --timeline audio/timeline.json   -> exporta narração/efeitos/trilha para o build_audio.py
//   node render.cjs --fmt sq --stills 1.5,6,12       -> quadros PNG soltos em ./stills (para conferência)
//
// Outras opções: --workers N (abas em paralelo, padrão 3), --out arquivo.mp4
// Requer: playwright (com Chromium) e ffmpeg no PATH.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const FPS = 30;
const BITRATE = '6000k';
const args = process.argv.slice(2);
const arg = name => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const fmt = arg('--fmt') || 'v';
const H = fmt === 'sq' ? 1080 : 1920;
const out = arg('--out') || path.join(__dirname, fmt === 'sq' ? 'jabuticaba-cafe-feed.mp4' : 'jabuticaba-cafe-reels.mp4');
const audio = arg('--audio');
const workers = Number(arg('--workers') || 3);

function run(cmd, argv) {
  const proc = spawn(cmd, argv, { stdio: ['pipe', 'inherit', 'inherit'] });
  proc.done = new Promise((res, rej) => proc.on('close', c => (c ? rej(new Error(`${cmd} saiu com código ${c}`)) : res())));
  return proc;
}

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: H }, deviceScaleFactor: 1 });
  await page.addInitScript(f => { window.__RENDER__ = true; window.__FMT__ = f; }, fmt);
  await page.goto('file://' + path.join(__dirname, 'motion.html'));
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  });
  return page;
}

(async () => {
  const browser = await chromium.launch();

  const timeline = arg('--timeline');
  if (timeline) {
    const page = await openPage(browser);
    fs.writeFileSync(timeline, JSON.stringify(await page.evaluate(() => window.TIMELINE), null, 1));
    console.log('ok ->', timeline);
    return browser.close();
  }

  const stills = arg('--stills');
  if (stills) {
    const page = await openPage(browser);
    const dir = path.join(__dirname, 'stills');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of stills.split(',').map(Number)) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(dir, `${fmt}-t${t.toFixed(2)}.png`) });
    }
    return browser.close();
  }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'jabu-render-'));
  const probe = await openPage(browser);
  const frames = Math.round((await probe.evaluate(() => window.DURATION)) * FPS);
  await probe.close();

  // 1) cada aba renderiza um trecho contínuo de quadros para um segmento quase sem perdas
  const chunk = Math.ceil(frames / workers);
  let doneFrames = 0;
  const t0 = Date.now();
  const segments = [];
  await Promise.all([...Array(workers).keys()].map(async w => {
    const a = w * chunk, b = Math.min(frames, a + chunk);
    if (a >= b) return;
    const file = path.join(tmp, `seg${w}.mp4`);
    segments[w] = file;
    const page = await openPage(browser);
    const ff = run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '10', '-pix_fmt', 'yuv420p', file]);
    for (let f = a; f < b; f++) {
      await page.evaluate(t => window.render(t), f / FPS);
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (++doneFrames % 60 === 0) console.log(`[${fmt}] frame ${doneFrames}/${frames}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    ff.stdin.end();
    await ff.done;
    await page.close();
  }));
  await browser.close();

  // 2) junta os segmentos e 3) codifica a versão final em duas passadas, já com o áudio
  const list = path.join(tmp, 'list.txt');
  fs.writeFileSync(list, segments.filter(Boolean).map(s => `file '${s}'`).join('\n'));
  const master = path.join(tmp, 'master.mp4');
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', master]).done;
  const log = path.join(tmp, 'x264');
  const venc = ['-c:v', 'libx264', '-preset', 'slow', '-b:v', BITRATE, '-pix_fmt', 'yuv420p', '-passlogfile', log];
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', master, ...venc, '-pass', '1', '-an', '-f', 'mp4', os.devNull]).done;
  const ain = audio ? ['-i', audio] : [];
  const aenc = audio ? ['-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest'] : [];
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', master, ...ain, ...venc, '-pass', '2', '-maxrate', '9000k', '-bufsize', '12000k',
    '-profile:v', 'high', ...aenc, '-movflags', '+faststart', out]).done;
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('ok ->', out);
})().catch(e => { console.error(e); process.exit(1); });
