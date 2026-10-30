"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

import { fill } from "@/components/momapply/fill";
import { ArrowIcon } from "@/components/momapply/icons";
import { openRazorpayCheckout } from "@/lib/cart/razorpay";
import type { HellostaffCopy } from "@/lib/copy/hellostaff";
import { hsTotal, type HsService } from "@/lib/hellostaff/catalog";
import { hsApi } from "@/lib/hellostaff/client";
import type { HsCase, HsResult } from "@/lib/hellostaff/types";

import { Alert } from "./Alert";
import { DocumentStep } from "./DocumentStep";
import { failText } from "./failText";
import { Done, InstructionsBody, PackageBody, PaymentBody, Rail, Summary } from "./parts";
import { SignIn } from "./SignIn";

/** Hello Staff's `Verify.tsx` steps after sign-in, in its order. */
const STEPS = ["package", "instructions", "payment", "document"] as const;
type Step = (typeof STEPS)[number];

type Progress = { step: Step; paid: boolean; fir: boolean };

const store = (caseId: string) => `hv-hellostaff-${caseId}`;

function readProgress(caseId: string): Progress | null {
  try {
    const p = JSON.parse(sessionStorage.getItem(store(caseId)) ?? "null") as Progress | null;
    return p && STEPS.includes(p.step) ? p : null;
  } catch {
    return null;
  }
}

/** The four HelloV home services' checkout, end to end, against the Hello
 *  Staff backend: sign in, package (with the FIR add-on that makes it
 *  Advanced), instructions, Razorpay, the document check. */
export function HelloStaffFlow({
  t,
  service,
  termsHref,
  hellovHref,
  demoCode,
}: {
  t: HellostaffCopy;
  service: HsService;
  termsHref: string;
  hellovHref: string;
  demoCode: string | null;
}) {
  const sv = t.services[service.slug];
  const [stage, setStage] = useState<"loading" | "signin" | "flow" | "done">("loading");
  const [hsCase, setCase] = useState<HsCase | null>(null);
  const [step, setStep] = useState<Step>("package");
  const [fir, setFir] = useState(false);
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  function apply(r: HsResult<{ case: HsCase }>) {
    if (!r.ok) {
      setError(r.code === "no_session" ? "" : failText(t, r));
      setStage("signin");
      return;
    }
    const saved = readProgress(r.case.caseId);
    const advanced = new URLSearchParams(window.location.search).get("plan") === "advanced";
    setError("");
    setCase(r.case);
    setFir(saved ? saved.fir : advanced);
    setPaid(saved?.paid ?? false);
    setStep(saved?.step ?? "package");
    setStage(r.case.check?.filled && saved?.paid ? "done" : "flow");
  }
  const applyLoaded = useEffectEvent(apply);

  useEffect(() => {
    let live = true;
    hsApi.loadCase(service.slug).then((r) => live && applyLoaded(r));
    return () => {
      live = false;
    };
  }, [service.slug]);

  function reload() {
    setStage("loading");
    hsApi.loadCase(service.slug).then(apply);
  }

  useEffect(() => {
    if (hsCase) sessionStorage.setItem(store(hsCase.caseId), JSON.stringify({ step, paid, fir } satisfies Progress));
  }, [hsCase, step, paid, fir]);

  const moved = useRef(false);
  useEffect(() => {
    if (moved.current) document.getElementById("hs-step-t")?.focus();
    moved.current = true;
  }, [step, stage]);

  async function signOut() {
    await hsApi.signOut();
    setCase(null);
    setStage("signin");
  }

  function paidNow() {
    setPaying(false);
    setPaid(true);
    setStep("document");
  }

  async function pay() {
    setError("");
    setPaying(true);
    const order = await hsApi.payOrder(service.slug, fir);
    if (!order.ok) {
      setPaying(false);
      return setError(failText(t, order));
    }
    if (order.demo) return paidNow();
    try {
      await openRazorpayCheckout({
        key: order.key,
        amount: Math.round(order.amount * 100),
        currency: "INR",
        name: "HelloVerify",
        description: "Case Verification Payment",
        order_id: order.orderId,
        prefill: { name: hsCase?.name, contact: hsCase?.mobile },
        onSuccess: async (p) => {
          const v = await hsApi.payVerify(service.slug, p);
          if (!v.ok) {
            setPaying(false);
            return setError(t.errors.payFail);
          }
          paidNow();
        },
        onDismiss: () => setPaying(false),
      });
    } catch {
      setPaying(false);
      setError(t.errors.upstream);
    }
  }

  const total = hsTotal(service, fir);
  const index = STEPS.indexOf(step);
  const railSteps = [t.rail.steps.signIn, ...STEPS.map((s) => t.rail.steps[s]), t.rail.steps.done];
  const railAt = stage === "done" ? railSteps.length - 1 : stage === "flow" ? index + 1 : 0;

  return (
    <div className="ma-apply">
      <div className="ma-apply-head">
        <div>
          <p className="k">{sv.pkg}</p>
          <h1 className="ma-title">{sv.t}</h1>
          <p className="ma-lede">{sv.lede}</p>
        </div>
        {demoCode ? <span className="ma-demo">{fill(t.demo, { code: demoCode })}</span> : null}
      </div>

      <Rail t={t} steps={railSteps} at={railAt} canGo={(i) => !paid && stage === "flow" && i >= 1 && i < railAt} onGo={(i) => setStep(STEPS[i - 1])} />

      {stage === "loading" ? (
        <p className="ma-loading">
          <span className="ma-spin" aria-hidden="true" />
        </p>
      ) : stage === "signin" ? (
        <div className="mf-work">
          <div>
            {error ? <Alert text={error} /> : null}
            <SignIn t={t} slug={service.slug} termsHref={termsHref} demoCode={demoCode} onSignedIn={reload} />
          </div>
          <Summary t={t} service={service} fir={fir} total={total} />
        </div>
      ) : stage === "done" && hsCase ? (
        <Done t={t} caseId={hsCase.caseId} mobile={hsCase.mobile} hellovHref={hellovHref} />
      ) : hsCase ? (
        <div className="mf-work">
          <section className="mf-step" aria-labelledby="hs-step-t">
            <p className="hs-who">
              <span>{fill(t.signIn.as, { name: hsCase.name || `+91 ${hsCase.mobile}`, caseId: hsCase.caseId })}</span>
              {paid ? null : (
                <button type="button" className="ma-link ma-link-sm" onClick={() => void signOut()}>
                  {t.signIn.signOut}
                </button>
              )}
            </p>

            {step === "package" ? (
              <PackageBody t={t} service={service} fir={fir} onFir={setFir} />
            ) : step === "instructions" ? (
              <InstructionsBody t={t} />
            ) : step === "payment" ? (
              <PaymentBody t={t} service={service} fir={fir} total={total} paid={paid} paying={paying} demo={Boolean(demoCode)} onPay={() => void pay()} />
            ) : (
              <>
                <h2 id="hs-step-t" className="mf-step-t" tabIndex={-1}>
                  {t.doc.title[service.doc]}
                </h2>
                {hsCase.check ? (
                  <DocumentStep t={t} service={service} check={hsCase.check} onSubmitted={() => setStage("done")} />
                ) : (
                  <Alert text={t.errors.upstream} />
                )}
              </>
            )}

            {error ? <Alert text={error} /> : null}

            {step === "package" || step === "instructions" || (step === "payment" && paid) ? (
              <div className="mf-nav">
                {step === "instructions" ? (
                  <button type="button" className="btn btn-line mf-back" onClick={() => setStep("package")}>
                    <ArrowIcon />
                    {t.nav.back}
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" className="btn btn-ink mf-next" onClick={() => setStep(STEPS[index + 1])}>
                  {t.nav.next}
                  <ArrowIcon />
                </button>
              </div>
            ) : null}
          </section>
          <Summary t={t} service={service} fir={fir} total={total} />
        </div>
      ) : null}
    </div>
  );
}
