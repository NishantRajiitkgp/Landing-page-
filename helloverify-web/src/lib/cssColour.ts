/** A palette token's computed value -> 8-bit sRGB, for the canvas drawings
 *  that read their colours from CSS (`globeDraw`, `trustNetworkSim`,
 *  `enWave`, `fieldWorld`, `relayWorld`).
 *
 *  A custom property computes to its declared text, and the brand shades are
 *  declared as `color-mix(…)` of `--primary` (`app/design.css`, "BRAND
 *  COLOUR"), which no hand parser keeps up with. So hex and `rgb()` are read
 *  directly and anything else is painted on a 1×1 canvas and read back: the
 *  browser resolves it exactly as the stylesheet does. Browser only; without
 *  a document a non-hex value reads as black. */
export type RGB = [number, number, number];

let probe: CanvasRenderingContext2D | null | undefined;

export function cssRgb(value: string): RGB {
  const s = value.trim();
  // The build minifies `#FFFFFF` to `#fff`, so the short form arrives too.
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1];
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(s);
  if (rgb) return [+rgb[1], +rgb[2], +rgb[3]];

  if (probe === undefined) {
    probe = typeof document === "undefined"
      ? null
      : document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  }
  if (!probe || !s) return [0, 0, 0];
  probe.clearRect(0, 0, 1, 1);
  // Reset first: an unparseable value leaves `fillStyle` unchanged.
  probe.fillStyle = "transparent";
  probe.fillStyle = s;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}
