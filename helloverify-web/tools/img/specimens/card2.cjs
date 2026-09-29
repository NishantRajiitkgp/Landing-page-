// Cuts the licence card off the scanner bed with its rounded corners and
// centres it on a transparent 470:300 canvas, so the stage's drop shadow
// follows the card. Edges measured from luminance steps across the middle
// row and column of the 29 Sep 2026 render (bed -> card).
const sharp = require("sharp");
const [src, out] = process.argv.slice(2);
(async () => {
  const l = 121, t = 80, r = 2440, b = 1592, rad = 58;
  const w = r - l, h = b - t;
  const rgb = await sharp(src).removeAlpha().extract({ left: l, top: t, width: w, height: h }).raw().toBuffer();
  // The alpha channel, drawn explicitly: 255 inside the rounded rectangle.
  const alpha = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${rad}" fill="#fff"/></svg>`))
    .extractChannel(3).raw().toBuffer();
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) { rgba[i * 4] = rgb[i * 3]; rgba[i * 4 + 1] = rgb[i * 3 + 1]; rgba[i * 4 + 2] = rgb[i * 3 + 2]; rgba[i * 4 + 3] = alpha[i]; }
  const OW = 1100, OH = Math.round((1100 * 300) / 470), s = OH / h, cw = Math.round(w * s);
  const card = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).resize(cw, OH).png().toBuffer();
  await sharp({ create: { width: OW, height: OH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } } })
    .composite([{ input: card, left: Math.round((OW - cw) / 2), top: 0 }])
    .webp({ quality: 86, alphaQuality: 100 }).toFile(out);
  console.log({ w, h, aspect: (w / h).toFixed(3), cw, left: Math.round((OW - cw) / 2), s: s.toFixed(5) });
})();
