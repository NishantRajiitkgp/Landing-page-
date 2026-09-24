/**
 * Site footer — the canvas footer regrouped to the audience-first IA.
 * Coverage rule: every destination the current site exposes keeps a home here
 * (IA §9 migration map). Nothing from the old footer is dropped, only re-filed.
 *
 * STRUCTURE HERE, WORDS IN `lib/copy/chrome`. `COLS` kept `{ label, href }`
 * pairs until the copy layer landed; it now carries the column ids and the
 * hrefs, and the labels are looked up per destination. The two `key=`
 * expressions below still evaluate to the strings they did before — the
 * column's heading text, and `href + label` — which is the third corollary of
 * the byte-identity rule in that layer's header.
 */
import { Logo } from "@/components/brand/Logo";
import Image from "next/image";
import { AppLink } from "@/components/chrome/AppLink";
import { LocaleSwitch } from "@/components/chrome/LocaleSwitch";
import {
  CHROME,
  type FooterCertId,
  type FooterColKey,
  type FooterHref,
} from "@/lib/copy/chrome";
import { copy } from "@/lib/copy/request";
import { Arrow } from "@/components/brand/Arrow";
// Homepage v2's footer treatment, one sheet like every v2 section. Imported
// here, so it rides with the footer onto all 56 routes; it is desktop-only
// rules plus a handful of `display: none` lines for the phone.
import "@/app/v2/footer.css";
import { FooterMark } from "./FooterMark";
import { OfficeClocks } from "./OfficeClocks";

const COLS: readonly { k: FooterColKey; links: readonly FooterHref[] }[] = [
  {
    k: "governments",
    links: [
      "/governments/health",
      "/governments/immigration",
      "/governments/manpower-education",
      "/governments/trade",
      "/governments/manpower-education/ministry-of-manpower",
    ],
  },
  {
    k: "business",
    links: [
      "/business/enterprise",
      "/business/smb",
      "/business/employee-verification",
      "/business/customer-kyc",
      "/business/certifier",
    ],
  },
  {
    k: "individuals",
    links: ["/individuals/hellov", "/individuals/immigration", "/individuals/home-family"],
  },
  {
    k: "platform",
    links: ["/platform/technology", "/platform/security-compliance", "/platform/coverage"],
  },
  {
    k: "resources",
    links: [
      "/resources/checks",
      "/checks/identity",
      "/checks/employment",
      "/checks/education",
      "/checks/criminal",
      "/checks/global-database",
      "/resources/countries",
      "/resources/glossary",
      "/resources/blog",
    ],
  },
];

/** The embossed seals' image box: 40px inside a 64px disc (`footer.css`
 *  `.fz-seal-d img`). Declared here rather than reusing `CERTLINE_BOX` (34),
 *  which would serve the desktop seal an upscaled 2x; the phone's certline
 *  still draws it at 34px from the same srcset. */
const SEAL_BOX = 40;

const CERTS: readonly { id: FooterCertId; img: string }[] = [
  { id: "iso", img: "/img/iso.jpg" },
  { id: "gdpr", img: "/img/gdpr.jpg" },
  { id: "pbsa", img: "/img/pbsa.jpg" },
  { id: "nsr", img: "/img/nsr.jpg" },
  { id: "mom", img: "/img/mom.jpg" },
];

export async function SiteFooter() {
  const t = (await copy(CHROME)).footer;
  const v = t.v2;
  const micro = `${v.microtext} `.repeat(6).trim();

  return (
    <footer className="foot2 fz hair-top">
      {/* HOMEPAGE V2 (Sep 2026), desktop. The canvas's footer (Desktop4,
          `assemble_footer.py`) brought a new visual treatment AND a regrouped
          set of columns; only the treatment is taken. The columns, routes and
          words below are the IA's (§9), an approved deviation from the board,
          and stay exactly as they were. One tree for both breakpoints: the
          v2-only blocks (the closing band, the office clocks, the wordmark,
          the microtext, per-link arrows, column counts, seal captions) are
          `display: none` under 1081px, so the phone renders what it did.
          REJECTED: a second `.dsk` footer beside the `.mob` one, the
          homepage's pattern — it would send every link twice on 56 routes. */}
      <div className="fz-guil" aria-hidden="true" />
      <div className="wrap">
        <div className="fz-top">
          <div className="fz-end">
            <span className="fz-end-k">{v.sheet}</span>
            <span className="fz-end-t">{v.end} <em>{v.endEm}</em></span>
          </div>
          {/* `#top` is the HTML spec's own fragment for the top of the
              document — it scrolls there with no element carrying the id. */}
          <a href="#top" className="fz-back" aria-label={v.backToTop}>
            <svg className="fz-back-ring" viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path id="fz-back-arc" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
              </defs>
              <text fontFamily="geistMono, SF Mono, Menlo, monospace" fontSize="8.6" letterSpacing="2.2" fill="currentColor">
                <textPath href="#fz-back-arc" textLength="272" lengthAdjust="spacing">{`${v.backRing} `}</textPath>
              </text>
            </svg>
            <span className="fz-back-c">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
        <OfficeClocks head={v.officesHead} openNow={v.openNow} atDesk={v.atDesk} closed={v.closed} cities={v.cities} />
        <div className="cols">
          <div className="fcol2 brandcol">
            <AppLink href="/" aria-label={t.logoHome} className="fz-logo"><Logo width={103} height={30} /></AppLink>
            <p className="blurb">
              {t.blurb}
            </p>
            {/* All three were `href="#"`. These are the URLs the LIVE site
                renders, read out of the old repo's footer CMS —
                `public/cms/en/globals.base.json:322,327,332`, consumed by
                `src/components/Footer.tsx:92`. None is invented; there is no
                fourth network in that block, so none is added.

                LINKEDIN IS A CONFLICT, resolved in favour of the footer. The
                old repo carries two: this one, and
                `https://linkedin.com/company/helloverify` in
                `src/components/StructuredData.tsx:62` (JSON-LD `sameAs`).
                Only the CMS one is a URL a visitor has ever been sent to, so
                it is the one a like-for-like footer port owes; the `/in/`
                shape is a personal-profile URL and looks wrong for a company,
                which is worth an owner decision but is NOT grounds to publish
                the other — that would be picking the prettier of two
                unverified strings. Rejected: emitting both, or dropping the
                icon until someone confirms.

                The Instagram URL is stored as
                `.../helloverify?igsh=eDh6cXdrZWsxaDVv`. `igsh` is a share
                token minted by whichever phone copied the link; it identifies
                that share, not the profile, and the profile resolves without
                it. Dropping a tracking parameter is not inventing a URL.

                No `target="_blank" rel="noreferrer"`, which the old footer
                used: there is not one `target` attribute anywhere in this
                repo, and the seven existing external anchors to
                `https://app.helloverify.com` are plain. Matching the house
                convention beats importing the old one for three links. */}
            <div className="socials">
              <a href="https://www.linkedin.com/in/hello-verify-trust-line-06b895148/" className="soc" aria-label={t.social.linkedin}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.2 6.2v6.3M3.2 3.5v.1M6.3 12.5V6.2m0 2.6c0-1.6 1.1-2.7 2.6-2.7s2.6 1 2.6 2.7v3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://www.facebook.com/HelloVerify/" className="soc" aria-label={t.social.facebook}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M9.2 13.5V8.7h1.7l.3-2H9.2V5.5c0-.6.2-1 1-1h1.1V2.7c-.2 0-.9-.1-1.6-.1-1.6 0-2.7 1-2.7 2.8v1.3H5.2v2H7v4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://www.instagram.com/helloverify" className="soc" aria-label={t.social.instagram}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="2.5" y="2.5" width="11" height="11" rx="3.2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="11.2" cy="4.8" r="0.7" fill="currentColor" />
                </svg>
              </a>
            </div>
            <div className="co">
              <AppLink href="/about">{t.about}</AppLink>
              <AppLink href="/contact">{t.contact}</AppLink>
              {/* `color` is new on this call site and only this one: the dead
                  anchor inherited `#3D3B35` from `.foot2 .co a`
                  (`pages.css:74`), and a `<span>` does not match that
                  selector. `--ink-soft` is that exact value
                  (`design.css:30`), so the pixel is unchanged. */}
              <LocaleSwitch style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500, color: "var(--ink-soft)" }} />
            </div>
          </div>
          {COLS.map((c) => (
            <div className="fcol2" key={t.cols[c.k]}>
              <div className="h">
                {t.cols[c.k]}
                <i aria-hidden="true">{String(c.links.length).padStart(2, "0")}</i>
              </div>
              {c.links.map((href) => (
                <AppLink key={href + t.links[href]} href={href}>
                  {t.links[href]}
                  <span className="fz-arr"><Arrow size="14" /></span>
                </AppLink>
              ))}
            </div>
          ))}
        </div>
        <div className="certline">
          {CERTS.map((c) => (
            <span key={t.certs[c.id]} className="fz-seal">
              <span className="fz-seal-d">
                <Image src={c.img} alt={t.certs[c.id]} width={SEAL_BOX} height={SEAL_BOX} />
              </span>
              <span className="fz-seal-l" aria-hidden="true">{v.seals[c.id]}</span>
            </span>
          ))}
          <span className="t">{t.certline}</span>
        </div>
        <div className="base">
          <span className="cr">{t.copyright}</span>
          <span className="lg">
            <AppLink href="/legal/privacy-policy">{t.legal.privacy}</AppLink>
            <AppLink href="/legal/terms-of-service">{t.legal.terms}</AppLink>
            <AppLink href="/legal/cookie-policy">{t.legal.cookies}</AppLink>
          </span>
          <span className="offices">{t.offices}</span>
        </div>
      </div>
      <FooterMark>
        {/* The engraving: the logo's own paths, filled with a fine wave
            pattern (ink, and red for the swoosh) through CSS `fill`, which
            beats `Logo`'s presentation attributes — so this reuses
            `brand/Logo.tsx` instead of a second copy of its paths. The
            patterns are artwork; their colours are SVG attribute literals. */}
        <svg className="fz-defs" width="0" height="0" focusable="false">
          <defs>
            <pattern id="fz-eng" width="0.62" height="0.62" patternUnits="userSpaceOnUse">
              <path d="M0 0.31 q0.155 -0.2 0.31 0 t0.31 0" fill="none" stroke="#15140F" strokeWidth="0.2" />
            </pattern>
            <pattern id="fz-eng-r" width="0.62" height="0.62" patternUnits="userSpaceOnUse">
              <path d="M0 0.31 q0.155 -0.2 0.31 0 t0.31 0" fill="none" stroke="#EC2E21" strokeWidth="0.22" />
            </pattern>
            <pattern id="fz-uv" width="1.4" height="1.4" patternUnits="userSpaceOnUse">
              <circle cx="0.7" cy="0.7" r="0.34" fill="#6EE7B0" />
            </pattern>
          </defs>
        </svg>
        <div className="fz-mark-eng"><Logo width={172} height={50} /></div>
        <div className="fz-mark-uv"><Logo width={172} height={50} /></div>
        <span className="fz-mark-hint">{v.markHint}</span>
      </FooterMark>
      <div className="fz-micro" aria-hidden="true">{micro}</div>
    </footer>
  );
}
