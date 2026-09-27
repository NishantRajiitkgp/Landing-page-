/**
 * Site navigation — the old site's menu (helloverify.com, Sep 2026) in the
 * new site's type and paper: Solutions, Products, Premium services and
 * Support open panels, About and Technology are plain links.
 *
 * Desktop panels are `chrome/NavDropdown` (hover, click/tap, Escape — see its
 * header); their contents are rendered here, on the server. On a phone the
 * same groups are `<details>` inside the CSS-only burger menu.
 *
 * Every class is `nv-`-prefixed. The first version used `.dd`/`.dd-card`,
 * which `app/v2/diligence.css` already owns on the homepage — its 72–140px
 * padding landed on the dropdown wrappers and pushed the triggers 10px above
 * the plain links. Section CSS is not scoped, so the prefix is the scope.
 *
 * The ORDER, hrefs and icons stay here; the words are in `lib/copy/chrome`,
 * keyed by item id so an entry without a label is a type error.
 */
import { Logo } from "@/components/brand/Logo";
import { AppLink } from "@/components/chrome/AppLink";
import { LocaleSwitch } from "@/components/chrome/LocaleSwitch";
import { NavDropdown } from "@/components/chrome/NavDropdown";
import { CHROME, type ChromeCopy } from "@/lib/copy/chrome";
import { copy } from "@/lib/copy/request";

type T = ChromeCopy["nav"];
type ItemId = keyof T["items"];
type ColId = keyof T["menus"]["solutions"]["cols"];
type IconId = "heart" | "bank" | "doc" | "building" | "case" | "store" | "user" | "id" | "star" | "passport" | "globe" | "badge" | "chat" | "shield" | "mail";
type Item = { id: ItemId; href: string; icon: IconId };

/** 24-unit line icons, stroked from CSS (`.nv-ic svg`). */
const ICONS: Record<IconId, React.ReactNode> = {
  heart: <path d="M12 19.5s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 7.6a3.9 3.9 0 0 1 7 2.3c0 5.3-7 9.6-7 9.6zM7.8 11.8h2.1l1.2-2.1 1.9 3.8 1.2-1.7h2" />,
  bank: <path d="M4 9.5L12 5l8 4.5M6 10.5v6.5M10 10.5v6.5M14 10.5v6.5M18 10.5v6.5M4 19.5h16" />,
  doc: <path d="M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6" />,
  building: <path d="M6 20.5v-16h12v16M4 20.5h16M9.5 8h1M13.5 8h1M9.5 11.5h1M13.5 11.5h1M10.5 20.5v-4h3v4" />,
  case: <path d="M4 8.5h16v11H4zM9 8.5v-2c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v2M4 13.5h16M11 13.5v1.5h2v-1.5" />,
  store: <path d="M4.5 9.5l1.5-5h12l1.5 5M4.5 9.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5M6 12v8h12v-8M10 20v-4.5h4V20" />,
  user: <path d="M10 11.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5zM4 19.5c.8-3.2 3.2-5 6-5 1.3 0 2.5.4 3.5 1.1M15 17l2 2 3.5-4" />,
  id: <path d="M3.5 6h17v12h-17zM9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 15.5c.5-1.5 1.6-2.3 3-2.3s2.5.8 3 2.3M14.5 10h3.5M14.5 13h3.5" />,
  star: <path d="M12 4.5l2.3 4.7 5.2.7-3.8 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.8-3.6 5.2-.7z" />,
  passport: <path d="M6.5 3.5h11v17h-11zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 10h6M12 7c1 1 1 5 0 6M12 7c-1 1-1 5 0 6M9.5 17h5" />,
  globe: <path d="M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5M12 3.5C9.7 5.9 8.6 8.7 8.6 12s1.1 6.1 3.4 8.5" />,
  badge: <path d="M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM9 13l-1.5 7 4.5-2.5 4.5 2.5L15 13M10 9l1.5 1.5L14.5 7.5" />,
  chat: <path d="M12 19.5a7.5 7.5 0 1 0-6.6-3.9L4.5 19.5l3.9-.9a7.5 7.5 0 0 0 3.6.9zM9 10.5c.3 1.9 2.3 3.9 4.5 4.5l1.3-1.3-1.8-1-.8.7c-.8-.4-1.5-1.1-1.9-1.9l.7-.8-1-1.8z" />,
  shield: <path d="M12 3.5l7 2.5v5.5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6zM9 12l2 2 4-4" />,
  mail: <path d="M4.5 6.5h15v11h-15zM4.5 7l7.5 6 7.5-6" />,
};

/** Solutions: three audiences, each column heading linking to its hub. */
const SOLUTIONS: { col: ColId; hub: string; items: Item[] }[] = [
  { col: "gov", hub: "/governments", items: [
    { id: "govHealth", href: "/governments/health", icon: "heart" },
    { id: "govImmigration", href: "/governments/immigration", icon: "bank" },
    { id: "govEducation", href: "/governments/manpower-education", icon: "doc" },
    { id: "govTrade", href: "/governments/trade", icon: "building" },
  ] },
  { col: "biz", hub: "/business", items: [
    { id: "forBusiness", href: "/business/enterprise", icon: "case" },
    { id: "forSmb", href: "/business/smb", icon: "store" },
    { id: "employee", href: "/business/employee-verification", icon: "user" },
    { id: "kyc", href: "/business/customer-kyc", icon: "id" },
  ] },
  { col: "consumer", hub: "/individuals", items: [
    { id: "individuals", href: "/individuals/home-family", icon: "star" },
    { id: "visa", href: "/individuals/immigration", icon: "passport" },
    { id: "global", href: "/platform/coverage", icon: "globe" },
  ] },
];

/** The old site's two columns: businesses on the left, people on the right.
 *  `.nv-grid2` fills column-first, so this order is left column, then right. */
const PRODUCTS: Item[] = [
  { id: "bgvEnterprise", href: "/business/enterprise", icon: "case" },
  { id: "bgvSmb", href: "/business/smb", icon: "store" },
  { id: "certifier", href: "/business/certifier", icon: "badge" },
  { id: "immigrationDocs", href: "/governments/immigration", icon: "bank" },
  { id: "hellov", href: "/individuals/hellov", icon: "chat" },
  { id: "trust", href: "/business/customer-kyc", icon: "shield" },
];

const PREMIUM: Item[] = [
  { id: "premHealth", href: "/governments/health", icon: "heart" },
  { id: "premImmigration", href: "/individuals/immigration", icon: "passport" },
  { id: "premConsumer", href: "/individuals/home-family", icon: "id" },
];

const SUPPORT: Item[] = [{ id: "enquiry", href: "/contact", icon: "mail" }];

function Entry({ item, t }: { item: Item; t: T }) {
  const c = t.items[item.id];
  return (
    <AppLink href={item.href} className="nv-i">
      <span className="nv-ic" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">{ICONS[item.icon]}</svg>
      </span>
      <span className="nv-tx">
        <span className="nv-t">{c.t}</span>
        <span className="nv-d">{c.d}</span>
      </span>
    </AppLink>
  );
}

function Arrow() {
  return (
    <svg className="nv-arr" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export async function SiteNav() {
  const t = (await copy(CHROME)).nav;
  const m = t.menus;

  return (
    <header className="nav2">
      <div className="wrap nbar">
        <AppLink href="/" style={{ display: "flex", alignItems: "center" }} aria-label={t.logoHome}>
          <Logo width={103} height={30} />
        </AppLink>
        <nav className="links" aria-label={t.primary}>
          <NavDropdown label={m.solutions.label} size="wide">
            <div className="nv-cols">
              {SOLUTIONS.map(({ col, hub, items }) => (
                <div key={col} className="nv-col">
                  <AppLink href={hub} className="nv-h nv-hl">{m.solutions.cols[col]}<Arrow /></AppLink>
                  {items.map((it) => <Entry key={it.id} item={it} t={t} />)}
                </div>
              ))}
            </div>
          </NavDropdown>
          <NavDropdown label={m.products.label} size="mid">
            <div className="nv-grid2">
              {PRODUCTS.map((it) => <Entry key={it.id} item={it} t={t} />)}
            </div>
            <AppLink href="/resources/checks" className="nv-foot">{m.products.all}<Arrow /></AppLink>
          </NavDropdown>
          <NavDropdown label={m.premium.label} size="narrow">
            <p className="nv-h">{m.premium.label}</p>
            <p className="nv-lede">{m.premium.lede}</p>
            {PREMIUM.map((it) => <Entry key={it.id} item={it} t={t} />)}
          </NavDropdown>
          <AppLink href="/about" className="nv-l">{t.about}</AppLink>
          <NavDropdown label={m.support.label} size="narrow">
            <p className="nv-h">{m.support.col}</p>
            {SUPPORT.map((it) => <Entry key={it.id} item={it} t={t} />)}
          </NavDropdown>
          <AppLink href="/platform/technology" className="nv-l">{t.technology}</AppLink>
        </nav>
        <div className="acts">
          {/* `LocaleSwitch` turns into a real switcher on one array entry — see its header. */}
          <LocaleSwitch />
          <AppLink href="/contact" className="btn btn-ink btn-sm">{t.cta}</AppLink>
          {/* Real text, not `aria-label`: a <label> has no role that permits
              a name from `aria-label` (axe `aria-prohibited-attr`, serious). */}
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
        <details>
          <summary>{m.solutions.label}<Caret /></summary>
          {SOLUTIONS.map(({ col, hub, items }) => (
            <div key={col} className="nv-col">
              <AppLink href={hub} className="nv-h nv-hl">{m.solutions.cols[col]}<Arrow /></AppLink>
              {items.map((it) => <Entry key={it.id} item={it} t={t} />)}
            </div>
          ))}
        </details>
        <details>
          <summary>{m.products.label}<Caret /></summary>
          <div className="nv-col">
            {PRODUCTS.map((it) => <Entry key={it.id} item={it} t={t} />)}
            <AppLink href="/resources/checks" className="nv-foot">{m.products.all}<Arrow /></AppLink>
          </div>
        </details>
        <details>
          <summary>{m.premium.label}<Caret /></summary>
          <div className="nv-col">
            <p className="nv-lede">{m.premium.lede}</p>
            {PREMIUM.map((it) => <Entry key={it.id} item={it} t={t} />)}
          </div>
        </details>
        <AppLink href="/about" className="nv-ml"><span>{t.about}</span><span className="k">→</span></AppLink>
        <details>
          <summary>{m.support.label}<Caret /></summary>
          <div className="nv-col">
            {SUPPORT.map((it) => <Entry key={it.id} item={it} t={t} />)}
          </div>
        </details>
        <AppLink href="/platform/technology" className="nv-ml"><span>{t.technology}</span><span className="k">→</span></AppLink>
      </nav>
    </header>
  );
}

function Caret() {
  return (
    <svg className="nv-car" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 3.75L5 6.75l3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
