import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";

// Shared with the three `check:*` gates so both see the same page set.
// `allowJs` in tsconfig means TypeScript infers this .mjs module's types, so
// it needs no declaration file and no suppression - checked, after a
// `@ts-expect-error` here turned out to be unused and failed `tsc`.
import { htmlPagesSync } from "../seo/build-output.mjs";
import { settle } from "./settle";

/** The three axe rules jsdom cannot run, run.
 *
 *  `npm run check:a11y` has printed the same line on every run since it was
 *  written: "not runnable without layout: color-contrast, target-size,
 *  scrollable-region-focusable". All three need a box model, and jsdom has
 *  none. BUILD-SPEC §17 condition 12 asks for zero critical/serious violations
 *  on every route, and until now a third of the WCAG 2.2 AA surface was
 *  unmeasured rather than clean.
 *
 *  ## Only those three, and that is the point
 *
 *  The jsdom gate already runs every other rule over all 56 pages in seconds,
 *  with no browser, in CI. Re-running them here would cost minutes to re-prove
 *  what is proved, and would make the browser suite the thing people skip. So
 *  this scan is restricted to exactly the rules the other one reports it cannot
 *  do. The two together are the complete rule set; either alone is not, and
 *  neither pretends otherwise.
 *
 *  `target-size` (WCAG 2.2 AA, 2.5.8) is about hit areas rather than colour and
 *  has never been measured anywhere in this repo before.
 *
 *  ## No accepted failures. Every violation fails the run.
 *
 *  There is no allowlist here any more, and there is no code to consult one.
 *  Both entries it once held are gone, and both were removed by FIXING the
 *  colour rather than by re-deciding the exception:
 *
 *  - **`#7d796f`** - 3.95:1 on paper, five nodes, homepage only, and the one
 *    the browser layer FOUND. The `.inp` placeholder took `var(--muted)`
 *    (#6f6b62, 4.83:1) at both breakpoints in `app/design.css`, and in
 *    `app/pages.css` on the real form's `::placeholder` and empty-`<select>`
 *    rules, which carried the same literal. 22 Sep 2026.
 *  - **`#a29e94`**, the `--faint` token - 2.43:1 on paper, 2.67:1 on white,
 *    ~180 nodes on the homepage alone. TASKS.md Part 2a, answered 22 Sep 2026
 *    by deleting the token: it also failed the LARGE-text threshold (2.43:1
 *    against 3:1), so enlarging the labels could not have passed it either,
 *    and the lightest colour on that hue which does reach 4.5:1 measures
 *    1.06:1 against `--muted` - the same colour to the eye. There was no third
 *    text tier to keep. Every use now reads `var(--muted)`.
 *
 *  Keeping a satisfied entry would be worse than keeping none: it reads as a
 *  live exception, and the same colour returning anywhere would pass the scan
 *  that exists to catch it. With the set gone, either colour reappearing on
 *  any of the 56 routes fails this run.
 *
 *  Why no static gate saw `#7d796f` first is worth keeping, because that gap
 *  is still open: `hv/no-color-literal` is an ESLint rule and reads TypeScript,
 *  not stylesheets; `check:tokens`, which did read files as text, was removed
 *  in Part 4 as redundant with it; and `check:contrast` walks the TOKEN TABLE,
 *  so a colour that is not a token is invisible to it by construction. Nothing
 *  reads the stylesheets for colour yet.
 *
 *  ## Determinism
 *
 *  The earlier version asserted only a "blocking" subset and annotated the
 *  accepted count instead, because repeated homepage scans returned between 70
 *  and 74 `--faint` nodes: some of that text sits inside panels whose final
 *  keyframe is partly transparent, and axe counts only what is painted. That
 *  variance was entirely in the accepted set; the blocking set was identical on
 *  every run. With nothing accepted, the two sets are one, the flaky half no
 *  longer exists, and the assertion is simply "no violations".
 */

const RULES = ["color-contrast", "target-size", "scrollable-region-focusable"];

// `process.cwd()` rather than `import.meta.url`: Playwright transpiles specs to
// CommonJS, where `import.meta` is a syntax error. Playwright runs from the
// package root, which is what the walk wants anyway.
const root = pathToFileURL(`${process.cwd()}/`);
const pages = ([...htmlPagesSync(root).keys()] as string[])
  // `/_not-found` and `/_global-error` are Next's own error documents, not
  // routes in the manifest; `check:static` excludes them for the same reason.
  .filter((p) => !p.startsWith("/_"))
  .sort();

test.describe("axe, in a browser", () => {
  for (const path of pages) {
    test(`${path}`, async ({ page }) => {
      await page.goto(path);
      await settle(page);

      const results = await new AxeBuilder({ page }).withRules(RULES).analyze();

      // The foreground and ratio stay in the message even though nothing is
      // excused by them: a contrast failure is unreadable as a selector alone,
      // and the colour is what identifies which token or literal is at fault.
      const violations = results.violations.flatMap((v) =>
        v.nodes.map((node) => {
          const data = node.any?.[0]?.data as { fgColor?: string; contrastRatio?: number } | undefined;
          const fg = String(data?.fgColor ?? "").toLowerCase();
          return `${v.id} [${v.impact}] ${fg || "-"} @ ${data?.contrastRatio ?? "-"}:1  ${node.target.join(" ")}`;
        }),
      );

      expect(violations, `${path} has violations:\n  ${violations.join("\n  ")}`).toEqual([]);
    });
  }
});
