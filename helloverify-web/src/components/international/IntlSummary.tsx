"use client";

import { ArrowIcon, ClockIcon, CloseIcon, InfoIcon, TickIcon } from "@/components/international/checkIcons";
import { Flag } from "@/components/international/IntlSelect";
import type { PlatformCopy } from "@/lib/copy/platform";
import { formatMoney, FX_AS_OF, FX_CONVERSION, rateOf, type IntlCheck, type IntlOption } from "@/lib/international/catalog";
import {
  addWorkingDays,
  currencyName,
  isoDate,
  localPrice,
  shortDate,
  sizeOf,
  type Delivery,
  type Quote,
} from "@/lib/international/order";

export type SummaryCopy = PlatformCopy["coverage"]["checks"]["summary"];

const DELIVERIES: readonly Delivery[] = ["each", "together"];

/** The running receipt beside the check list, in three parts: what was
 *  ticked, the two choices (delivery, speed), and the bill with its date.
 *  The rate and the turnaround caveat sit as a footnote under the CTA.
 *  Every figure is the `Quote`. */
export function IntlSummary({
  id,
  locale,
  copy,
  country,
  code,
  picked,
  quote,
  delivery,
  href,
  onRemove,
  onRush,
  onDelivery,
  onClear,
}: {
  id: string;
  locale: string;
  copy: SummaryCopy;
  country: IntlOption | undefined;
  code: string;
  picked: readonly IntlCheck[];
  quote: Quote;
  delivery: Delivery;
  href: string;
  onRemove: (id: string) => void;
  onRush: () => void;
  onDelivery: (d: Delivery) => void;
  onClear: () => void;
}) {
  const { cur, first, last, reportDays, rushOn } = quote;
  const money = (n: number) => formatMoney(n, cur);
  const totalLabel = money(quote.total);
  const pct = `${Math.round(FX_CONVERSION * 1000) / 10}%`;
  const rate = rateOf(cur);
  const has = picked.length > 0;
  const extras = rushOn || quote.fxFee > 0;
  const d = copy.delivery;
  const dateIn = (days: number) => shortDate(addWorkingDays(days), locale);

  return (
    <aside className="ic-sum" id={id} aria-label={copy.h}>
      <div className="ic-sum-hd">
        <span className="ic-k">{copy.h}</span>
        {country ? (
          <span className="ic-sum-where" data-audit-skip={country.cms ? undefined : "yes"}>
            <Flag option={country} />
            {country.name}
          </span>
        ) : null}
      </div>

      {has ? (
        <ul className="ic-picked">
          {picked.map((r) => (
            <li key={r.id}>
              <span data-audit-skip="yes">
                <bdi>{r.name}</bdi>
              </span>
              <bdi dir="ltr" data-audit-skip="yes">
                {money(localPrice(r, code))}
              </bdi>
              <button type="button" aria-label={copy.remove.replace("{{name}}", r.name)} onClick={() => onRemove(r.id)}>
                <CloseIcon />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="ic-empty">
          <span className="ic-empty-ic" aria-hidden="true">
            <TickIcon />
          </span>
          <p>{copy.empty.replace("{{currency}}", currencyName(cur, locale))}</p>
        </div>
      )}

      {picked.length > 1 || quote.rushOK ? (
        <div className="ic-opts">
          {picked.length > 1 ? (
            <fieldset className="ic-dlv">
              <legend className="ic-k">{d.h}</legend>
              {DELIVERIES.map((k) => (
                <label key={k} className={`ic-dopt${delivery === k ? " on" : ""}`}>
                  <input
                    type="radio"
                    className="ic-input"
                    name={`${id}-delivery`}
                    value={k}
                    checked={delivery === k}
                    onChange={() => onDelivery(k)}
                  />
                  <span className="ic-radio" aria-hidden="true" />
                  <span className="ic-dopt-tx">
                    <b>{d[k].t}</b>
                    <span>{d[k].p}</span>
                  </span>
                  <small>{d[k].when.replace("{{date}}", dateIn(k === "each" ? first : last + 1))}</small>
                </label>
              ))}
            </fieldset>
          ) : null}

          {quote.rushOK ? (
            <label className={`ic-fast${rushOn ? " on" : ""}`}>
              <input type="checkbox" className="ic-input" checked={rushOn} onChange={onRush} />
              <span className="ic-fast-tx">
                <b>
                  {copy.fast.t} <i>{copy.fast.extra}</i>
                </b>
                <span>{copy.fast.p}</span>
              </span>
              <span className="ic-switch" aria-hidden="true" />
            </label>
          ) : null}
        </div>
      ) : null}

      <div className={`ic-bill${has ? "" : " zero"}`}>
        {has && extras ? (
          <dl className="ic-lines">
            <div>
              <dt>
                {copy.lines.replace("{{count}}", String(picked.length))}
                {quote.feeUsd ? <small className="ic-sub">{copy.risk.row}</small> : null}
              </dt>
              <dd dir="ltr">{money(quote.subtotal)}</dd>
            </div>
            {rushOn ? (
              <div>
                <dt>
                  {copy.fast.t} <small>{copy.fast.extra}</small>
                </dt>
                <dd dir="ltr">+{money(quote.rushFee)}</dd>
              </div>
            ) : null}
            {quote.fxFee > 0 ? (
              <div>
                <dt>
                  {copy.fx.charge} <small>{pct}</small>
                </dt>
                <dd dir="ltr">+{money(quote.fxFee)}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
        <div className="ic-total">
          <span className="ic-k">{copy.total}</span>
          <b className={sizeOf(totalLabel)}>
            <bdi dir="ltr">{totalLabel}</bdi>
          </b>
        </div>
        {has && reportDays > 0 ? (
          <p className={`ic-ready${rushOn ? " rush" : ""}`}>
            <ClockIcon />
            <span data-audit-skip="yes">{copy.readyBy.replace("{{date}}", dateIn(reportDays))}</span>
          </p>
        ) : null}
      </div>

      <a className={`ic-cta${has ? " on" : ""}`} href={href}>
        <span>{copy.cta}</span>
        <ArrowIcon />
      </a>
      {has ? (
        <button type="button" className="ic-clear" onClick={onClear}>
          {copy.clear}
        </button>
      ) : null}

      <div className="ic-foot">
        <p>
          {cur === "USD"
            ? copy.note
            : copy.fx.rate
                .replaceAll("{{code}}", cur)
                .replace("{{date}}", isoDate(FX_AS_OF, locale))
                .split(/(1 US \$ = \{\{rate\}\} [A-Z]{3})/)
                .map((part, i) =>
                  i % 2 ? (
                    <bdi key={i} dir="ltr">
                      {part.replace("{{rate}}", rate.toLocaleString("en-US", { maximumFractionDigits: rate >= 10 ? 2 : 4 }))}
                    </bdi>
                  ) : (
                    part
                  ),
                )}
        </p>
        {has ? (
          <>
            <details className="ic-tatnote">
              <summary>
                <InfoIcon />
                {copy.tatNote.b}
              </summary>
              <p>{copy.tatNote.p}</p>
            </details>
            <details className="ic-tatnote">
              <summary>
                <InfoIcon />
                {copy.feeNote.b}
              </summary>
              <p>{copy.feeNote.p}</p>
            </details>
          </>
        ) : null}
      </div>
    </aside>
  );
}
