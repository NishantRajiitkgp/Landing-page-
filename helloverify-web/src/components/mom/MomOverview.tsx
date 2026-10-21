import { Steps } from "@/components/chrome/Steps";
import type { MomDoc } from "@/lib/mom/doc";

import { MomIcon, MomLink } from "./MomBits";

type Overview = MomDoc["screening"]["overview"];

export function MomOverview({ overview, locale }: { overview: Overview; locale: string }) {
  const prices = overview.transparentPricing;
  const why = overview.whyChoose;
  const services = overview.ourServices;
  const how = overview.howItWorks;
  const docs = overview.requiredDocuments;
  const compass = overview.compassFramework;
  const support = overview.support;

  return (
    <>
      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{prices.title}</h2>
        </div>
        <div className="mom3-pricebreak">
          {prices.items.map((item) => (
            <article key={item.title}>
              <b>{item.price}</b>
              <h3>{item.title}</h3>
              <p>{item.footnote}</p>
            </article>
          ))}
        </div>
        <div className="mom3-acts">
          <MomLink href={prices.cta.href} locale={locale} className="btn btn-line btn-sm">
            {prices.cta.label}
          </MomLink>
        </div>
      </section>

      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{why.title}</h2>
          <p className="lede">{why.subtitle}</p>
        </div>
        <div className="mom3-grid3">
          {why.cards.map((card) => (
            <article key={card.title} className="mom3-card">
              <MomIcon src={card.iconSrc} />
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{services.title}</h2>
          <p className="lede">{services.subtitle}</p>
        </div>
        <div className="mom3-svc">
          {services.cards.map((card) => (
            <article key={card.title} className={card.span === "wide" ? "mom3-card mom3-wide" : "mom3-card"}>
              <MomIcon src={card.iconSrc} />
              <h3>{card.title}</h3>
              {"body" in card && card.body ? <p>{card.body}</p> : null}
              {"tags" in card && card.tags ? (
                <ul className="mom3-tags">
                  {card.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{how.title}</h2>
          <p className="lede">{how.subtitle}</p>
        </div>
        <Steps
          name={how.title}
          items={how.steps.map((step, index) => ({
            n: String(index + 1).padStart(2, "0"),
            t: step.title,
            p: step.body,
          }))}
        />
      </section>

      <section className="wrap sec3">
        <div className="mom3-docs">
          <article className="mom3-card">
            <MomIcon src={docs.main.iconSrc} />
            <h2>{docs.main.title}</h2>
            <ul className="mom3-list">
              {docs.main.checklist.map((item, index) =>
                typeof item === "string" ? (
                  <li key={index}>{item}</li>
                ) : (
                  <li key={index}>
                    {item.text}
                    <span className="mom3-note">{item.tooltip}</span>
                  </li>
                ),
              )}
            </ul>
            <ul className="mom3-tags">
              {docs.main.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
          <div className="mom3-stack">
            {docs.sideCards.map((card) => (
              <article key={card.title} className="mom3-card">
                <MomIcon src={card.iconSrc} />
                <h3>{card.title}</h3>
                {"emphasisLines" in card
                  ? card.emphasisLines?.map((line) => (
                      <p key={line.lead}>
                        <strong>{line.lead}</strong>
                        {line.rest}
                      </p>
                    ))
                  : null}
                {"body" in card && card.body ? <p>{card.body}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap sec3">
        <p className="k">{compass.eyebrow}</p>
        <div className="sec-head">
          <h2 className="h2">{compass.title}</h2>
          <p className="lede">{compass.intro}</p>
        </div>
        <div className="mom3-grid2">
          {compass.stages.map((stage) => (
            <article key={stage.title} className="mom3-card">
              <h3>{stage.title}</h3>
              <p>{stage.body}</p>
            </article>
          ))}
        </div>
        <div className="mom3-acts">
          <MomLink href={compass.primaryCta.href} locale={locale} className="btn btn-ink btn-sm">
            {compass.primaryCta.label}
          </MomLink>
        </div>
        <div className="mom3-grid2">
          <article className="mom3-card">
            <h3>{compass.scoringCard.title}</h3>
            <p>{compass.scoringCard.body}</p>
            {compass.scoringCard.rows.map((row) => (
              <p key={row.points} className="mom3-row">
                <b>{row.points}</b>
                <span>{row.description}</span>
              </p>
            ))}
          </article>
          <article className="mom3-card">
            <h3>{compass.linksCard.title}</h3>
            <ul className="mom3-list mom3-linklist">
              {compass.linksCard.links.map((link) => (
                <li key={link.label}>
                  <MomLink href={link.href} locale={locale}>
                    {link.label}
                  </MomLink>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{support.title}</h2>
          <p className="lede">{support.subtitle}</p>
        </div>
        <div className="mom3-grid2">
          {support.cards.map((card) => (
            <article key={card.title} className="mom3-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <div className="mom3-acts">
                <MomLink href={card.cta.href} locale={locale} className="btn btn-line btn-sm">
                  {card.cta.label}
                </MomLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
