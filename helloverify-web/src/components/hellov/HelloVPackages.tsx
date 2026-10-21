/** HelloV's Packages tab: eight widgets in one continuous list, each showing
 *  its Basic and Advanced tiers. Every tier buys on the Hello Staff
 *  storefront (`/buy/<package>-<tier>`), the same links as the homepage.
 *  Tiers, prices and labels are the homepage storefront's
 *  (`sections.consumer.shop`), so the two cannot disagree. */
import type { IndividualsCopy } from "@/lib/copy/individuals";

type C = IndividualsCopy["hellov"];
export type PackageKey = keyof C["packages"]["items"];
type TierKey = "basic" | "advanced";

export type Tier = { checks: readonly string[]; price?: string; href: string; external: boolean };
export type Offer = {
  key: PackageKey;
  popular: boolean;
  basic: Tier;
  advanced: Tier;
};
export type OfferLabels = {
  tiers: Record<TierKey, string>;
  popular: string;
  currency: string;
};

const TIERS: readonly TierKey[] = ["basic", "advanced"];

function Tick() {
  return (
    <svg viewBox="0 0 16 16" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function HelloVPackages({ c, offers, labels: l }: { c: C; offers: readonly Offer[]; labels: OfferLabels }) {
  const p = c.packages;

  return (
    <>
      <div className="hv3-head">
        <h2 className="h2">{p.h}</h2>
        <p className="lede">{p.sub}</p>
      </div>
      <ul className="hv3-w">
        {offers.map((o) => {
          const it = p.items[o.key];
          return (
            <li key={o.key}>
              <h3>{it.t}</h3>
              <p>{it.p}</p>
              <div className="hv3-tiers">
                {TIERS.map((tk) => {
                  const tier = o[tk];
                  return (
                    <div key={tk} className={`hv3-tier${tk === "advanced" ? " adv" : ""}`}>
                      {tk === "advanced" && o.popular ? <span className="bdg">{l.popular}</span> : null}
                      <p className="nm">{l.tiers[tk]}</p>
                      <p className="pr">
                        {tier.price ? (
                          <>
                            <small>{l.currency}</small> {tier.price}
                          </>
                        ) : (
                          "₹ -"
                        )}
                      </p>
                      <ul className="ck">
                        {tier.checks.map((x) => (
                          <li key={x}>
                            <Tick />
                            {x}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={tier.href}
                        className={`btn btn-sm ${tk === "advanced" ? "btn-ink" : "btn-line"}`}
                        {...(tier.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {p.buy}
                        <Arrow />
                      </a>
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
