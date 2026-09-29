// Forges the Class XII marksheet the way a forger alters a genuine sheet,
// three ways, each leaving its own trace:
//
//   scrape  Mathematics 062 -> 092: the 6 scraped off (the paper there is
//           cloned in, a touch soft), a 9 typed on.
//   wash    Physics 058 -> 088: a solvent lifts the 5 and bleaches a halo of
//           the guilloche around it; an 8 is typed on.
//   slip    Total 415 -> 475: a slip of whiter paper printed "475" is glued
//           over the figure. The words ("FOUR HUNDRED FIFTEEN") are left.
//
// Writes d6-forged.png, one mask per technique (the UV pass draws each one
// differently) and their union (the heatmap). Coordinates are the 1792x2400
// render's, measured from the ink: middle digits x 895-913; rows y 1181-1212,
// 1258-1288, 1490-1520; figures column between rules at x 720 and 1088.
const sharp = require("sharp");
const D = process.argv[2];

const DIGIT = { x: 891, w: 27, h: 41 };
const MATHS = { y: 1176, base: 1212, digit: "9" };
const PHYS = { y: 1253, base: 1288, digit: "8" };
const WASH = { cx: 906, cy: 1272, rx: 60, ry: 36 };
const SLIP = { x: 852, y: 1485, w: 104, h: 42, base: 1520, text: "475" };

const svg = (W, H, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${body}</svg>`);
const typed = (W, H, x, base, text) =>
  sharp(svg(W, H, `<text x="${x}" y="${base + 1.5}" font-family="Menlo" font-size="40.5" fill="#1a1a1a">${text}</text>`)).blur(0.45).png().toBuffer();

(async () => {
  const src = sharp(D + "/d6.png");
  const { width: W, height: H } = await src.metadata();
  let img = await src.removeAlpha().png().toBuffer();

  // scrape: clone clean paper from right of the digits over the 6, type a 9.
  const clone = async (row) => sharp(img).extract({ left: DIGIT.x + 62, top: row.y, width: DIGIT.w, height: DIGIT.h }).blur(1.6).modulate({ brightness: 1.015 }).toBuffer();
  img = await sharp(img).composite([{ input: await clone(MATHS), left: DIGIT.x, top: MATHS.y }, { input: await typed(W, H, DIGIT.x + 3, MATHS.base, MATHS.digit), left: 0, top: 0 }]).png().toBuffer();

  // wash: a feathered, irregular halo where the guilloche fades and the paper
  // pales, then the same clone-and-type over the 5.
  const { cx, cy, rx, ry } = WASH;
  const halo = await sharp(img).extract({ left: cx - rx - 20, top: cy - ry - 20, width: 2 * rx + 40, height: 2 * ry + 40 })
    .modulate({ brightness: 1.07, saturation: 0.35 }).blur(0.8).ensureAlpha().toBuffer();
  const haloMask = await sharp(svg(2 * rx + 40, 2 * ry + 40,
    `<defs><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="18"/><feGaussianBlur stdDeviation="6"/></filter></defs><ellipse cx="${rx + 20}" cy="${ry + 20}" rx="${rx}" ry="${ry}" fill="#fff" filter="url(#f)"/>`)).png().toBuffer();
  const washed = await sharp(halo).composite([{ input: haloMask, blend: "dest-in" }]).png().toBuffer();
  img = await sharp(img).composite([{ input: washed, left: cx - rx - 20, top: cy - ry - 20 }]).png().toBuffer();
  img = await sharp(img).composite([{ input: await clone(PHYS), left: DIGIT.x, top: PHYS.y }, { input: await typed(W, H, DIGIT.x + 3, PHYS.base, PHYS.digit), left: 0, top: 0 }]).png().toBuffer();

  // slip: plain paper a shade paler than the sheet (221,229,229 beside it)
  // and without its guilloche, its own fine grain, the new total typed on it,
  // a faint hairline where its edge lifts.
  const { x, y, w, h } = SLIP;
  const grain = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) { const n = (Math.sin(i * 12.9898) * 43758.5453) % 1; const v = Math.round(Math.abs(n) * 5); grain[i * 3] = 229 + v; grain[i * 3 + 1] = 236 + v; grain[i * 3 + 2] = 235 + v; }
  const slipPaper = await sharp(grain, { raw: { width: w, height: h, channels: 3 } }).blur(0.5).png().toBuffer();
  const slipInk = await typed(W, H, 868, SLIP.base, SLIP.text);
  const edge = svg(W, H, `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" fill="none" stroke="#000" stroke-opacity="0.07" stroke-width="1"/><line x1="${x + 2}" y1="${y + h + 1}" x2="${x + w + 1}" y2="${y + h + 1}" stroke="#000" stroke-opacity="0.06" stroke-width="1.5"/><line x1="${x + w + 1}" y1="${y + 2}" x2="${x + w + 1}" y2="${y + h + 1}" stroke="#000" stroke-opacity="0.06" stroke-width="1.5"/>`);
  img = await sharp(img).composite([{ input: slipPaper, left: x, top: y }, { input: slipInk, left: 0, top: 0 }, { input: edge, left: 0, top: 0 }]).png().toBuffer();

  await sharp(img).toFile(D + "/d6-forged.png");

  const mask = (body) => sharp(svg(W, H, `<rect width="${W}" height="${H}" fill="black"/>${body}`)).png();
  const scrape = `<rect x="${DIGIT.x}" y="${MATHS.y}" width="${DIGIT.w}" height="${DIGIT.h}" fill="white"/>`;
  const wash = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="white"/>`;
  const slip = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="white"/>`;
  await mask(scrape).toFile(D + "/d6-mask-scrape.png");
  await mask(wash).toFile(D + "/d6-mask-wash.png");
  await mask(slip).toFile(D + "/d6-mask-slip.png");
  await mask(scrape + wash + slip).toFile(D + "/d6-mask.png");
  console.log("forged", W, H);
})();
