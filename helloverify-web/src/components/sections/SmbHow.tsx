/** "How it works" for the Small & Medium panel (`./SmbPacks`), 1 Oct 2026:
    the old SMB tab's three steps — Select Checks, Fill Information, Get
    Result — played on a drawn screen, one step at a time, on the shared
    `./StepCycler` clock that the Large band's KYC phone uses.

    The screen follows one Premium order all the way through, so the three
    screens are one story: its five checks tick on and the total prints; the
    candidate (the new hire from the Premium photograph) fills in and gives
    consent; the report comes back with each check verified, in 60 minutes.
    Every name, price and step on it is the old tab's copy; the words new
    here are `smb.demo`'s.

    It loops for longer than five seconds, so it carries its own "Pause
    motion" (`./BizMotion`, WCAG 2.2.2). Paused, under reduced motion, or
    off screen the clock stops and the steps still work by hand; the server
    HTML is step one, complete. The screens animate with transitions keyed
    on `.is-on`, never keyframes, so a stopped animation never hides one. */
import Image from "next/image";

import { Tick } from "@/components/brand/Tick";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { tint } from "@/lib/img";
import { MotionButton, MotionStage } from "./BizMotion";
import { PACKS } from "./smbData";
import { StepCycler } from "./StepCycler";

/** The candidate on the form and the report: the new hire in the Premium
 *  photograph, cropped to her face. */
const HIRE = "/img/v2/sm-hire.jpg";

function Face({ className }: { className: string }) {
  return (
    <span className={className} style={{ background: tint(HIRE) }}>
      <Image className="pimg" src={HIRE} alt="" fill sizes="56px" />
    </span>
  );
}

/** Stand-in lines of text on the screen: the form's labels and answers,
 *  the candidate's name. Decorative, like the KYC phone's `Bars`. */
function Bars({ n, className }: { n: number; className: string }) {
  return (
    <span className={className}>
      {Array.from({ length: n }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  );
}

export async function SmbHow() {
  const all = await copy(SECTIONS);
  const t = all.smb;
  const B = t.build;
  const order = PACKS.find((p) => p.best) ?? PACKS[PACKS.length - 1];
  const pk = t.packs[order.id];
  const d = (j: number) => ({ "--d": j }) as React.CSSProperties;

  return (
    <MotionStage className="sx" pausedClassName="sx-paused">
      <StepCycler
        className="sx-cy"
        every={2600}
        holdLast={1.8}
        stepsLabel={t.demo.stepsK}
        lead={
          <>
            <span className="sx-k">
              <span className="k">{t.demo.stepsK}</span>
              <MotionButton className="sx-motion" pauseLabel={all.hero.motion.pause} playLabel={all.hero.motion.play} />
            </span>
            <h3 className="sx-h">{B.quoteB}</h3>
            <p className="sx-p">{B.quote}</p>
          </>
        }
        steps={Object.entries(t.steps).map(([k, s]) => (
          <span key={k} className="sx-st">
            <b>{s.b}</b>
            <span>{s.p}</span>
          </span>
        ))}
        screens={[
          <div key="s0" className="sx-sel">
            <span className="sx-pill">{pk.name}</span>
            <ul className="sx-rows">
              {order.lines.map((l, j) => (
                <li key={l} style={d(j)}>
                  <span className="sx-box">
                    <Tick tone="inverse" />
                  </span>
                  <span>{t.lines[l]}</span>
                </li>
              ))}
            </ul>
            <span className="sx-sum">
              <span>{B.total}</span>
              <b>{pk.price}</b>
            </span>
          </div>,
          <div key="s1" className="sx-fill">
            <span className="sx-who">
              <Face className="sx-av" />
              <Bars n={2} className="sx-bars" />
            </span>
            {[0, 1, 2].map((j) => (
              <span key={j} className="sx-field" style={d(j)}>
                <i />
                <i />
              </span>
            ))}
            <span className="sx-consent">
              <span className="sx-sw">
                <i />
              </span>
              <span>{t.demo.consent}</span>
            </span>
          </div>,
          <div key="s2" className="sx-rep">
            <span className="sx-who">
              <Face className="sx-av" />
              <Bars n={2} className="sx-bars" />
              <span className="sx-seal">
                <Tick tone="inverse" />
              </span>
            </span>
            <ul className="sx-res">
              {order.lines.map((l, j) => (
                <li key={l} style={d(j)}>
                  <span>{t.lines[l]}</span>
                  <span className="sx-ok">
                    <Tick />
                    {all.hero.seal.word}
                  </span>
                </li>
              ))}
            </ul>
            <span className="sx-ready">
              <b>{t.demo.ready}</b>
              <span>{t.mins}</span>
            </span>
          </div>,
        ]}
      />
    </MotionStage>
  );
}
