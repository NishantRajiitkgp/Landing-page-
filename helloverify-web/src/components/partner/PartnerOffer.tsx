/** `/partner-with-us`: every service a partner earns on — each card opens
 *  that service's own page, and wears its commission as a meter against the
 *  15% ceiling — then who the programme is for and the three ways to
 *  partner. */
import type { CSSProperties } from "react";
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";
import { Reveal } from "@/components/about/AboutMotion";
import { d, Head, Icon, type IconName, type PartnerCopy } from "./partnerParts";

type Svc = PartnerCopy["services"];
type Who = PartnerCopy["who"];

const SERVICES: readonly [keyof Svc["items"], IconName, 15 | 10, string][] = [
  ["employee", "users", 15, "/employee-verification"],
  ["visa", "plane", 15, "/products/immigration"],
  ["health", "pulse", 15, "/solutions/health-authorities"],
  ["education", "cap", 15, "/solutions/manpower-and-education-authorities"],
  ["international", "globe", 15, "/international"],
  ["kyc", "face", 15, "/products/customer-kyc"],
  ["certifier", "building", 15, "/products/certifier"],
  ["hellov", "home", 10, "/products/hellov"],
  ["instant", "bolt", 10, "/resources/checks"],
];

export function PartnerServices({ c }: { c: Svc }) {
  return (
    <section className="wrap pw-sec" id="services" aria-labelledby="pw-svc-h">
      <Head k={c.k} h={c.h} id="pw-svc-h" sub={c.sub} />
      <Reveal as="ul" className="pw-svcs">
        {SERVICES.map(([k, icon, rate, href], i) => {
          const s = c.items[k];
          return (
            <li key={k} className="pw-svc" style={d(i)}>
              <div className="pw-svc-top">
                <span className="pw-tile"><Icon n={icon} /></span>
                <span className="pw-meter" style={{ "--r": rate / 15 } as CSSProperties}>
                  <i aria-hidden="true" />
                  {rate === 15 ? c.upTo15 : c.upTo10}
                </span>
              </div>
              <h3>
                <AppLink href={href}>{s.t}</AppLink>
              </h3>
              <p>{s.p}</p>
              <p className="pw-svc-who"><b>{c.ideal}</b> {s.who}</p>
              <span className="pw-svc-go" aria-hidden="true"><Arrow /></span>
            </li>
          );
        })}
      </Reveal>
    </section>
  );
}

const MODELS = ["referral", "channel", "integration"] as const satisfies readonly (keyof Who["models"])[];

export function PartnerWho({ c }: { c: Who }) {
  return (
    <section className="wrap pw-sec" aria-labelledby="pw-who-h">
      <Head k={c.k} h={c.h} id="pw-who-h" sub={c.sub} />
      <Reveal as="ul" className="pw-chips">
        {c.audiences.map((a, i) => (
          <li key={a} style={d(i)}>{a}</li>
        ))}
      </Reveal>
      <Reveal className="pw-models">
        <h3 className="pw-models-h">{c.choose}</h3>
        <ol>
          {MODELS.map((k, i) => (
            <li key={k} style={d(i)}>
              <span className="wm" data-wm={String(i + 1).padStart(2, "0")} aria-hidden="true" />
              <span className="pw-num">{i + 1}</span>
              <h4>{c.models[k].t}</h4>
              <p>{c.models[k].p}</p>
              <p className="pw-best"><b>{c.best}</b> {c.models[k].who}</p>
            </li>
          ))}
        </ol>
        <div className="pw-note">
          <Icon n="info" />
          <p>{c.note}</p>
        </div>
      </Reveal>
    </section>
  );
}
