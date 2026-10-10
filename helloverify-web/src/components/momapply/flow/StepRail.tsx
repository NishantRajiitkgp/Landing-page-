import { fill } from "../fill";
import { TickIcon } from "../icons";

export type RailCopy = {
  aside: { steps: readonly { t: string }[] };
  apply: { progress: string; step: string };
};

/** A track that fills up to the step you're on. Reached steps, except the
 *  account, are a way back. */
export function StepRail({
  t,
  current,
  reached,
  onGo,
}: {
  t: RailCopy;
  current: number;
  reached: number;
  onGo: (index: number) => void;
}) {
  const steps = t.aside.steps;

  return (
    <nav className="ma-rail" aria-label={t.apply.progress}>
      <p className="ma-rail-m">
        <span>{fill(t.apply.step, { n: current + 1, total: steps.length })}</span>
        <b>{steps[current].t}</b>
      </p>
      <div className="ma-rail-bar" aria-hidden="true">
        {steps.map((step, i) => (
          <i key={step.t} className={i === current ? "is-now" : i < reached ? "is-done" : undefined} />
        ))}
      </div>
      <ol>
        {steps.map((step, i) => {
          const now = i === current;
          const complete = !now && i < reached;
          const goable = i > 0 && i <= reached && !now;
          const state = [now ? "is-now" : complete ? "is-done" : "", i <= reached ? "is-reached" : ""].filter(Boolean).join(" ");
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
