import Image from "next/image";

import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { AppLink } from "@/components/chrome/AppLink";
import { BLUE_COLLAR_CLIENTS, blueLogo, type BlueClientId, type BlueLogoFit } from "@/lib/blueCollarClients";
import { WHITE_COLLAR_CLIENTS, whiteLogo, type WhiteClientId } from "@/lib/whiteCollarClients";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type SectionsCopy } from "@/lib/copy/sections";
// Homepage v2 styles are one sheet per section (see `app/v2/hero.css`).
import "@/app/v2/packages.css";

/** Key Verification Solutions — the two workforces (6 Oct 2026 redesign).
 *
 *  Two light cards, side by side on desktop. Each opens on its photograph,
 *  with a rotating verification stamp and an example case that plays its
 *  three steps. Under it: the promise, who it is built for, three figures,
 *  the four checks, the clients, and two actions.
 *
 *  Pure CSS motion (`app/v2/packages.css`), so this stays a Server Component.
 */

type CollarId = "blue" | "white";

/** Photograph, focal point, the pack whose title and audience it carries,
 *  and where Explore goes: each workforce's section of `/employee-verification`. */
const PANELS: readonly {
  id: CollarId;
  pack: "blueCollar" | "whiteCollar";
  src: string;
  focus: string;
  href: string;
}[] = [
  { id: "blue", pack: "blueCollar", src: "/img/v2/pkg-bluecollar.jpg", focus: "50% 35%", href: "/employee-verification#employees-blue-collar" },
  { id: "white", pack: "whiteCollar", src: "/img/v2/pkg-whitecollar.jpg", focus: "50% 30%", href: "/employee-verification#employees-white-collar" },
];

const SIZES_KV = "(max-width: 1080px) 92vw, 36vw";

/** Each workforce's client marks, in strip order. */
const MARKS: Record<CollarId, readonly { id: BlueClientId | WhiteClientId; fit?: BlueLogoFit; src: string }[]> = {
  blue: BLUE_COLLAR_CLIENTS.map((cl) => ({ ...cl, src: blueLogo(cl.id) })),
  white: WHITE_COLLAR_CLIENTS.map((cl) => ({ ...cl, src: whiteLogo(cl.id) })),
};

function Seal({ id, ring }: { id: CollarId; ring: string }) {
  const path = `kv-ring-${id}`;
  return (
    <svg className="kv-seal" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <path id={path} d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" />
      </defs>
      <circle className="kv-seal-bg" cx="60" cy="60" r="58" />
      <g className="kv-seal-spin">
        <text className="kv-seal-txt" direction="ltr">
          <textPath href={`#${path}`} textLength="268" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </g>
      <circle className="kv-seal-core" cx="60" cy="60" r="27" />
      <path className="kv-seal-tick" d="M48 61l8 8 16-18" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Panel({ p, t }: { p: (typeof PANELS)[number]; t: SectionsCopy["packages"] }) {
  const c = t.collars[p.id];
  const pk = t.packs[p.pack];
  const title = `kv-t-${p.id}`;
  const checks = Object.entries(c.checks) as [string, string][];

  return (
    <article id={`kv-${p.id}`} className={`kv-panel kv-${p.id}`} aria-labelledby={title}>
      <div className="kv-media">
        <Image className="kv-img" src={p.src} alt="" fill sizes={SIZES_KV} style={{ objectPosition: p.focus }} />
        <div className="kv-scrim" />
        <Seal id={p.id} ring={t.sealRing} />
        <div className="kv-case">
          <p className="kv-case-k">
            <span className="kv-live" aria-hidden="true" />
            {c.case.label}
          </p>
          <ol className="kv-steps">
            {(Object.entries(c.case.steps) as [string, { t: string; d: string }][]).map(([k, s], i, all) => (
              <li key={k}>
                <span className="kv-step-bar" aria-hidden="true" />
                <span className="kv-step-t">
                  {s.t}
                  {i === all.length - 1 ? (
                    <span className="kv-step-ok" aria-hidden="true">
                      <Tick />
                    </span>
                  ) : null}
                </span>
                <span className="kv-step-d">{s.d}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="kv-body" data-idx={c.idx}>
        <p className="kv-k">
          <span className="kv-k-n">{c.idx}</span>
          {c.k}
        </p>
        <h3 id={title} className="kv-h3">
          {pk.tt}
          <em>{c.em}</em>
        </h3>
        <p className="kv-hook">{c.hook}</p>

        <div className="kv-sectors">
          <span className="kv-label">{t.sectorsK}</span>
          <ul>
            {Object.entries(c.sectors).map(([k, s]) => (
              <li key={k}>{s}</li>
            ))}
          </ul>
        </div>

        <dl className="kv-metrics">
          {(Object.entries(c.metrics) as [string, { v: string; l: string }][]).map(([k, m]) => (
            <div key={k}>
              <dt>{m.l}</dt>
              <dd>{m.v}</dd>
            </div>
          ))}
        </dl>

        <div className="kv-checks">
          <p className="kv-label">{t.checksK}</p>
          <ul>
            {checks.map(([k, name]) => (
              <li key={k}>
                <span className="kv-tk"><Tick /></span>
                <span className="kv-ck">{name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="kv-clients">
          <p className="kv-label">{c.clientsH}</p>
          <ul className="kv-logos">
            {MARKS[p.id].map((m) => (
              <li key={m.id} className={m.fit ? `kv-logo-${m.fit}` : undefined}>
                <Image src={m.src} alt={t.clients[m.id]} width={160} height={48} unoptimized={m.src.endsWith(".svg")} />
              </li>
            ))}
          </ul>
        </div>

        <div className="kv-acts">
          <AppLink href="/contact" className="btn btn-ink kv-talk" aria-label={`${t.talk}: ${pk.tt}`}>
            <span>{t.talk}</span>
            <Arrow />
          </AppLink>
          <AppLink href={p.href} className="btn btn-ghost kv-more">
            <span>{c.cta}</span>
          </AppLink>
        </div>
      </div>
    </article>
  );
}

export async function Packages() {
  const t = (await copy(SECTIONS)).packages;

  return (
    <div className="wrap hair-top kv">
      <div className="kv-head">
        <div>
          <p className="k kv-kicker">{t.kicker}</p>
          <h2 className="h2 kv-h2">
            {t.headingA}
            <em>{t.headingEm}</em>
          </h2>
        </div>
        <div className="kv-head-side">
          <p className="lede">{t.lede}</p>
          <nav className="kv-jump" aria-label={t.jump}>
            {PANELS.map((p) => {
              const c = t.collars[p.id];
              return (
                <a key={p.id} href={`#kv-${p.id}`}>
                  <i>{c.idx}</i>
                  <span>{t.packs[p.pack].tt}</span>
                  <b>{c.metrics.tat.v}</b>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="kv-panels">
        {PANELS.map((p) => (
          <Panel key={p.id} p={p} t={t} />
        ))}
      </div>
    </div>
  );
}
