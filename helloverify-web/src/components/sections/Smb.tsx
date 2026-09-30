/** Background checks for business: Large Enterprises ↔ Small & Medium.

    Since 29 Sep 2026 one band with a toggle (`./SmbSegments`), as the old
    home page's `solutionsShowcase` had it: "Large Enterprises" — the four
    solution cards (white- and blue-collar, KYC, vendor), a proof strip and
    the ask — and "Small & Medium Businesses", the receipts below. Large is
    first, as the old site's was. Both panels are server-rendered.

    THE SMALL & MEDIUM PANEL - receipts on clips, and one that prints.

    Homepage v2 (the Business board, Sep 2026), one tree at every width.
    On a phone the receipts hang in a row that scrolls sideways, one and a
    bit in view (`smb.css`); stacked, three 500px receipts pushed the builder
    two screens further down.

    Three fixed packages as receipts hanging from bulldog clips (the shared
    `.rc` receipt from `design.css`, given a scalloped tear here) and the
    three-step strip. All server-rendered.

    "Customize Your Package" (`./SmbBuilder`, the à-la-carte builder, and the
    jump link to it) was taken off the homepage on 29 Sep 2026. The island,
    its copy (`smb.build`) and its CSS are kept so it can come back as one
    `<SmbBuilder>` here; `smb.build.rupees` still formats the per-check line. */
import Image from "next/image";

import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { tint } from "@/lib/img";
import "@/app/v2/smb.css";
import { SmbSegments } from "./SmbSegments";

type Pack = "basic" | "standard" | "premium";
type Line = "identity" | "criminal" | "global" | "address" | "moonlighting";

/** Which lines each package lists, what it adds over the tier below (drawn
 *  highlighted), and the tilt it hangs at.
 *
 *  CONVERSION PASS (24 Sep 2026). The lines are in one order on every
 *  receipt, the inherited ones first, so the eye can compare down the three
 *  and the added check is always the last — the old SMB tab listed Premium's
 *  address check second, which hid what Premium adds. Premium is the one
 *  spotlit (`best`): at ≈₹480 a check it is the cheapest per check, and it
 *  hangs straight, raised, with the green button. */
const PACKS: { id: Pack; lines: Line[]; adds: Line[]; rot: string; best?: true }[] = [
  { id: "basic", lines: ["identity", "criminal", "global"], adds: [], rot: "-1.4deg" },
  { id: "standard", lines: ["identity", "criminal", "global", "address"], adds: ["address"], rot: "0.8deg" },
  { id: "premium", lines: ["identity", "criminal", "global", "address", "moonlighting"], adds: ["moonlighting"], rot: "0deg", best: true },
];

/** "₹2,399" over 5 checks -> "480", rounded and grouped the Indian way
 *  (no `Intl`, so server and browser print the same); the copy adds the ₹. */
function perCheck(price: string, n: number): string {
  const each = Math.round(Number(price.replace(/[^0-9]/g, "")) / n);
  return String(each).replace(/\B(?=(\d{2})*\d{3}$)/g, ",");
}

/** The bulldog clip. Artwork: its three greys are the clip's metal, not the
 *  palette, so they stay SVG literals (the exemption `hv/no-color-literal`
 *  gives artwork). */
function Clip() {
  return (
    <svg className="sm-clip" viewBox="0 0 64 34" aria-hidden="true" focusable="false">
      <rect x="6" y="12" width="52" height="18" rx="3" fill="#2A2823" />
      <rect x="10" y="16" width="44" height="3" rx="1.5" fill="#4A463E" />
      <path d="M20 12 C20 2, 44 2, 44 12" fill="none" stroke="#6F6B62" strokeWidth="2.4" />
    </svg>
  );
}

/** The Large Enterprises panel's four cards: the old home page's
 *  `solutionsShowcase` enterprise segment, in its order. Each names the
 *  audience it screens (`enterprises.rings`), shows four of that product's
 *  checks as chips, and opens its page. The photographs are the site's own
 *  (`/img/v2/`), not the old site's stock. */
type Card = { id: string; photo: string; ring: "employees" | "customers" | "businesses"; href: string };
const CARDS: Card[] = [
  { id: "white", photo: "/img/v2/pkg-whitecollar.jpg", ring: "employees", href: "/business/employee-verification" },
  { id: "blue", photo: "/img/v2/pkg-bluecollar.jpg", ring: "employees", href: "/business/employee-verification" },
  { id: "kyc", photo: "/img/v2/en-selfie.jpg", ring: "customers", href: "/business/customer-kyc" },
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
  const B = t.build;

  const smbPanel = (
    <>
      <div className="sec-head sm-head">
        <h2 className="h2 sm-h2">
          {t.headingA}
          <br />
          <em className="sm-it">{t.headingB}</em>
        </h2>
        <p className="lede sm-lede">{t.lede}</p>
      </div>

      <div className="sm-pks">
        {PACKS.map((p) => {
          const pk = t.packs[p.id];
          return (
            <div
              key={p.id}
              className={p.best ? "sm-pk sm-pk-best" : "sm-pk"}
              style={{ "--rot": p.rot } as React.CSSProperties}
            >
              <Clip />
              <div className="rc sm-rc">
                <div className="hd">
                  <span>{pk.name}</span>
                  <span className="sm-tat">
                    <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
                      <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M6 3.4V6l1.8 1.1" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    {t.mins}
                  </span>
                </div>
                <div className="tt sm-tt">
                  {pk.tt}
                  {p.best && <span className="sm-stamp">{t.best}</span>}
                </div>
                <div className="sub">{pk.sub}</div>
                <div className="sep" />
                {p.lines.map((l) => (
                  <div key={l} className={p.adds.includes(l) ? "ln sm-add" : "ln"}>
                    <Tick />
                    <span>{t.lines[l]}</span>
                  </div>
                ))}
                <div className="sm-fill" />
                <div className="sep" />
                <div className="tot">
                  <span className="lb">{t.tot(p.lines.length)}</span>
                  <span className="v">{pk.price}</span>
                </div>
                <div className="sm-each">{t.perCheck(B.rupees(perCheck(pk.price, p.lines.length)))}</div>
                <AppLink href="/business/smb" className={p.best ? "btn sm-pk-buy sm-pk-buy-best" : "btn btn-ink sm-pk-buy"}>
                  <span>{t.buy}</span>
                  <Arrow />
                </AppLink>
                <div className="bc" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="sm-steps">
        {Object.entries(t.steps).map(([k, s], i) => (
          <div key={k} className="sm-step">
            <span className="sm-step-n">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <b>{s.b}</b>
              <p>{s.p}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

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
          { key: "small", label: t.seg.small, panel: smbPanel },
        ]}
      />
    </div>
  );
}
