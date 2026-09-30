// Forges the other seven specimens on the evidence table, one trick each, the
// way `forge.cjs` forges the Class XII marksheet: the alteration is made in
// the scan's own pixels, so everything the case file says about it is true
// of the image. Coordinates are each 2400-long render's, measured from the
// ink with a row/column run scan.
//
//   d1  B.E. degree       name removed and retyped (someone else's degree,
//                         then colour-copied: the UV pass draws office paper)
//   d2  UAE transcript    Maths 64 -> 84, Physics 61 -> 81: a pen closes each
//                         6 into an 8 in a second, bluer ink
//   d3  PH transcript     Pharmacology 5.00 -> 2.00 under correction fluid
//   d4b Egypt pharmacy    the faculty seal is printed (a halftone), not stamped
//   d5  UK MBA            degree mill: the gold seal is a stationery sticker
//   d7  SG diploma        year tape-lifted, 2021 -> 2019; the serial still
//                         reads HP21
//   d8  PK MBBS           the Controller's signature traced over a pencil guide
//
// Writes dN-forged.png and dN-mask.png (what changed, for the heatmap) for
// each. Run: node forge-all.cjs <dir>
const sharp = require("sharp");
const D = process.argv[2];

const svg = (W, H, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${body}</svg>`);
const mask = (W, H, body) => sharp(svg(W, H, `<rect width="${W}" height="${H}" fill="black"/>${body}`)).png();
const text = (W, H, attrs, s) => sharp(svg(W, H, `<text ${attrs}>${s}</text>`)).png().toBuffer();

/** Paper to cover a box: a clean band of the same sheet, tiled (alternate
 *  tiles flipped so the seams do not repeat) and softened a touch. */
async function paper(img, band, box) {
  const strip = await sharp(img).extract(band).toBuffer();
  const flip = await sharp(strip).flip().toBuffer();
  const tiles = [];
  for (let y = 0, i = 0; y < box.height; y += band.height, i++) tiles.push({ input: i % 2 ? flip : strip, left: 0, top: y });
  const tall = await sharp({ create: { width: band.width, height: Math.ceil(box.height / band.height) * band.height, channels: 3, background: "#fff" } })
    .composite(tiles).png().toBuffer();
  return sharp(tall).extract({ left: 0, top: 0, width: box.width, height: box.height }).blur(0.8).toBuffer();
}

async function load(f) {
  const s = sharp(`${D}/${f}.png`);
  const { width: W, height: H } = await s.metadata();
  return { W, H, img: await s.removeAlpha().png().toBuffer() };
}
async function save(id, img, W, H, maskBody) {
  await sharp(img).toFile(`${D}/${id}-forged.png`);
  await mask(W, H, maskBody).toFile(`${D}/${id}-mask.png`);
  console.log("forged", id, W, H);
}

// d1: the holder's name, lifted and retyped a hair heavier, wider-spaced and
// 2px low, over paper cloned from the clear band beneath it.
async function d1() {
  let { W, H, img } = await load("d1");
  const box = { left: 962, top: 834, width: 484, height: 54 };
  const patch = await paper(img, { left: 962, top: 889, width: 484, height: 32 }, box);
  const name = await text(W, H, `x="1204" y="883.5" text-anchor="middle" font-family="Times New Roman" font-weight="bold" font-size="62" letter-spacing="1.6" fill="#141210"`, "PRANAV K. IYER");
  img = await sharp(img).composite([{ input: patch, left: box.left, top: box.top }, { input: await sharp(name).blur(0.5).toBuffer(), left: 0, top: 0 }]).png().toBuffer();
  await save("d1", img, W, H, `<rect x="962" y="834" width="484" height="54" fill="white"/>`);
}

// d2: each 6 closed into an 8 — the upper loop's right side redrawn in a
// bluer, slightly heavier ink. Visible ink is near-black either way.
async function d2() {
  let { W, H, img } = await load("d2");
  const pen = async (b) => {
    const g = await sharp(img).extract(b).greyscale().raw().toBuffer();
    const o = Buffer.alloc(b.width * b.height * 4);
    for (let i = 0; i < b.width * b.height; i++) {
      const a = Math.max(0, Math.min(1, (190 - g[i]) / 120));
      o[i * 4] = 34; o[i * 4 + 1] = 44; o[i * 4 + 2] = 96; o[i * 4 + 3] = Math.round(255 * Math.min(1, a * 1.5));
    }
    return sharp(o, { raw: { width: b.width, height: b.height, channels: 4 } }).blur(1).png().toBuffer();
  };
  const m = { left: 1386, top: 1258, width: 14, height: 19 };
  const p = { left: 1387, top: 1365, width: 14, height: 19 };
  img = await sharp(img).composite([{ input: await pen(m), left: m.left, top: m.top }, { input: await pen(p), left: p.left, top: p.top }]).png().toBuffer();
  await save("d2", img, W, H, `<rect x="1384" y="1256" width="18" height="23" fill="white"/><rect x="1385" y="1363" width="18" height="23" fill="white"/>`);
}

// d3: a blob of correction fluid over the first digit, a shade whiter than
// the green security paper, faintly raised; a 2 typed on it, a size larger
// and a degree off true.
async function d3() {
  let { W, H, img } = await load("d3");
  const blob = svg(W, H, `<defs><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="11"/><feDisplacementMap in="SourceGraphic" scale="7"/><feGaussianBlur stdDeviation="1.1"/></filter></defs>
<ellipse cx="1327" cy="1379" rx="18" ry="21" fill="#000" opacity="0.12" filter="url(#f)" transform="translate(1.5 1.5)"/>
<ellipse cx="1325" cy="1378" rx="18" ry="21" fill="#F3F6EF" filter="url(#f)"/>`);
  const two = await text(W, H, `x="1314" y="1393" font-family="Times New Roman" font-size="45" fill="#1e1e1e" transform="rotate(1.2 1325 1378)"`, "2");
  img = await sharp(img).composite([{ input: blob, left: 0, top: 0 }, { input: await sharp(two).blur(0.4).toBuffer(), left: 0, top: 0 }]).png().toBuffer();
  await save("d3", img, W, H, `<ellipse cx="1325" cy="1378" rx="22" ry="25" fill="white"/>`);
}

// d4b: the faculty seal's ink re-screened as a printer's halftone: one flat
// violet laid down in dots, where a rubber stamp pools and fades.
async function d4b() {
  let { W, H, img } = await load("d4b");
  const b = { left: 812, top: 1236, width: 332, height: 332 }, cx = 977 - b.left, cy = 1401 - b.top, R = 162;
  const px = await sharp(img).extract(b).raw().toBuffer();
  const out = Buffer.from(px);
  const P = 6.5, cos = Math.cos(Math.PI / 4), sin = Math.sin(Math.PI / 4);
  for (let y = 0; y < b.height; y++) for (let x = 0; x < b.width; x++) {
    if ((x - cx) ** 2 + (y - cy) ** 2 > R * R) continue;
    const i = (y * b.width + x) * 3, r = px[i], g = px[i + 1], bl = px[i + 2];
    const violet = r - g > 18 && bl - g > 28 && r > 60;
    if (!violet) continue;
    const cover = Math.max(0, Math.min(0.85, (240 - g) / 130));
    const u = (x * cos + y * sin) / P, v = (-x * sin + y * cos) / P;
    const screen = (Math.cos(2 * Math.PI * u) * Math.cos(2 * Math.PI * v) + 1) / 2;
    const on = screen < cover;
    const paperC = [238, 230, 208], ink = [98, 66, 150];
    const c = on ? ink : paperC;
    out[i] = c[0]; out[i + 1] = c[1]; out[i + 2] = c[2];
  }
  const seal = await sharp(out, { raw: { width: b.width, height: b.height, channels: 3 } }).blur(0.55).png().toBuffer();
  img = await sharp(img).composite([{ input: seal, left: b.left, top: b.top }]).png().toBuffer();
  await save("d4b", img, W, H, `<circle cx="977" cy="1401" r="162" fill="white"/>`);
}

// d5: the gold seal is a foil sticker. The scan shows only a hairline where
// its edge lifts; the UV pass shows the adhesive.
async function d5() {
  let { W, H, img } = await load("d5");
  const edge = svg(W, H, `<circle cx="1191" cy="1542" r="175" fill="none" stroke="#000" stroke-opacity="0.08" stroke-width="2.2"/><path d="M1080 1680 A175 175 0 0 0 1340 1640" fill="none" stroke="#000" stroke-opacity="0.07" stroke-width="3"/>`);
  img = await sharp(img).composite([{ input: await sharp(edge).blur(0.9).toBuffer(), left: 0, top: 0 }]).png().toBuffer();
  await save("d5", img, W, H, `<circle cx="1190" cy="1540" r="178" fill="white"/>`);
}

// d7: the year lifted with tape and reprinted — "19" a hair heavier and 2px
// low in a faint scuff of roughened paper. The serial beside the seal is
// the genuine one, HP21.
async function d7() {
  let { W, H, img } = await load("d7");
  const white = (w, h) => sharp({ create: { width: w, height: h, channels: 3, background: "#FDFDFD" } }).png().toBuffer();
  const scuffN = 70 * 66, sc = Buffer.alloc(scuffN * 4);
  for (let i = 0; i < scuffN; i++) { const n = Math.abs((Math.sin(i * 78.233) * 43758.5453) % 1); const x = (i % 70) / 35 - 1, y = Math.floor(i / 70) / 33 - 1, fall = Math.max(0, 1 - Math.hypot(x, y)); sc[i * 4] = sc[i * 4 + 1] = sc[i * 4 + 2] = 150; sc[i * 4 + 3] = Math.round(n * 12 * fall); }
  const scuff = await sharp(sc, { raw: { width: 70, height: 66, channels: 4 } }).blur(0.9).png().toBuffer();
  const year = await text(W, H, `transform="translate(450.5 1108) scale(0.92 1)" font-family="Arial" font-size="49" fill="#111" stroke="#111" stroke-width="0.6"`, "19");
  const serial = await text(W, H, `transform="translate(2025 1646.5) scale(0.92 1)" font-family="Arial" font-size="30.5" fill="#1a1a1a"`, "21");
  img = await sharp(img).composite([
    { input: await white(52, 56), left: 450, top: 1066 },
    { input: scuff, left: 441, top: 1061 },
    { input: await sharp(year).blur(0.45).toBuffer(), left: 0, top: 0 },
    { input: await white(30, 28), left: 2025, top: 1622 },
    { input: await sharp(serial).blur(0.35).toBuffer(), left: 0, top: 0 },
  ]).png().toBuffer();
  await save("d7", img, W, H, `<rect x="441" y="1061" width="70" height="66" fill="white"/>`);
}

// d8: the Controller's signature traced — the original shape, drawn slowly:
// a tremor along every stroke, blunt heavier ends, and the pencil guide it
// followed left a few pixels off.
async function d8() {
  let { W, H, img } = await load("d8");
  const b = { left: 1136, top: 1940, width: 400, height: 108 };
  const g = await sharp(img).extract(b).greyscale().raw().toBuffer();
  const alpha = (lo, hi) => { const o = Buffer.alloc(b.width * b.height * 4); for (let i = 0; i < b.width * b.height; i++) { const a = Math.max(0, Math.min(1, (lo - g[i]) / hi)); o[i * 4 + 3] = Math.round(255 * a); } return o; };
  const inkPng = await sharp(alpha(170, 120), { raw: { width: b.width, height: b.height, channels: 4 } }).png().toBuffer();
  const uri = `data:image/png;base64,${inkPng.toString("base64")}`;
  const defs = `<defs><filter id="t" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="1" seed="5"/><feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G" /></filter>
<filter id="p"><feGaussianBlur stdDeviation="0.7"/></filter></defs>`;
  // The pencil is grey and the ink blue-black: colour each layer by rendering
  // it separately.
  const layer = async (body, rgb) => {
    const a = await sharp(svg(b.width, b.height, body)).ensureAlpha().extractChannel(3).raw().toBuffer();
    const o = Buffer.alloc(b.width * b.height * 4);
    for (let i = 0; i < b.width * b.height; i++) { o[i * 4] = rgb[0]; o[i * 4 + 1] = rgb[1]; o[i * 4 + 2] = rgb[2]; o[i * 4 + 3] = a[i]; }
    return sharp(o, { raw: { width: b.width, height: b.height, channels: 4 } }).png().toBuffer();
  };
  const pencil = await layer(`${defs}<g filter="url(#p)" opacity="0.3" transform="translate(4 3)"><image href="${uri}" width="${b.width}" height="${b.height}"/></g>`, [120, 120, 118]);
  const ink = await layer(`${defs}<g filter="url(#t)"><image href="${uri}" width="${b.width}" height="${b.height}"/></g>`, [22, 22, 34]);
  const patch = await paper(img, { left: b.left, top: 1820, width: b.width, height: 90 }, { width: b.width, height: b.height });
  // The signature line runs through the box (y 2039-2042): put the sheet's
  // own strip back over it, so the rule is printed, not traced.
  const rule = await sharp(img).extract({ left: b.left, top: 2037, width: b.width, height: 7 }).toBuffer();
  img = await sharp(img).composite([{ input: patch, left: b.left, top: b.top }, { input: pencil, left: b.left, top: b.top }, { input: ink, left: b.left, top: b.top }, { input: rule, left: b.left, top: 2037 }]).png().toBuffer();
  await save("d8", img, W, H, `<rect x="1140" y="1950" width="394" height="100" fill="white"/>`);
}

(async () => {
  for (const f of [d1, d2, d3, d4b, d5, d7, d8]) await f();
})();
