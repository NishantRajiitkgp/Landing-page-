"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { MomApplyCopy } from "@/lib/copy/momApply";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { localise } from "@/lib/i18n/href";
import { openRazorpayCheckout } from "@/lib/cart/razorpay";
import type { RazorpaySuccessPayload } from "@/lib/cart/types";
import { momAccount } from "@/lib/mom/account/client";
import type { Applicant } from "@/lib/mom/account/types";
import { application, checkout, pay as settle } from "@/lib/mom/apply/client";
import { today } from "@/lib/mom/apply/policy";
import { money, quote, type Prices } from "@/lib/mom/apply/pricing";
import type { ApplyFailure, CaseFile } from "@/lib/mom/apply/types";
import { MOM_SIGN_IN_PATH } from "@/lib/mom/paths";

import { failureText, fill } from "./fill";
import { AboutStep } from "./flow/AboutStep";
import { ApplySummary } from "./flow/ApplySummary";
import { ChecksStep } from "./flow/ChecksStep";
import { forgetDraft, useDraft } from "./flow/draft";
import { PayStep } from "./flow/PayStep";
import { QualStep } from "./flow/QualStep";
import { ReviewStep } from "./flow/ReviewStep";
import { StepFrame } from "./flow/StepFrame";
import { StepRail } from "./flow/StepRail";
import { Submitted } from "./flow/Submitted";
import { openItems, reachable, setStepHash, STEP_IDS, STEP_OF, useStepHash } from "./flow/steps";
import { useMomSession } from "./useMomSession";

type Props = { t: MomApplyCopy; s: MomStepsCopy; locale: string; prices: Prices };

/** `/apply`: signed-in applicants only; anyone else goes to sign in. */
export function ApplyHome(props: Props) {
  const router = useRouter();
  const session = useMomSession();
  const signInHref = localise(MOM_SIGN_IN_PATH, props.locale);

  useEffect(() => {
    if (session.ready && !session.applicant) router.replace(signInHref);
  }, [session.ready, session.applicant, router, signInHref]);

  if (!session.applicant) {
    return (
      <p className="ma-loading" role="status">
        <span className="ma-spin" aria-hidden="true" />
        {props.t.apply.loading}
      </p>
    );
  }

  const applicant = session.applicant;
  return (
    <Workspace
      {...props}
      applicant={applicant}
      onSignOut={async () => {
        forgetDraft(applicant.id);
        await momAccount.signOut();
        router.replace(signInHref);
      }}
    />
  );
}

function Workspace({ t, s, locale, prices, applicant, onSignOut }: Props & { applicant: Applicant; onSignOut: () => Promise<void> }) {
  const { draft, update } = useDraft(applicant);
  const hash = useStepHash();
  const [now] = useState(today);
  const limit = reachable(draft, now);
  const asked = (STEP_IDS as readonly string[]).indexOf(hash);
  const current = asked >= 1 && asked <= limit ? asked : limit;
  const [tried, setTried] = useState<number | null>(null);
  /** Set while editing from review, so Continue goes straight back to it. */
  const [resume, setResume] = useState<number | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const [fault, setFault] = useState<string | null>(null);
  const [held, setHeld] = useState<CaseFile | null | undefined>(undefined);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const left = openItems(current, draft, now);
  const steps = t.aside.steps;

  useEffect(() => {
    let live = true;
    void application().then((res) => {
      if (live) setHeld(res.ok ? res.application : null);
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (held === undefined) return;
    const want = held ? "track" : STEP_IDS[current];
    if (window.location.hash.slice(1) !== want) window.history.replaceState(window.history.state, "", `#${want}`);
  }, [current, held]);

  const returning = resume !== null && resume > current;

  function go(index: number) {
    setTried(null);
    if (resume !== null && index >= resume) setResume(null);
    setStepHash(index);
    window.requestAnimationFrame(() => {
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      top.current?.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" });
      titleRef.current?.focus({ preventScroll: true });
    });
  }

  function explain(failure: ApplyFailure): string {
    if (failure.step) return s.pay.incomplete;
    if (failure.code === "rate_limited") return failureText(t.errors, { ok: false, code: "rate_limited", retryAfter: failure.retryAfter });
    if (failure.code === "too_large" || failure.code === "bad_type") return t.errors.upstream;
    return t.errors[failure.code];
  }

  function next() {
    if (left.length) {
      setTried(current);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById(left[0])?.focus()));
      return;
    }
    if (current === 5) {
      void pay();
      return;
    }
    update((d) => ({ ...d, reached: Math.max(d.reached, current + 1) }));
    go(returning ? (resume ?? current + 1) : current + 1);
  }

  async function pay() {
    if (paying) return;
    setPaying(true);
    setFault(null);
    const name = (draft.billing.name ?? draft.about.fullName).replace(/\s+/g, " ").trim();
    const company = draft.billing.company.replace(/\s+/g, " ").trim();
    const opened = await checkout(draft, { name, company });
    if (!opened.ok) {
      setPaying(false);
      if (opened.step) {
        const index = STEP_OF[opened.step];
        if (index !== current) go(index);
        setTried(index);
      } else setFault(explain(opened));
      return;
    }
    if ("application" in opened) {
      setHeld(opened.application);
      return;
    }
    const done = (paid: Awaited<ReturnType<typeof settle>>) => {
      if (paid.ok) setHeld(paid.application);
      else {
        setPaying(false);
        setFault(explain(paid));
      }
    };
    if (opened.demo) {
      done(await settle({ intent: opened.intent }));
      return;
    }
    try {
      await openRazorpayCheckout({
        key: opened.key,
        amount: opened.amount,
        currency: opened.currency,
        name: "HelloVerify",
        description: s.pay.gateway,
        order_id: opened.orderId,
        prefill: { name, email: applicant.email, contact: `${applicant.dial}${applicant.phone}` },
        onSuccess: (payload: RazorpaySuccessPayload) => {
          void settle({
            intent: opened.intent,
            razorpay_order_id: payload.razorpay_order_id,
            razorpay_payment_id: payload.razorpay_payment_id,
            razorpay_signature: payload.razorpay_signature,
          }).then(done);
        },
        onDismiss: () => setPaying(false),
      });
    } catch {
      setPaying(false);
      setFault(t.errors.upstream);
    }
  }

  function edit(step: number) {
    setResume(current);
    go(step);
  }

  const shared = { draft, update, s, errors: t.errors, locale, now, tried: tried === current };
  const frame = {
    s,
    n: current + 1,
    total: steps.length,
    titleRef,
    left: tried === current ? left.length : null,
    saved: draft.savedAt > 0,
    onBack: current > 1 ? () => go(current - 1) : null,
    nextLabel: returning ? s.nav.toReview : undefined,
  };

  const head = (
    <header className="ma-apply-head">
        <h1 className="ma-title">{fill(t.apply.hello, { name: applicant.first })}</h1>
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
  );

  if (held === undefined) {
    return (
      <p className="ma-loading" role="status">
        <span className="ma-spin" aria-hidden="true" />
        {t.apply.loading}
      </p>
    );
  }

  if (held) {
    return (
      <div className="ma-apply">
        {head}
        <Submitted file={held} s={s} locale={locale} />
      </div>
    );
  }

  return (
    <div className="ma-apply">
      {head}
      <StepRail t={t} current={current} reached={limit} onGo={go} />
      <div className="mf-work" ref={top}>
        <div className="mf-main">
          {current === 1 ? (
            <StepFrame {...frame} title={s.about.title} lede={s.about.lede} onNext={next}>
              <AboutStep {...shared} />
            </StepFrame>
          ) : current === 2 ? (
            <StepFrame {...frame} title={s.quals.title} lede={s.quals.lede} onNext={next}>
              <QualStep {...shared} />
            </StepFrame>
          ) : current === 3 ? (
            <StepFrame {...frame} title={s.checks.title} lede={s.checks.lede} onNext={next}>
              <ChecksStep {...shared} prices={prices} />
            </StepFrame>
          ) : current === 4 ? (
            <StepFrame {...frame} title={s.review.title} lede={s.review.lede} onNext={next} nextLabel={s.review.next}>
              <ReviewStep {...shared} prices={prices} onEdit={edit} />
            </StepFrame>
          ) : (
            <StepFrame
              {...frame}
              title={s.pay.title}
              lede={s.pay.lede}
              onNext={next}
              busy={paying}
              nextLabel={paying ? s.pay.paying : fill(s.pay.pay, { amount: money(quote(draft, prices).total, locale) })}
            >
              <PayStep {...shared} fault={fault} />
            </StepFrame>
          )}
        </div>
        <ApplySummary draft={draft} s={s} locale={locale} prices={prices} due={current === 5} />
      </div>
    </div>
  );
}
