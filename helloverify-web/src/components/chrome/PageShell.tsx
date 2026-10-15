/** Standard inner-page frame: nav → breadcrumb → content → closing CTA → footer.
 *
 *  It also emits the page's `BreadcrumbList` (BUILD-SPEC §8.2, AUDIT C2), from
 *  the SAME `crumbs` array it hands to `<Breadcrumb>`. That is the whole design:
 *  the markup and the visible trail are one list, not two, so Google's rule that
 *  breadcrumb markup must match what a user sees holds by construction rather
 *  than by review. See `lib/seo/schema/breadcrumbs.ts` for why the last item
 *  carries no `item`, and why the legal pages get `null`.
 *
 *  Async because the locale is needed to build absolute URLs and `getLocale()`
 *  is the server-side accessor — the same call `AppLink` already makes for every
 *  link in this shell, so no new cost and no client boundary. It resolves
 *  statically because every page calls `setRequestLocale` (BUILD-SPEC §5).
 */
// First, so the inner-page rules keep their old place in the cascade: after
// `globals.css` (where they sat at the end of `pages.css`) and before any
// section sheet the page imports. Only inner pages load them; see the file.
import "@/app/inner.css";
import { SiteNav } from "@/components/chrome/SiteNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Breadcrumb } from "@/components/chrome/Breadcrumb";
import { ClosingCta } from "@/components/chrome/ClosingCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { CHROME } from "@/lib/copy/chrome";
import { copy } from "@/lib/copy/request";
import { breadcrumbList, type Crumb } from "@/lib/seo/schema/breadcrumbs";
import { getLocale } from "next-intl/server";

export async function PageShell({
  crumbs,
  children,
  closing,
  showSignUp = true,
}: {
  crumbs: readonly Crumb[];
  children: React.ReactNode;
  /** `false` drops the closing band, for pages whose old version ended on
   *  its last section. */
  closing?: React.ComponentProps<typeof ClosingCta> | false;
  /** `false` on flows that have their own account, so the bar does not offer
   *  Sign up next to that flow's Sign out. */
  showSignUp?: boolean;
}) {
  const locale = await getLocale();
  const breadcrumbs = breadcrumbList(crumbs, locale, (await copy(CHROME)).breadcrumb.home);

  return (
    <div className="page">
      <SiteNav showSignUp={showSignUp} />
      <Breadcrumb items={crumbs} />
      {breadcrumbs && <JsonLd data={breadcrumbs} />}
      <main id="main-content">{children}</main>
      {closing !== false && <ClosingCta {...closing} />}
      <SiteFooter />
    </div>
  );
}
