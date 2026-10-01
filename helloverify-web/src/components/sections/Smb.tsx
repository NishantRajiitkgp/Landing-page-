/** Background checks for business: Large Enterprises ↔ Small & Medium.

    Since 29 Sep 2026 one band with a toggle (`./SmbSegments`), as the old
    home page's `solutionsShowcase` had it: "Large Enterprises" — the four
    solution cards (white- and blue-collar, KYC, vendor), a proof strip and
    the ask — and "Small & Medium Businesses", the three packages. Large is
    first, as the old site's was. Both panels are server-rendered.

    THE SMALL & MEDIUM PANEL is `./SmbPacks` since 1 Oct 2026: three
    photo-led package cards with a receipt stub, "How it works" on a drawn
    screen, and a facts row with the ask — the Large panel's rhythm. The
    receipts on bulldog clips and the three-step strip it replaced are in
    git history (564cbf1).

    "Customize Your Package" (`./SmbBuilder`, the à-la-carte builder, and the
    jump link to it) was taken off the homepage on 29 Sep 2026. The island,
    its copy (`smb.build`) and its CSS are kept so it can come back as one
    `<SmbBuilder>` in `./SmbPacks`; `smb.build.rupees` still formats the
    per-check line and `smb.build.quoteB`/`quote` head "How it works". */
import Image from "next/image";

import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { tint } from "@/lib/img";
import "@/app/v2/smb.css";
import { SmbPanel } from "./SmbPacks";
import { SmbSegments } from "./SmbSegments";

/** The Large Enterprises panel's four cards: the old home page's
 *  `solutionsShowcase` enterprise segment, in its order. Each names the
 *  audience it screens (`enterprises.rings`), shows four of that product's
 *  checks as chips, and opens its page. The photographs are the site's own
 *  (`/img/v2/`), not the old site's stock. KYC's (1 Oct 2026, Higgsfield) is
 *  digital onboarding itself — a selfie taken with the ID held up — where
 *  it used the KYC phone's face close-up (`en-selfie`, still the phone's). */
type Card = { id: string; photo: string; ring: "employees" | "customers" | "businesses"; href: string };
const CARDS: Card[] = [
  { id: "white", photo: "/img/v2/pkg-whitecollar.jpg", ring: "employees", href: "/business/employee-verification" },
  { id: "blue", photo: "/img/v2/pkg-bluecollar.jpg", ring: "employees", href: "/business/employee-verification" },
  { id: "kyc", photo: "/img/v2/sg-kyc.jpg", ring: "customers", href: "/business/customer-kyc" },
  { id: "vendor", photo: "/img/v2/en-vendor.jpg", ring: "businesses", href: "/business/certifier" },
];
/** 290px wide at the 1440 board (four in 1200 less gaps), 45vw two up on a
 *  tablet, the column on a phone. */
const SIZES_SG_CARD = "(max-width: 639px) 92vw, (max-width: 1080px) 45vw, 290px";

async function LargePanel() {
  const all = await copy(SECTIONS);
  const s = all.smb.seg;
  const e = all.enterprises;
  const em = e.employees;
  const pick = <T extends Record<string, string>>(o: T, keys: (keyof T)[]) => keys.map((k) => o[k]);
  const body: Record<string, { t: string; p: string; chips: string[] }> = {
    white: { t: em.white.t, p: em.white.p, chips: pick(em.white.chips, ["education", "employment", "identity", "criminal"]) },
    blue: { t: em.blue.t, p: em.blue.p, chips: pick(em.blue.chips, ["pan", "rc", "licence", "criminal"]) },
    kyc: { t: s.kyc.t, p: s.kyc.p, chips: e.customers.grid.kyc.s.split(" · ") },
    vendor: { t: s.vendor.t, p: s.vendor.p, chips: pick(e.businesses.chips, ["trade", "gst", "directors", "criminal"]) },
  };

  return (
    <>
      <div className="sec-head sm-head">
        <h2 className="h2 sm-h2">
          {s.headingA}
          <br />
          <em className="sm-it">{s.headingB}</em>
        </h2>
        <p className="lede sm-lede">{em.h}</p>
      </div>
      <ul className="sg-cards">
        {CARDS.map((c, i) => {
          const b = body[c.id];
          return (
            <li key={c.id} className="sg-card" style={{ "--i": i } as React.CSSProperties}>
              <span className="sg-ph" style={{ background: tint(c.photo) }}>
                <Image className="pimg" src={c.photo} alt="" fill sizes={SIZES_SG_CARD} />
                <span className="sg-tag">
                  <i>{String(i + 1).padStart(2, "0")}</i>
                  {e.rings[c.ring]}
                </span>
              </span>
              <div className="sg-body">
                <h3 className="sg-t">{b.t}</h3>
                <p className="sg-p">{b.p}</p>
                <ul className="sg-chips">
                  {b.chips.map((ch) => (
                    <li key={ch}>
                      <Tick />
                      {ch}
                    </li>
                  ))}
                </ul>
                {/* Four links read "Explore More"; the title names each for a
                    screen reader, as `Why.tsx`'s audience cards do. */}
                <AppLink href={c.href} className="sg-more" aria-label={`${e.explore}: ${b.t}`}>
                  <span>{e.explore}</span>
                  <Arrow />
                </AppLink>
              </div>
            </li>
          );
        })}
      </ul>
      {/* The old enterprise page's client strip, compact: one line of
          heading, one row of logos. */}
      <div className="sg-trust">
        <p className="sg-trust-h">
          {e.letters.hA} <em>{e.letters.hB}</em>
        </p>
        <ul className="sg-logos">
          {(Object.keys(s.clients) as (keyof typeof s.clients)[]).map((k) => (
            <li key={k}>
              <Image src={`/img/clients/${k}.png`} alt={s.clients[k]} width={150} height={40} />
            </li>
          ))}
        </ul>
      </div>
      <div className="sg-proof">
        <dl className="sg-stats">
          {Object.entries(e.stats).map(([k, st]) => (
            <div key={k}>
              <dt>{st.s}</dt>
              <dd>{st.b}</dd>
            </div>
          ))}
        </dl>
        <AppLink href="/contact" className="btn btn-ink sg-sales">
          <span>{e.sales}</span>
          <Arrow />
        </AppLink>
      </div>
    </>
  );
}

export async function Smb() {
  const t = (await copy(SECTIONS)).smb;

  return (
    <div className="wrap hair-top sm">
      <div className="sm-mast">
        <span className="k">{t.seg.kicker}</span>
        <span className="sm-sheet">{t.sheet}</span>
      </div>
      <SmbSegments
        label={t.seg.label}
        segments={[
          { key: "large", label: t.seg.large, panel: <LargePanel /> },
          { key: "small", label: t.seg.small, panel: <SmbPanel /> },
        ]}
      />
    </div>
  );
}
