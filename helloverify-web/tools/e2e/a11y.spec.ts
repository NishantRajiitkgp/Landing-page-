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
 *  ## One accepted failure, a decision rather than silence
 *
 *  **`--faint` (#a29e94)** at 2.43:1 on paper and 2.67:1 on white, where 4.5:1
 *  is required. This is TASKS.md Part 2a, already carried as an explicit
 *  ACCEPTED entry in `tools/a11y/check-contrast.mjs` with its measurement.
 *  Mirrored here rather than re-decided.
 *
 *  There were two. **`#7d796f`** - 3.95:1 on paper, five nodes, homepage only,
 *  and the one the browser layer FOUND - is **fixed, not accepted**: the `.inp`
 *  placeholder now takes `var(--muted)` (#6f6b62, 4.83:1) at both breakpoints
 *  in `app/design.css`, and in `app/pages.css` on the real form's
 *  `::placeholder` and empty-`<select>` rules, which carried the same literal.
 *  It is out of the accepted set, so the colour reappearing anywhere now fails
 *  this run - which is the whole point of removing it rather than leaving a
 *  satisfied entry behind. Why no static gate saw it in the first place is
 *  worth keeping: `hv/no-color-literal` is an ESLint rule and reads TypeScript,
 *  not stylesheets; `check:tokens`, which did read files as text, was removed
 *  in Part 4 as redundant with it; and `check:contrast` walks the TOKEN TABLE,
 *  so a colour that is not a token is invisible to it by construction. Nothing
 *  reads the stylesheets for colour yet, so that gap is still open even though
 *  this instance of it is closed.
 *
 *  Anything else, on any of the three rules, fails the run.
 *
 *  ## Determinism
 *
 *  The accepted set is reported, not asserted, and the reason is
 *  measured: repeated scans of the homepage returned between 70 and 74 faint
 *  nodes, because some faint text sits inside panels whose final keyframe is
 *  partly transparent and axe counts only what is painted. The BLOCKING set was
 *  identical on every run. So the assertion is on the blocking set - which is
 *  stable - and the accepted count is an annotation, which is honest about
 *  being approximate rather than pretending to a precision it does not have.
 */

/** Foregrounds knowingly below their threshold, lower-cased as axe reports
 *  them. An entry is a DECISION, visible in the diff - not a way to make the
 *  scan quiet. Nothing goes here without a measurement and a sentence above. */
const ACCEPTED_FG = new Set(["#a29e94"]);
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

      const accepted: string[] = [];
      const blocking: string[] = [];

      for (const v of results.violations) {
        for (const node of v.nodes) {
          const data = node.any?.[0]?.data as { fgColor?: string; contrastRatio?: number } | undefined;
          const fg = String(data?.fgColor ?? "").toLowerCase();
          const isAccepted = v.id === "color-contrast" && ACCEPTED_FG.has(fg);
          const where = node.target.join(" ");
          (isAccepted ? accepted : blocking).push(
            `${v.id} [${v.impact}] ${fg || "-"} @ ${data?.contrastRatio ?? "-"}:1  ${where}`,
          );
        }
      }

      if (accepted.length) {
        test.info().annotations.push({
          type: "accepted",
          description: `${accepted.length} node(s) on a known-accepted foreground (--faint, TASKS.md Part 2a)`,
        });
      }

      expect(blocking, `${path} has unaccepted violations:\n  ${blocking.join("\n  ")}`).toEqual([]);
    });
  }
});
