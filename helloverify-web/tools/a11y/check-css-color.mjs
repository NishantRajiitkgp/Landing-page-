/** Colour literals in the STYLESHEETS (BUILD-SPEC §17 condition 21, §12, §14.2;
 *  DESIGN.md §2.1).
 *
 *  THE HOLE THIS FILLS, stated as the defect that got through it. `#7D796F`
 *  sat in `src/app/design.css` and `src/app/pages.css` at **3.95:1** against
 *  1.4.3's 4.5:1, on the placeholder text of the REAL contact form, and shipped.
 *  Three gates missed it, each by construction rather than by accident:
 *
 *    - `hv/no-color-literal` (`tools/eslint/no-color-literal.mjs`) is an ESLint
 *      rule. It reads TypeScript. It cannot see a stylesheet.
 *    - `check:tokens` (`tools/ci/check-tokens.mjs`) DID read files as text, and
 *      Part 4 deleted it as redundant with that ESLint rule. That is where the
 *      coverage was lost. Part 4 kept `check:logical` for exactly this reason —
 *      "it reads the stylesheets, which ESLint cannot" — and simply did not
 *      apply the same reasoning to colour.
 *    - `check:contrast` (`tools/a11y/check-contrast.mjs`) walks the TOKEN TABLE
 *      and matches `color: var(--x)`. A colour that is not a token, or a token
 *      written longhand, is invisible to it. So is `color: rgba(…)`.
 *
 *  So this gate reads the same bytes `check:logical` reads, for colour instead
 *  of for direction. `check-logical-css.mjs` is its model: source stylesheets,
 *  not build output — the place to catch a hex is where it was typed.
 *
 *  ── WHAT WAS MEASURED BEFORE DECIDING WHAT TO FAIL ON (22 Sep 2026) ─────────
 *
 *  TASKS.md put the number at "roughly 264" (228 in `design.css`, 36 in
 *  `pages.css`), which counted hex only. Re-measured: **267 hex and 175 in
 *  functional notation, 442 in all** — `rgba()` was more than a third of the
 *  colour in these files and no gate had ever counted it.
 *
 *  Flagging 442 things produces a gate somebody switches off, so they were
 *  classified before anything was decided. Normalising `rgba(…)` to
 *  `#RRGGBBAA` is what made that possible, and it moved the headline result:
 *
 *    | class                                            | count |
 *    |--------------------------------------------------|------:|
 *    | inside a comment — blanked, not scanned          |    11 |
 *    | `:root` custom-property declarations             |    19 |
 *    | token value written longhand, TEXT property      |    44 |
 *    | token value + an alpha, TEXT property            |    23 |
 *    | token value written longhand, surface            |   141 |
 *    | token value + an alpha, surface                  |   128 |
 *    | NOT a token, surface (near-ink, gradients, …)    |    76 |
 *    | **NOT a token, TEXT property**                   | **0** |
 *
 *  The last row is the point. `#7D796F`'s class is EMPTY: every text colour in
 *  these stylesheets resolves to a declared token — 67 of them written longhand
 *  rather than as `var(--x)`, but none of them off-palette. So the gate's one
 *  zero-tolerance rule is a rule the code passes today, and 442 literals produce
 *  **0 failures**, not 442.
 *
 *  The honest reading of the other rows: **336 of the 442 are a token value
 *  written longhand**, which is the same duplication Part 3 removed from
 *  `src/**\/*.tsx`. They are real, they are not contrast failures, and they are
 *  recorded with counts rather than failed — see below.
 *
 *  ── THE THREE RULES ────────────────────────────────────────────────────────
 *
 *  1. **A text colour must resolve to a declared token.** Hard, zero tolerance,
 *     no exemption list — this is `#7D796F` exactly. The message carries the
 *     measured ratio against `--paper`, `--white` and `--ink`, because "not a
 *     token" is a tidiness complaint and "3.95:1 where 4.5:1 is required" is
 *     the reason anyone should care.
 *
 *  2. **A colour that is not in BASELINE fails.** A new literal — any property,
 *     any value — is a design decision, so it has to be written down. This is
 *     the same device as `ACCEPTED` in `check-contrast.mjs`: an entry is visible
 *     in the diff and carries a number.
 *
 *  3. **A BASELINE group may not grow.** `#FFFFFF` is 68 surface uses today; the
 *     69th fails with "use var(--white)". So the 336 longhand uses are recorded
 *     debt that cannot spread, rather than 336 red lines.
 *
 *  Under-count is NOT a failure, it prints "lower it to N". A gate that fails on
 *  an improvement is the definition of one that gets disabled — and lowering the
 *  number is then a one-line diff that ratchets the tolerance down for good.
 *
 *  ── WHY THE 336 LONGHAND USES ARE NOT FIXED HERE ───────────────────────────
 *
 *  `color: #FFFFFF` → `color: var(--white)` is mechanical, and it is the same
 *  duplication Part 3 removed from `src/**\/*.tsx` (#FFFFFF ×81, #1B6B4A ×40).
 *  It is left because `design.css` is regenerated from `design-src/artboards/`
 *  by `tools/port/build-css.py`, whose inputs are present and git-tracked
 *  (measured 22 Sep) — so a rewrite of the output that is not also a rewrite of
 *  the nine boards is one `python` invocation from being undone, silently. That
 *  is a stylesheet+artboard change with its own diff, not a tooling change.
 *  Rule 3 holds the line until someone does it.
 *
 *  ── TWO THINGS THE PARSER HAS TO DO, BOTH FOUND BY MEASURING ───────────────
 *
 *  - **Blank the comments.** 11 of the remaining literals are inside the WHY
 *    comments that record their own removal — `#7D796F` ×4 and `#A29E94` ×3
 *    among them. A gate reading raw text fails on its own documentation, and
 *    the obvious "fix" is to delete the reasoning. Comments are blanked
 *    character-for-character so line numbers stay true.
 *  - **Blank `url(…)`.** `select.inp`'s chevron is an inline SVG data URI
 *    carrying `stroke='%236F6B62'`. That IS `--muted`, and `var()` cannot
 *    resolve inside a data URI, so it can never be tokenised — the same
 *    exemption Part 3 gave SVG artwork, for the same reason. It currently
 *    removes ZERO literals, and that is worth stating rather than leaving as
 *    implied coverage: the colour is percent-encoded (`%236F6B62`), so a `#`
 *    regex never saw it. The blanking is there for the day someone writes an
 *    unencoded `#` in a data URI, which is legal in a single-quoted attribute.
 *
 *  ── THE ARTBOARDS ARE SCANNED TOO, AND CAPPED RATHER THAN CLEAN ────────────
 *
 *  `design.css` carries a "generated, do not hand-edit" header, and TASKS.md's
 *  open questions record that regenerating it would reintroduce `#7D796F` with
 *  **no gate catching it**. This is that gate. The nine boards are the
 *  generator's input, not shipped bytes, so a literal there is a latent hazard
 *  and not a live defect: rule 1 is reported over them and capped at the 9 that
 *  exist (`color: #7D796F` on `.inp`, one per board) rather than failed. Every
 *  other text colour in all nine boards already resolves to a token — measured:
 *  110 `#FFFFFF`, 81 `#CFCAC0`, 81 `#1B6B4A`, 26 `#6F6B62`, 16 `#3D3B35`, 14
 *  `#15140F`, and those 9. Fix the boards and the cap goes to 0.
 *
 *  REJECTED: a full CSS parser (postcss). It would resolve `@media` nesting and
 *  shorthand expansion properly, but this file has to run in `check:all` before
 *  anything is built, and every other gate in `tools/` is a regex over source
 *  for the same reason. The one thing a parser would buy — knowing which
 *  background a translucent text colour composites against — needs layout, not
 *  a parser, and that is `tools/e2e/a11y.spec.ts`'s job.
 *
 *  Run any time; it needs no build:
 *      node tools/a11y/check-css-color.mjs
 *      node tools/a11y/check-css-color.mjs --census   # print BASELINE afresh
 */
import { readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);
const CENSUS = process.argv.includes("--census");

/** Shipped stylesheets. Rule 1 is fatal here. */
const SHEETS = ["src/app/design.css", "src/app/pages.css", "src/app/inner.css", "src/app/globals.css"];
/** Homepage v2: one hand-written sheet per section in `src/app/v2/`, read as a
 *  directory so a new section cannot ship a stylesheet this gate never sees. */
SHEETS.push(
  ...readdirSync(new URL("src/app/v2/", root)).filter((f) => f.endsWith(".css")).sort().map((f) => `src/app/v2/${f}`),
);

/** The generator's inputs (`tools/port/build-css.py`). Rule 1 is reported and
 *  capped here — see the header. */
const BOARDS = [
  "design-src/artboards/Main.dc.html",
  "design-src/artboards/Desktop2.dc.html",
  "design-src/artboards/Desktop3.dc.html",
  "design-src/artboards/Desktop4.dc.html",
  "design-src/artboards/Mobile.dc.html",
  "design-src/artboards/Mobile2.dc.html",
  "design-src/artboards/Mobile3.dc.html",
  "design-src/artboards/Mobile4.dc.html",
  "design-src/artboards/Mobile5.dc.html",
];

/** Properties whose value IS text, so WCAG 2.2 AA 1.4.3 applies to it.
 *  `background`/`border`/`box-shadow` are non-text contrast (1.4.11), which
 *  needs layout and is not this gate's business. */
const TEXT_PROPS = new Set([
  "color",
  "-webkit-text-fill-color",
  "-webkit-text-stroke-color",
  "caret-color",
  "text-decoration-color",
  "text-emphasis-color",
]);

/** Latent non-token text colours in the artboards. **EMPTY, and it has to stay
 *  that way.**
 *
 *  It held one entry for a few hours on 22 Sep 2026: `color: #7D796F` on
 *  `.inp`, once per board, 3.95:1 on `--paper` where AA needs 4.5:1. The
 *  shipped stylesheets were fixed that morning and the boards were not, so
 *  `python tools/port/build-css.py` would have reintroduced the failure — this
 *  gate existing is what made that loud instead of silent, and it is the reason
 *  the boards were then fixed too (all nine now read `var(--muted)`, CRLF
 *  preserved, verified byte-level).
 *
 *  So the count is 0 and an entry here is a REGRESSION, not a tolerance. The
 *  same device as `ACCEPTED` in `check-contrast.mjs`, which is also empty and
 *  for the same reason: a satisfied entry reads as a live exception and would
 *  excuse the colour coming back. Adding one is a decision that belongs in a
 *  diff with a measurement beside it. */
const BOARD_CAP = {};

// ───────────────────────────────────────────────────── colour normalisation
/** `#abc` → `#AABBCC`, `rgba(255,255,255,.6)` → `#FFFFFF99`. Normalising the
 *  functional forms to hex is what let the census compare them against the
 *  token table at all: every translucent text colour in these sheets turned out
 *  to be a token value with an alpha, not an off-palette colour. */
function normalise(raw) {
  const s = raw.trim();
  if (s[0] === "#") {
    const h = s.slice(1).toUpperCase();
    if (h.length === 3 || h.length === 4) return "#" + [...h].map((c) => c + c).join("");
    return "#" + h;
  }
  const fn = s.match(/^(rgba?|hsla?)\(([^)]*)\)$/i);
  if (!fn) return null;
  const parts = fn[2].split(/[\s,/]+/).filter(Boolean);
  const num = (t) => (t.endsWith("%") ? Number(t.slice(0, -1)) / 100 : Number(t));
  const byte = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).toUpperCase().padStart(2, "0");
  let rgb;
  if (fn[1].toLowerCase().startsWith("rgb")) {
    if (parts.length < 3) return null;
    rgb = parts.slice(0, 3).map((t) => (t.endsWith("%") ? num(t) * 255 : Number(t)));
  } else {
    if (parts.length < 3) return null;
    const [h, sl, l] = [Number(parts[0].replace(/deg$/, "")), num(parts[1]), num(parts[2])];
    const c = (1 - Math.abs(2 * l - 1)) * sl;
    const x = c * (1 - Math.abs((((h / 60) % 2) + 2) % 2 - 1));
    const m = l - c / 2;
    const seg = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor((((h % 360) + 360) % 360) / 60)];
    rgb = seg.map((v) => (v + m) * 255);
  }
  if (rgb.some((v) => !Number.isFinite(v))) return null;
  const hex = "#" + rgb.map(byte).join("");
  const a = parts.length > 3 ? num(parts[3]) : 1;
  return a >= 1 ? hex : hex + byte(a * 255);
}

const base = (c) => c.slice(0, 7);
const alpha = (c) => c.length > 7;

// ───────────────────────────────────────────────────── contrast, for the message
const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
function luminance(hex) {
  const n = parseInt(hex.slice(1, 7), 16);
  return 0.2126 * srgb((n >> 16) & 255) + 0.7152 * srgb((n >> 8) & 255) + 0.0722 * srgb(n & 255);
}
function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// ───────────────────────────────────────────────────── the scan
/** Replace a match with the same number of bytes of space, keeping newlines, so
 *  every reported line number is the line in the real file. */
const blank = (m) => m.replace(/[^\n]/g, " ");
const strip = (text) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/url\((?:"[^"]*"|'[^']*'|[^)]*)\)/g, blank);

const LITERAL = /#[0-9A-Fa-f]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)/g;

async function scan(files, palette = null) {
  const found = [];
  const tokens = new Map(); // normalised value -> token name(s)
  const texts = [];
  for (const file of files) {
    const raw = await readFile(new URL(file, root), "utf8").catch(() => null);
    if (raw === null) continue;
    texts.push([file, strip(raw)]);
  }
  for (const [, css] of texts) {
    for (const m of css.matchAll(/--([a-z][a-z0-9-]*)\s*:\s*(#[0-9A-Fa-f]{3,8}\b|(?:rgba?|hsla?)\([^)]*\))/g)) {
      const v = normalise(m[2]);
      if (!v) continue;
      if (!tokens.has(v)) tokens.set(v, new Set());
      tokens.get(v).add(m[1]);
    }
  }
  /** The artboards are measured against the SHIPPED palette, not their own
   *  `:root`. Their `:root` pre-dates Part 3's four added tokens (--white,
   *  --green-light, --tick-off, --ink-soft), so scoring them against themselves
   *  reports 220 "non-token" text colours, 219 of which are current palette
   *  values the boards simply spell out. The question that matters is the one
   *  regeneration would answer: would it write a text colour the palette does
   *  not contain? Measured that way the answer is one colour, #7D796F. */
  const lookup = palette ?? tokens;
  for (const [file, css] of texts) {
    for (const m of css.matchAll(LITERAL)) {
      const value = normalise(m[0]);
      if (!value) continue;
      // The declaration this literal sits in: back up to the last delimiter.
      const cut = Math.max(css.lastIndexOf(";", m.index), css.lastIndexOf("{", m.index), css.lastIndexOf("}", m.index)) + 1;
      const head = css.slice(cut, m.index);
      const prop = head.match(/^\s*(--[a-z][a-z0-9-]*|[-a-zA-Z]+)\s*:/)?.[1] ?? "?";
      const cls = prop.startsWith("--") ? "decl" : TEXT_PROPS.has(prop) ? "text" : "surface";
      found.push({
        file,
        line: css.slice(0, m.index).split("\n").length,
        raw: m[0],
        value,
        prop,
        cls,
        token: lookup.get(base(value)) ? [...lookup.get(base(value))][0] : null,
      });
    }
  }
  return { found, tokens };
}

const { found, tokens } = await scan(SHEETS);
const boards = (await scan(BOARDS, tokens)).found;

/** Group key: one line of BASELINE.
 *
 *  `surface` groups every non-text property together on purpose — the
 *  distinction 1.4.3 cares about is text or not text, and a per-property table
 *  would be 40 rows of noise.
 *
 *  Alpha is collapsed to a `+a` flag rather than kept. Keeping it made the table
 *  90 rows: --ink appears at 12 different alphas in surfaces, --green at 11,
 *  --white at 11. Worse, the rows were rounding-sensitive — `rgba(…,0.28)`
 *  normalises to `47` and a hand-edit to `0.29` would fail the gate for no
 *  reason. What the gate is checking is whether the colour came from the
 *  palette, and that does not depend on the alpha. */
const keyOf = (e) => `${e.cls} ${base(e.value)}${alpha(e.value) ? "+a" : ""}`;

const groups = new Map();
for (const e of found) {
  if (!groups.has(keyOf(e))) groups.set(keyOf(e), []);
  groups.get(keyOf(e)).push(e);
}

/** Recorded state of the two stylesheets, measured 22 Sep 2026. Every entry is
 *  a colour that is already there; rule 2 makes a new one fail and rule 3 stops
 *  an old one spreading. `t` names the token whose value it is, where there is
 *  one — that is the `var(--t)` the declaration should have been. */
const BASELINE = {
  // ── the palette itself. These MUST be literals; `:root` is where colour is
  //    allowed to be a number. Two of each because design.css keeps the desktop
  //    and mobile boards in disjoint media queries (see its own header).
  "decl #15140F": { n: 2, t: "ink" },
  "decl #1B6B4A": { n: 2, t: "green" },
  "decl #3D3B35": { n: 2, t: "ink-soft" },
  "decl #6F6B62": { n: 2, t: "muted" },
  "decl #8FD3B3": { n: 2, t: "green-light" },
  "decl #CFCAC0": { n: 2, t: "tick-off" },
  "decl #E3DFD6": { n: 2, t: "hair" },
  "decl #EC2E21": { n: 1, t: "red" },
  "decl #F6F4EF": { n: 2, t: "paper" },
  "decl #FFFFFF": { n: 2, t: "white" },

  // ── homepage v2 (`src/app/v2.css`, Sep 2026): paper tints declared once as
  //    `--v2-*` tokens so the rules below them carry no literal. Every one is a
  //    SURFACE — the guilloche frame line, the door's paper and its shading,
  //    the mint of an opened doorway, the kicker's dashed hairline — and none
  //    is ever a text colour, which is why they are tints and not palette.
  "decl #DAD4C8": { n: 1, why: "--v2-frame: the security-print frame line on the hero" },
  "decl #FBFAF6": { n: 1, why: "--v2-paper-hi: the lit top of a door's paper" },
  "decl #EFEBE3": { n: 1, why: "--v2-paper-lo: the shaded foot of a door's paper" },
  "decl #FAF8F3": { n: 1, why: "--v2-leaf-mid: a door leaf's shading, mid-stop" },
  "decl #F1EEE6": { n: 1, why: "--v2-leaf-lo: a door leaf's shading at the free edge" },
  "decl #F4FAF6": { n: 1, why: "--v2-mint-pale: the outer glow of an opened doorway" },
  "decl #BDB7AB": { n: 1, why: "--v2-dash: the hero kicker's fading hairlines" },

  // ── homepage v2 · "Why governments" deck (`src/app/v2/why.css`): each card's
  //    accent and the deep stop of its illustration tint (the light stop is
  //    derived with color-mix). Surfaces only — small accent text reads a mix
  //    of the accent with --ink that clears 4.5:1, never these directly.
  "decl #2F6FB5": { n: 1, why: "--v2-wy-sky: the immigration card's accent" },
  "decl #A77A2E": { n: 1, why: "--v2-wy-sand: the manpower & education card's accent" },
  "decl #6B54A8": { n: 1, why: "--v2-wy-lilac: the business & trade card's accent" },
  "decl #C2463B": { n: 1, why: "--v2-wy-rose: the fraud-alerts card's accent" },
  "decl #1F7A6D": { n: 1, why: "--v2-wy-teal: the dashboards card's accent" },
  "decl #3F5F8F": { n: 1, why: "--v2-wy-slate: the integration card's accent" },
  "decl #E2F2E9": { n: 1, why: "--v2-wy-mint-t: the health card's illustration tint" },
  "decl #E1ECF8": { n: 1, why: "--v2-wy-sky-t: the immigration card's illustration tint" },
  "decl #F2E8D6": { n: 1, why: "--v2-wy-sand-t: the manpower card's illustration tint" },
  "decl #EAE3F5": { n: 1, why: "--v2-wy-lilac-t: the business & trade card's illustration tint" },
  "decl #F7E3E0": { n: 1, why: "--v2-wy-rose-t: the fraud-alerts card's illustration tint" },
  "decl #DFF0EC": { n: 1, why: "--v2-wy-teal-t: the dashboards card's illustration tint" },
  "decl #E2E8F0": { n: 1, why: "--v2-wy-slate-t: the integration card's illustration tint" },
  // ── homepage v2 · Numbers (`src/app/v2/numbers.css`). A surface, never text.
  // Declared by two v2 sheets (numbers.css, how.css) — merged into one row so
  // the object has no duplicate key (a JS literal keeps only the last one).
  "decl #EDE9E0": { n: 2, why: "--v2-nm-track and --v2-hw-rail: an empty groove/track, a step lighter than --hair" },

  // ── homepage v2 · Presence, follow the sun (`src/app/v2/presence.css`).
  //    Read at runtime by the canvas painter (`sections/sunPaint.ts`) so no
  //    colour is typed in TS. Every one is canvas artwork: the sun, its
  //    light and the night side. None is CSS text.
  "decl #FFD682": { n: 1, why: "--v2-su-glow: the warm daylight wash round the sun" },
  "decl #FFC450": { n: 1, why: "--v2-su-sun: the sun's halo" },
  "decl #FFE6A3": { n: 1, why: "--v2-su-core-hi: the sun disc's lit edge, and the wash's outer stop" },
  "decl #F2A92E": { n: 1, why: "--v2-su-core-lo: the sun disc's shaded edge" },
  "decl #D69628": { n: 1, why: "--v2-su-amber: the sun's rays and the dashed noon meridian" },
  "decl #B07014": { n: 1, why: "--v2-su-amber-ink: the NOON label drawn on the canvas" },
  "decl #2C3A54": { n: 1, why: "--v2-su-night: the night side, the midnight meridian and its label" },
  "decl #787C8C": { n: 1, why: "--v2-su-dusk: a land dot on the night side (green by day)" },
  // ── homepage v2 · international globe (`src/app/v2/globe.css`). Surfaces
  //    only: the stage's paper and three tints the canvas reads at runtime.
  "decl #F5F7F2": { n: 1, why: "--v2-gb-stage-mid: the globe stage's paper, mid-stop" },
  "decl #ECEFE8": { n: 1, why: "--v2-gb-stage-lo: the globe stage's paper at its edge" },
  "decl #F2F7F3": { n: 1, why: "--v2-gb-body-mid: the orb's body, mid-stop (canvas)" },
  "decl #D3E4D9": { n: 1, why: "--v2-gb-body-lo: the orb's shaded limb (canvas)" },
  "decl #2EAA76": { n: 1, why: "--v2-gb-pulse: a pulse travelling a route (canvas)" },

  // ── homepage v2 · consumer storefront (`src/app/v2/consumer.css`).
  //    Surfaces only: the WhatsApp Buy Now and the WhatsApp chip's mint.
  "decl #117F45": { n: 1, why: "--v2-cx-wa: the WhatsApp-green Buy Now (5.1:1 with its white label)" },
  "decl #E7F7EC": { n: 1, why: "--v2-cx-wa-tint: the WhatsApp chip behind --green text" },
  // ── homepage v2 · business bands (`app/v2/enterprises.css`, `smb.css`,
  //    `diligence.css`, Sep 2026). Surfaces only; every text colour in the
  //    three sheets is a token. A tint within a couple of units of an existing
  //    `--v2-*` or palette value reuses it rather than appearing here.
  "decl #FFFEFB": { n: 1, why: "--v2-lt-paper: the client letters' warm paper" },
  "decl #F28A2E": { n: 1, why: "--v2-en-hivis: the blue-collar ID badge's hi-vis webbing and print band" },
  "decl #EFA6D6": { n: 1, why: "--v2-en-foil-a: a badge seal foil stop (pink)" },
  "decl #9EBCFF": { n: 1, why: "--v2-en-foil-b: a badge seal foil stop (sky)" },
  "decl #FFDF73": { n: 1, why: "--v2-en-foil-c: a badge seal foil stop (butter)" },
  "decl #ECE8DF": {
    n: 2,
    why:
      "--v2-lt-rule (letterhead rule) and --v2-dd-rule (a scan tile's outline): " +
      "the same one-step-under-hair line, declared once per sheet so neither " +
      "band depends on the other's stylesheet being on the page",
  },
  "decl #2A2823": { n: 1, why: "--v2-sm-press: the receipt printer's top face (the .btn-ink:hover lift off --ink)" },
  "decl #145539": { n: 1, why: "--v2-sm-green-press: the spotlit package's Buy Now on hover (white label 7.9:1)" },
  "decl #050504": { n: 1, why: "--v2-sm-slot: the printer's paper slot, darker than --ink" },
  "decl #D8D3C9": { n: 1, why: "--v2-sm-dash: the printed receipt's dashed rules, .rc .sep's colour" },
  // ── homepage v2 · governments (`src/app/v2/govseals.css`,
  //    `src/app/v2/govdossier.css`). Surfaces only. Board shades within two
  //    units of a token or an existing `--v2-*` tint were mapped onto it
  //    rather than declared; these four have no neighbour on file.
  "decl #FFE4A0": { n: 1, why: "--v2-sv-foil-gold: the seal foil's holographic gold stop" },
  "decl #AAC8FF": { n: 1, why: "--v2-sv-foil-blue: the seal foil's holographic blue stop" },
  "decl #ECE7DD": { n: 1, why: "--v2-gv-tab: an unselected dossier tab's card stock" },
  "decl #E8E3D9": { n: 1, why: "--v2-gv-back: the deepest sheet in the dossier stack" },
  // ── homepage v2 · Trust Platform (`src/app/v2/platform.css`): the network
  //    card's surfaces, plus two hover fills the canvas reads at runtime so
  //    `sections/TrustNetwork.tsx` carries no hex. None is a text colour.
  "decl #9FCDB5": { n: 1, why: "--v2-tq-edge: the legend's 'Verifications' line swatch" },
  "decl #EEF7F1": { n: 1, why: "--v2-tq-glow: the network stage's centre glow" },
  "decl #F7FBF8": { n: 1, why: "--v2-tq-mist: the network stage's mid-stop" },
  "decl #F3F8F4": { n: 1, why: "--v2-tq-medal: the medallion's shaded rim" },
  "decl #14573B": { n: 1, why: "--v2-tq-green-deep: a hovered customer node (canvas fill)" },
  "decl #EAF5EE": { n: 1, why: "--v2-tq-mint: a hovered institution node (canvas fill)" },

  // ── homepage v2 · footer (`src/app/v2/footer.css`, every route): the UV
  //    lamp that reveals the giant wordmark. Surfaces and a glow, never text.
  // Declared by two v2 sheets (footer.css, fraud.css) — one row, see #EDE9E0.
  "decl #16132A": { n: 2, why: "--v2-fz-night and --v2-ff-uv-lo: the dark disc of a UV lamp" },
  "decl #6EE7B0": { n: 1, why: "--v2-fz-uv: the fluorescent glow of the revealed wordmark" },
  // ── homepage v2 · One in eight (`src/app/v2/fraud.css`): the synthetic
  //    certificates' paper, rules and gold seal, and the UV lamp's blacklight.
  //    All surfaces; the certificates' words are `--ink`/`--ink-soft`/`--muted`.
  "decl #FBF8F0": { n: 1, why: "--v2-ff-paper: certificate paper" },
  "decl #E3DCCB": { n: 1, why: "--v2-ff-edge: certificate edge" },
  "decl #DCD2BC": { n: 1, why: "--v2-ff-rule: certificate inner rule" },
  "decl #E8E0CE": { n: 1, why: "--v2-ff-rule-lo: certificate inner rule, second line" },
  "decl #E6D3A0": { n: 1, why: "--v2-ff-gold-hi: gold seal, highlight" },
  "decl #B99A5B": { n: 1, why: "--v2-ff-gold: gold seal" },
  "decl #9C7F45": { n: 1, why: "--v2-ff-gold-lo: gold seal, shade" },
  "decl #C8B07A": { n: 1, why: "--v2-ff-gold-rim: gold seal rim" },
  "decl #E9D59C": { n: 1, why: "--v2-ff-fgold-hi: the forged seal's slightly-off gold, highlight" },
  "decl #C2A25C": { n: 1, why: "--v2-ff-fgold: the forged seal's slightly-off gold" },
  "decl #A4864A": { n: 1, why: "--v2-ff-fgold-lo: the forged seal's slightly-off gold, shade" },
  "decl #221D3A": { n: 1, why: "--v2-ff-uv-hi: UV lamp pool, centre" },
  "decl #1C1834": { n: 1, why: "--v2-ff-uv-cell: a genuine certificate under UV" },
  "decl #3B3659": { n: 1, why: "--v2-ff-uv-bad: the forgery under UV (no features)" },

  // ── homepage v2 · How we know (`src/app/v2/how.css`): the case file's table
  //    and rails, the specimen's hologram, and the custody orb. All surfaces.
  "decl #F4F1EA": { n: 1, why: "--v2-hw-table: the desk the specimen lies on" },
  "decl #E8D9FF": { n: 1, why: "--v2-hw-holo-1: specimen hologram, conic stop" },
  "decl #C7F0E0": { n: 1, why: "--v2-hw-holo-2: specimen hologram, conic stop" },
  "decl #FFF3C4": { n: 1, why: "--v2-hw-holo-3: specimen hologram, conic stop" },
  "decl #FFD6E6": { n: 1, why: "--v2-hw-holo-4: specimen hologram, conic stop" },
  "decl #CFE4FF": { n: 1, why: "--v2-hw-holo-5: specimen hologram, conic stop" },
  "decl #E9F7EF": { n: 1, why: "--v2-hw-orb-hi: the spinning mint orb, highlight" },
  "decl #9AD8BA": { n: 1, why: "--v2-hw-orb-mid: the spinning mint orb" },
  "decl #2E8A62": { n: 1, why: "--v2-hw-orb-lo: the spinning mint orb, shade" },

  // ── text colour. Every row is a token value; the `t` is the `var(--t)` that
  //    should be there instead. 44 opaque + 23 with an alpha = 67. This is the
  //    debt rule 3 pins: not a contrast failure, but colour nobody can
  //    re-theme, and the place `#7D796F` hid for months.
  "text #15140F": { n: 2, t: "ink" },
  "text #15140F+a": { n: 6, t: "ink" },
  "text #1B6B4A": { n: 2, t: "green" },
  "text #3D3B35": { n: 10, t: "ink-soft" },
  "text #CFCAC0": { n: 2, t: "tick-off" },
  "text #FFFFFF": { n: 28, t: "white" },
  "text #FFFFFF+a": { n: 17, t: "white" },

  // ── surfaces that are token values written longhand. 141 opaque + 128 with
  //    an alpha. The translucent ones cannot be `var(--x)` as they stand —
  //    they want `rgb(from var(--x) r g b / a)` — so fixing them is a rewrite,
  //    not a substitution, which is why they are capped rather than failed.
  "surface #15140F": { n: 6, t: "ink" },
  "surface #15140F+a": { n: 35, t: "ink" },
  "surface #1B6B4A": { n: 36, t: "green" },
  "surface #1B6B4A+a": { n: 58, t: "green" },
  "surface #CFCAC0": { n: 26, t: "tick-off" },
  "surface #F6F4EF": { n: 5, t: "paper" },
  "surface #FFFFFF": { n: 68, t: "white" },
  "surface #FFFFFF+a": { n: 35, t: "white" },

  // ── surfaces that are NOT on the palette, with the reason each one is not.
  //    76 in all — 52 opaque and 24 translucent near-inks. None is text, so
  //    1.4.3 does not reach them; they are here so that a 77th has to be
  //    argued for rather than typed.
  "surface #0E0D0A+a": {
    n: 20,
    why:
      "rgb(14,13,10) - the canvas's own near-ink, used only translucent: the " +
      "`.ph .scrim` photo gradient and the `.person .who` text-shadow. Three " +
      "channels off --ink (21,20,15) and invisible at these alphas, so it is " +
      "an export artefact rather than a decision. Collapsing it into --ink is " +
      "a rendering change, small but real, so it is not done silently here",
  },
  "surface #14130F+a": {
    n: 4,
    why:
      "rgb(20,19,15) - --ink off by ONE unit per channel, on `.cell .from`'s " +
      "pill. Same story as #0E0D0A and even more clearly a rounding artefact",
  },
  "surface #2A2823": {
    n: 6,
    why: "`.btn-ink:hover` and the `.drow .bar2` gradient - the lift off --ink on press",
  },
  "surface #3A3833": { n: 2, why: "`.phone2`'s bezel gradient, the light end of a ramp to --ink" },
  "surface #B99A85": { n: 4, why: "artwork - the face plate in the `.lic` licence-card mock" },
  "surface #E7C9C9": { n: 4, why: "artwork - `.lic .holo`'s conic-gradient stop" },
  "surface #CFE2D8": { n: 2, why: "artwork - `.lic .holo`'s conic-gradient stop" },
  "surface #D7D1EA": { n: 2, why: "artwork - `.lic .holo`'s conic-gradient stop" },
  "surface #F0E0BF": { n: 2, why: "artwork - `.lic .holo`'s conic-gradient stop" },
  "surface #EEE7DA": { n: 2, why: "artwork - the `.lic` card's own gradient, with #D9CDB8" },
  "surface #D9CDB8": {
    n: 4,
    why:
      "the default `.ph` photograph tint, and the `.lic` gradient's dark end. " +
      "Part 3's third exemption: a tint belongs to a photograph, not to the " +
      "palette - the per-image ones live in PLACEHOLDER_TINT in lib/img.ts",
  },
  "surface #DDD8CE": { n: 5, why: "`.strack` and `.panel::after` - inert 1px connector rules" },
  "surface #D8D3C9": {
    n: 4,
    why:
      "`.rc .sep`'s dashed rule and `.inp`'s border - one step darker than " +
      "--hair. A border, so 1.4.3 does not apply; 1.4.11 would, and that needs " +
      "layout (tools/e2e/a11y.spec.ts)",
  },
  "surface #CFE3D6": { n: 2, why: "`.b.rep`'s border - a tint of --green with no token" },
  "surface #F2EFE8": { n: 2, why: "`.phone2 .scr`'s screen fill, a shade off --paper" },
  "surface #F9F8F4": { n: 2, why: "`.stage`'s gradient end, a shade off --white" },
  "surface #FBFAF6": { n: 3, why: "pages.css `.d2scan`/`.d2foot`/`.ct3 .status` fills, a shade off --white" },
  "surface #EAE6DC": { n: 5, why: "pages.css `.d2f` dashed rules and the `.d2meter` track" },
  "surface #E7E2D6": { n: 1, why: "pages.css `.d2prog` track - the only one-off literal in the file" },
};

if (CENSUS) {
  console.log("/** measured " + new Date().toISOString().slice(0, 10) + " */");
  for (const [k, list] of [...groups].sort()) {
    const t = list[0].token;
    console.log(
      `  "${k}": { n: ${list.length}${t ? `, t: "${t}"` : ', why: ""'} },` +
        `${t ? "" : `   // ${list[0].file}:${list[0].line} ${list[0].prop}`}`,
    );
    if (!t) for (const e of list.slice(0, 6)) console.log(`      // ${e.file}:${e.line} ${e.prop}`);
  }
  console.log("\nboards (scored against the shipped palette):");
  const bg = new Map();
  for (const e of boards) if (e.cls === "text" && !e.token) bg.set(e.value, (bg.get(e.value) ?? 0) + 1);
  for (const [v, n] of bg) console.log(`  "${v}": { n: ${n} },`);
  process.exit(0);
}

// ───────────────────────────────────────────────────── the report
const SURFACES = { paper: "#F6F4EF", white: "#FFFFFF", ink: "#15140F" };
const failures = [];
const notes = [];

/** Rule 1 — a text colour that does not resolve to a token. `#7D796F`. */
for (const e of found) {
  if (e.cls !== "text" || e.token) continue;
  const on = Object.entries(SURFACES)
    .map(([n, s]) => `${ratio(e.value, s).toFixed(2)}:1 on --${n}`)
    .join(", ");
  failures.push(
    `${e.file}:${e.line}  ${e.prop}: ${e.raw} is not any token's value.\n` +
      `      Measured ${on}. WCAG 2.2 AA 1.4.3 wants 4.5:1 for body text, 3:1 for large.\n` +
      `      This is the #7D796F shape: text colour off the palette, in a stylesheet.`,
  );
}

/** Rule 2 — a literal that is not recorded.
 *
 *  Skips anything rule 1 already owns. Without that, reintroducing `#7D796F`
 *  reported twice and the second message offered "or add it to BASELINE with a
 *  reason" — advice that is correct for a surface and wrong for text, where
 *  there is no exemption to be had. Caught by mutation m1. */
for (const [k, list] of groups) {
  if (BASELINE[k]) continue;
  if (list[0].cls === "text" && !list[0].token) continue;
  const e = list[0];
  failures.push(
    `${e.file}:${e.line}  ${e.prop}: ${e.raw} (${k}) is a colour this stylesheet did not have.\n` +
      `      ${list.length} occurrence(s). Either use ${e.token ? `var(--${e.token})` : "a token"}, or add\n` +
      `      "${k}": { n: ${list.length}, why: "…" } to BASELINE with the reason.`,
  );
}

/** Rule 3 — a recorded group may not grow. */
for (const [k, rec] of Object.entries(BASELINE)) {
  const n = groups.get(k)?.length ?? 0;
  if (n > rec.n) {
    const extra = groups.get(k).slice(rec.n);
    failures.push(
      `${k} has spread: ${rec.n} recorded, ${n} found.\n` +
        `      e.g. ${extra[0].file}:${extra[0].line}  ${extra[0].prop}: ${extra[0].raw}\n` +
        `      ${rec.t ? `Write var(--${rec.t}) instead.` : `Not a token: ${rec.why}`}`,
    );
  } else if (n < rec.n) {
    notes.push(`${k}: ${n} found, ${rec.n} recorded — lower it to ${n} so the gate tightens.`);
  }
}

/** The boards, reported and capped. */
const boardHits = new Map();
for (const e of boards) {
  if (e.cls !== "text" || e.token) continue;
  if (!boardHits.has(e.value)) boardHits.set(e.value, []);
  boardHits.get(e.value).push(e);
}
const boardFail = [];
for (const [v, list] of boardHits) {
  const cap = BOARD_CAP[v];
  if (!cap) boardFail.push(`${v} is a new non-token text colour in the artboards (${list.length}×), e.g. ${list[0].file}:${list[0].line}`);
  else if (list.length > cap.n) boardFail.push(`${v} in the artboards: ${cap.n} recorded, ${list.length} found — the reintroduction hazard grew.`);
}

console.log(`stylesheets: ${SHEETS.length}   artboards: ${BOARDS.length}`);
console.log(`tokens: ${tokens.size} value(s)   literals classified: ${found.length}`);
const byCls = { decl: 0, text: 0, surface: 0 };
for (const e of found) byCls[e.cls]++;
console.log(`  declarations ${byCls.decl}   text ${byCls.text}   surface ${byCls.surface}`);
console.log(
  `  text colours resolving to a token: ${found.filter((e) => e.cls === "text" && e.token).length}` +
    ` / ${byCls.text}\n`,
);

if (boardHits.size) {
  console.log("artboards — latent non-token text colour (reported, capped, not fatal):");
  for (const [v, list] of boardHits) {
    console.log(`  ! ${v} ×${list.length}   ${list.map((e) => `${e.file.split("/").pop()}:${e.line}`).slice(0, 3).join(" ")}${list.length > 3 ? " …" : ""}`);
    const cap = BOARD_CAP[v];
    if (cap) console.log(`    ${cap.why.replace(/(.{72})\s/g, "$1\n    ")}`);
  }
  console.log("");
}

if (notes.length) {
  console.log("ratchet — these can be tightened:");
  for (const n of notes) console.log(`  - ${n}`);
  console.log("");
}

const all = [...failures, ...boardFail];
if (all.length) {
  for (const f of all) console.log(`  x ${f}`);
  console.log(
    `\nFAIL - ${all.length} colour finding(s) in the stylesheets.\n` +
      "       §17 condition 21 is 'no colour literal in UI code', and a stylesheet\n" +
      "       is UI code. A text colour must resolve to a token (1.4.3); anything\n" +
      "       else must be in BASELINE with a reason and a count.",
  );
  process.exit(1);
}

console.log(
  "PASS - every text colour in the stylesheets resolves to a declared token,\n" +
    "       and no recorded literal has spread.",
);
process.exit(0);
