/** The `/technology` hero: the headline beside its sentence, and beside them
    the sentence acted out on a globe (`./TechHeroGlobe`): a case reaches
    HelloVerify's AI and is routed across borders to the authorities that
    can confirm it, one after another, until it closes; then the next. */
import type { CSSProperties, ReactNode } from "react";
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";
import { splitWords } from "@/components/brand/splitWords";
import "@/app/v2/tech.css";
import type { TechArt } from "./TechPillarKit";
import { TechHeroGlobe } from "./TechHeroGlobe";

export function TechHero({
  kicker,
  h1,
  sub,
  cta,
  href,
  art,
}: {
  kicker: string;
  h1: ReactNode;
  sub: string;
  cta: string;
  href: string;
  art: TechArt;
}) {
  const count = { i: 0 };
  const headline = splitWords(h1, "tk-w", count);

  return (
    <section className="tk-hero">
      <div className="wrap tk-hero-in">
        <div className="tk-copy" style={{ "--n": count.i } as CSSProperties}>
          <p className="tk-kick">
            <span className="tk-kick-dot" aria-hidden="true" />
            {kicker}
          </p>
          <h1 className="tk-h1">{headline}</h1>
          <p className="tk-sub">{sub}</p>
          <div className="tk-acts">
            <AppLink href={href} className="btn btn-ink tk-cta">
              <span>{cta}</span>
              <Arrow />
            </AppLink>
          </div>
        </div>

        <TechHeroGlobe art={art} />
      </div>
    </section>
  );
}
