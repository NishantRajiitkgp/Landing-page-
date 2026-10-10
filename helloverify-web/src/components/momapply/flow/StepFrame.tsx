import type { ReactNode, RefObject } from "react";

import type { MomStepsCopy } from "@/lib/copy/momSteps";

import { fill } from "../fill";
import { AlertIcon, ArrowIcon, TickIcon } from "../icons";

export function StepFrame({
  s,
  n,
  total,
  title,
  lede,
  titleRef,
  left,
  saved,
  onBack,
  onNext,
  nextLabel,
  busy,
  children,
}: {
  s: MomStepsCopy;
  n: number;
  total: number;
  title: ReactNode;
  lede?: string;
  titleRef: RefObject<HTMLHeadingElement | null>;
  /** Items still to do, shown after a failed Continue; null hides the count. */
  left: number | null;
  saved: boolean;
  onBack: (() => void) | null;
  onNext: (() => void) | null;
  nextLabel?: string;
  busy?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="mf-step" aria-labelledby="mf-step-t">
      <header className="mf-step-h">
        <p className="k">{fill(s.nav.step, { n, total })}</p>
        <h2 className="mf-step-t" id="mf-step-t" ref={titleRef} tabIndex={-1}>
          {title}
        </h2>
        {lede ? <p className="ma-lede">{lede}</p> : null}
      </header>

      <div className="mf-step-b">{children}</div>

      {left ? (
        <p className="ma-alert" role="alert">
          <AlertIcon />
          {left === 1 ? s.issues.fixOne : fill(s.issues.fix, { n: left })}
        </p>
      ) : null}

      <footer className="mf-nav">
        {onBack ? (
          <button type="button" className="btn btn-line mf-back" onClick={onBack}>
            <ArrowIcon />
            {s.nav.back}
          </button>
        ) : (
          <span />
        )}
        <span className="mf-saved" aria-live="polite">
          {saved ? (
            <>
              <TickIcon />
              {s.nav.saved}
            </>
          ) : null}
        </span>
        {onNext ? (
          <button type="button" className="btn btn-ink mf-next" onClick={onNext} disabled={busy}>
            {nextLabel ?? s.nav.next}
            <ArrowIcon />
          </button>
        ) : null}
      </footer>
    </section>
  );
}
