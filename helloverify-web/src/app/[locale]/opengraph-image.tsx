/** The Open Graph / Twitter card image, generated at build time.
 *
 *  Replaces `scripts/generate-og-image.mjs`. It sits at the `[locale]` segment
 *  so every page inherits it, which is a deliberate v1 scope: §8.3 wants
 *  per-route images eventually, but a per-route image is only worth generating
 *  once each route has copy worth putting on one. A single correct card beats
 *  57 that all say the same thing in a different font.
 *
 *  ON FONTS — this renders in the site's palette but NOT in the site's
 *  typefaces. `ImageResponse` needs font bytes, and ours come from
 *  `next/font/google` at build time; reaching back out to Google Fonts from
 *  inside image generation would add a network call to `next build`, and the
 *  audit is scathing (rightly) about the old build's Playwright download being
 *  a hard dependency of shipping a marketing page. The bundled default is used
 *  instead. When §9.3's self-hosted subset lands as a real `.woff2` in the
 *  repo, this reads it off disk and the card gets Newsreader.
 *
 *  ON LAYOUT — `ImageResponse` implements a subset of flexbox via Satori, not
 *  a browser. No grid, no float, and every element with more than one child
 *  needs an explicit `display`. Values are hardcoded here rather than pulled
 *  from `design.css` because Satori cannot resolve CSS variables.
 *
 *  KNOWN COSMETIC DEFECT — word spacing is visibly uneven in the rendered
 *  card ("Verified  at the source", "confirms  with the issuer"). It is a
 *  Satori text-shaping artifact, not markup: setting `display: "block"` on
 *  every text-bearing div produced a byte-identical PNG, so the flex-items
 *  theory is wrong and is recorded here so nobody retries it. Most likely the
 *  bundled fallback font, which makes it the same problem as the font note
 *  above and probably the same fix.
 */
import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/seo/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} — verified at the source, in minutes`;

/** Without this the route is generated per request and the build stops being
 *  fully static (§5). The `[locale]` values come from the layout's own
 *  `generateStaticParams`, but an image route needs its own. */
export function generateStaticParams() {
  return [{ locale: "en" }];
}

// DESIGN.md §2.1. Satori cannot read CSS custom properties, so these are the
// literal token values, and they are the ONLY colours permitted here.
const PAPER = "#F6F4EF";
const INK = "#15140F";
const MUTED = "#6F6B62";
const HAIR = "#E3DFD6";
const GREEN = "#1B6B4A";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PAPER,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 34, fontWeight: 600, color: INK, letterSpacing: "-0.02em" }}>
            {SITE_NAME}
          </div>
          {/* The accent is --green, never --red: red exists only inside the
              logo mark, which this card does not draw. */}
          <div style={{ width: 8, height: 8, borderRadius: 8, backgroundColor: GREEN }} />
          <div style={{ fontSize: 22, color: MUTED }}>Primary-source verification</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              color: INK,
              letterSpacing: "-0.03em",
              maxWidth: 920,
            }}
          >
            Verified at the source, in minutes.
          </div>
          <div style={{ fontSize: 30, color: MUTED, maxWidth: 860, lineHeight: 1.35 }}>
            AI reads the documents. Our team confirms with the issuer — the university, the
            employer, the registry.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 48,
            paddingTop: 32,
            borderTop: `1px solid ${HAIR}`,
            fontSize: 24,
            color: INK,
          }}
        >
          {/* Specificity is a GEO requirement (§11a.2 rule 4), and these are
              the canvas annotation's REAL figures, not illustrative ones. */}
          <div style={{ display: "flex" }}>20M+ checks</div>
          <div style={{ display: "flex" }}>120+ countries</div>
          <div style={{ display: "flex" }}>2,000+ clients</div>
        </div>
      </div>
    ),
    size,
  );
}
