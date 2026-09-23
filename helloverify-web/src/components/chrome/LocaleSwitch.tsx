/** The locale control, honest about there being exactly one locale.
 *
 *  Both call sites shipped `<a href="#">` with a globe and the literal word
 *  "English": `chrome/SiteNav.tsx` and `chrome/SiteFooter.tsx`, so 2 of the 14
 *  `href="#"` anchors left in `src/**`, on every one of the 56 routes. It was
 *  dead CORRECTLY — `routing.locales` is `["en"]`, so there is nowhere to
 *  switch to — but a control that visibly does nothing when clicked reads as a
 *  broken site, and it sat next to the primary CTA.
 *
 *  WHAT IT EMITS TODAY: a `<span class="lang">`, not an anchor, with the same
 *  children in the same order. `.lang` is a class selector (`pages.css:18`),
 *  so the nav's rule still matches. The footer's copy took its colour from
 *  `.foot2 .co a` (`pages.css:74`), which a `<span>` no longer matches, so
 *  that call site restates the value as `var(--ink-soft)` — `--ink-soft` IS
 *  `#3D3B35` (`design.css:30`), so the computed colour is unchanged and
 *  `hv/no-color-literal` stays satisfied. Rejected: adding `.foot2 .co .lang`
 *  to `pages.css`, which edits a stylesheet three other sections share to fix
 *  one element.
 *
 *  HOW IT BECOMES A REAL SWITCHER: add `"hi"` to `routing.locales`. That one
 *  array entry is the entire change — the map below already renders every
 *  locale other than the current one as a link, and `ENDONYM` already carries
 *  `hi` and `ar`. Nothing in this file, `SiteNav` or `SiteFooter` is touched,
 *  which is what BUILD-SPEC §3.4 means by "accept a 4th locale by adding one
 *  array entry". Rejected: leaving a bare `<span>` at each call site and
 *  building the switcher later — that defers the same two edits plus a third,
 *  and §3.4's promise would be untrue in the meantime.
 *
 *  The link goes to that locale's HOME, not to the mirrored current path.
 *  Mirroring needs the request pathname; there is no stable server-side way to
 *  read it in this router, and the client-side answer is next-intl's
 *  `usePathname`, which forces `NextIntlClientProvider` at the root and the
 *  15.7 KB brotli runtime `chrome/AppLink.tsx` measured and rejected. A switch
 *  that lands on the localised home is worse than one that lands on the same
 *  page, and better than 15.7 KB on all 56 routes.
 *
 *  ENDONYM is a table rather than `Intl.DisplayNames`: the name has to be in
 *  its OWN language — a reader who needs हिन्दी cannot be asked to find the
 *  English word "Hindi" first — and `Intl.DisplayNames` output depends on the
 *  ICU data compiled into whichever Node is running, which is not the same on
 *  the build box and in CI. A table makes a locale a data change, the shape
 *  `RTL_LOCALES` in `lib/i18n/routing.ts` already uses.
 *
 *  AND THAT IS WHY THIS FILE HAS NO ENTRY IN `lib/copy/chrome`, which is worth
 *  writing down because it is the one component in this directory the copy
 *  migration deliberately did not touch. An endonym is BY DEFINITION the same
 *  string in every locale — "English" is "English" on the Hindi page too, or
 *  it is not an endonym. Putting the table in the dictionary would mean every
 *  future locale file repeats all three names verbatim to satisfy
 *  `Record<Locale, T>`, and the first translator to render `hi: "Hindi"` in
 *  their own language would break the control for exactly the reader it is
 *  for. Not-copy is a real category, and this is it. */
import type { CSSProperties } from "react";
import { getLocale } from "next-intl/server";

import { localise } from "@/lib/i18n/href";
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
    <span className="lang" style={style}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
        <path d="M1.75 8h12.5M8 1.75c2 2 2 10.5 0 12.5M8 1.75c-2 2-2 10.5 0 12.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      <span>{endonym(locale)}</span>
      {others.map((l) => (
        <a key={l} href={localise("/", l)} hrefLang={l} lang={l}>{endonym(l)}</a>
      ))}
    </span>
  );
}
