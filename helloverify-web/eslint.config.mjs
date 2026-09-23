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

  {
    /** §17 condition 22 -- "no component file over 300 lines" -- with a gate,
     *  because it regressed without one.
     *
     *  Part 5 closed this condition by measuring once. Its table recorded
     *  `platform/security-compliance/page.tsx` at 291 lines and
     *  `business/enterprise/page.tsx` at 293. Measured 22 Sep on the same tree
     *  TASKS.md called "10 of 24 met": **383** and **336**, plus
     *  `components/sections/Contact.tsx` at **319**, which was never in that
     *  table. Traced per file with `git show <commit>:<path> | wc -l`, because
     *  reading the commit subjects got it wrong once already: **`fc954ee`**
     *  (Part 8's answer blocks) crossed the limit twice on its own, taking
     *  security-compliance 291 -> 362 and enterprise 293 -> 328. Contact
     *  crossed later and elsewhere, at **`1117d35`** (the eleventh gate),
     *  289 -> 319 -- and `git show --stat 9053098 -- .../Contact.tsx` is empty,
     *  so the credential-table commit this comment first blamed never touched
     *  it. Two parts marked DONE broke a closed condition and nothing could
     *  notice, because no gate in `check:all` counts lines and this file set no
     *  limit.
     *
     *  `max: 300` allows 300 and fails at 301, which is what "over 300" says.
     *  `components/sections/Checks.tsx` sits at exactly 300 and passes -- one
     *  line of headroom, recorded here rather than silently relied on.
     *
     *  BLANK LINES AND COMMENTS COUNT, and the strongest argument against that
     *  is in the trace above: Contact.tsx crossed 300 on +32/-2 lines that are
     *  almost entirely comment, so the setting failed a file for documenting
     *  itself. Kept anyway. The condition is a plain physical line count, which
     *  is also how Part 5 measured; a 300-line file is hard to hold in the head
     *  whatever its lines are for; and the fix that followed was an extraction
     *  of twelve repeated field rows into two lists, not a deletion of
     *  comments. The rejected alternative, `skipComments: true`, would let the
     *  house comment style buy unlimited body -- and a file needing 80 lines of
     *  explanation for 280 lines of markup is precisely the file this condition
     *  exists to catch.
     *
     *  SCOPED TO COMPONENTS, not all of `src`. The rejected alternative was
     *  `src/**`, which fails `lib/content/company.ts` (414 lines) -- a flat
     *  data table where the length is content rather than complexity, and
     *  splitting it would scatter one catalogue across files to satisfy a
     *  number. Condition 22 says "component file"; Part 5's own table scoped
     *  it to `app/**` pages and `components/**`, and so does this.
     */
    files: ["src/app/**/*.tsx", "src/components/**/*.tsx"],
    rules: {
      "max-lines": ["error", { max: 300, skipBlankLines: false, skipComments: false }],
    },
  },
]);
