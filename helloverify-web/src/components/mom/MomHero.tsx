import Image from "next/image";

import { localise } from "@/lib/i18n/href";
import type { MomDoc } from "@/lib/mom/doc";

/** Hero fields follow each locale's CMS key order in the DOM. CSS `order`
 *  keeps one visual sequence: logo and caption, the alt line, the title. */
export function MomHero({ hero, locale }: { hero: MomDoc["hero"]; locale: string }) {
  const caption = hero.logoCaption.replace(/\s+/g, " ").trim();
  const alt = hero.logoAlt.replace(/\s+/g, " ").trim();
  const same = caption === alt;
  const slots: Record<string, React.ReactNode> = {
    breadcrumb: (
      <p key="breadcrumb" hidden>
        {hero.breadcrumb[0].label} {hero.breadcrumb[1].label}
      </p>
    ),
    logoAlt: (
      <p key="logoAlt" className={same ? "mom3-alt mom3-sr" : "mom3-alt"} aria-hidden={same ? true : undefined}>
        {hero.logoAlt}
      </p>
    ),
    logoCaption: (
      <div key="logoCaption" className="mom3-logo">
        <Image src="/img/partners/mom.png" alt={same ? hero.logoAlt : ""} width={40} height={40} />
        <span className="mom3-pre">{hero.logoCaption}</span>
      </div>
    ),
    title: (
      <h1 key="title" className="h1 mom3-pre">
        {hero.title}
      </h1>
    ),
    subtitle: (
      <p key="subtitle" className="sub">
        {hero.subtitle}
      </p>
    ),
    priceStrip: (
      <div key="priceStrip" className="strip3">
        {hero.priceStrip.map((item) => (
          <a key={item.label} className="it" href={localise(item.href, locale)}>
            <b>{item.value}</b>
            <span>{item.label}</span>
            <span>{item.footnote}</span>
          </a>
        ))}
      </div>
    ),
  };

  return (
    <div className="wrap hero3 mom3-hero">
      {Object.keys(hero).map((key) => slots[key] ?? null)}
    </div>
  );
}
