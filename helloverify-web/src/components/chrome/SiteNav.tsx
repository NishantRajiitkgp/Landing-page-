/**
 * Site navigation — audience-first per INFORMATION-ARCHITECTURE.md §2.
 * Five commercial paths + the single primary CTA; About/Support live in the
 * footer. Mobile menu is CSS-only (checkbox disclosure) for the design phase.
 */
import { Logo } from "@/components/brand/Logo";

const LINKS = [
  { href: "/governments", label: "Governments" },
  { href: "/business", label: "Business" },
  { href: "/individuals", label: "Individuals" },
  { href: "/platform", label: "Platform" },
  { href: "/resources", label: "Resources" },
];

export function SiteNav() {
  return (
    <header className="nav2">
      <div className="wrap nbar">
        <a href="/" style={{ display: "flex", alignItems: "center" }} aria-label="HelloVerify — home">
          <Logo width={103} height={30} />
        </a>
        <nav className="links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <div className="acts">
          <a href="#" className="lang">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
              <path d="M1.75 8h12.5M8 1.75c2 2 2 10.5 0 12.5M8 1.75c-2 2-2 10.5 0 12.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span>English</span>
          </a>
          <a href="/contact" className="btn btn-ink btn-sm">Talk to sales</a>
          <label htmlFor="nav-menu-toggle" className="burger" aria-label="Open menu">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2.5 5h11M2.5 11h11" stroke="#15140F" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </label>
        </div>
      </div>
      {/* mobile disclosure panel; the checkbox precedes it so :checked ~ .menu applies */}
      <input type="checkbox" id="nav-menu-toggle" className="mtoggle vh" />
      <nav className="menu" aria-label="Primary, mobile">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            <span>{l.label}</span>
            <span className="k">→</span>
          </a>
        ))}
        <a href="/contact"><span>Contact &amp; support</span><span className="k">→</span></a>
      </nav>
    </header>
  );
}
