/** The `/about` hero: the headline over the world it is about. The words
    rise in reading order while the land-dot map (`./AboutMap`) plays the
    head office reaching the other five offices and trust spreading out
    across the land. */
import type { ReactNode } from "react";
import { splitWords } from "@/components/brand/splitWords";
import { AboutMap } from "./AboutMap";
import "@/app/v2/about.css";

export function AboutHero({ h1 }: { h1: ReactNode }) {
  const headline = splitWords(h1, "ab-w", { i: 0 });
  return (
    <section className="ab-hero">
      <div className="wrap">
        <h1 className="ab-h1">{headline}</h1>
      </div>
      <div className="wrap ab-map">
        <AboutMap />
      </div>
    </section>
  );
}
