/** Small & medium businesses - receipts on clips, and one that prints.

    Homepage v2, desktop only (the Business board, Sep 2026). New on the
    homepage, so there is no `.mob` tree to keep; the phone gets its own part.

    Three fixed packages as receipts hanging from bulldog clips (the shared
    `.rc` receipt from `design.css`, given a scalloped tear here), the
    three-step strip, and "Customize Your Package" — the only interactive
    piece, and so the only client island (`./SmbBuilder`). It has no loop
    that outlasts the click that started it, so it needs no pause control. */
import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import "@/app/v2/smb.css";
import { SmbBuilder, type SmbOption } from "./SmbBuilder";

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

/** À-la-carte prices in rupees, from the old `/products/bgv-smb`. */
const PRICES = { identity: 349, employment: 499, education: 999, address: 499, reference: 499 };

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

export async function Smb() {
  const t = (await copy(SECTIONS)).smb;
  const B = t.build;
  const options: SmbOption[] = (Object.keys(PRICES) as (keyof typeof PRICES)[]).map((id) => ({
    id,
    name: B.options[id],
    price: PRICES[id],
    ...(id === "education" ? { extra: B.eduExtra } : {}),
  }));

  return (
    <div className="dsk">
      <div className="wrap hair-top sm">
        <div className="sm-mast">
          <span className="k">{t.kicker}</span>
          <span className="sm-sheet">{t.sheet}</span>
        </div>
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

        <a className="sm-custom" href="#sm-build">
          <span>{B.kicker}</span>
          <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
            <path d="M6 2v8M2.5 6.5L6 10l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

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

        <SmbBuilder
          head={
            <>
              <div className="k">{B.kicker}</div>
              <h3 className="sm-build-h">{B.h}</h3>
            </>
          }
          quote={
            <p className="sm-quote">
              <b>{B.quoteB}</b> {B.quote}
            </p>
          }
          buyLink={
            <AppLink href="/business/smb" className="btn btn-ink sm-buy">
              {t.buy}
            </AppLink>
          }
          options={options}
          receipt={B.receipt}
          count={[0, 1, 2, 3, 4, 5].map((n) => B.count(n))}
          empty={B.empty}
          total={B.total}
          eduNote={B.eduNote}
          eduId="education"
          rupees={B.rupees("")}
          printer={B.printer}
          tick={<Tick />}
        />
      </div>
    </div>
  );
}
