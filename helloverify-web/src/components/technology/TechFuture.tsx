/** "Building the Future of Digital Trust" on `/technology`, as one scroll
    story in three acts. A tall runway pins the heading and the three
    layers beside one scene that runs out to the page's edge, on the page
    itself; scrolling plays it, one layer's line open at a time:

      01  persistent: the road the page travelled braids into HelloVerify's
          core; an identity, a business and a credential are verified and
          stored, a layer each, then watched round its orbit, alive, and
          updated as they change (`./TechFutureCore`);
      02  trusted access: a government, an enterprise, a bank and a hospital
          each reach them by consent and get the validated credential back,
          their own repeat checks struck off (`./TechFutureAccess`);
      03  infrastructure: the view pulls back to the network the core
          powers, lit ring by ring, and the verification provider becomes
          the trust infrastructure (`./TechFutureNet`).

    A layer's name jumps to its act, and pointing at a card or an
    organisation lights its line. The scroll is `./TechFutureStage`; the
    scene is decoration (`aria-hidden`). */
import "@/app/v2/tech.css";
import type { TechArt } from "./TechPillarKit";
import { TechFutureStage } from "./TechFutureStage";
import { Assets, Braid, CoreBack, CoreStack } from "./TechFutureCore";
import { AccessBack, Orgs } from "./TechFutureAccess";
import { Badge, TechFutureNet } from "./TechFutureNet";

export function TechFuture({ h, cards, art }: { h: string; cards: { t: string; p: string }[]; art: TechArt }) {
  return (
    <TechFutureStage>
      <div className="tk-ft-run">
        <div className="wrap tk-ft-pin">
          <div className="tk-ft-copy">
            <h2 className="h2 tk-ft-h">{h}</h2>
            <ol className="tk-ft-steps">
              {cards.map((c, i) => (
                <li key={c.t} className="tk-ft-step">
                  <span className="tk-ft-n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>
                    <button type="button" className="tk-ft-go" data-go={i}>
                      {c.t}
                    </button>
                  </h3>
                  <div className="tk-ft-p">
                    <p>{c.p}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="tk-ft-scene" aria-hidden="true">
            <div className="tk-ft-art">
              <TechFutureNet />
              <div className="tk-ft-lay tk-ft-hub">
                <Braid />
                <svg className="tk-ft-svg tk-mirror" viewBox="0 0 800 700" fill="none">
                  <AccessBack />
                  <CoreBack />
                  <CoreStack />
                </svg>
                <Assets a={art} />
                <Orgs a={art} />
              </div>
              <Badge a={art} />
            </div>
          </div>
        </div>
      </div>
    </TechFutureStage>
  );
}
