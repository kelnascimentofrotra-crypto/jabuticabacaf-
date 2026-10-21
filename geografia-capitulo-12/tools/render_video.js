#!/usr/bin/env node
/* Renderiza video/cabecalho.html quadro a quadro e gera o MP4 (H.264 + AAC).
   Requer: Node, Playwright (Chromium) e ffmpeg.
   Uso: node tools/render_video.js [saida.mp4] [--preview N]
   --preview N  renderiza só os N primeiros segundos (teste rápido).
   --stills a,b,c  salva apenas quadros PNG nesses instantes (em segundos) ao lado da saída.
   --audio-only  refaz só a trilha e recodifica o MP4 existente com ela. */
const path = require("path");
const fs = require("fs");
const http = require("http");
const { spawn } = require("child_process");
let playwright;
try { playwright = require("playwright"); } catch (e) { playwright = require("/opt/node22/lib/node_modules/playwright"); }

const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : path.join(ROOT, "video", "cabecalho-capitulo-12.mp4"));
const pi = process.argv.indexOf("--preview");
const LIMIT = pi > 0 ? Number(process.argv[pi + 1]) : null;

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;
  const browser = await playwright.chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on("console", (m) => { if (m.type() === "error") console.error("[página]", m.text()); });
  page.on("pageerror", (e) => console.error("[erro]", e.message));
  await page.goto(`http://127.0.0.1:${port}/video/cabecalho.html?render=1`);
  await page.evaluate(() => window.ready);
  const { FPS, DUR } = await page.evaluate(() => window.VIDEO);
  const si = process.argv.indexOf("--stills");
  if (si > 0) {
    const dir = path.join(path.dirname(OUT), "stills"); fs.mkdirSync(dir, { recursive: true });
    for (const t of process.argv[si + 1].split(",").map(Number)) {
      await page.evaluate((x) => window.renderFrame(x), t);
      await page.screenshot({ path: path.join(dir, "t" + t.toFixed(1).padStart(4, "0") + ".png") });
    }
    await browser.close(); server.close(); console.log("quadros em", dir); return;
  }
  if (process.argv.includes("--audio-only")) {
    const wav = OUT.replace(/\.mp4$/, ".wav"), tmp = OUT.replace(/\.mp4$/, ".tmp.mp4");
    fs.writeFileSync(wav, Buffer.from(await page.evaluate(() => window.renderAudio()), "base64"));
    await new Promise((r, j) => spawn("ffmpeg", ["-y", "-loglevel", "error", "-i", OUT, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "20",
      "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", tmp], { stdio: "inherit" }).on("close", (c) => (c ? j(new Error("ffmpeg " + c)) : r())));
    fs.renameSync(tmp, OUT); fs.unlinkSync(wav);
    await browser.close(); server.close(); console.log("vídeo:", OUT); return;
  }
  const dur = LIMIT ? Math.min(LIMIT, DUR) : DUR;
  const frames = Math.round(dur * FPS);

  const wav = OUT.replace(/\.mp4$/, ".wav");
  const b64 = await page.evaluate(() => window.renderAudio());
  fs.writeFileSync(wav, Buffer.from(b64, "base64"));
  console.log("áudio:", wav);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
    "-i", wav, "-t", String(dur), "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-r", String(FPS),
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", OUT], { stdio: ["pipe", "inherit", "inherit"] });
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.renderFrame(t), f / FPS);
    const png = await page.screenshot({ type: "png" });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % 60 === 0) console.log(`quadro ${f}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  fs.unlinkSync(wav);
  await browser.close(); server.close();
  console.log("vídeo:", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
