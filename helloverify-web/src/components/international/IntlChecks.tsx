"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { IntlSelect } from "@/components/international/IntlSelect";
import {
  enquiryHref,
  INTL_CHECKS,
  intlOptions,
  resolveIntlCode,
  type CmsCountryCopy,
  type CmsCountryId,
  type IntlCheck,
} from "@/lib/international/catalog";

const LIMIT = 7;

type SortKey = "name" | "price" | "tat";

/** Checks table. Default country is the CMS `US`. The first seven rows show;
 *  the rest open under the CMS Explore More label. Names, prices and
 *  turnarounds are the live catalog, so they are audit-skipped — the CMS
 *  rows are rendered separately by the page. */
export function IntlChecks({
  locale,
  initialCode,
  cols,
  add,
  more,
  countries,
  pick,
  search,
  none,
  less,
  empty,
  multi,
  sort,
  up,
  down,
  select,
}: {
  locale: string;
  initialCode: string;
  cols: { name: string; price: string; tat: string; action: string };
  add: string;
  more: string;
  countries: Record<CmsCountryId, CmsCountryCopy>;
  pick: string;
  search: string;
  none: string;
  less: string;
  empty: string;
  multi: string;
  sort: string;
  up: string;
  down: string;
  select: string;
}) {
  const [code, setCode] = useState(INTL_CHECKS[initialCode] ? initialCode : "US");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());
  const href = enquiryHref(locale);
  const rows = INTL_CHECKS[code] ?? [];
  const sorted = sortKey ? [...rows].sort((a, b) => compare(a, b, sortKey, sortDir)) : rows;
  const visible = showAll ? sorted : sorted.slice(0, LIMIT);

  const pickCountry = (next: string) => {
    setCode(next);
    setSortKey(null);
    setSortDir("asc");
    setShowAll(false);
    setExpanded(null);
    setChecked(new Set());
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleChecked = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sortLabel = (column: string, key: SortKey) => {
    const base = sort.replace("{{column}}", column);
    if (sortKey !== key) return base;
    return `${base} — ${sortDir === "asc" ? up : down}`;
  };

  return (
    <>
      <IntlSelect
        label={pick}
        value={code}
        options={intlOptions(countries, "checks")}
        search={search}
        none={none}
        onChange={pickCountry}
      />
      {rows.length === 0 ? (
        <p className="intl3-empty" role="status">
          {empty}
        </p>
      ) : (
        <div className="intl3-scroll">
          <div className="intl3-table">
            <div className="intl3-head">
              <SortButton
                label={cols.name}
                aria={sortLabel(cols.name, "name")}
                pressed={sortKey === "name" ? sortDir : undefined}
                onClick={() => toggleSort("name")}
              />
              <SortButton
                label={cols.price}
                aria={sortLabel(cols.price, "price")}
                pressed={sortKey === "price" ? sortDir : undefined}
                onClick={() => toggleSort("price")}
              />
              <SortButton
                label={cols.tat}
                aria={sortLabel(cols.tat, "tat")}
                pressed={sortKey === "tat" ? sortDir : undefined}
                onClick={() => toggleSort("tat")}
              />
              <span>{cols.action}</span>
            </div>
            <ul className="intl3-rows">
              {visible.map((row) => (
                <li className="intl3-row" key={row.id}>
                  <div className="intl3-name" data-audit-skip="yes">
                    <input
                      type="checkbox"
                      checked={checked.has(row.id)}
                      aria-label={select.replace("{{name}}", row.name)}
                      onChange={() => toggleChecked(row.id)}
                    />
                    <CheckName
                      row={row}
                      open={expanded === row.id}
                      onToggle={() => setExpanded((prev) => (prev === row.id ? null : row.id))}
                    />
                  </div>
                  <span className="intl3-price" data-audit-skip="yes">
                    <bdi dir="ltr">{row.price}</bdi>
                  </span>
                  <span className="intl3-tat" data-audit-skip="yes">
                    {row.tat}
                  </span>
                  <a className="btn btn-ghost btn-sm intl3-act" href={href}>
                    {add}
                  </a>
                </li>
              ))}
            </ul>
            {checked.size > 0 ? (
              <div className="intl3-multi">
                <a className="btn btn-ink btn-sm" href={href}>
                  {checked.size > 1 ? multi : add}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      )}
      {sorted.length > LIMIT ? (
        <div className="intl3-more">
          <button type="button" className="btn btn-ink" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
            {showAll ? less : more}
            <Caret up={showAll} />
          </button>
        </div>
      ) : null}
    </>
  );
}

function SortButton({
  label,
  aria,
  pressed,
  onClick,
}: {
  label: string;
  aria: string;
  pressed?: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <button type="button" aria-label={aria} onClick={onClick}>
      <span>{label}</span>
      <span className="intl3-carets" aria-hidden="true">
        <i className={pressed === "asc" ? "on" : undefined} />
        <i className={`d${pressed === "desc" ? " on" : ""}`} />
      </span>
    </button>
  );
}

function CheckName({ row, open, onToggle }: { row: IntlCheck; open: boolean; onToggle: () => void }) {
  if (!row.details) {
    return (
      <span className="intl3-toggle">
        <Chevron open={false} />
        <span>{row.name}</span>
      </span>
    );
  }
  return (
    <span className="intl3-toggle-wrap">
      <button type="button" className="intl3-toggle" aria-expanded={open} onClick={onToggle}>
        <Chevron open={open} />
        <span>{row.name}</span>
      </button>
      {open ? <p>{row.details}</p> : null}
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span className={`intl3-chev${open ? " open" : ""}`}>
      <svg viewBox="0 0 12 12" aria-hidden="true">
        <path d="M4.5 2.5 8 6 4.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Caret({ up }: { up: boolean }) {
  return (
    <svg className={`intl3-caret${up ? " up" : ""}`} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

type ChecksProps = {
  locale: string;
  cols: { name: string; price: string; tat: string; action: string };
  add: string;
  more: string;
  countries: Record<CmsCountryId, CmsCountryCopy>;
  pick: string;
  search: string;
  none: string;
  less: string;
  empty: string;
  multi: string;
  sort: string;
  up: string;
  down: string;
  select: string;
};

/** `?country=` is read here, behind a Suspense boundary, so the route stays static. */
export function IntlChecksBound(props: ChecksProps) {
  const hint = useSearchParams().get("country") ?? "";
  return <IntlChecks {...props} initialCode={resolveIntlCode(hint) || "US"} />;
}

function compare(a: IntlCheck, b: IntlCheck, key: SortKey, dir: "asc" | "desc") {
  const av = sortValue(a, key);
  const bv = sortValue(b, key);
  const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
  return dir === "asc" ? cmp : -cmp;
}

function sortValue(row: IntlCheck, key: SortKey): string | number {
  if (key === "price") {
    const n = Number(row.price.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
  }
  if (key === "tat") {
    const n = Number.parseInt(row.tat.replace(/[^\d]/g, ""), 10);
    return Number.isFinite(n) ? n : row.tat.toLowerCase();
  }
  return row.name.toLowerCase();
}
