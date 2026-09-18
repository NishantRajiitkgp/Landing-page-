/** `BreadcrumbList`, derived from the trail the page already renders
 *  (BUILD-SPEC §8.2 — "every page below depth 1", AUDIT C2).
 *
 *  THE POINT OF THIS FILE IS THAT THERE IS NO SECOND LIST. `PageShell` already
 *  takes a `crumbs` prop and renders it through `components/chrome/Breadcrumb`;
 *  this builds the JSON-LD from that same array, in the same component, so the
 *  markup and the visible trail cannot disagree. It is the principle
 *  `lib/seo/routes.ts` applies to the sitemap and `lib/seo/metadata.ts` applies
 *  to the canonical: one source, checked against the build output rather than
 *  trusted.
 *
 *  It matters more here than it looks. Google's structured-data policy is that
 *  breadcrumb markup must match the breadcrumb a user sees; a hand-maintained
 *  parallel array in each of 31 page files would satisfy the validator on the
 *  day it was written and drift the first time a label was reworded.
 *  `tools/seo/check-schema.mjs` re-parses the visible `<nav
 *  aria-label="Breadcrumb">` out of the emitted HTML and compares it item for
 *  item, so this claim is measured per page rather than argued here.
 *
 *  TWO THINGS ABOUT THE REAL DATA that invalidate the obvious design:
 *
 *  1. **Crumb hrefs are not URL ancestors.** `/checks/identity` renders
 *     Home → Resources → Check library → Identity, i.e. `/resources` and
 *     `/resources/checks` — neither of which is a path prefix of
 *     `/checks/identity`. Same for `/countries/*` and `/resources/blog/*`. So
 *     the trail is an IA hierarchy, not a URL hierarchy, and "each crumb is a
 *     prefix of the canonical" is NOT a valid check. What is valid, and is
 *     enforced below, is that every crumb href is a real route in the manifest
 *     — a breadcrumb pointing at a redirect or a 404 is AUDIT A2 in miniature.
 *
 *  2. **`/legal/[slug]` has an intermediate rung that is not a page.** Its
 *     trail is Home → Legal → Privacy Policy, and `/legal` has no route: the
 *     crumb is rendered as plain text with no `href`. Google requires `item` on
 *     every `ListItem` except the last, so that list cannot be expressed
 *     validly. This returns `null` for it rather than emitting a broken list or
 *     silently dropping the rung — dropping it would make the markup disagree
 *     with the visible trail, which is the one rule this file exists to keep.
 *     The result is that the eight legal pages carry no `BreadcrumbList` —
 *     47 of the 56 pages have one, which is 56 minus the home page (no
 *     `PageShell`) minus those eight. They are the lowest-priority routes in
 *     the manifest (0.3) and a breadcrumb rich result there is worth
 *     nothing. The real fix is a `/legal` index page, which is an IA change,
 *     not a schema one.
 *
 *  Scope note: §8.2 says "every page below depth 1", which would exclude
 *  `/business`, `/platform` and the other depth-1 hubs. This emits wherever
 *  `PageShell` renders a trail, which is every page except the home page — a
 *  superset. A hub's trail is Home → Business, a valid two-item list that
 *  describes a real position in the hierarchy, and suppressing it would mean a
 *  depth rule in a second place that the visible breadcrumb does not share.
 */
import type { BreadcrumbList, ListItem, WithContext } from "schema-dts";

import { localise } from "@/lib/i18n/href";
import { allRoutes } from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/seo/site";

/** The shape `PageShell`, `Breadcrumb` and `VerticalPage` all pass around. It
 *  lives here, next to the thing that has to reason about `href` being
 *  optional, rather than being re-declared inline in three components. */
export type Crumb = { label: string; href?: string };

/** Same set `lib/seo/metadata.ts` builds, for the same reason: a crumb href
 *  that is not a route is a link into a redirect or a 404, advertised to a
 *  crawler as a parent page. Built once per build. */
const KNOWN_PATHS: ReadonlySet<string> = new Set(allRoutes().map((r) => r.path));

/**
 * `breadcrumbList([{ label: "Business", href: "/business" }, { label: "SMB" }], "en")`
 * → Home → Business → SMB, absolute, in `en`.
 *
 * Returns `null` when the trail cannot be expressed validly — see point 2
 * above. Callers render nothing in that case.
 */
export function breadcrumbList(
  crumbs: readonly Crumb[],
  locale: string,
): WithContext<BreadcrumbList> | null {
  /** `components/chrome/Breadcrumb.tsx` renders the Home link itself and does
   *  not take it as a crumb, so it is prepended here to match what the page
   *  actually shows. If that component ever stops rendering Home, this list
   *  gains a phantom first item — which is exactly the disagreement
   *  `check-schema.mjs` compares the two for. */
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];

  const items: ListItem[] = [];
  for (const [i, crumb] of trail.entries()) {
    const isLast = i === trail.length - 1;

    if (crumb.href !== undefined && !KNOWN_PATHS.has(crumb.href)) {
      throw new Error(
        `breadcrumbList: ${JSON.stringify(crumb.href)} is not in the route ` +
          `manifest (lib/seo/routes.ts). A breadcrumb pointing at a redirect ` +
          `or a 404 tells a crawler the parent page is somewhere it is not.`,
      );
    }

    if (crumb.href === undefined && !isLast) return null;

    items.push({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      /** `item` is omitted on the last entry, which is Google's documented
       *  form for the current page: the page's own URL is already stated by
       *  its canonical, and restating it here would be a second string to get
       *  wrong. `PageShell` is handed no pathname (the same limitation
       *  `generateMetadata` has — see `lib/seo/metadata.ts`), so the
       *  alternative would mean passing the route to `PageShell` as well and
       *  giving 31 pages a second chance to name the wrong one. */
      ...(isLast || crumb.href === undefined
        ? {}
        : { item: absoluteUrl(localise(crumb.href, locale)) }),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
