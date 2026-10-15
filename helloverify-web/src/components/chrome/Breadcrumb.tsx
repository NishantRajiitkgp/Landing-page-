/** Breadcrumb for inner pages — mono ledger trail. Last item is the current page.
 *
 *  The "Home" rung is rendered here rather than passed in as a crumb, which is
 *  why `lib/seo/schema/breadcrumbs.ts` prepends it when building the
 *  `BreadcrumbList` — the two have to agree, and `check-schema.mjs` compares
 *  what this renders against what that emits, per page.
 *
 *  That rung is `chrome.breadcrumb.home`, and `PageShell` hands the same leaf
 *  to `breadcrumbList()`, so the two agree in every locale.
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
