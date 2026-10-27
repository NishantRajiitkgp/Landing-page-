"use client";

/** The language links, pointed at the page the visitor is already on.
 *
 *  `LocaleSwitch` cannot read the URL on the server: `headers()` would turn
 *  every prerendered page dynamic. next-intl's `usePathname` would force
 *  `NextIntlClientProvider` onto the root — the runtime `AppLink` measured
 *  and rejected. `next/navigation`'s `usePathname` is the App Router's own
 *  hook and does not need that provider.
 *
 *  Search and hash are applied after mount. Reading them during render
 *  (`useSearchParams`, or `window` in render) either deopts static generation
 *  or mismatches hydration. The path is correct in the prerendered HTML;
 *  `?tab=` and `#fragment` catch up before a person can open the menu. */
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { switchLocaleHref } from "@/lib/i18n/href";

export function LocaleLinks({
  locales,
  others,
}: {
  locales: readonly string[];
  others: readonly { code: string; name: string }[];
}) {
  const pathname = usePathname() || "/";
  const [extra, setExtra] = useState("");

  useEffect(() => {
    setExtra(`${window.location.search}${window.location.hash}`);
  }, [pathname]);

  return others.map((l) => (
    <a key={l.code} href={switchLocaleHref(pathname, l.code, locales, extra)} hrefLang={l.code} lang={l.code}>
      {l.name}
    </a>
  ));
}
