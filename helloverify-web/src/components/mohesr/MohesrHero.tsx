import Image from "next/image";

import { AppLink } from "@/components/chrome/AppLink";
import { MomIcon } from "@/components/mom/MomBits";
import type { MohesrDoc } from "@/lib/mohesr/doc";

type Roles = MohesrDoc["screening"]["roleCards"];

/** Hero fields follow the live CMS key order. The candidate and employer
 *  cards fill the column beside the title. */
export function MohesrHero({ hero, roles }: { hero: MohesrDoc["hero"]; roles: Roles }) {
  const employers = roles.employers;
  return (
    <div className="wrap hero3 mom3-hero mom3-hero-split">
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
      <div className="mom3-hero-roles">
        <article className="mom3-card mom3-role">
          <MomIcon src="/img/mom/icon-candidates.svg" />
          <h2>{roles.candidates.title}</h2>
          <p>{roles.candidates.body}</p>
          <div className="mom3-acts">
            <a className="btn btn-ink btn-sm" href={roles.candidates.primaryCta.href}>
              {roles.candidates.primaryCta.label}
            </a>
          </div>
        </article>
        <article className="mom3-card mom3-role">
          <MomIcon src="/img/mom/icon-employers.svg" />
          <h2>{employers.title}</h2>
          <p>{employers.body}</p>
          <div className="mom3-acts">
            <AppLink className="btn btn-ink btn-sm" href={employers.secondaryCta.href}>
              {employers.secondaryCta.label}
            </AppLink>
          </div>
        </article>
      </div>
    </div>
  );
}
