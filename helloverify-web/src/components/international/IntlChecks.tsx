"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";

import { Flag, IntlSelect } from "@/components/international/IntlSelect";
import {
  enquiryHref,
  INTL_CHECKS,
  intlOptions,
  resolveIntlCode,
  type CmsCountryCopy,
  type CmsCountryId,
  type IntlCheck,
} from "@/lib/international/catalog";

type SortKey = "name" | "price" | "tat";
const SORTS: readonly SortKey[] = ["name", "price", "tat"];

export type SummaryCopy = {
  h: string;
  empty: string;
  count: string;
  total: string;
  ready: string;
  cta: string;
  clear: string;
  remove: string;
  note: string;
  review: string;
};

type ChecksProps = {
  locale: string;
  cols: { name: string; price: string; tat: string };
  countries: Record<CmsCountryId, CmsCountryCopy>;
  pick: string;
  search: string;
  none: string;
  empty: string;
  available: string;
  sortBy: string;
  sort: string;
  up: string;
  down: string;
  select: string;
  summary: SummaryCopy;
};

/** The check builder. Pick a country, tick checks, and the summary beside
 *  the list adds up the price and the longest turnaround; its one CTA goes
 *  to the enquiry form. Default country is the CMS `US`. Names, prices and
 *  turnarounds are the ops catalog, so they are audit-skipped — the CMS
 *  rows are rendered separately by the page. */
export function IntlChecks({
  locale,
  initialCode,
  cols,
  countries,
  pick,
  search,
  none,
  empty,
  available,
  sortBy,
  sort,
  up,
  down,
  select,
  summary,
}: ChecksProps & { initialCode: string }) {
  const sumId = useId();
  const [code, setCode] = useState(INTL_CHECKS[initialCode] ? initialCode : "US");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());
  const href = enquiryHref(locale);
  const options = intlOptions(countries, "checks");
  const country = options.find((o) => o.code === code);
  const rows = INTL_CHECKS[code] ?? [];
  const sorted = sortKey ? [...rows].sort((a, b) => compare(a, b, sortKey, sortDir)) : rows;
  const maxDays = Math.max(0, ...rows.map(daysOf).filter(Number.isFinite));
  const picked = rows.filter((r) => checked.has(r.id));
  const total = picked.reduce((sum, r) => sum + priceOf(r), 0);
  const longest = picked.reduce<IntlCheck | null>((max, r) => (!max || daysOf(r) > daysOf(max) ? r : max), null);
  const totalLabel = `$${total.toLocaleString("en-US")}`;
  const countLabel = summary.count.replace("{{count}}", String(picked.length));

  const pickCountry = (next: string) => {
    setCode(next);
    setSortKey(null);
    setSortDir("asc");
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

  const sortLabel = (key: SortKey) => {
    const base = sort.replace("{{column}}", cols[key]);
    if (sortKey !== key) return base;
    return `${base} — ${sortDir === "asc" ? up : down}`;
  };

  return (
    <div className="ic">
      <div className="ic-main">
        <div className="ic-tool">
          <div className="ic-where">
            <span className="ic-k" aria-hidden="true">
              {pick}
            </span>
            <IntlSelect label={pick} value={code} options={options} search={search} none={none} onChange={pickCountry} />
          </div>
          <div className="ic-sort">
            <span className="ic-k" aria-hidden="true">
              {sortBy}
            </span>
            <div className="ic-seg" role="group" aria-label={sortBy}>
              {SORTS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={sortKey === key ? "on" : undefined}
                  aria-pressed={sortKey === key}
                  aria-label={sortLabel(key)}
                  onClick={() => toggleSort(key)}
                >
                  {cols[key]}
                  <SortArrow dir={sortKey === key ? sortDir : undefined} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="ic-count" role="status">
          {available.replace("{{count}}", String(rows.length))}
        </p>

        {rows.length === 0 ? (
          <p className="intl3-empty">{empty}</p>
        ) : (
          <ul className="ic-list">
            {sorted.map((row) => {
              const on = checked.has(row.id);
              const [amount, unit] = splitPrice(row.price);
              return (
                <li key={row.id}>
                  <label className={`ic-row${on ? " on" : ""}`}>
                    <input
                      type="checkbox"
                      className="ic-input"
                      checked={on}
                      aria-label={select.replace("{{name}}", row.name)}
                      onChange={() => toggleChecked(row.id)}
                    />
                    <span className="ic-box" aria-hidden="true">
                      <TickIcon />
                    </span>
                    <span className="ic-info" data-audit-skip="yes">
                      <span className="ic-name">
                        <bdi>{row.name}</bdi>
                      </span>
                      {row.details ? (
                        <span className="ic-det">
                          <bdi>{row.details}</bdi>
                        </span>
                      ) : null}
                    </span>
                    <span className="ic-tat" data-audit-skip="yes">
                      <bdi>{row.tat}</bdi>
                      {Number.isFinite(daysOf(row)) && maxDays > 0 ? (
                        <span className="ic-meter" aria-hidden="true">
                          <i style={{ inlineSize: `${Math.max(6, (daysOf(row) / maxDays) * 100)}%` }} />
                        </span>
                      ) : null}
                    </span>
                    <span className="ic-price" data-audit-skip="yes">
                      <bdi dir="ltr">
                        <b>{amount}</b>
                        {unit ? <small>{unit}</small> : null}
                      </bdi>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        {picked.length > 0 ? (
          <div className="ic-bar">
            <span>
              <b>{countLabel}</b>
              <bdi dir="ltr">{totalLabel}</bdi>
            </span>
            <a href={`#${sumId}`}>{summary.review}</a>
          </div>
        ) : null}
      </div>

      <aside className="ic-sum" id={sumId} aria-label={summary.h}>
        <div className="ic-sum-hd">
          <span className="ic-k">{summary.h}</span>
          {country ? (
            <span className="ic-sum-where" data-audit-skip={country.cms ? undefined : "yes"}>
              <Flag option={country} />
              {country.name}
            </span>
          ) : null}
        </div>

        {picked.length === 0 ? (
          <div className="ic-empty">
            <span className="ic-empty-ic" aria-hidden="true">
              <TickIcon />
            </span>
            <p>{summary.empty}</p>
          </div>
        ) : (
          <ul className="ic-picked">
            {picked.map((r) => (
              <li key={r.id}>
                <span data-audit-skip="yes">
                  <bdi>{r.name}</bdi>
                </span>
                <bdi dir="ltr" data-audit-skip="yes">
                  {splitPrice(r.price)[0]}
                </bdi>
                <button type="button" aria-label={summary.remove.replace("{{name}}", r.name)} onClick={() => toggleChecked(r.id)}>
                  <CloseIcon />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className={`ic-total${picked.length ? "" : " zero"}`}>
          <span className="ic-k">{summary.total}</span>
          <b>
            <bdi dir="ltr">{totalLabel}</bdi>
          </b>
          {picked.length > 0 ? <span className="ic-total-n">{countLabel}</span> : null}
        </div>
        {longest ? (
          <p className="ic-ready">
            <ClockIcon />
            <span>{summary.ready}</span>
            <b data-audit-skip="yes">
              <bdi>{longest.tat}</bdi>
            </b>
          </p>
        ) : null}

        <a className={`ic-cta${picked.length ? " on" : ""}`} href={href}>
          <span>{summary.cta}</span>
          <ArrowIcon />
        </a>
        {picked.length > 0 ? (
          <button type="button" className="ic-clear" onClick={() => setChecked(new Set())}>
            {summary.clear}
          </button>
        ) : null}
        <p className="ic-note">{summary.note}</p>
      </aside>
    </div>
  );
}

function SortArrow({ dir }: { dir?: "asc" | "desc" }) {
  return (
    <svg className={`ic-arrow${dir ? ` ${dir}` : ""}`} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 2.5v7M3 6.5l3 3 3-3" />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" pathLength={1} />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="ic-clock" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 4.75V8l2.25 1.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 3l6 6M9 3l-6 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="ic-go" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/** `?country=` is read here, behind a Suspense boundary, so the route stays static. */
export function IntlChecksBound(props: ChecksProps) {
  const hint = useSearchParams().get("country") ?? "";
  return <IntlChecks {...props} initialCode={resolveIntlCode(hint) || "US"} />;
}

/** `$135/check` → [`$135`, `/check`]. */
function splitPrice(price: string): [string, string] {
  const at = price.indexOf("/");
  return at < 0 ? [price, ""] : [price.slice(0, at), price.slice(at)];
}

function priceOf(row: IntlCheck): number {
  const n = Number(row.price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** The slowest figure in a turnaround: "4-7 Working Days" is 7. */
function daysOf(row: IntlCheck): number {
  const nums = row.tat.match(/\d+/g)?.map(Number) ?? [];
  return nums.length ? Math.max(...nums) : Number.POSITIVE_INFINITY;
}

function compare(a: IntlCheck, b: IntlCheck, key: SortKey, dir: "asc" | "desc") {
  const cmp =
    key === "price"
      ? priceOf(a) - priceOf(b)
      : key === "tat"
        ? daysOf(a) - daysOf(b)
        : a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  return dir === "asc" ? cmp : -cmp;
}
