import { expect, test, type Page } from "@playwright/test";
import { pathToFileURL } from "node:url";

// Same page set as `check:a11y` and the browser axe scan, for the same reason:
// three suites disagreeing about which routes exist is a worse failure than any
// of them being wrong.
import { htmlPagesSync } from "../seo/build-output.mjs";
import { settle } from "./settle";

/** Render every page right-to-left, which nothing here had ever done.
 *
 *  BUILD-SPEC §17 condition 15 asks for Arabic RTL "verified visually and
 *  programmatically on every page". Part 3 and Part 4 converted the physical
 *  inline-axis properties to logical ones — 197 in `app/design.css` and
 *  `app/pages.css` by the converter's own breakdown, plus 77 more in
 *  `style={{ }}` objects that `check:logical` cannot see and `hv/logical-css`
 *  found — and `npm run check:logical` has enforced the result ever since. But
 *  `routing.locales` is `["en"]`, so `directionOf` (`lib/i18n/routing.ts`) has
 *  never returned `"rtl"` in a build, and **no page had ever been painted
 *  mirrored**. A lint rule proving no `margin-left` survives is not the same
 *  claim as a page laying out correctly, and only one of the two is condition
 *  15.
 *
 *  ## Why the document is rewritten rather than the attribute set
 *
 *  The obvious version is `document.documentElement.dir = "rtl"` after `goto`.
 *  Rejected: `<html>` is rendered by `app/[locale]/layout.tsx`, so React owns
 *  those props, and the mirrored layout would then be a post-hydration mutation
 *  of a document the browser first parsed and laid out as LTR. What ships for
 *  `ar` is a document that arrives with `dir="rtl"` in its first bytes. So the
 *  document response is intercepted and its single `dir="ltr"` — measured:
 *  exactly one occurrence per page, on `<html>` — is rewritten before the
 *  browser sees it. Scripts are untouched, so the injected per-page
 *  `script-src` hashes (Part 7) stay valid and hydration still runs.
 *
 *  ## Why every page is measured TWICE
 *
 *  The first version of this asserted that nothing lies outside the viewport
 *  once mirrored. It failed all 112 tests, and it was wrong to: the homepage's
 *  people strip is a marquee whose `.track` is 5,280px wide by design, so its
 *  cards sit outside the viewport in BOTH directions — measured at 1440px,
 *  `.track` spans left -3840 to right 1440 under RTL and the mirror image of
 *  that under LTR. An absolute check cannot tell deliberate horizontal overflow
 *  from a mirroring defect, so it reports the design as a bug on every page
 *  that has a strip and proves nothing on the ones that do not.
 *
 *  So each page is loaded unmirrored first and the overflow it ALREADY has is
 *  recorded, then loaded mirrored and the two sets are differenced. What fails
 *  is overflow that RTL *introduces*. The LTR pass is also the control: if this
 *  predicate were simply wrong, both sets would be equally wrong and the
 *  difference would stay empty — which is why the direction guard below is a
 *  separate assertion rather than an assumption.
 *
 *  ## What this does and does not prove
 *
 *  It proves the STYLESHEETS mirror: the box model, the inline-axis offsets,
 *  the flex and grid flow. It does not prove Arabic typography, because the
 *  text is still Latin, there are no bidi runs, and no Arabic face is loaded —
 *  the four subset faces carry no Arabic or Devanagari glyphs at all (measured:
 *  `tools/perf/subset-fonts.mjs`'s SAFETY set is Latin plus punctuation, and
 *  its glyph census reads `en` HTML only). Nor does it prove that a
 *  right-pointing arrow now points the wrong way: geometry cannot see the
 *  inside of an SVG path. Both halves need a real `ar` locale and are Part 9b.
 *  Stating the split here rather than letting a green run imply the whole
 *  condition.
 *
 *  ## The guard
 *
 *  If the rewrite silently stops matching — a Next upgrade emitting `dir` last,
 *  or the layout dropping the attribute — every differential assertion would
 *  compare a page against itself and pass. So the first assertion is that the
 *  computed direction really is `rtl`, and the second is that the unmirrored
 *  pass really was `ltr`. Broken deliberately by rewriting to `dir="ltr"`
 *  instead: the run fails on that assertion on every page rather than passing
 *  quietly, which is the behaviour that makes the rest evidence.
 *
 *  ## `/ar` is measured as served
 *
 *  `ar` now ships, so its pages arrive with `dir="rtl"` and need no rewrite.
 *  They are measured as they are, against their `/en` twin as the LTR
 *  control. `hi` is left out: it is LTR and renders the same templates as
 *  `en`, so rewriting it would repeat the `/en` pass in another script.
 *  `/landing-page` is left out too: a frozen English snapshot outside
 *  `[locale]`, never served rtl, whose copied stylesheet predates the
 *  isolated-arrow rule this checks.
 */
const root = pathToFileURL(`${process.cwd()}/`);
const NATIVE_RTL = /^\/ar(?=\/|$)/;
const pages = ([...htmlPagesSync(root).keys()] as string[])
  // Next's own error documents, not routes in the manifest. `check:static` and
  // the axe scan exclude them on the same grounds.
  .filter((p) => !p.startsWith("/_") && !/^\/hi(?=\/|$)/.test(p) && p !== "/landing-page")
  .sort();

/** Serve every document mirrored.
 *
 *  `route.fetch()` re-issues the request through Playwright rather than the
 *  page, so the body can be edited before fulfilment. Non-document requests
 *  fall straight through — rewriting a stylesheet or a chunk here would be
 *  testing a page this site never serves.
 */
async function serveRtl(page: Page): Promise<void> {
  await page.route("**/*", async (route) => {
    if (route.request().resourceType() !== "document") {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    const body = await response.text();
    await route.fulfill({ response, body: body.replace('dir="ltr"', 'dir="rtl"') });
  });
}

type Geometry = {
  direction: string;
  /** How far the document scrolls horizontally, in px. 0 on a sound page. */
  overshoot: number;
  /** `tag.class` → how many boxes with that signature sit outside the viewport.
   *  A signature rather than a node list because the same rule produces the
   *  same defect on every card, and 40 identical entries read as 40 findings. */
  outside: Record<string, number>  /** Every forward arrow's computed `transform`, deduplicated with a count.
   *  The whole population rather than a boolean: one unmirrored arrow among
   *  twenty-six is the failure this exists to catch, and a boolean would hide
   *  which page it is on. */
  arrows: Record<string, number>;
};

async function measure(page: Page, path: string): Promise<Geometry> {
  await page.goto(path);
  await settle(page);
  return page.evaluate<Geometry>(() => {
    const doc = document.documentElement;
    const outside: Record<string, number> = {};

    /** Inside an ancestor that clips the inline axis and is itself on screen,
     *  a box shows only where it overlaps that ancestor. The people strip
     *  (`v2/strip.css`) is the case: a 3D drum whose cards the loop turns each
     *  frame, so which off-screen cards a pass caught depended on the frame,
     *  and the homepage failed one run in two at 390px under load. */
    const clippedOnScreen = (el: Element) => {
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const overflow = getComputedStyle(a).overflowX;
        if (overflow !== "hidden" && overflow !== "clip") continue;
        const box = a.getBoundingClientRect();
        if (box.left >= -1 && box.right <= doc.clientWidth + 1) return true;
      }
      return false;
    };

    // `content-visibility: auto` (`app/v2/home.css`) skips layout for bands
    // off screen, so what was measurable depended on where `settle()` left
    // the scroll: the two passes compared different sets of laid-out bands.
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
      if (getComputedStyle(el).contentVisibility === "auto") el.style.contentVisibility = "visible";
    }

    for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
      const box = el.getBoundingClientRect();
      // Zero-area nodes have no side to be on. `clip-path: inset(50%)` visually
      // hidden helpers and collapsed wrappers would otherwise dominate the list.
      if (box.width === 0 || box.height === 0) continue;
      // 1px of slack each way: `clientWidth` is an integer and sub-pixel layout
      // at 390px leaves a fractional tail on boxes that are flush, not outside.
      if (box.left >= -1 && box.right <= doc.clientWidth + 1) continue;
      // Unpainted boxes have no side either. The field case's map overlays
      // (`v2/field.css`) wait `visibility: hidden` at the stage's corner until
      // the loop places them, and under rtl that corner is the viewport's left
      // edge. Scroll they could cause is still caught: that is `overshoot`.
      if (getComputedStyle(el).visibility !== "visible") continue;
      if (clippedOnScreen(el)) continue;
      // The attribute, not `className`: on an SVG element that is an
      // `SVGAnimatedString`, and every SVG keyed as `[object.SVGAnimatedString]`.
      const cls = (el.getAttribute("class") ?? "").trim().split(/\s+/).filter(Boolean).join(".");
      const key = cls ? `${el.tagName.toLowerCase()}.${cls}` : el.tagName.toLowerCase();
      outside[key] = (outside[key] ?? 0) + 1;
    }

    /** SVG arrows are selected by the drawing, not by a class, because that
     *  is how `globals.css` mirrors them — keying on `d` adds no attribute.
     *  Isolated `→` glyphs cannot be selected by their character, so those
     *  three classes are the stylesheet's own list (After 9b). Reading the
     *  same selectors here means the test fails if either rule stops matching. */
    const arrows: Record<string, number> = {};
    const FORWARD = [
      'svg:has(> path[d="M3 8h10M9 4l4 4-4 4"])',
      ".idx3 .xa",
      ".nv-ml .k",
      ".fwd",
    ].join(", ");
    for (const el of Array.from(document.querySelectorAll<Element>(FORWARD))) {
      // Painted only. Chromium does not resolve `transform` inside a
      // `display: none` subtree, so the homepage's hidden breakpoint tree
      // reports `none` on a correctly mirrored arrow. Measured: /en carries 11
      // forward arrows, 9 painted and correct, 2 inside `.mob` at 1440px
      // reporting `none` with `--flip` still inheriting as "1". The homepage is
      // the only two-tree page in the build (Part 6: `class="dsk"` appears on
      // 1 of them), so without this the assertion fails on correct code, on
      // every run, at both breakpoints.
      if (el.getClientRects().length === 0) continue;
      const matrix = getComputedStyle(el).transform;
      arrows[matrix] = (arrows[matrix] ?? 0) + 1;
    }

    return {
      direction: getComputedStyle(doc).direction,
      overshoot: Math.max(0, doc.scrollWidth - doc.clientWidth),
      outside,
      arrows,
    };
  });
}

/** Signatures that RTL adds, or adds more of, than LTR had. */
function introduced(ltr: Geometry, rtl: Geometry): Record<string, string> {
  const gained: Record<string, string> = {};
  for (const [key, count] of Object.entries(rtl.outside)) {
    const before = ltr.outside[key] ?? 0;
    if (count > before) gained[key] = `${before} -> ${count}`;
  }
  return gained;
}

test.describe("rtl", () => {
  /** Three passes over the page per test, against a 60s global budget sized in
   *  Part 6 for the axe scan's one pass.
   *
   *  Each test here does two `goto`s (the LTR control and the mirrored run),
   *  two `settle()`s -- which scroll the whole document so every reveal paints
   *  -- and a full-page screenshot, which Playwright takes by scrolling and
   *  stitching. Measured 23 Sep: `/en/products/hellov` (115,828 bytes, the
   *  longest page after the homepage) failed at mobile with
   *  `page.screenshot: Test timeout of 60000ms exceeded` while the other 293
   *  tests passed. The suite was 166 tests when 60s was chosen and is 294 now,
   *  still at `workers: 2` alongside `next start`; the full run went 11.2m to
   *  13.1m when the consent banner added markup to all 60 pages.
   *
   *  Scoped here rather than raised globally: a 60s axe failure is exactly
   *  what Part 6 wanted to stay visible, and `retries: 0` is kept for the same
   *  reason. */
  test.describe.configure({ timeout: 120_000 });

  for (const path of pages) {
    test(`${path}: mirrors without breaking the inline axis`, async ({ page }, testInfo) => {
      const native = NATIVE_RTL.test(path);
      const ltr = await measure(page, native ? path.replace(NATIVE_RTL, "/en") : path);
      expect(ltr.direction, "the control pass must be ltr").toBe("ltr");

      if (!native) await serveRtl(page);
      const rtl = await measure(page, path);

      // The guard. Everything below compares a page against itself otherwise.
      expect(rtl.direction, "the document must actually be rtl").toBe("rtl");

      // The "visually" half of condition 15. Attached rather than compared:
      // there is no LTR baseline a mirrored page should match, and a snapshot
      // suite would assert only that the residue is stable. Reviewed by eye
      // once, then kept for whoever reviews it next.
      await testInfo.attach(`rtl${path.replace(/\//g, "_")}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });

      expect(introduced(ltr, rtl), "boxes pushed outside the viewport by RTL").toEqual({});

      // The arrow mirror, which no geometric check can see: a 14px icon flipped
      // the wrong way moves nothing outside the viewport. Vacuous on a page with
      // no arrow, which is why the control's identity matrix is asserted too -
      // together they prove the selector matched something and that `--flip`
      // reached it.
      const ltrArrows = Object.keys(ltr.arrows);
      const rtlArrows = Object.keys(rtl.arrows);
      expect(ltrArrows.filter((m) => m !== "matrix(1, 0, 0, 1, 0, 0)")).toEqual([]);
      expect(
        rtlArrows.filter((m) => m !== "matrix(-1, 0, 0, 1, 0, 0)"),
        "every forward arrow must be mirrored under rtl",
      ).toEqual([]);
      expect(
        rtl.overshoot,
        `horizontal scroll gained by mirroring (ltr overshoot was ${ltr.overshoot}px)`,
      ).toBeLessThanOrEqual(ltr.overshoot);
    });
  }
});
