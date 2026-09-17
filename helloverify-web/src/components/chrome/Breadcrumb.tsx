/** Breadcrumb for inner pages — mono ledger trail. Last item is the current page. */
import { AppLink } from "@/components/chrome/AppLink";
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="wrap crumbs" aria-label="Breadcrumb">
      <AppLink href="/">Home</AppLink>
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
