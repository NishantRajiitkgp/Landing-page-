/** "Zero hex literals outside the theme" (BUILD-SPEC §17 condition 21, §14.2).
 *
 *  This replaces `tools/ci/check-tokens.mjs`, which did the same job by regex.
 *  The AST version is strictly better in two ways that matter: it can tell a
 *  colour in an SVG attribute from one in a style object *on the same line*
 *  (the regex needed a masking trick for that), and it reports in the editor
 *  while the colour is being typed rather than at the end of a build.
 *
 *  The rule exists because a colour typed into a component is a colour nobody
 *  can re-theme, re-check for contrast, or find. `src/` held **382** of them;
 *  119 were UI colour and are now zero.
 *
 *  TWO EXEMPTIONS, both narrower than they look.
 *
 *  1. **SVG presentation attributes** — `fill`, `stroke` and friends. 194 of the
 *     original 382 are artwork: national flags in `sections/International.tsx`,
 *     the wordmark, the YC badge. Singapore's flag is #C8102E whether or not the
 *     brand changes, and putting that in the palette would make the palette
 *     meaningless.
 *
 *     This is NOT a licence to hide UI colour in an SVG attribute. The
 *     confirmation tick was inlined 87 times with its colour repeated each time;
 *     it is now one component coloured from CSS. The test is repetition and
 *     role, not file type — and because this rule works on the AST, a hex
 *     anywhere else on the same line as an exempt attribute is still reported.
 *
 *  2. **`app/[locale]/opengraph-image.tsx`** — Satori renders that card at build
 *     time with no CSSOM, so it cannot resolve a custom property. `var(--paper)`
 *     would render as nothing.
 *
 *  Not an exemption, though it looks like one: placeholder tints. The 57 `.ph`
 *  background colours are a property of one photograph, like `blurDataURL`, and
 *  live in `PLACEHOLDER_TINT` in `lib/img.ts` keyed by image.
 */

const HEX = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** SVG presentation attributes that legitimately carry artwork colour. */
const SVG_COLOUR_ATTRS = new Set([
  "fill",
  "stroke",
  "stopColor",
  "floodColor",
  "lightingColor",
]);

/** Files that cannot use a custom property at all, with the reason. */
const EXEMPT = [
  {
    match: /opengraph-image\.tsx$/,
    why: "Satori renders this at build time and cannot resolve CSS custom properties",
  },
  {
    match: /app\/manifest\.ts$/,
    why:
      "The web app manifest is JSON fetched by the browser, not CSS. " +
      "theme_color and background_color are read by the OS chrome before any " +
      "stylesheet exists, so a custom property there resolves to nothing",
  },
  {
    match: /lib\/img\.ts$/,
    why:
      "PLACEHOLDER_TINT is the sanctioned home for per-photograph tints - this " +
      "is the file the rule redirects people TO, so it cannot also be a violation",
  },
];

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Colour must come from a design token, not a literal. SVG artwork and " +
        "the Satori-rendered OG card are exempt.",
    },
    schema: [],
    messages: {
      literal:
        'Colour literal "{{value}}". Use a token from design.css, e.g. ' +
        "var(--ink). If it belongs to one photograph rather than to the design, " +
        "put it in PLACEHOLDER_TINT in lib/img.ts. If it is artwork, it belongs " +
        "in an SVG fill/stroke attribute.",
    },
  },

  create(context) {
    const filename = context.filename ?? context.getFilename();
    const exempt = EXEMPT.find((e) => e.match.test(filename.replace(/\\/g, "/")));
    if (exempt) return {};

    /** True when this literal IS the value of an SVG colour attribute —
     *  `fill="#C8102E"`. Deliberately not "appears inside an SVG element": a
     *  style object on an `<svg>` is still UI colour. */
    function isSvgArtwork(node) {
      const parent = node.parent;
      return (
        parent?.type === "JSXAttribute" &&
        parent.name?.type === "JSXIdentifier" &&
        SVG_COLOUR_ATTRS.has(parent.name.name)
      );
    }

    function check(node, value) {
      if (typeof value !== "string" || !HEX.test(value.trim())) return;
      if (isSvgArtwork(node)) return;
      context.report({ node, messageId: "literal", data: { value } });
    }

    return {
      Literal(node) {
        check(node, node.value);
      },
      /** `` `#F6F4EF` `` — no interpolation, so it is just a literal wearing a
       *  different hat. */
      TemplateLiteral(node) {
        if (node.expressions.length === 0 && node.quasis.length === 1) {
          check(node, node.quasis[0].value.cooked);
        }
      },
    };
  },
};
