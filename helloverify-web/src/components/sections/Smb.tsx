/** Small & medium businesses - receipts on clips, and one that prints.

    Homepage v2, desktop only (the Business board, Sep 2026). New on the
    homepage, so there is no `.mob` tree to keep; the phone gets its own part.

    Three fixed packages as receipts hanging from bulldog clips (the shared
    `.rc` receipt from `design.css`, given a scalloped tear here), the
    three-step strip, and "Customize Your Package" — the only interactive
    piece, and so the only client island (`./SmbBuilder`). It has no loop
    that outlasts the click that started it, so it needs no pause control. */
import { Tick } from "@/components/brand/Tick";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import "@/app/v2/smb.css";
import { SmbBuilder, type SmbOption } from "./SmbBuilder";

type Pack = "basic" | "standard" | "premium";
type Line = "identity" | "criminal" | "global" | "address" | "moonlighting";

/** Which lines each package lists, in its receipt's order, and the tilt it
 *  hangs at. The old SMB tab lists Premium's address check second. */
const PACKS: { id: Pack; lines: Line[]; rot: string }[] = [
  { id: "basic", lines: ["identity", "criminal", "global"], rot: "-1.4deg" },
  { id: "standard", lines: ["identity", "criminal", "global", "address"], rot: "0.8deg" },
  { id: "premium", lines: ["identity", "address", "criminal", "global", "moonlighting"], rot: "-0.6deg" },
];

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
              <div key={p.id} className="sm-pk" style={{ "--rot": p.rot } as React.CSSProperties}>
                <Clip />
                <div className="rc sm-rc">
                  <div className="hd">
                    <span>{pk.name}</span>
                    <span>{t.mins}</span>
                  </div>
                  <div className="tt">{pk.tt}</div>
                  <div className="sub">{pk.sub}</div>
                  <div className="sep" />
                  {p.lines.map((l) => (
                    <div key={l} className="ln">
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
                  <div className="bc" />
                  <div className="act">
                    <span className="who">{t.included}</span>
                    <AppLink href="/business/smb" className="btn btn-ink btn-sm sm-pk-buy">
                      {t.buy}
                    </AppLink>
                  </div>
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
