/** One anchor that knows whether it is going somewhere we own.
 *
 *  With `localePrefix: "always"` every internal URL must carry its locale, so a
 *  bare anchor to "/about" now points at a path that does not exist and has to
 *  be redirected — the redirect chain BUILD-SPEC §6 exists to prevent.
 *
 *  WHY NOT next-intl's `<Link>`: it is a Client Component that reads the locale
 *  from `NextIntlClientProvider`, so using it anywhere forces that provider on
 *  at the root and ships next-intl's client runtime to every visitor. Measured:
 *  15.7 KB brotli, on a page already over the §9.1 budget, to compute a string
 *  prefix the server already knows. This resolves the locale on the server and
 *  emits a plain anchor instead — no client boundary, no runtime, no provider.
 *
 *  The site had no client-side navigation before this change either (there was
 *  not a single `next/link` in the codebase), so nothing regresses.
 *
 *  A blanket rewrite to a locale-prefixing component would also have been
 *  wrong: several hrefs are runtime values that are sometimes external
 *  (`https://app.helloverify.com`) and sometimes a fragment (`#turnaround`).
 *  Prefixing either breaks it, so the decision is made per href, here, rather
 *  than trusted to every call site.
 */
import type { ComponentProps } from "react";
import { getLocale } from "next-intl/server";

import { localise } from "@/lib/i18n/href";

type AnchorProps = Omit<ComponentProps<"a">, "href">;

export async function AppLink({
  href,
  children,
  ...rest
}: AnchorProps & { href: string }) {
  const locale = await getLocale();

  return (
    <a href={localise(href, locale)} {...rest}>
      {children}
    </a>
  );
}
