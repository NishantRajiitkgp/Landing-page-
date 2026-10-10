/** "Enterprise-Grade Security & Compliance" on `/technology`: a white vault
    panel. The dial beside the copy turns with the scroll until its red mark
    meets the index, then the lock closes once. Below it, the certification
    and membership marks, one tile each. The dial is decoration
    (`aria-hidden`); the logos carry their alts from the copy. */
import type { CSSProperties } from "react";
import Image from "next/image";
import "@/app/v2/tech.css";
import { LOGOS, type Alts } from "@/components/chrome/CertLogos";
import { TechCertsStage } from "./TechCertsStage";

const SEALS = ["nsr", "pbsa", "iso9001", "gdpr"] as const;
const C = 200;
const r2 = (n: number) => Math.round(n * 100) / 100;
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = ((i * 5 - 90) * Math.PI) / 180;
  const long = i % 6 === 0;
  const [r0, r1] = [long ? 150 : 156, 166];
  return { i, long, x1: r2(C + r0 * Math.cos(a)), y1: r2(C + r0 * Math.sin(a)), x2: r2(C + r1 * Math.cos(a)), y2: r2(C + r1 * Math.sin(a)) };
});
const d = (s: number) => ({ "--d": `${s.toFixed(2)}s` }) as CSSProperties;

function Dial() {
  return (
    <svg className="tk-dial" viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <circle className="tk-dial-ring" cx={C} cy={C} r="186" pathLength="1" style={d(0.3)} />
      <g className="tk-dial-rot">
        {TICKS.map((t) => (
          <line key={t.i} className={t.i === 0 ? "tk-tick-key" : t.long ? "tk-tick-l" : "tk-tick-s"} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
        ))}
      </g>
      <path className="tk-dial-idx" d="M193 2h14l-7 10z" />
      <g className="tk-dial-rot2">
        <circle className="tk-dial-dash" cx={C} cy={C} r="124" />
        <circle className="tk-dot-red" cx={C} cy={C - 124} r="4" />
      </g>
      <circle className="tk-dial-ring" cx={C} cy={C} r="96" pathLength="1" style={d(0.55)} />
      <circle className="tk-dial-rip" cx={C} cy={C} r="96" />
      <path className="tk-dial-shield" d="M200 134l52 18v42c0 36-23 59-52 72c-29-13-52-36-52-72v-42z" />
      <path className="tk-shackle" d="M186 196v-12a14 14 0 0 1 28 0v12" />
      <rect className="tk-dial-body" x="178" y="194" width="44" height="36" rx="8" />
      <path className="tk-dial-ok" d="M190 212l7 7 13-14" pathLength="1" />
    </svg>
  );
}

export function TechCerts({ h, lede, alts }: { h: string; lede: string; alts: Alts }) {
  return (
    <TechCertsStage>
      <div className="tk-vault">
        <div className="tk-vault-top">
          <div className="tk-vault-tx">
            <h2 className="h2 tk-rv">{h}</h2>
            <p className="lede tk-rv tk-rv2">{lede}</p>
          </div>
          <div className="tk-dial-box">
            <Dial />
          </div>
        </div>
        <ul className="tk-seals">
          {SEALS.map((id, i) => {
            const l = LOGOS[id];
            return (
              <li key={id} className="tk-seal" style={d(0.5 + i * 0.1)}>
                <Image src={l.src} alt={alts[id]} width={l.w} height={l.h} sizes="140px" />
              </li>
            );
          })}
        </ul>
      </div>
    </TechCertsStage>
  );
}
