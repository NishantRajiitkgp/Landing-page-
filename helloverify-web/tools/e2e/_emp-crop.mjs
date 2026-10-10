import sharp from "sharp";

const [file, ...cuts] = process.argv.slice(2);
const meta = await sharp(file).metadata();
const step = Number(cuts[0] ?? 1400);
for (let y = 0, i = 0; y < meta.height; y += step, i++) {
  const h = Math.min(step, meta.height - y);
  await sharp(file).extract({ left: 0, top: y, width: meta.width, height: h }).toFile(file.replace(".png", `-c${i}.png`));
}
console.log(meta.width, meta.height);
