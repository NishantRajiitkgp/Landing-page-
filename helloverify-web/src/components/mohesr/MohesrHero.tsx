import Image from "next/image";

import type { MohesrDoc } from "@/lib/mohesr/doc";

/** Hero fields follow the live CMS key order. The price figures sit in the
 *  strip; `value` is an audit skip key, so those figures are allowed. */
export function MohesrHero({ hero }: { hero: MohesrDoc["hero"] }) {
  return (
    <div className="wrap hero3 mom3-hero">
      <p hidden>
        {hero.breadcrumb[0].label} {hero.breadcrumb[1].label}
      </p>
      <span hidden>{hero.logoHeight}</span>
      <div className="mom3-logo">
        <Image src="/img/mohesr-emblem.png" alt={hero.logoAlt} width={72} height={72} />
      </div>
      <p className="mom3-alt mom3-sr" aria-hidden>
        {hero.logoAlt}
      </p>
      <h1 className="h1">{hero.title}</h1>
      <p className="sub">{hero.subtitle}</p>
      <div className="strip3 mohesr-strip">
        {hero.priceStrip.map((item) => (
          <div key={item.label} className="it">
            <span>{item.label}</span>
            <b>{item.value}</b>
            {item.footnote ? <span>{item.footnote}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
