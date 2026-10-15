"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { fill } from "@/components/momapply/fill";
import { StepRail } from "@/components/momapply/flow/StepRail";
import { useStepHash } from "@/components/momapply/flow/steps";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { localise } from "@/lib/i18n/href";
import { today } from "@/lib/mom/apply/policy";
import type { Prices } from "@/lib/mom/apply/pricing";
import { batchIssues, missingSlots } from "@/lib/mom/org/batch";
import { momOrg } from "@/lib/mom/org/client";
import type { OrgUser } from "@/lib/mom/org/types";
import { MOM_ORG_SIGN_IN_PATH } from "@/lib/mom/paths";

import { BatchSummary } from "./batch/BatchSummary";
import { CandidatesStep } from "./batch/CandidatesStep";
import { BatchPaid } from "./batch/BatchPaid";
import { DocsStep } from "./batch/DocsStep";
import { ReviewStep } from "./batch/ReviewStep";
import { emptyBatch, forgetBatch, useBatch } from "./batch/useBatch";
import { forgetPaid, usePaid } from "./batch/usePaid";
import { useOrgSession } from "./useOrgSession";

type Props = { t: MomOrgCopy; s: MomStepsCopy; locale: string; prices: Prices };

/** Index 0 is the account, done before this page opens. The hash is the step. */
const STEPS = ["account", "candidates", "documents", "review", "submitted"] as const;

/** `/employers`: signed-in organisations only; anyone else goes to sign in. */
export function OrgHome(props: Props) {
  const router = useRouter();
  const session = useOrgSession();
  const signInHref = localise(MOM_ORG_SIGN_IN_PATH, props.locale);

  useEffect(() => {
    if (session.ready && !session.user) router.replace(signInHref);
  }, [session.ready, session.user, router, signInHref]);

  if (!session.user) {
    return (
      <p className="ma-loading" role="status">
        <span className="ma-spin" aria-hidden="true" />
        {props.t.apply.loading}
      </p>
    );
  }

  const user = session.user;
  return (
    <Workspace
      {...props}
      user={user}
      onSignOut={async () => {
        forgetBatch(user.id);
        forgetPaid(user.id);
        await momOrg.signOut();
        router.replace(signInHref);
      }}
    />
  );
}

function Workspace({ t, s, locale, prices, user, onSignOut }: Props & { user: OrgUser; onSignOut: () => Promise<void> }) {
  const { batch, update } = useBatch(user.id);
  const { held, add } = usePaid(user.id);
  const hash = useStepHash();
  const [now] = useState(today);
  const [leaving, setLeaving] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const issues = useMemo(() => batchIssues(batch, now), [batch, now]);
  const ready = batch.candidates.length > 0 && batch.candidates.every((c) => !issues.get(c.id)?.count);
  const filed = ready && batch.candidates.every((c) => !missingSlots(c).length);
  const limit = ready ? Math.min(Math.max(batch.reached, 1), filed ? 3 : 2) : 1;
  const asked = (STEPS as readonly string[]).indexOf(hash);
  /** The latest paid batch, on its own step or when there is nothing new yet. */
  const paid = held.length > 0 && (asked === 4 || (asked < 1 && !batch.candidates.length));
  const current = paid ? 4 : asked >= 1 && asked <= limit ? asked : limit;

  useEffect(() => {
    const want = STEPS[current];
    if (window.location.hash.slice(1) !== want) window.history.replaceState(window.history.state, "", `#${want}`);
  }, [current]);

  function go(index: number) {
    window.location.hash = STEPS[index];
    window.requestAnimationFrame(() => {
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      top.current?.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" });
      (index === 4 ? document.getElementById("mo-paid-id") : titleRef.current)?.focus({ preventScroll: true });
    });
  }

  const frame = {
    s,
    n: current + 1,
    total: STEPS.length,
    titleRef,
    saved: batch.savedAt > 0,
    onBack: current > 1 ? () => go(current - 1) : null,
  };

  return (
    <div className="ma-apply">
      <header className="ma-apply-head">
        <div>
          <p className="k mo-org">{user.org}</p>
          <h1 className="ma-title">{fill(t.apply.hello, { name: user.first })}</h1>
        </div>
        <button
          type="button"
          className="btn btn-line btn-sm"
          disabled={leaving}
          onClick={() => {
            setLeaving(true);
            void onSignOut();
          }}
        >
          {t.apply.signOut}
        </button>
      </header>
      <StepRail t={t} current={current} reached={paid ? 4 : limit} onGo={go} />
      {paid ? (
        <div ref={top}>
          <BatchPaid key={held[0].batch.id} held={held} onNew={() => go(1)} t={t} s={s} locale={locale} />
        </div>
      ) : (
      <div className="mf-work" ref={top}>
        <div className="mf-main">
          {current === 1 ? (
            <CandidatesStep
              candidates={batch.candidates}
              issues={issues}
              update={update}
              frame={frame}
              onDone={() => {
                update((b) => ({ ...b, reached: Math.max(b.reached, 2) }));
                go(2);
              }}
              t={t}
              s={s}
              locale={locale}
              now={now}
              prices={prices}
            />
          ) : current === 2 ? (
            <DocsStep
              candidates={batch.candidates}
              update={update}
              frame={frame}
              onDone={() => {
                update((b) => ({ ...b, reached: Math.max(b.reached, 3) }));
                go(3);
              }}
              t={t}
              s={s}
              errors={t.errors}
              locale={locale}
            />
          ) : (
            <ReviewStep
              candidates={batch.candidates}
              stored={batch.billing}
              update={update}
              frame={frame}
              user={user}
              onPaid={(h) => {
                add(h);
                update(emptyBatch);
                go(4);
              }}
              onStep={go}
              t={t}
              s={s}
              locale={locale}
              prices={prices}
            />
          )}
        </div>
        <BatchSummary candidates={batch.candidates} issues={issues} t={t} s={s} locale={locale} prices={prices} due={current === 3} />
      </div>
      )}
    </div>
  );
}
