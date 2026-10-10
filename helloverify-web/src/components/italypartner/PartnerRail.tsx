import type { ItalyPartnerCopy } from "@/lib/copy/italyPartner";

import { fill } from "../momapply/fill";
import { TickIcon } from "../momapply/icons";

/** `open` is the furthest step that can be visited. Account is already done. */
export function PartnerRail({
  t,
  current,
  open,
  onGo,
}: {
  t: ItalyPartnerCopy;
  current: number;
  open: number;
  onGo: (index: number) => void;
}) {
  const steps = t.aside.steps;

  return (
    <nav className="ma-rail" aria-label={t.home.progress}>
      <p className="ma-rail-m">
        <span>{fill(t.home.step, { n: current + 1, total: steps.length })}</span>
        <b>{steps[current]?.t}</b>
      </p>
      <div className="ma-rail-bar" aria-hidden="true">
        {steps.map((step, i) => (
          <i key={step.t} className={i === current ? "is-now" : i < current ? "is-done" : undefined} />
        ))}
      </div>
      <ol>
        {steps.map((step, i) => {
          const now = i === current;
          const complete = !now && i < current;
          const goable = !now && i > 0 && i <= open;
          const state = [now ? "is-now" : complete ? "is-done" : "", i <= current ? "is-reached" : ""].filter(Boolean).join(" ");
          const body = (
            <>
              <span className="ma-rail-dot">{complete ? <TickIcon /> : i + 1}</span>
              <span className="ma-rail-lab">{step.t}</span>
            </>
          );
          return (
            <li key={step.t} className={state || undefined} aria-current={now ? "step" : undefined}>
              <span className="ma-rail-line ma-rail-in" aria-hidden="true" />
              <span className="ma-rail-line ma-rail-out" aria-hidden="true" />
              {goable ? (
                <button type="button" className="ma-rail-go" onClick={() => onGo(i)}>
                  {body}
                </button>
              ) : (
                <span className="ma-rail-go">{body}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
