/** Which extra faces a locale needs on top of the Latin trio
 *  (BUILD-SPEC §9.3, TASKS.md Part 9b).
 *
 *  Newsreader, Instrument Sans and Geist Mono have no Devanagari or Arabic
 *  glyphs — measured: the four files in `src/fonts/` are the Latin subsets
 *  `build:fonts` produced, and a Hindi sentence in any of them is tofu.
 *  Noto (OFL) fills the gap: Sans Devanagari / Serif Devanagari for `hi`,
 *  Sans Arabic / Naskh Arabic for `ar`. They sit BEHIND the brand faces in
 *  `--sans` / `--serif` (`globals.css`), so Latin punctuation, "HelloVerify"
 *  and numerals keep the designed type.
 *
 *  `null` is the load-bearing answer. English pages must not download 100 KB
 *  of script faces they cannot paint. `layout.tsx` only adds the Noto CSS
 *  variables when this returns a stack, and those `localFont` calls set
 *  `preload: false` so Next does not emit a `<link rel="preload">` on `/en`.
 *
 *  A lookup rather than a ternary, same reason as `directionOf`: adding `ur`
 *  or `fa` (Arabic script, not Arabic locale) is a data change. Hebrew is
 *  RTL and a different script — it does not belong here.
 */
export type ScriptStack = "deva" | "arab";

const DEVANAGARI = new Set<string>(["hi", "mr", "ne"]);
const ARABIC = new Set<string>(["ar", "fa", "ur"]);

export function scriptStackOf(locale: string): ScriptStack | null {
  if (DEVANAGARI.has(locale)) return "deva";
  if (ARABIC.has(locale)) return "arab";
  return null;
}
