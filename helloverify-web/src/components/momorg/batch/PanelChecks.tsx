"use client";

import { fill } from "@/components/momapply/fill";
import { TickIcon } from "@/components/momapply/icons";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { money, type Prices } from "@/lib/mom/apply/pricing";
import { qualHasAcc, requiredAcc, type Candidate } from "@/lib/mom/org/batch";

/** Education is on every qualification. Accreditation is forced where the
 *  institution is not on MOM's list and optional elsewhere. Express is per
 *  candidate. */
export function PanelChecks({
  c,
  onChange,
  t,
  s,
  locale,
  prices,
}: {
  c: Candidate;
  onChange: (patch: Partial<Candidate>) => void;
  t: MomOrgCopy;
  s: MomStepsCopy;
  locale: string;
  prices: Prices;
}) {
  const p = t.panel;
  const n = c.quals.length;
  const required = requiredAcc(c);
  const acc = c.quals.filter((q) => qualHasAcc(c, q)).length;
  const locked = required === n;
  const accHint =
    c.acc && !locked ? p.accAll : required ? fill(p.accRequired, { n: required }) : p.accOptional;

  return (
    <fieldset className="mo-sheet-s mo-checks">
      <legend className="ma-l mo-sheet-k">{p.checks}</legend>
      <div className="mo-check is-fixed">
        <span className="mo-check-i">
          <TickIcon />
        </span>
        <span className="mo-check-b">
          <b>{s.checks.edu}</b>
          <small>
            {p.eduHint} · × {n}
          </small>
        </span>
        <span className="mo-check-p">{money(n * prices.edu, locale)}</span>
      </div>
      <label className={`mo-check${c.acc || locked ? " is-on" : ""}`}>
        <input
          type="checkbox"
          role="switch"
          checked={c.acc || locked}
          disabled={locked}
          onChange={(e) => onChange({ acc: e.target.checked })}
        />
        <span className="mo-sw" aria-hidden="true" />
        <span className="mo-check-b">
          <b>{s.checks.acc}</b>
          <small>{accHint}</small>
        </span>
        <span className="mo-check-p">{acc ? money(acc * prices.acc, locale) : `+${money(n * prices.acc, locale)}`}</span>
      </label>
      <label className={`mo-check${c.express ? " is-on" : ""}`}>
        <input type="checkbox" role="switch" checked={c.express} onChange={(e) => onChange({ express: e.target.checked })} />
        <span className="mo-sw" aria-hidden="true" />
        <span className="mo-check-b">
          <b>{s.checks.express}</b>
          <small>{s.checks.expressDays}</small>
        </span>
        <span className="mo-check-p">{c.express ? money(prices.express, locale) : `+${money(prices.express, locale)}`}</span>
      </label>
    </fieldset>
  );
}
