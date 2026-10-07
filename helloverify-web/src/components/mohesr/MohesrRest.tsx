import type { MohesrDoc } from "@/lib/mohesr/doc";

type Screening = MohesrDoc["screening"];

function pretty(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function MohesrRequirements({ screening }: { screening: Screening }) {
  const process = screening.applicationProcess.subTabs;
  const individual = process.individual;
  const box = individual.uaePassBox;
  const docs = screening.documents;
  return (
    <div className="wrap sec3">
      <div className="mohesr-kinds">
        <span>{individual.label}</span>
        <span>{process.business.label}</span>
      </div>

      <section className="mohesr-block">
        <div className="sec-head">
          <h2 className="h2">{individual.title}</h2>
          <p className="lede">{individual.intro}</p>
        </div>
        <article className="mom3-card mohesr-pass">
          <p>{box.intro}</p>
          <div className="mom3-acts">
            <a className="btn btn-ink btn-sm" href={box.signInUrl}>
              {box.signInButtonLabel}
            </a>
          </div>
          <p>
            {box.signUpPrefix} {box.signUpLinkLabel}
          </p>
          <div hidden>
            <img alt={box.signInLogoAlt} src="/img/mohesr-emblem.png" />
            <p>{box.signUpQrModal.androidTitle}</p>
            <img alt={box.signUpQrModal.androidQrAlt} src="/img/mohesr-emblem.png" />
            <p>{box.signUpQrModal.androidCaption}</p>
            <p>{box.signUpQrModal.androidLinkLabel}</p>
            <p>{box.signUpQrModal.iosTitle}</p>
            <img alt={box.signUpQrModal.iosQrAlt} src="/img/mohesr-emblem.png" />
            <p>{box.signUpQrModal.iosNote}</p>
          </div>
        </article>
        <h3 className="mohesr-sub">{individual.uaePassInfo.title}</h3>
        <p className="mohesr-copy">{individual.uaePassInfo.body}</p>
        <div className="mom3-grid3 mohesr-facts">
          {individual.features.map((feature) => (
            <article key={feature.title} className="mom3-card mohesr-fact">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mohesr-block">
        <div className="sec-head">
          <h2 className="h2">{process.business.title}</h2>
          <p className="lede">{process.business.intro}</p>
        </div>
        <div className="mom3-grid2 mohesr-facts">
          {process.business.features.map((feature) => (
            <article key={feature.title} className="mom3-card mohesr-fact">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
        <div className="mom3-acts">
          <a className="btn btn-ink" href={process.business.applyButtonLink}>
            {process.business.applyButtonLabel}
          </a>
        </div>
      </section>

      <section className="mohesr-block">
        <div className="sec-head">
          <h2 className="h2">{docs.intro.title}</h2>
          <p className="lede">{docs.intro.subtitle}</p>
        </div>
        <article className="mom3-card mohesr-doc">
          <h3>{docs.uaePass.headerTitle}</h3>
          <p>{docs.uaePass.intro}</p>
          <ul className="mom3-list">
            {docs.uaePass.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{docs.uaePass.footer}</p>
        </article>
        <div className="mom3-grid2">
          {docs.columns.map((column) => (
            <article key={column.id} className="mom3-card mohesr-doc">
              <h3>{column.headerTitle}</h3>
              <ul className="mom3-list">
                {column.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <h3 className="mohesr-sub">{docs.notes.title}</h3>
        <ul className="mom3-list">
          {docs.notes.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function MohesrTrack({ screening }: { screening: Screening }) {
  const track = screening.track;
  return (
    <section className="wrap sec3">
      <div className="sec-head">
        <h2 className="h2">{track.title}</h2>
        <p className="lede">{track.lead}</p>
      </div>
      <p className="mohesr-copy">{track.infoLead}</p>
      <div className="mom3-acts">
        <a className="btn btn-ink" href={track.portalCta.href}>
          {track.portalCta.label}
        </a>
      </div>
    </section>
  );
}

export function MohesrAppeal({ screening }: { screening: Screening }) {
  const appeal = screening.appealProcess;
  return (
    <section className="wrap sec3">
      <h2 className="h2">{appeal.title}</h2>
      <div className="mohesr-prose">
        {appeal.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function MohesrFaqs({ screening }: { screening: Screening }) {
  const faqs = screening.faqs;
  return (
    <div className="wrap sec3">
      <div className="sec-head">
        <h2 className="h2">{faqs.title}</h2>
        <p className="lede">{faqs.subtitle}</p>
      </div>
      {faqs.categories.map((category) => (
        <section key={category.id} className="mohesr-faq">
          <h3 className="mohesr-sub">{category.label}</h3>
          <div className="faq3">
            {category.items.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <span className="m" data-audit-skip="yes" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="a" data-audit-skip="yes">
                  {pretty(item.answer)}
                </p>
                <span hidden>{item.answer}</span>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
