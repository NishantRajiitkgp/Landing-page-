/** The locale switcher. One control, two call sites (`SiteNav`, `SiteFooter`)
 *  plus the burger menu, so a fourth locale is still one `routing.locales`
 *  entry and this file does not grow.
 *
 *  A DROPDOWN, not the three endonyms in a row. Unicode `→` was the last
 *  directional residue; this was the leftover layout one: three names sat
 *  in `.acts` and the bar hid the whole control below 1280px to fit. The
 *  trigger is the current endonym; the others live in a `<details>` panel,
 *  the same disclosure the burger groups already use.
 *
 *  The link stays on the current page and only swaps the locale prefix:
 *  `/en/products/customer-kyc` becomes `/hi/products/customer-kyc`.
 *  The prefix swap lives in `LocaleLinks`: this file still cannot see the
 *  request path, and calling `headers()` for it would make every page dynamic.
 *
 *  ENDONYM is a table rather than `Intl.DisplayNames`: the name has to be in
 *  its OWN language — a reader who needs हिन्दी cannot be asked to find the
 *  English word "Hindi" first — and `Intl.DisplayNames` output depends on the
 *  ICU data compiled into whichever Node is running. A table makes a locale a
 *  data change, the shape `RTL_LOCALES` in `lib/i18n/routing.ts` already uses.
 *
 *  AND THAT IS WHY THIS FILE HAS NO ENTRY IN `lib/copy/chrome`. An endonym is
 *  BY DEFINITION the same string in every locale — "English" is "English" on
 *  the Hindi page too, or it is not an endonym. Putting the table in the
 *  dictionary would mean every future locale file repeats all three names
 *  verbatim to satisfy `Record<Locale, T>`. */
import type { CSSProperties } from "react";
import { getLocale } from "next-intl/server";

import { LocaleLinks } from "@/components/chrome/LocaleLinks";
import { routing } from "@/lib/i18n/routing";

const ENDONYM: Record<string, string | undefined> = {
  en: "English",
  hi: "हिन्दी",
  ar: "العربية",
};

function endonym(locale: string): string {
  return ENDONYM[locale] ?? locale.toUpperCase();
}

export async function LocaleSwitch({ style }: { style?: CSSProperties }) {
  const locale = await getLocale();
  const others = routing.locales.filter((l) => l !== locale);

  return (
    <details className="lang" style={style}>
      <summary className="lang-sum">
        <span className="lang-now">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
            <path d="M1.75 8h12.5M8 1.75c2 2 2 10.5 0 12.5M8 1.75c-2 2-2 10.5 0 12.5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <span>{endonym(locale)}</span>
        </span>
        <svg className="nv-car" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 3.75L5 6.75l3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="lang-list">
        <LocaleLinks
          locales={routing.locales}
          others={others.map((l) => ({ code: l, name: endonym(l) }))}
        />
      </div>
    </details>
  );
}
