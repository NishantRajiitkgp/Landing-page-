import { JsonLd } from "@/components/seo/JsonLd";
import type { MomDoc } from "@/lib/mom/doc";
import { faqPage } from "@/lib/seo/schema/faq";

import { MomIcon, MomLink } from "./MomBits";

export function MomTrack({ track, locale }: { track: MomDoc["screening"]["track"]; locale: string }) {
  return (
    <section className="wrap sec3">
      <div className="sec-head">
        <h2 className="h2">{track.title}</h2>
        <p className="lede">{track.lead}</p>
      </div>
      <p className="mom3-lead">{track.infoLead}</p>
      <div className="mom3-acts">
        <MomLink href={track.portalCta.href} locale={locale} className="btn btn-ink btn-sm">
          {track.portalCta.label}
        </MomLink>
      </div>
    </section>
  );
}

export function MomResources({
  resources,
  locale,
}: {
  resources: MomDoc["screening"]["resources"];
  locale: string;
}) {
  const official = resources.officialMomResources;
  const track = resources.trackAuthenticate;

  return (
    <>
      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{official.title}</h2>
          <p className="lede">{official.subtitle}</p>
        </div>
        <div className="mom3-grid3">
          {official.cards.map((card) => (
            <MomLink key={card.title} href={card.href} locale={locale} className="mom3-card">
              <MomIcon src={card.iconSrc} />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </MomLink>
          ))}
        </div>
      </section>
      <section className="wrap sec3">
        <h2 className="h2">{track.title}</h2>
        <div className="mom3-grid2">
          {track.cards.map((card) => (
            <article key={card.title} className="mom3-card">
              <MomIcon src={card.iconSrc} />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <p className="mom3-note">{card.footnote}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function MomFaqs({ faqs }: { faqs: MomDoc["screening"]["faqs"] }) {
  return (
    <>
      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{faqs.title}</h2>
          <p className="lede">{faqs.subtitle}</p>
        </div>
        <div className="faq3">
          {faqs.items.map((item) => (
            <details key={item.question}>
              <summary>
                {item.question}
                <span className="m">+</span>
              </summary>
              <p className="a">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <JsonLd data={faqPage(faqs.items.map((item) => ({ q: item.question, a: item.answer })))} />
    </>
  );
}
