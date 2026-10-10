import type { MomDoc } from "@/lib/mom/doc";

import { MomIcon, MomLink, MomRich } from "./MomBits";

type Compass = MomDoc["screening"]["compass"];

export function MomCompass({ compass, locale }: { compass: Compass; locale: string }) {
  const story = compass.compassNarrative;
  const criteria = compass.compassCriteria;
  const detail = compass.compassQualificationResources;

  return (
    <div id="mom-compass-details">
      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{compass.pageHeader.title}</h2>
          <p className="lede">{compass.pageHeader.subtitle}</p>
        </div>
        <h3 className="mom3-h">{story.twoStage.title}</h3>
        <p className="mom3-lead">{story.twoStage.intro}</p>
        <div className="mom3-grid2">
          {story.twoStage.pillars.map((pillar) => (
            <article key={pillar.stageLabel} className="mom3-card">
              <p className="mom3-code">{pillar.stageLabel}</p>
              <h3>{pillar.pillarTitle}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <h2 className="h2">{story.whatIs.title}</h2>
        <p className="mom3-lead">{story.whatIs.intro}</p>
        <article className="mom3-card mom3-callout">
          <MomIcon src={story.whatIs.notice.iconSrc} />
          <h3>{story.whatIs.notice.title}</h3>
          <p>
            <MomRich segments={story.whatIs.notice.segments} />
          </p>
        </article>
      </section>

      <section className="wrap sec3">
        <div className="mom3-titlerow">
          <MomIcon src={story.accreditation.iconSrc} />
          <h2>{story.accreditation.title}</h2>
        </div>
        <div className="mom3-grid2">
          {story.accreditation.cards.map((card) => (
            <article key={card.title} className="mom3-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{criteria.title}</h2>
          <p className="lede">{criteria.intro}</p>
        </div>
        <div className="mom3-grid3">
          {criteria.cards.map((card) => (
            <article key={card.code} className="mom3-card">
              <p className="mom3-code">
                {card.code} {card.category === "bonus" ? criteria.tagBonus : criteria.tagFoundation}
              </p>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <p>{card.pointsLabel}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <h2 className="h2">{detail.c2Scoring.title}</h2>
        <p className="mom3-lead">{detail.c2Scoring.intro}</p>
        <div className="mom3-card mom3-rows">
          {detail.c2Scoring.rows.map((row) => (
            <p key={row.pointsLabel} className="mom3-row">
              <MomIcon src={detail.c2Scoring.checklistIconSrc} />
              <b>{row.pointsLabel}</b>
              <span>{row.body}</span>
            </p>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <h2 className="h2">{detail.verificationCover.title}</h2>
        <p className="mom3-lead">{detail.verificationCover.intro}</p>
        <div className="mom3-grid2">
          {detail.verificationCover.cards.map((card) => (
            <article key={card.title} className={card.tone === "peach" ? "mom3-card mom3-peach" : "mom3-card"}>
              <h3>
                {card.titleInfoIcon ? <MomIcon src={detail.verificationCover.infoIconSrc} /> : null}
                {card.title}
              </h3>
              {"body" in card && card.body ? <p>{card.body}</p> : null}
              {"bullets" in card && card.bullets ? (
                <ul className="mom3-list">
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="wrap sec3">
        <h2 className="h2">{detail.officialResources.title}</h2>
        <ul className="mom3-links">
          {detail.officialResources.links.map((link) => (
            <li key={link.label}>
              <MomIcon src={detail.officialResources.linkIconSrc} />
              <MomLink href={link.href} locale={locale}>
                {link.label}
              </MomLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
