/** Breadcrumb for inner pages — mono ledger trail. Last item is the current page. */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="wrap crumbs" aria-label="Breadcrumb">
      <a href="/">Home</a>
      {items.map((it, i) => (
        <span key={i} style={{ display: "contents" }}>
          <span className="sep" aria-hidden="true">/</span>
          {it.href ? (
            <a href={it.href}>{it.label}</a>
          ) : (
            <span className="here" aria-current="page">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
