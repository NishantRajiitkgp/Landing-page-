/**
 * Site navigation — audience-first per INFORMATION-ARCHITECTURE.md §2.
 * Five commercial paths + the single primary CTA; About/Support live in the
 * footer. Mobile menu is CSS-only (checkbox disclosure) for the design phase.
 *
 * The ORDER and the hrefs stay here and the words come from
 * `lib/copy/chrome`: an href is routing, not copy. `LINKS` is typed
 * `readonly NavHref[]`, so a sixth destination added without a label is a
 * compile error on the array below rather than a blank link — see the copy
 * layer's header for why the table is keyed by path.
 */
import { Logo } from "@/components/brand/Logo";
import { AppLink } from "@/components/chrome/AppLink";
import { LocaleSwitch } from "@/components/chrome/LocaleSwitch";
import { CHROME, type NavHref } from "@/lib/copy/chrome";
import { copy } from "@/lib/copy/request";

const LINKS: readonly NavHref[] = [
  "/governments",
  "/business",
  "/individuals",
  "/platform",
  "/resources",
];

export async function SiteNav() {
  const t = (await copy(CHROME)).nav;

  return (
    <header className="nav2">
      <div className="wrap nbar">
        <AppLink href="/" style={{ display: "flex", alignItems: "center" }} aria-label={t.logoHome}>
          <Logo width={103} height={30} />
        </AppLink>
        <nav className="links" aria-label={t.primary}>
          {LINKS.map((href) => (
            <AppLink key={href} href={href}>{t.links[href]}</AppLink>
          ))}
        </nav>
        <div className="acts">
          {/* Was `<a href="#">`, dead on all 56 routes because
              `routing.locales` is `["en"]`. `LocaleSwitch` emits the same
              children inside a `<span class="lang">` and turns into a real
              switcher on one array entry — see its header. */}
          <LocaleSwitch />
          <AppLink href="/contact" className="btn btn-ink btn-sm">{t.cta}</AppLink>
          {/* The accessible name is real text, not `aria-label`: a <label> has no
              role that permits a name from `aria-label`, so axe reports
              `aria-prohibited-attr` (serious) and assistive tech may announce
              the control as unnamed. Measured on all 56 pages. */}
          <label htmlFor="nav-menu-toggle" className="burger">
            <span className="sr-only">{t.openMenu}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2.5 5h11M2.5 11h11" stroke="#15140F" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </label>
        </div>
      </div>
      {/* mobile disclosure panel; the checkbox precedes it so :checked ~ .menu applies */}
      <input type="checkbox" id="nav-menu-toggle" className="mtoggle vh" />
      <nav className="menu" aria-label={t.primaryMobile}>
        {LINKS.map((href) => (
          <AppLink key={href} href={href}>
            <span>{t.links[href]}</span>
            <span className="k">→</span>
          </AppLink>
        ))}
        <AppLink href="/contact"><span>{t.contact}</span><span className="k">→</span></AppLink>
      </nav>
    </header>
  );
}
