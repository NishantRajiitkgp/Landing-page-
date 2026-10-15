import { GlobeIcon, InfoIcon } from "@/components/international/checkIcons";
import type { SummaryCopy } from "@/components/international/IntlSummary";
import { currencyOf, formatMoney, RISK_FEE_USD, toLocal, type IntlOption } from "@/lib/international/catalog";

/** Above the check list: which ticked checks a country change dropped, and
 *  for a high-risk country the per-check fee its prices already carry. */
export function IntlNotices({
  copy,
  country,
  dropped,
}: {
  copy: SummaryCopy;
  country: IntlOption | undefined;
  dropped: readonly string[];
}) {
  const cur = country ? currencyOf(country.code) : "USD";
  const droppedLabel = (dropped.length === 1 ? copy.moved.one : copy.moved.many)
    .replace("{{count}}", String(dropped.length))
    .replace("{{country}}", country?.name ?? "")
    .replace("{{names}}", dropped.join(", "));

  return (
    <>
      {dropped.length > 0 ? (
        <p className="ic-notice" role="status" data-audit-skip="yes">
          <InfoIcon />
          <span>{droppedLabel}</span>
        </p>
      ) : null}

      {country?.risk ? (
        <div className="ic-risk" role="note">
          <span className="ic-risk-ic" aria-hidden="true">
            <GlobeIcon />
          </span>
          <span className="ic-risk-tx">
            <span className="ic-k">{copy.risk.tag}</span>
            <b data-audit-skip={country.cms ? undefined : "yes"}>{copy.risk.h.replace("{{country}}", country.name)}</b>
            <span>{copy.risk.p}</span>
          </span>
          <span className="ic-risk-fee">
            <b>
              <bdi dir="ltr">{formatMoney(toLocal(RISK_FEE_USD, cur), cur)}</bdi>
            </b>
            <small>{copy.risk.fee}</small>
          </span>
        </div>
      ) : null}
    </>
  );
}
