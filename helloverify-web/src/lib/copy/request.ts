/** The request-scoped accessor. Everything about WHY this layer is shaped the
 *  way it is lives in `./index`'s header — including why this one function is
 *  not in that file.
 *
 *  The short of it: `next-intl/server` pulls in `next/headers`, which does not
 *  resolve outside a Next runtime. Measured again while writing this module —
 *  `npx vitest run tools/test/copy.test.ts` with `copy()` imported from
 *  `./index` fails at collection with
 *  `Error: Cannot find module 'next/headers'`, and `tools/test/locales.test.ts`
 *  already recorded the same failure for `app/[locale]/layout.tsx`. Splitting
 *  the pure `pick()` out is what lets `copy.test.ts` import every dictionary
 *  and assert its keyset; a one-module layer would have been untestable.
 *
 *  Nothing else belongs here. This is the ONLY module in `lib/copy` that
 *  touches next-intl, which is what keeps `./index` and every `<ns>.en.tsx`
 *  loadable from bare Node and from Vitest.
 */
import { getLocale } from "next-intl/server";

import { pick, type Dictionary } from "./index";

/** `const t = await copy(CHROME)` in a Server Component.
 *
 *  Async rather than a `locale` prop threaded from the shell: the components
 *  that need it already `await getLocale()` (`chrome/AppLink.tsx`,
 *  `chrome/LocaleSwitch.tsx`, `chrome/PageShell.tsx`), and next-intl caches
 *  that call per request, so this adds no work — only an await that the
 *  component tree already contains. The rejected alternative (props from the
 *  shell, and the 33 `app/[locale]/**` files it would drag in) is argued in
 *  `./index`.
 *
 *  A component that ALREADY holds the locale — `chrome/ConsentBanner.tsx` is
 *  the only one — calls `pick(DICT, locale)` instead and stays synchronous.
 */
export async function copy<T>(dict: Dictionary<T>): Promise<T> {
  return pick(dict, await getLocale());
}
