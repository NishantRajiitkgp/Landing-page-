import type { MomDoc } from "@/lib/mom/doc";

import { MomLink } from "./MomBits";

type Band = MomDoc["screening"]["pricing"]["packagesBand"];

export function MomPricing({ band, locale }: { band: Band; locale: string }) {
  const express = band.expressAddon;
  const check = express.includedCheck;

  return (
    <div id="mom-pricing">
      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{band.title}</h2>
          <p className="lede">{band.subtitle}</p>
        </div>
        <div className="mom3-grid2">
          {band.packages.map((pkg) => (
            <article key={pkg.name} className={"badge" in pkg && pkg.badge ? "mom3-card mom3-pkg" : "mom3-card"}>
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              <p className="mom3-price">
                <b>{pkg.priceDisplay}</b>
                <span>{pkg.priceUnit}</span>
              </p>
              <p>{pkg.gstBreakdownLine}</p>
              {"badge" in pkg && pkg.badge ? <p className="mom3-pop">{pkg.badge}</p> : null}
              <ul className="mom3-list">
                {pkg.features.map((feature) => (
                  <li key={feature.label}>{feature.label}</li>
                ))}
              </ul>
              <ul className="mom3-list">
                {pkg.lineItems.map((item) => (
                  <li key={item.label}>{item.label}</li>
                ))}
              </ul>
              <h4>
                {band.included.titlePrefix}
                {pkg.name}
              </h4>
              <p>{band.included.tapHint}</p>
              {pkg.includedChecks.map((item) => (
                <div key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.priceLabel}</p>
                  <p>{item.summary}</p>
                  <ul className="mom3-list">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <article className="mom3-card">
          <h2>
            {express.title} {express.optionalLabel}
          </h2>
          <p>{express.description}</p>
          <p>{express.descriptionEmphasis}</p>
          <p className="mom3-pop">{express.priceBadge}</p>
          <p>{express.summaryLabel}</p>
          <h3>{check.title}</h3>
          <p>{check.priceLabel}</p>
          <p>{check.summary}</p>
          <ul className="mom3-list">
            {check.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="wrap sec3">
        <article className="mom3-card">
          <h2>
            {band.packages[0].name}
            {band.summary.titleSuffix}
          </h2>
          <p>{band.summary.subtotalLabel}</p>
          <p>{band.summary.gstLabel}</p>
          <p>{band.summary.totalLabel}</p>
          <div className="mom3-acts">
            <MomLink href={band.summary.cta.href} locale={locale} className="btn btn-ink btn-sm">
              {band.summary.cta.label}
            </MomLink>
          </div>
          <p>{band.summary.footer}</p>
        </article>
      </section>

      <section className="wrap sec3">
        <h2 className="h2">{band.reportIncludes.title}</h2>
        <div className="mom3-grid2">
          <ul className="mom3-list">
            {band.reportIncludes.leftColumn.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className="mom3-list">
            {band.reportIncludes.rightColumn.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
