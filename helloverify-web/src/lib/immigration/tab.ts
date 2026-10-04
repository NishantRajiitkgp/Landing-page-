/** Old `ImmigrationMigrationServicePage` tabs — `?tab=applicant` | `?tab=authorities`.
 *
 *  The old SPA defaulted a bare query to authorities because both panels
 *  lived on one URL. This host split them: `/products/immigration` is the
 *  applicant vertical (visa portal CTA), `/solutions/immigration-authorities`
 *  is the authority vertical. A missing or junk `tab` therefore opens
 *  applicant, matching this page's body. `tab=authorities` is still a real
 *  value — the product page hops to the authority URL after mount.
 */

export const IMMIGRATION_TABS = ["authorities", "applicant"] as const;
export type ImmigrationTab = (typeof IMMIGRATION_TABS)[number];

export const IMMIGRATION_AUTHORITIES_HREF = "/solutions/immigration-authorities";
export const IMMIGRATION_APPLICANT_HREF = "/products/immigration?tab=applicant";

export function parseImmigrationTab(raw: string | null | undefined): ImmigrationTab {
  return raw === "authorities" ? "authorities" : "applicant";
}

export function writeImmigrationTab(tab: ImmigrationTab): void {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tab);
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}
