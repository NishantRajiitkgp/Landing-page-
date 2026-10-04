/** Old `ContactUsUnified` top tabs — `?tab=enquiry` | `?tab=track`. */

export const CONTACT_TABS = ["enquiry", "track"] as const;
export type ContactTab = (typeof CONTACT_TABS)[number];

export function parseContactTab(raw: string | null | undefined): ContactTab {
  return raw === "track" ? "track" : "enquiry";
}

export function writeContactTab(tab: ContactTab): void {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tab);
  // Keep Next's router state on `history.state`. `replaceState(null, …)`
  // wipes it and App Router treats the call as a navigation back to the
  // pathname without the query we just wrote.
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}
