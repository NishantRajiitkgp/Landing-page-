/** Breadcrumb for inner pages — mono ledger trail. Last item is the current page.
 *
 *  The "Home" rung is rendered here rather than passed in as a crumb, which is
 *  why `lib/seo/schema/breadcrumbs.ts` prepends it when building the
 *  `BreadcrumbList` — the two have to agree, and `check-schema.mjs` compares
 *  what this renders against what that emits, per page.
 *
 *  THAT RUNG IS NOW `chrome.breadcrumb.home`, so the two sides are a string in
 *  a dictionary and a literal in a schema builder. They cannot disagree today
 *  (`en` is the only locale, so both are "Home"), and `tools/test/copy.test.ts`
 *  runs the real `breadcrumbList()` and compares its first item's `name`
 *  against this key so that they cannot disagree tomorrow either. See the
 *  "Known couplings" note in `lib/copy/index.ts`.
 */
import { AppLink } from "@/components/chrome/AppLink";
import type { Crumb } from "@/lib/seo/schema/breadcrumbs";
import { CHROME } from "@/lib/copy/chrome";
import { copy } from "@/lib/copy/request";

export async function Breadcrumb({ items }: { items: readonly Crumb[] }) {
  const t = (await copy(CHROME)).breadcrumb;

  return (
    <nav className="wrap crumbs" aria-label={t.label}>
      <AppLink href="/">{t.home}</AppLink>
      {items.map((it, i) => (
        <span key={i} style={{ display: "contents" }}>
          <span className="sep" aria-hidden="true">/</span>
          {it.href ? (
            <AppLink href={it.href}>{it.label}</AppLink>
          ) : (
            <span className="here" aria-current="page">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
