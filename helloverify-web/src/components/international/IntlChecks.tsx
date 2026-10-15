"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";

import { SortArrow, TickIcon } from "@/components/international/checkIcons";
import { IntlNotices } from "@/components/international/IntlNotices";
import { IntlSelect } from "@/components/international/IntlSelect";
import { IntlSummary, type SummaryCopy } from "@/components/international/IntlSummary";
import {
  currencyOf,
  enquiryHref,
  formatMoney,
  INTL_CHECKS,
  intlOptions,
  resolveIntlCode,
  type CmsCountryCopy,
  type CmsCountryId,
  type IntlCheck,
} from "@/lib/international/catalog";
import { daysOf, localPrice, priceOf, quoteOf, sizeOf, type Delivery } from "@/lib/international/order";

type SortKey = "name" | "price" | "tat";
const SORTS: readonly SortKey[] = ["name", "price", "tat"];

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
 *  rows are rendered separately by the page. Prices show in the country's
 *  currency, with the high-risk fee already in them (`lib/international/order`).
 *  Changing country keeps every ticked check the new one offers (matched by
 *  name) and says which were dropped. */
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
  const [fast, setFast] = useState(false);
  const [delivery, setDelivery] = useState<Delivery>("each");
  const [dropped, setDropped] = useState<readonly string[]>([]);
  const options = intlOptions(countries, "checks");
  const country = options.find((o) => o.code === code);
  const cur = currencyOf(code);
  const rows = INTL_CHECKS[code] ?? [];
  const sorted = sortKey ? [...rows].sort((a, b) => compare(a, b, sortKey, sortDir)) : rows;
  const maxDays = Math.max(0, ...rows.map(daysOf).filter(Number.isFinite));
  const picked = rows.filter((r) => checked.has(r.id));
  const quote = quoteOf(code, picked, fast, delivery);
  const href = enquiryHref(locale) + (quote.rushOn ? "&rush=1" : "") + (quote.together ? "&delivery=together" : "");
  const totalLabel = formatMoney(quote.total, cur);
  const countLabel = summary.count.replace("{{count}}", String(picked.length));

  const reset = () => {
    setChecked(new Set());
    setFast(false);
    setDelivery("each");
    setDropped([]);
  };

  const pickCountry = (next: string) => {
    if (next === code) return;
    const offered = new Map((INTL_CHECKS[next] ?? []).map((r) => [r.name, r.id]));
    const kept = picked.flatMap((r) => offered.get(r.name) ?? []);
    setCode(next);
    setChecked(new Set(kept));
    setDropped(picked.filter((r) => !offered.has(r.name)).map((r) => r.name));
    if (kept.length === 0) {
      setFast(false);
      setDelivery("each");
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleChecked = (id: string) => {
    setDropped([]);
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
            <IntlSelect
              label={pick}
              value={code}
              options={options}
              search={search}
              none={none}
              riskTag={summary.risk.tag}
              note={
                <>
                  <b>{summary.risk.menuB}</b> {summary.risk.menuP}
                </>
              }
              onChange={pickCountry}
            />
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

        <IntlNotices copy={summary} country={country} dropped={dropped} />

        {rows.length === 0 ? (
          <p className="intl3-empty">{empty}</p>
        ) : (
          <ul className="ic-list">
            {sorted.map((row) => {
              const on = checked.has(row.id);
              const amount = formatMoney(localPrice(row, code), cur);
              const unit = splitPrice(row.price)[1];
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
                      <bdi dir="ltr" className={sizeOf(amount)}>
                        <b>{amount}</b>
                        {unit ? <small>{unit}</small> : null}
                      </bdi>
                      {quote.feeUsd ? <span className="ic-fee">{summary.risk.row}</span> : null}
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

      <IntlSummary
        id={sumId}
        locale={locale}
        copy={summary}
        country={country}
        code={code}
        picked={picked}
        quote={quote}
        delivery={delivery}
        href={href}
        onRemove={toggleChecked}
        onRush={() => setFast((v) => !v)}
        onDelivery={setDelivery}
        onClear={reset}
      />
    </div>
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

function compare(a: IntlCheck, b: IntlCheck, key: SortKey, dir: "asc" | "desc") {
  const cmp =
    key === "price"
      ? priceOf(a) - priceOf(b)
      : key === "tat"
        ? daysOf(a) - daysOf(b)
        : a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  return dir === "asc" ? cmp : -cmp;
}
