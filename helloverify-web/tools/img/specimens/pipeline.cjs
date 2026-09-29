const sharp = require("sharp");
const fs = require("fs");
const D = process.argv[2], OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });

// id, source, long edge, UV emblem centre (fractions), emblem radius (fraction of width)
const DOCS = [
  ["ev-01-be-in", "d1.png", 1000, [0.5, 0.17], 0.09],
  ["ev-02-transcript-ae", "d2.png", 1000, [0.5, 0.085], 0.11],
  ["ev-03-tor-ph", "d3.png", 1000, [0.5, 0.07], 0.12],
  ["ev-04-pharmacy-eg", "d4b.png", 1000, [0.5, 0.47], 0.1],
  ["ev-05-mba-uk", "d5.png", 1000, [0.5, 0.13], 0.08],
  ["ev-06-marksheet-in", "d6-forged.png", 1400, [0.5, 0.09], 0.11],
  ["ev-07-diploma-sg", "d7.png", 1000, [0.56, 0.5], 0.1],
  ["ev-08-mbbs-pk", "d8.png", 1000, [0.5, 0.33], 0.12],
];

// Deterministic PRNG so the fibres are the same on every run.
async function tint(input, W, H, a, b) {
  const g = await sharp(input).removeAlpha().greyscale().extractChannel(0).raw().toBuffer();
  const o = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) for (let c = 0; c < 3; c++) o[i * 3 + c] = Math.max(0, Math.min(255, Math.round(g[i] * a[c] + b[c])));
  return sharp(o, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
}
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function uvOverlay(W, H, [cx, cy], rf, seed, extra = "") {
  const r = rng(seed), cols = ["#8CFFC4", "#9AD8FF", "#FF9CC6", "#C9FF8C"];
  let fib = "";
  const n = Math.round((W * H) / 9000);
  for (let i = 0; i < n; i++) {
    const x = r() * W, y = r() * H, a = r() * Math.PI * 2, l = 6 + r() * 16, b = (r() - 0.5) * 10;
    const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l;
    fib += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} Q${((x + x2) / 2 + b).toFixed(1)} ${((y + y2) / 2 - b).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${cols[i % 4]}" stroke-width="${(0.7 + r() * 0.8).toFixed(2)}" fill="none" opacity="${(0.55 + r() * 0.45).toFixed(2)}"/>`;
  }
  const R = rf * W, X = cx * W, Y = cy * H;
  let ros = "";
  for (const [rr, amp, lobes] of [[R, R * 0.09, 28], [R * 0.72, R * 0.12, 18], [R * 0.45, R * 0.1, 12]]) {
    let d = "";
    for (let k = 0; k <= lobes * 12; k++) { const t = (k / (lobes * 12)) * Math.PI * 2, q = rr + amp * Math.sin(lobes * t); d += `${k ? "L" : "M"}${(X + q * Math.cos(t)).toFixed(1)} ${(Y + q * Math.sin(t)).toFixed(1)}`; }
    ros += `<path d="${d}Z" fill="none" stroke="#B8FF9A" stroke-width="${Math.max(1, W / 700).toFixed(2)}"/>`;
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs><filter id="g" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(W / 600).toFixed(2)}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<g filter="url(#g)">${fib}</g><g filter="url(#g)" opacity="0.85">${ros}</g>${extra}</svg>`);
}

(async () => {
  for (const [id, src, long, emb, rf] of DOCS) {
    const meta = await sharp(D + "/" + src).metadata();
    const land = meta.width >= meta.height;
    const W = land ? long : Math.round((long * meta.width) / meta.height);
    const H = land ? Math.round((long * meta.height) / meta.width) : long;
    const vis = await sharp(D + "/" + src).removeAlpha().resize(W, H).toBuffer();
    await sharp(vis).jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/${id}.jpg`);
    // Under 365 nm: security paper goes deep violet, ink near-black.
    const base = await tint(vis, W, H, [0.13, 0.086, 0.3], [10, 6, 22]);
    let extra = "";
    if (id === "ev-06-marksheet-in") {
      // Each alteration in `forge.cjs` shows its own way under 365 nm:
      //   scrape  abraded fibres fluoresce: a soft blue-white glow;
      //   wash    the solvent took the paper's brighteners: a dark halo with
      //           a bright tide line where it dried;
      //   slip    ordinary paper full of optical brightener glows white, and
      //           the glue at its edges glows brighter still.
      const k = W / 1792, f = (v) => (v * k).toFixed(1);
      extra = `<defs>
<filter id="p" x="-40%" y="-40%" width="180%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="${f(14)}"/><feGaussianBlur stdDeviation="${f(4)}"/></filter>
<filter id="w" x="-40%" y="-40%" width="180%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="${f(18)}"/><feGaussianBlur stdDeviation="${f(5)}"/></filter>
<filter id="t" x="-40%" y="-40%" width="180%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="${f(18)}"/><feGaussianBlur stdDeviation="${f(1.4)}"/></filter>
<filter id="s" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="${f(2.2)}"/></filter></defs>
<ellipse cx="${f(906)}" cy="${f(1196)}" rx="${f(40)}" ry="${f(25)}" fill="#D6E2FF" opacity="0.42" filter="url(#p)"/>
<ellipse cx="${f(906)}" cy="${f(1272)}" rx="${f(60)}" ry="${f(36)}" fill="#05030F" opacity="0.6" filter="url(#w)"/>
<ellipse cx="${f(906)}" cy="${f(1272)}" rx="${f(60)}" ry="${f(36)}" fill="none" stroke="#C9D8FF" stroke-width="${f(4)}" opacity="0.7" filter="url(#t)"/>
<rect x="${f(852)}" y="${f(1485)}" width="${f(104)}" height="${f(42)}" fill="#E6ECFF" opacity="0.5"/>
<rect x="${f(852)}" y="${f(1485)}" width="${f(104)}" height="${f(42)}" fill="none" stroke="#F4F7FF" stroke-width="${f(5)}" opacity="0.95" filter="url(#s)"/>`;
    }
    await sharp(base).composite([{ input: uvOverlay(W, H, emb, rf, id.length * 7919 + W, extra) }]).jpeg({ quality: 80, mozjpeg: true }).toFile(`${OUT}/${id}-uv.jpg`);
    console.log(id, W, H);
  }

  // Error-level heatmap of the forgery: the real edit mask, blurred, over a
  // dimmed greyscale of the sheet, plus the sheet's own high-frequency energy
  // as the faint blue floor an ELA pass always shows.
  const H = 1400, W = Math.round((1400 * 1792) / 2400);
  const grey = await sharp(D + "/d6-forged.png").removeAlpha().resize(W, H).greyscale().toBuffer();
  const dim = await tint(grey, W, H, [0.1, 0.11, 0.16], [6, 8, 18]);
  const hf = await sharp(grey).blur(1.2).toBuffer();
  const g = await sharp(grey).extractChannel(0).raw().toBuffer(), b = await sharp(hf).extractChannel(0).raw().toBuffer();
  const floor = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) { const e = Math.min(255, Math.abs(g[i] - b[i]) * 3); floor[i * 4] = 40; floor[i * 4 + 1] = 120; floor[i * 4 + 2] = 255; floor[i * 4 + 3] = Math.round(Math.min(255, e * 1.1)); }
  const floorPng = await sharp(floor, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  const m = await sharp(D + "/d6-mask.png").removeAlpha().resize(W, H).greyscale().extractChannel(0).blur(11).raw().toBuffer();
  const hot = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const v = m[i] / 255; if (v < 0.02) continue;
    const t = Math.min(1, v * 1.6);
    hot[i * 4] = 255; hot[i * 4 + 1] = Math.round(230 - 200 * t); hot[i * 4 + 2] = Math.round(60 - 60 * t); hot[i * 4 + 3] = Math.round(255 * Math.min(1, v * 2.2));
  }
  const hotPng = await sharp(hot, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  await sharp(dim).composite([{ input: floorPng }, { input: hotPng }]).jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/ev-06-marksheet-in-heat.jpg`);
  console.log("heat", W, H);
})();
