/** Serialising a JSON-LD graph into an HTML `<script>` body (BUILD-SPEC §8.2).
 *
 *  Split out of `components/seo/JsonLd.tsx` so that it can be imported by a
 *  test on bare Node — Node's built-in type stripping removes TypeScript
 *  annotations but does not compile JSX, so anything reachable from a `.tsx`
 *  file is untestable under `tools/test/register.mjs`.
 */

/** JSON, with `<` escaped — which is the whole reason this is not a bare
 *  `JSON.stringify` call.
 *
 *  `<script type="application/ld+json">` is a *raw text* element in the HTML
 *  spec (§13.2.5.1), so the parser does not decode entities inside it and ends
 *  it at the first `</script`, wherever that appears — including inside a JSON
 *  string. A single FAQ answer or page description containing that byte
 *  sequence would therefore close the tag early, spill the remaining JSON into
 *  the document as text, and hand an attacker who controls any of that copy an
 *  injection point.
 *
 *  `<` is the fix because it is legal JSON for the same character: the
 *  JSON parser reading this block sees `<` again, so the graph is unchanged,
 *  while the HTML parser never sees the `</script` sequence at all. Escaping
 *  only `<` is sufficient — `>`, `&` and quotes cannot end a raw text element.
 *
 *  Rejected alternative: `JSON.stringify(data, null, 2)`. Pretty-printing adds
 *  bytes to every page for a graph no human reads in the served HTML, and the
 *  checker parses it rather than eyeballing it. `JSON.parse` on the emitted
 *  block is the only reader that matters.
 */
export function serialiseJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
