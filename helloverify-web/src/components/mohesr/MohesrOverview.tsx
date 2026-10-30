import { localise } from "@/lib/i18n/href";
import type { MohesrDoc } from "@/lib/mohesr/doc";

type Screening = MohesrDoc["screening"];

function outbound(href: string, locale: string) {
  if (href.startsWith("/")) return localise(href, locale);
  return href;
}

export function MohesrOverview({
  screening,
  prices,
  locale,
}: {
  screening: Screening;
  prices: MohesrDoc["hero"]["priceStrip"];
  locale: string;
}) {
  const { overview } = screening;
  const how = overview.howItWorks;
  return (
    <>
      <section className="wrap sec3">
        <div className="mom3-pricebreak mohesr-prices">
          {prices.map((item) => (
            <article key={item.label}>
              <b>{item.value}</b>
              <h3>{item.label}</h3>
              {item.footnote ? <p>{item.footnote}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{overview.psvIntro.title}</h2>
          <p className="lede">{overview.psvIntro.intro}</p>
        </div>
        <div className="mom3-grid2 mohesr-facts">
          {overview.psvIntro.cards.map((card) => (
            <article key={card.title} className="mom3-card mohesr-fact">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{overview.whyChoose.title}</h2>
          <p className="lede">{overview.whyChoose.subtitle}</p>
        </div>
        <div className="mom3-grid2 mohesr-facts">
          {overview.whyChoose.cards.map((card) => (
            <article key={card.title} className="mom3-card mohesr-fact">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{how.title}</h2>
          <p className="lede">{how.subtitle}</p>
        </div>
        <div className="steps3 mohesr-steps">
          {how.steps.map((step) => (
            <div key={step.step}>
              <div className="n">{step.step}</div>
              <div className="t">{step.title}</div>
              <p className="p">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <article className="mom3-card mohesr-turn">
          <h2>{overview.turnaround.headline}</h2>
          <p>{overview.turnaround.body}</p>
        </article>
      </section>

      <section className="wrap sec3">
        <Support support={overview.support} locale={locale} />
      </section>
    </>
  );
}

export function MohesrSupport({ screening, locale }: { screening: Screening; locale: string }) {
  return (
    <section className="wrap sec3">
      <Support support={screening.overview.support} locale={locale} />
    </section>
  );
}

function Support({ support, locale }: { support: Screening["overview"]["support"]; locale: string }) {
  return (
    <div id="mohesr-support">
      <div className="sec-head">
        <h2 className="h2">{support.title}</h2>
        <p className="lede">{support.subtitle}</p>
      </div>
      <div className="mom3-grid2">
        {support.cards.map((card) => (
          <article key={card.title} className="mom3-card mohesr-action">
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <div className="mom3-acts">
              <a className="btn btn-ink btn-sm" href={outbound(card.cta.href, locale)}>
                {card.cta.label}
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
