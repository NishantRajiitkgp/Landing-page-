/** The applicant guide's stateless pieces: answer links, the checklist tick,
 *  the embassy accordions (How to Apply) and Latvia's Premium Service
 *  packages. */
import type { IndividualsCopy } from "@/lib/copy/individuals";
import { EMBASSY_ID, LATVIA_LINKS, PREMIUM_FEATURE_ICONS } from "@/lib/immigration/guide";
import { ApplicantIcon } from "@/components/immigration/ApplicantIcons";

export type Guide = IndividualsCopy["immigration"]["guide"];

const URL_RE = /(https?:\/\/[^\s,]+[^\s,.)])/g;

export function Linkify({ text }: { text: string }) {
  return (
    <>
      {text.split(URL_RE).map((part, i) =>
        i % 2 ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function Check() {
  return (
    <span className="tk" aria-hidden="true">
      <svg viewBox="0 0 16 16">
        <path d="m3.5 8.5 3 3 6-7" />
      </svg>
    </span>
  );
}

export function Accordions({ g, embassy }: { g: Guide; embassy: number }) {
  const items =
    embassy === EMBASSY_ID.italy
      ? [{ ...g.accordions.italy.who, links: false }]
      : embassy === EMBASSY_ID.latvia
        ? [
            { ...g.accordions.latvia.who, links: true },
            { ...g.accordions.latvia.dependents, links: false },
          ]
        : [];
  if (!items.length) return null;
  return (
    <div className="gd3-acc">
      {items.map((it) => (
        <details key={it.t}>
          <summary>{it.t}</summary>
          <p>{it.p}</p>
          {it.links && (
            <>
              <p>{g.linksIntro}</p>
              <ul>
                {(Object.keys(LATVIA_LINKS) as (keyof typeof LATVIA_LINKS)[]).map((k) => (
                  <li key={k}>
                    <a href={LATVIA_LINKS[k]} target="_blank" rel="noreferrer">
                      {g.latviaLinks[k]}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </details>
      ))}
    </div>
  );
}

export function Premium({ g, href }: { g: Guide; href: string }) {
  const p = g.premium;
  return (
    <div className="gd3-prem">
      <h3>{p.h}</h3>
      <div className="gd3-prem-grid">
        {(["clearance", "premium"] as const).map((k) => {
          const pkg = p[k];
          return (
            <div key={k} className="gd3-pk">
              <div className="top">
                <p className="nm">
                  <span className="mk">
                    <ApplicantIcon id={k === "clearance" ? "insufficiencyClearance" : "premium"} />
                  </span>
                  <span>
                    {pkg.t} <small>{pkg.sub}</small>
                  </span>
                </p>
                <p className="pr">{pkg.price}</p>
                <ul>
                  {pkg.features.map((f, i) => (
                    <li key={f}>
                      <ApplicantIcon id={PREMIUM_FEATURE_ICONS[k][i]} className="fi" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="dc">{"disclaimer" in pkg ? pkg.disclaimer : p.disclaimer}</p>
              <a className="btn btn-ink" href={href} target="_blank" rel="noreferrer">
                {p.cta}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
