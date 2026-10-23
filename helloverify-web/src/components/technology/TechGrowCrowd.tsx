/** The crowd out of focus round the `/technology` compounding story
    (`./TechGrowBoard`): more candidates' cards round the twelve in act
    one, and more institutions round the ten nodes in act two, blurred and
    faded the further out they lie, so the few in focus read as part of a
    great many. They carry no words, only the shapes of them. `./techGrow`
    places them; without it only the wider network shows, round the nodes. */
import type { CSSProperties } from "react";
import { WIDE as L, type Ghost } from "./techGrowPlan";

/** A ghost's place, and how soft it is: blur in scene units, and opacity. */
const soft = (g: Ghost) =>
  ({ "--x": g.x, "--y": g.y, "--blur": (1.2 + g.depth * 3.2).toFixed(2), "--alpha": (0.62 - g.depth * 0.36).toFixed(2) }) as CSSProperties;

export function TechGrowCrowd() {
  return (
    <>
      {L.crowd.map((g, i) => (
        <i key={`c${i}`} className="tk-cx-at tk-cx-ghost tk-cx-ghost-card" data-ghost={i} style={soft(g)}>
          <b />
          <b />
          <b />
          <b />
        </i>
      ))}
      {L.wider.map((g, i) => (
        <i key={`w${i}`} className="tk-cx-at tk-cx-ghost tk-cx-ghost-chip" data-wider={i} data-s="trusted" style={soft(g)}>
          <b />
          <b />
        </i>
      ))}
    </>
  );
}
