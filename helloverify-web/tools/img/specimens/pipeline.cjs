// Exports the eight evidence-table specimens (all forged: `forge.cjs` for
// the marksheet, `forge-all.cjs` for the other seven) and, for each, the
// three other ways the case file looks at it:
//
//   fx-NN-*.jpg        the scan
//   fx-NN-*-uv.jpg     the same sheet under 365 nm, at the same size
//   fx-NN-*-heat.jpg   where the sheet was altered, over its own texture
//   fx-NN-*-zoom.jpg   the key finding, magnified
//
// Run: node pipeline.cjs <dir> <out>. Everything is seeded, so reruns match.
const sharp = require("sharp");
const fs = require("fs");
const D = process.argv[2], OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });

// Under UV. `paper`: "security" (violet, fibres, a UV-ink rosette),
// "office" (optical brighteners glow blue-white; no fibres, no emblem — a
// colour copy) or "plain" (dull stock, nothing — a degree mill's).
// `emb` is the rosette's centre (fractions) and radius (fraction of width).
// `zoom` is a crop of the source at its own pixels and how much to enlarge
// it; `from: "uv"` crops the UV photograph instead.
const DOCS = [
  { id: "fx-01-be-in", src: "d1", long: 1000, paper: "office", emb: [0.5, 0.17, 0.09], zoom: { box: [1150, 824, 300, 70], k: 1.6 } },
  { id: "fx-02-transcript-ae", src: "d2", long: 1000, paper: "security", emb: [0.5, 0.085, 0.11], zoom: { box: [1356, 1250, 112, 50], k: 4 } },
  { id: "fx-03-tor-ph", src: "d3", long: 1000, paper: "security", emb: [0.5, 0.07, 0.12], zoom: { box: [1282, 1350, 146, 56], k: 3.2 } },
  { id: "fx-04-pharmacy-eg", src: "d4b", long: 1000, paper: "security", emb: [0.5, 0.47, 0.1], zoom: { box: [880, 1296, 160, 62], k: 3 } },
  { id: "fx-05-mba-uk", src: "d5", long: 1000, paper: "plain", emb: null, zoom: { box: [1250, 1490, 150, 96], k: 2.8, from: "uv" } },
  { id: "fx-06-marksheet-in", src: "d6", long: 1400, paper: "security", emb: [0.5, 0.09, 0.11], zoom: { box: [846, 1098, 120, 205], k: 3 } },
  { id: "fx-07-diploma-sg", src: "d7", long: 1000, paper: "security", emb: [0.56, 0.5, 0.1], zoom: { box: [392, 1058, 116, 64], k: 3.6 } },
  { id: "fx-08-mbbs-pk", src: "d8", long: 1000, paper: "security", emb: [0.5, 0.33, 0.12], zoom: { box: [1138, 1944, 250, 100], k: 1.8 } },
];

const TINT = {
  security: [[0.13, 0.086, 0.3], [10, 6, 22]],
  office: [[0.3, 0.34, 0.58], [26, 30, 70]],
  plain: [[0.085, 0.06, 0.17], [6, 4, 14]],
};

async function tint(input, W, H, a, b) {
  const g = await sharp(input).removeAlpha().greyscale().extractChannel(0).raw().toBuffer();
  const o = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) for (let c = 0; c < 3; c++) o[i * 3 + c] = Math.max(0, Math.min(255, Math.round(g[i] * a[c] + b[c])));
  return sharp(o, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
}
// Deterministic PRNG so the fibres are the same on every run.
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function fibres(W, H, seed) {
  const r = rng(seed), cols = ["#8CFFC4", "#9AD8FF", "#FF9CC6", "#C9FF8C"];
  let fib = "";
  const n = Math.round((W * H) / 9000);
  for (let i = 0; i < n; i++) {
    const x = r() * W, y = r() * H, a = r() * Math.PI * 2, l = 6 + r() * 16, b = (r() - 0.5) * 10;
    const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l;
    fib += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} Q${((x + x2) / 2 + b).toFixed(1)} ${((y + y2) / 2 - b).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${cols[i % 4]}" stroke-width="${(0.7 + r() * 0.8).toFixed(2)}" fill="none" opacity="${(0.55 + r() * 0.45).toFixed(2)}"/>`;
  }
  return fib;
}
function rosette(W, H, [cx, cy, rf]) {
  const R = rf * W, X = cx * W, Y = cy * H;
  let ros = "";
  for (const [rr, amp, lobes] of [[R, R * 0.09, 28], [R * 0.72, R * 0.12, 18], [R * 0.45, R * 0.1, 12]]) {
    let d = "";
    for (let k = 0; k <= lobes * 12; k++) { const t = (k / (lobes * 12)) * Math.PI * 2, q = rr + amp * Math.sin(lobes * t); d += `${k ? "L" : "M"}${(X + q * Math.cos(t)).toFixed(1)} ${(Y + q * Math.sin(t)).toFixed(1)}`; }
    ros += `<path d="${d}Z" fill="none" stroke="#B8FF9A" stroke-width="${Math.max(1, W / 700).toFixed(2)}"/>`;
  }
  return ros;
}

/** An RGBA image of `rgb` wherever the forged sheet differs from the
 *  original inside `box` (source pixels), as a data URI — the footprint of
 *  what the forger added. */
async function footprint(src, box, rgb, thr = 16) {
  const a = await sharp(`${D}/${src}.png`).removeAlpha().extract(box).raw().toBuffer();
  const b = await sharp(`${D}/${src}-forged.png`).removeAlpha().extract(box).raw().toBuffer();
  const o = Buffer.alloc(box.width * box.height * 4);
  for (let i = 0; i < box.width * box.height; i++) {
    const d = Math.max(Math.abs(a[i * 3] - b[i * 3]), Math.abs(a[i * 3 + 1] - b[i * 3 + 1]), Math.abs(a[i * 3 + 2] - b[i * 3 + 2]));
    o[i * 4] = rgb[0]; o[i * 4 + 1] = rgb[1]; o[i * 4 + 2] = rgb[2]; o[i * 4 + 3] = d > thr ? Math.min(255, d * 4) : 0;
  }
  const png = await sharp(o, { raw: { width: box.width, height: box.height, channels: 4 } }).png().toBuffer();
  return `<image x="${box.left}" y="${box.top}" width="${box.width}" height="${box.height}" href="data:image/png;base64,${png.toString("base64")}"/>`;
}
/** The original sheet's dark ink inside `box`, as `rgb`, shifted by (dx, dy). */
async function inkOf(src, box, rgb, dx, dy, lo = 170, hi = 120) {
  const g = await sharp(`${D}/${src}.png`).removeAlpha().extract(box).greyscale().raw().toBuffer();
  const o = Buffer.alloc(box.width * box.height * 4);
  for (let i = 0; i < box.width * box.height; i++) { o[i * 4] = rgb[0]; o[i * 4 + 1] = rgb[1]; o[i * 4 + 2] = rgb[2]; o[i * 4 + 3] = Math.round(255 * Math.max(0, Math.min(1, (lo - g[i]) / hi))); }
  const png = await sharp(o, { raw: { width: box.width, height: box.height, channels: 4 } }).png().toBuffer();
  return `<image x="${box.left + dx}" y="${box.top + dy}" width="${box.width}" height="${box.height}" href="data:image/png;base64,${png.toString("base64")}"/>`;
}

const noise = (id, freq, seed, scale, blur) => `<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="${scale}"/><feGaussianBlur stdDeviation="${blur}"/></filter>`;

/** What each alteration looks like under 365 nm, in the SOURCE's pixels. */
const EXTRA = {
  // The name was retyped before the sheet was colour-copied, so under UV it
  // is only the copier's toner — the lamp's finding is the paper itself.
  d1: async () => "",
  // The second ink fluoresces a warm orange; the school's print stays dark.
  d2: async () => `<defs><filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<g filter="url(#g)">${await footprint("d2", { left: 1380, top: 1252, width: 26, height: 30 }, [255, 176, 96], 10)}${await footprint("d2", { left: 1381, top: 1359, width: 26, height: 30 }, [255, 176, 96], 10)}</g>`,
  // Correction fluid absorbs UV: a dead-black blot on glowing paper.
  d3: async () => `<defs>${noise("w", 0.08, 11, 7, 1.6)}</defs><ellipse cx="1325" cy="1378" rx="19" ry="22" fill="#030208" opacity="0.92" filter="url(#w)"/>`,
  // The revenue stamp's UV print glows; the printed seal stays dark.
  d4b: async () => `<defs><filter id="g" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<g filter="url(#g)" opacity="0.9"><rect x="2046" y="1350" width="178" height="236" fill="none" stroke="#FFE27A" stroke-width="5"/><rect x="2066" y="1372" width="138" height="150" fill="#FFE27A" opacity="0.22"/><circle cx="2135" cy="1440" r="42" fill="none" stroke="#C9FF8C" stroke-width="4"/><path d="M2070 1545h130" stroke="#FFE27A" stroke-width="7"/></g>`,
  // The sticker's adhesive oozes and glows in a ring round the seal.
  d5: async () => `<defs>${noise("a", 0.05, 9, 14, 3.2)}${noise("h", 0.05, 9, 14, 9)}</defs>
<circle cx="1191" cy="1541" r="176" fill="none" stroke="#DCE6FF" stroke-width="16" opacity="0.35" filter="url(#h)"/>
<circle cx="1191" cy="1541" r="176" fill="none" stroke="#F2F6FF" stroke-width="6" opacity="0.95" filter="url(#a)"/>`,
  // Scrape, wash and slip (`forge.cjs`), each its own way.
  d6: async () => `<defs>
${noise("p", 0.09, 7, 14, 4)}${noise("w", 0.05, 3, 18, 5)}${noise("t", 0.05, 3, 18, 1.4)}
<filter id="s" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="2.2"/></filter></defs>
<ellipse cx="906" cy="1196" rx="40" ry="25" fill="#D6E2FF" opacity="0.42" filter="url(#p)"/>
<ellipse cx="906" cy="1272" rx="60" ry="36" fill="#05030F" opacity="0.6" filter="url(#w)"/>
<ellipse cx="906" cy="1272" rx="60" ry="36" fill="none" stroke="#C9D8FF" stroke-width="4" opacity="0.7" filter="url(#t)"/>
<rect x="852" y="1485" width="104" height="42" fill="#E6ECFF" opacity="0.5"/>
<rect x="852" y="1485" width="104" height="42" fill="none" stroke="#F4F7FF" stroke-width="5" opacity="0.95" filter="url(#s)"/>`,
  // Tape took the paper's surface with it: abraded fibres glow blue-white.
  d7: async () => `<defs>${noise("p", 0.09, 4, 12, 4)}</defs><ellipse cx="476" cy="1094" rx="40" ry="33" fill="#D6E2FF" opacity="0.28" filter="url(#p)"/>`,
  // Graphite does not fluoresce but shines: the pencil guide shows as a
  // pale line beside every stroke.
  d8: async () => `<defs><filter id="g"><feGaussianBlur stdDeviation="1.2"/></filter></defs><g filter="url(#g)" opacity="0.85">${await inkOf("d8", { left: 1136, top: 1940, width: 400, height: 97 }, [176, 168, 214], 4, 3)}</g>`,
};

async function heat(scan, maskFile, W, H, out) {
  const grey = await sharp(scan).resize(W, H).greyscale().toBuffer();
  const dim = await tint(grey, W, H, [0.1, 0.11, 0.16], [6, 8, 18]);
  const hf = await sharp(grey).blur(1.2).toBuffer();
  const g = await sharp(grey).extractChannel(0).raw().toBuffer(), b = await sharp(hf).extractChannel(0).raw().toBuffer();
  const floor = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) { const e = Math.min(255, Math.abs(g[i] - b[i]) * 3); floor[i * 4] = 40; floor[i * 4 + 1] = 120; floor[i * 4 + 2] = 255; floor[i * 4 + 3] = Math.round(Math.min(255, e * 1.1)); }
  const floorPng = await sharp(floor, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  const m = await sharp(maskFile).removeAlpha().resize(W, H).greyscale().extractChannel(0).blur(Math.max(4, W / 100)).raw().toBuffer();
  const hot = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const v = m[i] / 255; if (v < 0.02) continue;
    const t = Math.min(1, v * 1.6);
    hot[i * 4] = 255; hot[i * 4 + 1] = Math.round(230 - 200 * t); hot[i * 4 + 2] = Math.round(60 - 60 * t); hot[i * 4 + 3] = Math.round(255 * Math.min(1, v * 2.2));
  }
  const hotPng = await sharp(hot, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  await sharp(dim).composite([{ input: floorPng }, { input: hotPng }]).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
}

(async () => {
  for (const { id, src, long, paper, emb, zoom } of DOCS) {
    const scan = `${D}/${src}-forged.png`;
    const { width: SW, height: SH } = await sharp(scan).metadata();
    const land = SW >= SH;
    const W = land ? long : Math.round((long * SW) / SH);
    const H = land ? Math.round((long * SH) / SW) : long;
    const k = W / SW;
    const vis = await sharp(scan).removeAlpha().resize(W, H).toBuffer();
    await sharp(vis).jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/${id}.jpg`);

    const [a, b] = TINT[paper];
    const base = await tint(vis, W, H, a, b);
    const glow = `<filter id="G" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(W / 600).toFixed(2)}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    const sec = paper === "security" ? `<g filter="url(#G)">${fibres(W, H, id.length * 7919 + W)}</g><g filter="url(#G)" opacity="0.85">${rosette(W, H, emb)}</g>` : "";
    const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${glow}</defs>${sec}<g transform="scale(${k})">${await EXTRA[src]()}</g></svg>`);
    const uvPath = `${OUT}/${id}-uv.jpg`;
    await sharp(base).composite([{ input: overlay }]).jpeg({ quality: 80, mozjpeg: true }).toFile(uvPath);

    await heat(scan, `${D}/${src}-mask.png`, W, H, `${OUT}/${id}-heat.jpg`);

    // The zoom: from the full-size source, or from the UV photograph scaled
    // back up to the source's pixels.
    const [zx, zy, zw, zh] = zoom.box;
    const zsrc = zoom.from === "uv" ? await sharp(uvPath).resize(SW, SH).toBuffer() : scan;
    await sharp(zsrc).removeAlpha().extract({ left: zx, top: zy, width: zw, height: zh }).resize(Math.round(zw * zoom.k), Math.round(zh * zoom.k), { kernel: "lanczos3" })
      .jpeg({ quality: 84, mozjpeg: true }).toFile(`${OUT}/${id}-zoom.jpg`);
    console.log(id, W, H, "zoom", Math.round(zw * zoom.k), Math.round(zh * zoom.k));
  }
})();
