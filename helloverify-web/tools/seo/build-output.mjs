/** Reading the pages Next actually wrote to disk.
 *
 *  Shared by `check-sitemap.mjs` and `check-schema.mjs`. It was private to the
 *  first until the second needed the identical walk; two copies of "how do I
 *  find the emitted HTML" is how one checker comes to be looking at a different
 *  set of pages than the other and neither noticing.
 */
import { readdir } from "node:fs/promises";

/** Every prerendered page, keyed by the URL it is served at.
 *  `.next/server/app/en/about.html` -> `/en/about`; `en.html` -> `/en`. */
export async function htmlPages(root, dir = ".next/server/app/", prefix = "") {
  const out = new Map();
  for (const item of await readdir(new URL(dir, root), { withFileTypes: true })) {
    if (item.isDirectory()) {
      for (const [k, v] of await htmlPages(root, `${dir}${item.name}/`, `${prefix}/${item.name}`)) {
        out.set(k, v);
      }
    } else if (item.name.endsWith(".html")) {
      out.set(`${prefix}/${item.name.slice(0, -".html".length)}`, `${dir}${item.name}`);
    }
  }
  return out;
}

/** The five entities React escapes in a text node, undone.
 *
 *  Not cosmetic: React writes `&#x27;` for an apostrophe, and a third of the
 *  FAQ questions on this site contain one ("Do I need the candidate's
 *  permission?"). Comparing the JSON-LD string against the raw HTML without
 *  this makes every one of them look like a mismatch — which is exactly how a
 *  checker comes to be quietly disabled for being noisy.
 */
export function decodeEntities(s) {
  return s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&"); // last: an entity written &amp;#x27; must stay literal
}

/** Tags out, entities decoded, whitespace normalised — the text a reader sees.
 *  `<script>` and `<style>` bodies are dropped first so that the RSC flight
 *  payload (which contains every string on the page a second time, JSON-encoded)
 *  cannot make a missing on-page string look present. */
export function visibleText(html) {
  return decodeEntities(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/g, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ");
}
