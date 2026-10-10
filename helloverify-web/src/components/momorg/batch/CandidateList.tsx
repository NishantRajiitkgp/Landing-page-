"use client";

import { useState } from "react";

import { fill } from "@/components/momapply/fill";
import { CrossIcon, TickIcon } from "@/components/momapply/icons";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import { countryName } from "@/lib/mom/apply/countries";
import { qualHasAcc, type Candidate, type CandidateIssues } from "@/lib/mom/org/batch";
import { fold } from "@/lib/mom/org/cells";

export type Filter = "all" | "fix";
export type ChecksPatch = Partial<Pick<Candidate, "acc" | "express">>;

export const rowId = (id: string) => `mo-row-${id}`;

function matches(c: Candidate, q: string) {
  if (!q) return true;
  const hay = fold([c.fullName, c.passportNo, c.email, ...c.quals.map((x) => x.institution)].join(" "));
  return q.split(" ").every((w) => hay.includes(w));
}

export function CandidateList({
  candidates,
  issues,
  filter,
  onFilter,
  onOpen,
  onRemove,
  onChecks,
  t,
  locale,
}: {
  candidates: readonly Candidate[];
  issues: ReadonlyMap<string, CandidateIssues>;
  filter: Filter;
  onFilter: (f: Filter) => void;
  onOpen: (id: string) => void;
  onRemove: (ids: string[]) => void;
  onChecks: (ids: string[], patch: ChecksPatch) => void;
  t: MomOrgCopy;
  locale: string;
}) {
  const b = t.batch;
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set());
  const q = fold(query);
  const flagged = candidates.filter((c) => issues.get(c.id)?.count).length;
  const shown = candidates.filter((c) => (filter === "all" || issues.get(c.id)?.count) && matches(c, q));
  const selected = candidates.filter((c) => picked.has(c.id));
  const ids = selected.map((c) => c.id);
  const allShown = shown.length > 0 && shown.every((c) => picked.has(c.id));
  const allAcc = selected.length > 0 && selected.every((c) => c.acc);
  const allExpress = selected.length > 0 && selected.every((c) => c.express);

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="mo-listw">
      <div className="mo-tools">
        <label className="mo-pick mo-pick-all">
          <input
            type="checkbox"
            checked={allShown}
            disabled={!shown.length}
            aria-label={b.selectAll}
            onChange={() =>
              setPicked((prev) => {
                const next = new Set(prev);
                for (const c of shown) {
                  if (allShown) next.delete(c.id);
                  else next.add(c.id);
                }
                return next;
              })
            }
          />
        </label>
        <div className="ma-ctl mo-search">
          <input type="search" value={query} placeholder={b.search} aria-label={b.search} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="mo-seg" role="group" aria-label={b.fix}>
          {(["all", "fix"] as const).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} className={filter === f ? "is-on" : undefined} onClick={() => onFilter(f)}>
              {f === "all" ? b.all : b.fix}
              <span>{f === "all" ? candidates.length : flagged}</span>
            </button>
          ))}
        </div>
      </div>

      {shown.length ? (
        <ul className="mo-list">
          {shown.map((c) => {
            const n = candidates.indexOf(c) + 1;
            const left = issues.get(c.id)?.count ?? 0;
            const name = c.fullName.trim() || b.unnamed;
            const first = c.quals.find((x) => x.institution.trim());
            const acc = c.quals.filter((x) => qualHasAcc(c, x)).length;
            return (
              <li key={c.id} className={`mo-row${left ? " is-bad" : ""}${picked.has(c.id) ? " is-picked" : ""}`}>
                <label className="mo-pick">
                  <input type="checkbox" checked={picked.has(c.id)} aria-label={fill(b.select, { name })} onChange={() => toggle(c.id)} />
                </label>
                <button type="button" className="mo-row-b" id={rowId(c.id)} onClick={() => onOpen(c.id)}>
                  <span className="mo-row-n">{String(n).padStart(2, "0")}</span>
                  <span className="mo-row-who">
                    <b className={c.fullName.trim() ? undefined : "is-empty"}>{name}</b>
                    <small>
                      {c.passportNo ? <bdi dir="ltr">{c.passportNo}</bdi> : null}
                      {c.passportNo && c.nationality ? " · " : null}
                      {c.nationality ? countryName(c.nationality, locale) : null}
                    </small>
                  </span>
                  <span className="mo-row-q">
                    <span>
                      {first?.institution.trim() ?? (c.quals.length === 1 ? b.qualsOne : fill(b.qualsMany, { n: c.quals.length }))}
                      {first && c.quals.length > 1 ? <em>{fill(b.more, { n: c.quals.length - 1 })}</em> : null}
                    </span>
                    <span className="mo-chips">
                      <i>{fill(b.edu, { n: c.quals.length })}</i>
                      {acc ? <i>{fill(b.acc, { n: acc })}</i> : null}
                      {c.express ? <i className="is-x">{b.express}</i> : null}
                    </span>
                  </span>
                  <span className={`mo-row-st${left ? "" : " is-ok"}`}>
                    {left ? fill(b.toFix, { n: left }) : <TickIcon />}
                    {left ? null : b.ready}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mo-none">{b.none}</p>
      )}

      {selected.length ? (
        <div className="mo-bulk" role="region" aria-label={fill(b.selected, { n: selected.length })}>
          <span className="mo-bulk-n">{fill(b.selected, { n: selected.length })}</span>
          <button type="button" className="mo-bulk-t" aria-pressed={allAcc} onClick={() => onChecks(ids, { acc: !allAcc })}>
            <span className="mo-sw" aria-hidden="true" />
            {b.accreditation}
          </button>
          <button type="button" className="mo-bulk-t" aria-pressed={allExpress} onClick={() => onChecks(ids, { express: !allExpress })}>
            <span className="mo-sw" aria-hidden="true" />
            {b.express}
          </button>
          <button
            type="button"
            className="btn btn-line btn-sm"
            onClick={() => {
              onRemove(ids);
              setPicked(new Set());
            }}
          >
            {b.remove}
          </button>
          <button type="button" className="ma-icon-btn" aria-label={b.clear} onClick={() => setPicked(new Set())}>
            <CrossIcon />
          </button>
        </div>
      ) : null}
    </div>
  );
}
