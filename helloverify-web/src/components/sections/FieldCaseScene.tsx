/** The field case's scene (`./FieldCase` composes it inside the client
    `./FieldCaseStage`): all of the pinned frame's markup, rendered on the
    server so none of it ships as script — the case card, the six steps, the
    act text, and the stage's map furniture, overlays and report pages. The
    stage and its engine (`./fieldLoop`) bring it to life; without them the
    acts read as plain text. See `./FieldCaseStage` for how. */
import type { CSSProperties } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";

import { ACTS, PAGES, Page } from "./FieldCaseReport";

type T = SectionsCopy["fieldCase"];

export function FieldCaseScene({ t }: { t: T }) {
  const a = t.acts;
  return (
  <div className="fc-scroll">
    <div className="fc-sticky">
      <div className="fc-text">
        <div className="fc-case">
          <span className="fc-case-k">{t.caseK}</span>
          <span className="fc-case-w">{t.caseWhere}</span>
          <span className="fc-case-f">{t.caseFor}</span>
        </div>
        <ol className="fc-rail" aria-label={t.railLabel}>
          {ACTS.map((id, i) => (
            <li key={id}>
              <button type="button" className="fc-rail-b" data-go={i}>
                <span className="fc-rail-n" aria-hidden="true">{`0${i + 1}`}</span>
                <span className="fc-rail-t">{a[id].k}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="fc-acts">
          {ACTS.map((id) => (
            <article key={id} className="fc-act">
              <div className="fc-clock">
                <span className="dot live" aria-hidden="true" />
                {a[id].clock}
              </div>
              <h3 className="fc-act-t">{a[id].t}</h3>
              <p className="fc-act-d">{a[id].d}</p>
              {id === "a3" && (
                <ul className="fc-chips">
                  {Object.values(t.chips).map((c) => <li key={c}>{c}</li>)}
                </ul>
              )}
            </article>
          ))}
        </div>
        {/* Both states are in the markup; `.fc-paused` shows the right one
            and the stage sets `aria-pressed`. */}
        <button type="button" className="fc-motion" data-pause aria-pressed="false">
          <svg className="fc-m-pause" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 1.5v7M7.5 1.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          <svg className="fc-m-play" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 1.5v7l6-3.5z" fill="currentColor" /></svg>
          <span className="fc-m-pause">{t.motion.pause}</span>
          <span className="fc-m-play">{t.motion.play}</span>
        </button>
      </div>

      <div className="fc-stage" aria-hidden="true">
        <div className="fc-map">
          <canvas className="fc-cv" />
          <div className="fc-frame"><span>{t.jurisdiction}</span></div>

          <div className="fc-pin fc-pin-town" data-at="town" data-on="0.62,0.95">
            <i className="fc-cross" />
          </div>
          <div className="fc-lock" data-at="" data-on="0.36,0.9">
            <i className="fc-lock-i" />
            <span className="fc-lock-k">{t.caseWhere}</span>
            <b data-hud="view2" />
          </div>
          <div className="fc-big" data-at="" data-on="5.45,6.1">
            <b>{t.globe.big}</b>
            <span>{t.globe.bigLabel}</span>
          </div>
          <div className="fc-loupe-hint" data-at="" data-on="1,3.9">{t.loupe.hint}</div>
          <div className="fc-tag fc-tag-a" data-at="declared" data-on="0.9,2.3">
            <b>{t.pins.declared}</b>
            <span>{t.pins.declaredSub}</span>
            <em data-ll="declared" />
          </div>
          <div className="fc-tag fc-tag-b" data-at="shared" data-on="1.05,2.86">
            <b>{t.pins.shared}</b>
            <span>{t.pins.sharedSub}</span>
            <em data-ll="shared" />
          </div>
          <div className="fc-tag fc-tag-p" data-at="partner" data-on="1.85,2.35">
            <b>{t.pins.partner}</b>
            <span>{t.pins.partnerSub}</span>
          </div>
          <div className="fc-dist" data-at="mid" data-on="1.18,1.95">{t.distance}</div>
          <ul className="fc-anom" data-at="declared" data-on="1.3,1.95">
            {Object.values(t.anomalies).map((f, i) => <li key={f} style={{ "--i": i } as CSSProperties}>{f}</li>)}
          </ul>

          {(["a", "b"] as const).map((k) => (
            <figure key={k} className={`fc-ev fc-ev-${k}`} data-at={k === "a" ? "declared" : "shared"} data-on={k === "a" ? "2.3,3.95" : "2.86,3.95"}>
              <div className="fc-ev-img">
                <canvas className="fc-cap" data-cap={k} width={300} height={200} />
                <span className="fc-ev-sat">{t.evidence.sat}</span>
                <span className="fc-ev-seal">{t.evidence.sealed}<code data-hash={k} /></span>
              </div>
              <figcaption>
                <span className="fc-ev-k">{t.evidence[k].k}</span>
                <span className="fc-ev-ll" data-ll={k === "a" ? "declared" : "shared"} />
                <q className="fc-ev-q">{t.evidence[k].quote}</q>
                <span className="fc-ev-tr">{t.evidence.tr}</span>
                <span className="fc-ev-en">{t.evidence[k].en}</span>
              </figcaption>
            </figure>
          ))}

          <div className="fc-hud">
            <span><b>{t.hud.lat}</b><i data-hud="lat" /></span>
            <span><b>{t.hud.lon}</b><i data-hud="lon" /></span>
            <span><b>{t.hud.plus}</b><i data-hud="plus" /></span>
            <span><b>{t.hud.alt}</b><i data-hud="alt" /></span>
            <span><b>{t.hud.view}</b><i data-hud="view" /></span>
          </div>
          <canvas className="fc-lp" />
          <div className="fc-scale"><i data-hud="bar" /><span data-hud="scale" /></div>
          <div className="fc-north"><svg viewBox="0 0 20 28"><path d="M10 2l6 18-6-4-6 4z" /></svg>N</div>
        </div>

        <div className="fc-report">
          {PAGES.map((pg, i) => (
            <div key={pg} className={`fc-page fc-page-${pg}`} style={{ "--o": i - 3, "--d": Math.abs(i - 3) } as CSSProperties}>
              <div className="fc-page-h">
                <span>{`p.${String(i + 1).padStart(2, "0")}`}</span>
                <b>{t.report.pages[pg]}</b>
              </div>
              <Page id={pg} t={t} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}
