/** Premium services, under Individual Checks. The three cards are the nav's
    Premium menu — doctors and dentists, immigration pre-screening, and
    consumer service — with that menu's own words and the same destinations.

    The band is the homepage's own vocabulary: the paper ground, a serif
    heading with its red italic line, a centred mono label over the cards
    (Individual Checks'), and photograph cards with a frosted chip at the top
    and a frosted plate at the foot holding the audience and a white button
    (Individual Checks' price row). Three across on desktop; on a phone one
    scroll-snap row, as the packages are.

    THE PHOTOGRAPHS are not the homepage's elsewhere: the dossiers already show
    the green-scrubs nurse and the visa counter, so health is the blue-scrubs
    nurse with her file (`people/`), immigration a document photographed for
    a pre-check, and consumer the home-and-family page's own picture. */
import Image from "next/image";

import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { tint } from "@/lib/img";
import "@/app/v2/premium.css";

/** Order, destinations and marks, matching `chrome/SiteNav.tsx`'s `PREMIUM`.
 *  The paths are that menu's icons, drawn here so this section does not
 *  import the nav. `pos` keeps the face in the top half, above the words. */
const SERVICES = [
  {
    id: "health",
    href: "/solutions/health-authorities",
    img: "/img/people/02-nurse-abudhabi.jpg",
    pos: "50% 30%",
    d: "M12 19.5s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 7.6a3.9 3.9 0 0 1 7 2.3c0 5.3-7 9.6-7 9.6zM7.8 11.8h2.1l1.2-2.1 1.9 3.8 1.2-1.7h2",
  },
  {
    id: "immigration",
    href: "/products/immigration?tab=applicant",
    img: "/img/12-phone-signup.jpg",
    pos: "62% 40%",
    d: "M6.5 3.5h11v17h-11zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 10h6M12 7c1 1 1 5 0 6M12 7c-1 1-1 5 0 6M9.5 17h5",
  },
  {
    id: "consumer",
    href: "/individuals/home-family",
    img: "/img/people/04-nanny-gurugram.jpg",
    pos: "55% 45%",
    d: "M3.5 6h17v12h-17zM9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 15.5c.5-1.5 1.6-2.3 3-2.3s2.5.8 3 2.3M14.5 10h3.5M14.5 13h3.5",
  },
] as const;

const SIZES = "(max-width: 1080px) 78vw, 400px";

export async function PremiumServices() {
  const t = (await copy(SECTIONS)).premiumServices;

  return (
    <section className="pm" aria-labelledby="pm-h">
      <div className="wrap sec-head pm-head">
        <h2 className="h2" id="pm-h">
          {t.heading} <em className="pm-it">{t.headingEm}</em>
        </h2>
        <p className="lede">{t.lede}</p>
      </div>
      <div className="wrap">
        <p className="pm-k">
          <span className="pm-dot" aria-hidden="true" />
          {t.kicker}
        </p>
        <ul className="pm-grid">
          {SERVICES.map((s, i) => {
            const it = t.items[s.id];
            return (
              <li key={s.id} className="pm-card">
                <AppLink href={s.href} className="pm-link">
                  <span className="pm-ph" style={{ background: tint(s.img) }}>
                    <Image className="pimg" src={s.img} alt="" fill sizes={SIZES} style={{ objectPosition: s.pos }} />
                  </span>
                  <span className="pm-scrim" aria-hidden="true" />
                  <span className="pm-chip" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none"><path d={s.d} /></svg>
                    {`0${i + 1}`}
                  </span>
                  <span className="pm-body">
                    <span className="pm-t">{it.t}</span>
                    <span className="pm-p">{it.p}</span>
                    <span className="pm-plate">
                      <span className="pm-who">{it.who}</span>
                      <span className="pm-btn">
                        {t.more}
                        <Arrow size="14" />
                      </span>
                    </span>
                  </span>
                </AppLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
