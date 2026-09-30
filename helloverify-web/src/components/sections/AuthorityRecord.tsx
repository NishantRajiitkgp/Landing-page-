/** One authority's record — the challenge, what HelloVerify is to it, the
    facts, what we deliver, the impact and why it chose us. It used to open
    under the homepage seals (`./GovSeals`); since 30 Sep 2026 each seal links
    to its authority's own page, and that page renders this. Server-only; the
    entrances are CSS (`govseals.css`) and play on load. */
import "@/app/v2/govseals.css";
import { Inlay, PartnerPitch, Stamp, type PartnerCopy, type SealItem } from "./GovSealParts";

export function AuthorityRecord({
  g,
  stamp,
  labels,
  partner,
  contactHref,
}: {
  g: SealItem;
  stamp: string;
  labels: { problem: string; deliver: string; why: string };
  partner: PartnerCopy;
  contactHref: string;
}) {
  return (
    <div className="sv-recs sv-recs-page">
      <div className="sv-rec">
        <div className="sv-rec-l">
          <div className="sv-rec-k"><span>{g.record}</span><span>{g.role}</span></div>
          <div className="sv-prob">
            <p className="sv-out-k">{labels.problem}</p>
            <p className="sv-prob-v">{g.problem.v}</p>
            <p className="sv-prob-l">{g.problem.l}</p>
          </div>
          <p className="sv-rec-h">{g.h}</p>
          <p className="sv-rec-p">{g.p}</p>
          <dl className="sv-facts">
            {g.facts.map((f, j) => (
              <div key={f.k} className="sv-fact" style={{ animationDelay: `${(0.25 + j * 0.07).toFixed(2)}s` }}>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="sv-rec-r">
          <div className="sv-emb"><Inlay item={g} small /></div>
          <p className="sv-out-k sv-deliver-k">{labels.deliver}</p>
          <ol className="sv-chain">
            {g.deliver.map((c, j) => (
              <li key={c.t} style={{ "--d": `${(0.35 + j * 0.32).toFixed(2)}s` } as React.CSSProperties}>
                <i aria-hidden="true" />
                <span className="sv-step">
                  <b>{c.t}</b>
                  <span>{c.p}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="sv-stamp-w"><Stamp id="svst-page" ring={stamp} /></div>
        </div>
        <div className="sv-rec-b">
          <div className="sv-out">
            <p className="sv-out-k">{g.impactK}</p>
            <ul className="sv-imp">
              {g.impact.map((m, j) => (
                <li key={m.l} className="sv-fact" style={{ animationDelay: `${(0.6 + j * 0.08).toFixed(2)}s` }}>
                  <b>{m.v}</b>
                  <span>{m.l}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="sv-out">
            <p className="sv-out-k">{labels.why}</p>
            <ul className="sv-why">
              {g.why.map((w, j) => (
                <li key={w.t} className="sv-fact" style={{ animationDelay: `${(0.8 + j * 0.08).toFixed(2)}s` }}>
                  <b>{w.t}</b>
                  <span>{w.p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <PartnerPitch c={partner} contactHref={contactHref} />
      </div>
    </div>
  );
}
