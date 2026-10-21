#!/usr/bin/env node
/* Renderiza video/capitulo.html (continuação do cabeçalho) e gera o vídeo completo:
   cabeçalho (video/cabecalho-capitulo-12.mp4) + capítulo, com uma trilha única.
   Requer Node, Playwright (Chromium) e ffmpeg.
   Uso:
     node tools/render_capitulo.js                      → video/capitulo-12-completo.mp4
     node tools/render_capitulo.js --workers 3          → renderizadores em paralelo
     node tools/render_capitulo.js --versao curto       → versão de até 3 min (video/capitulo-12-curto.mp4)
     node tools/render_capitulo.js --stills mid         → quadros de teste de cada cena
     node tools/render_capitulo.js --stills 12.5,40     → quadros de teste nesses instantes
   A renderização é feita em blocos de 300 quadros numa pasta de trabalho (--work). Se o processo
   for interrompido, rode o mesmo comando de novo: os blocos prontos são reaproveitados. */
const path = require("path");
const fs = require("fs");
const http = require("http");
const os = require("os");
const { spawn } = require("child_process");
let playwright;
try { playwright = require("playwright"); } catch (e) { playwright = require("/opt/node22/lib/node_modules/playwright"); }

const ROOT = path.resolve(__dirname, "..");
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const VERSAO = arg("--versao", "longo");
const OUT = path.resolve(arg("--out", path.join(ROOT, "video", VERSAO === "curto" ? "capitulo-12-curto.mp4" : "capitulo-12-completo.mp4")));
const HEADER = path.join(ROOT, "video", "cabecalho-capitulo-12.mp4");
const WORKERS = Number(arg("--workers", 3));
const STILLS = arg("--stills", null);
const WORK = path.resolve(arg("--work", path.join(os.tmpdir(), "cap12-trabalho-" + VERSAO)));
const CHUNK = Number(arg("--chunk", 300));

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
const ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"];
const run = (cmd, args) => new Promise((r, j) => spawn(cmd, args, { stdio: "inherit" }).on("close", (c) => (c ? j(new Error(cmd + " saiu com " + c)) : r())));

async function openPage(port) {
  const browser = await playwright.chromium.launch({ args: ARGS });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on("console", (m) => { if (m.type() === "error") console.error("[página]", m.text()); });
  page.on("pageerror", (e) => console.error("[erro]", e.message));
  await page.goto(`http://127.0.0.1:${port}/video/capitulo.html?render=1&versao=${VERSAO}`);
  await page.evaluate(() => window.ready);
  return { browser, page };
}

function wavHeader(bytes, sr, ch) {
  const b = Buffer.alloc(44);
  b.write("RIFF", 0); b.writeUInt32LE(36 + bytes, 4); b.write("WAVE", 8); b.write("fmt ", 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(ch, 22); b.writeUInt32LE(sr, 24);
  b.writeUInt32LE(sr * ch * 2, 28); b.writeUInt16LE(ch * 2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(bytes, 40);
  return b;
}

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;
  const main = await openPage(port);
  const V = await main.page.evaluate(() => window.VIDEO);
  console.log(`capítulo: ${V.DUR.toFixed(1)} s (${V.scenes.length} cenas) + cabeçalho ${V.HEAD} s`);

  if (process.argv.includes("--list")) { V.scenes.forEach((x) => console.log(x.start.toFixed(1).padStart(6), x.dur.toString().padStart(5), x.id)); await main.browser.close(); server.close(); return; }
  if (STILLS) {
    const dir = path.join(path.dirname(OUT), "stills-capitulo"); fs.mkdirSync(dir, { recursive: true });
    const times = STILLS === "mid" ? V.scenes.map((s) => s.start + s.dur * 0.72) : STILLS.split(",").map(Number);
    for (const t of times) {
      await main.page.evaluate((x) => window.renderFrame(x), t);
      await main.page.screenshot({ path: path.join(dir, "t" + t.toFixed(1).padStart(6, "0") + ".png") });
    }
    await main.browser.close(); server.close(); console.log("quadros em", dir); return;
  }

  fs.mkdirSync(WORK, { recursive: true });
  // 1) trilha completa (reaproveitada se já existir)
  const wav = path.join(WORK, "trilha.wav");
  if (!fs.existsSync(wav + ".done")) {
    const info = await main.page.evaluate(() => window.renderAudio());
    const parts = [];
    for (let i = 0; i * info.chunk < info.bytes; i++) parts.push(Buffer.from(await main.page.evaluate(([k, n]) => window.audioChunk(k, n), [i, info.chunk]), "base64"));
    const pcm = Buffer.concat(parts);
    fs.writeFileSync(wav, Buffer.concat([wavHeader(pcm.length, info.sampleRate, info.channels), pcm]));
    fs.writeFileSync(wav + ".done", "");
    console.log("trilha:", (pcm.length / 1048576).toFixed(1), "MB");
  }
  await main.browser.close();

  // 2) quadros em blocos, com vários renderizadores em paralelo
  const frames = Math.round(V.DUR * V.FPS), nChunks = Math.ceil(frames / CHUNK), t0 = Date.now();
  const chunkFile = (i) => path.join(WORK, `bloco${String(i).padStart(3, "0")}.mp4`);
  const queue = Array.from({ length: nChunks }, (_, i) => i).filter((i) => !fs.existsSync(chunkFile(i) + ".done"));
  console.log(`blocos: ${nChunks - queue.length}/${nChunks} já prontos`);
  let done = 0;
  await Promise.all(Array.from({ length: Math.min(WORKERS, queue.length) }, async () => {
    const { browser, page } = await openPage(port);
    while (queue.length) {
      const i = queue.shift(), a = i * CHUNK, b = Math.min(frames, a + CHUNK), out = chunkFile(i);
      const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(V.FPS), "-c:v", "png", "-i", "-",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", "-pix_fmt", "yuv420p", "-r", String(V.FPS), out], { stdio: ["pipe", "inherit", "inherit"] });
      const closed = new Promise((r) => ff.on("close", r));
      for (let f = a; f < b; f++) {
        await page.evaluate((t) => window.renderFrame(t), f / V.FPS);
        const png = await page.screenshot({ type: "png" });
        if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
      }
      ff.stdin.end();
      if ((await closed) === 0) fs.writeFileSync(out + ".done", "");
      done++;
      console.log(`bloco ${i + 1}/${nChunks} pronto (${done} nesta execução, ${((Date.now() - t0) / 60000).toFixed(1)} min)`);
    }
    await browser.close();
  }));
  server.close();

  // 3) cabeçalho + capítulo + trilha
  const list = path.join(WORK, "blocos.txt");
  fs.writeFileSync(list, Array.from({ length: nChunks }, (_, i) => `file '${chunkFile(i)}'`).join("\n"));
  const cap = path.join(WORK, "capitulo.mp4");
  await run("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", cap]);
  await run("ffmpeg", ["-y", "-loglevel", "error", "-i", HEADER, "-i", cap, "-i", wav, "-filter_complex", "[0:v][1:v]concat=n=2:v=1:a=0[v]",
    "-map", "[v]", "-map", "2:a", "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p", "-r", String(V.FPS),
    "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", OUT]);
  if (!process.argv.includes("--keep")) fs.rmSync(WORK, { recursive: true, force: true });
  console.log("vídeo:", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
