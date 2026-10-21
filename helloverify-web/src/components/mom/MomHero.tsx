import Image from "next/image";

import type { MomDoc } from "@/lib/mom/doc";
import { MOM_ORG_REGISTER_PATH, MOM_REGISTER_PATH } from "@/lib/mom/paths";

import { MomIcon, MomLink } from "./MomBits";

type Roles = MomDoc["screening"]["overview"]["roleCards"];

/** Hero fields follow each locale's CMS key order in the DOM. CSS places
 *  each one: logo and caption, the alt line, the title. The applicant and
 *  employer cards fill the column beside the title. */
export function MomHero({ hero, roles, locale }: { hero: MomDoc["hero"]; roles: Roles; locale: string }) {
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
  };

  return (
    <div className="wrap hero3 mom3-hero mom3-hero-split">
      {Object.keys(hero).map((key) => slots[key] ?? null)}
      <div className="mom3-hero-roles">
        <article className="mom3-card mom3-role">
          <MomIcon src={roles.candidates.iconSrc} />
          <h2>{roles.candidates.title}</h2>
          <p>{roles.candidates.body}</p>
          <div className="mom3-acts">
            <MomLink href={MOM_REGISTER_PATH} locale={locale} className="btn btn-ink btn-sm">
              {roles.candidates.primaryCta.label}
            </MomLink>
          </div>
        </article>
        <article className="mom3-card mom3-role">
          <MomIcon src={roles.employers.iconSrc} />
          <h2>{roles.employers.title}</h2>
          <p>{roles.employers.body}</p>
          <div className="mom3-acts">
            <MomLink href={MOM_ORG_REGISTER_PATH} locale={locale} className="btn btn-ink btn-sm">
              {roles.employers.primaryCta.label}
            </MomLink>
            <MomLink href={roles.employers.secondaryCta.href} locale={locale} className="btn btn-line btn-sm">
              {roles.employers.secondaryCta.label}
            </MomLink>
          </div>
        </article>
      </div>
    </div>
  );
}
