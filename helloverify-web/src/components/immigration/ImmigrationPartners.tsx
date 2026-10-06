/** The old immigration page's "Our Partners" band — five marks with their
 *  labels and one CTA — shared by the authorities and applicant pages. */
import Image from "next/image";
import { AppLink } from "@/components/chrome/AppLink";

const LOGOS = {
  latvia: { src: "/img/partners/latvia.png", w: 197, h: 158 },
  italy: { src: "/img/partners/italy.png", w: 150, h: 100 },
  britain: { src: "/img/partners/britain.png", w: 176, h: 150 },
  switzerland: { src: "/img/partners/switzerland.png", w: 395, h: 127 },
  zambia: { src: "/img/partners/zambia.png", w: 506, h: 160 },
} as const;

export function ImmigrationPartners({
  h,
  logos,
  cta,
  href,
}: {
  h: string;
  logos: Record<keyof typeof LOGOS, string>;
  cta: string;
  href: string;
}) {
  return (
    <div className="wrap sec3">
      <div className="sec-head">
        <h2 className="h2">{h}</h2>
      </div>
      <ul className="body3 ptn3">
        {(Object.keys(LOGOS) as (keyof typeof LOGOS)[]).map((k) => (
          <li key={k}>
            <span className="lg">
              <Image src={LOGOS[k].src} alt={logos[k]} width={LOGOS[k].w} height={LOGOS[k].h} sizes="140px" />
            </span>
            <span className="nm">{logos[k]}</span>
          </li>
        ))}
      </ul>
      <div className="ptn3-cta">
        <AppLink href={href} className="btn btn-ink" target="_blank" rel="noopener noreferrer">{cta}</AppLink>
      </div>
    </div>
  );
}
