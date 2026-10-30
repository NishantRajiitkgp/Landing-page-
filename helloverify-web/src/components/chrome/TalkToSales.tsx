/** Floating "Talk to sales" control, mounted once from the locale layout so it
 *  sits on every page. A plain anchor, not a client component: the label is
 *  the nav CTA (`chrome.nav.cta`) and the destination is the same enquiry
 *  form `SiteNav` already uses, so the two cannot drift in wording.
 *
 *  Synchronous on purpose, the same reason `ConsentBanner` is. The layout
 *  already has the locale, and `pick()` plus `localise()` need no
 *  `getLocale()` await and add no client runtime. */
import { pick } from "@/lib/copy";
import { CHROME } from "@/lib/copy/chrome";
import { localise } from "@/lib/i18n/href";

/** Same path as `ENQUIRY` in `chrome/SiteNav.tsx`. */
const ENQUIRY = "/contact?tab=enquiry";

export function TalkToSales({ locale }: { locale: string }) {
  const label = pick(CHROME, locale).nav.cta;

  return (
    <a className="hv-sales" href={localise(ENQUIRY, locale)}>
      <span className="hv-sales-ic" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 19.5a7.5 7.5 0 1 0-6.6-3.9L4.5 19.5l3.9-.9A7.5 7.5 0 0 0 12 19.5z" />
        </svg>
      </span>
      {label}
    </a>
  );
}
