/** ESLint, flat config (BUILD-SPEC §14.2).
 *
 *  §14.2's pipeline lists "lint (incl. token + logical-property rules)". Until
 *  now there was no ESLint at all and the CI step said so rather than passing
 *  silently; these are those two rules, plus Next's own recommended set.
 *
 *  The two local rules are the reason this file exists rather than a bare
 *  `eslint-config-next`:
 *
 *  - **`hv/no-color-literal`** replaces `tools/ci/check-tokens.mjs`. Same job,
 *    done on the AST instead of by regex, which means it can tell a colour in an
 *    SVG artwork attribute from one in a style object on the same line, and it
 *    reports in the editor rather than at the end of a build. The script it
 *    replaces has been removed — one rule, one implementation.
 *  - **`hv/logical-css`** covers the gap `npm run check:logical` cannot reach.
 *    That gate reads the stylesheets; this reads `style={{ }}` objects in TSX,
 *    which are JavaScript and invisible to it. Both are needed, and neither is
 *    redundant.
 *
 *  `tools/**` is not linted. It is build-time tooling run by Node directly —
 *  no JSX, no React, no browser — and Next's React rules do not apply to it.
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

import noColorLiteral from "./tools/eslint/no-color-literal.mjs";
import logicalCss from "./tools/eslint/logical-css.mjs";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    /** Build tooling and the throwaway test harness. Run by Node, not shipped,
     *  and excluded from tsconfig for the same reason. */
    "tools/**",
  ]),

  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      hv: {
        rules: {
          "no-color-literal": noColorLiteral,
          "logical-css": logicalCss,
        },
      },
    },
    rules: {
      "hv/no-color-literal": "error",
      "hv/logical-css": "error",

      /** Narrowed, not disabled. The rule's real job is the characters that are
       *  genuinely ambiguous next to JSX syntax — `>` and `}` — and it keeps
       *  doing that. Its defaults also forbid a plain apostrophe in text, which
       *  flagged 71 places across reviewed marketing copy; `Don't` and
       *  `Don&apos;t` render byte-identical HTML (React escapes both to
       *  `&#x27;`), so those 71 edits would have been churn through copy that
       *  has been signed off, for no change a reader could see. */
      "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    },
  },
]);
