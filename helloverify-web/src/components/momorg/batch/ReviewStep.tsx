"use client";

import { useState } from "react";

import { failureText, fill } from "@/components/momapply/fill";
import { StepFrame } from "@/components/momapply/flow/StepFrame";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { openRazorpayCheckout } from "@/lib/cart/razorpay";
import { money, type Prices } from "@/lib/mom/apply/pricing";
import { batchQuote, type Candidate } from "@/lib/mom/org/batch";
import { checkoutBatch, payBatch, type BatchPaid } from "@/lib/mom/org/batchClient";
import { blankBilling, NO_DECLARATIONS, type BatchBilling, type BatchFailure, type Declarations } from "@/lib/mom/org/checkout";
import type { OrgUser } from "@/lib/mom/org/types";

import { Manifest } from "./Manifest";
import { ReviewPay, reviewLeft } from "./ReviewPay";
import type { UpdateBatch } from "./useBatch";
import type { Held } from "./usePaid";

type Frame = Omit<Parameters<typeof StepFrame>[0], "title" | "lede" | "left" | "onNext" | "children">;

const later = (fn: () => void) => window.requestAnimationFrame(() => window.requestAnimationFrame(fn));

/** One look at the batch, three confirmations, the invoice details, one payment. */
export function ReviewStep({
  candidates,
  stored,
  update,
  frame,
  user,
  onPaid,
  onStep,
  t,
  s,
  locale,
  prices,
}: {
  candidates: readonly Candidate[];
  stored: BatchBilling | undefined;
  update: UpdateBatch;
  frame: Frame;
  user: OrgUser;
  onPaid: (held: Held) => void;
  onStep: (step: 1 | 2) => void;
  t: MomOrgCopy;
  s: MomStepsCopy;
  locale: string;
  prices: Prices;
}) {
  const r = t.review;
  const billing = stored ?? blankBilling(user);
  const [agree, setAgree] = useState<Declarations>(NO_DECLARATIONS);
  const [tried, setTried] = useState(false);
  const [paying, setPaying] = useState(false);
  const [fault, setFault] = useState<string | null>(null);
  const left = reviewLeft(agree, billing);
  const total = batchQuote(candidates, prices).total;

  function explain(f: BatchFailure): string {
    if (f.step) return r.incomplete;
    if (f.code === "rate_limited") return failureText(t.errors, { ok: false, code: "rate_limited", retryAfter: f.retryAfter });
    if (f.code === "too_large" || f.code === "bad_type") return t.errors.upstream;
    return t.errors[f.code];
  }

  function done(paid: BatchPaid) {
    if (paid.ok) {
      onPaid({ batch: paid.batch, receipt: paid.receipt });
      return;
    }
    setPaying(false);
    setFault(explain(paid));
  }

  async function pay() {
    if (paying) return;
    if (left.length) {
      setTried(true);
      later(() => document.getElementById(left[0])?.focus());
      return;
    }
    setPaying(true);
    setFault(null);
    const opened = await checkoutBatch(candidates, billing, agree);
    if (!opened.ok) {
      setPaying(false);
      if (opened.step === "candidates" || opened.step === "documents") {
        onStep(opened.step === "candidates" ? 1 : 2);
        return;
      }
      if (opened.step === "review") setTried(true);
      setFault(explain(opened));
      return;
    }
    if (opened.demo) {
      done(await payBatch({ intent: opened.intent }));
      return;
    }
    try {
      await openRazorpayCheckout({
        key: opened.key,
        amount: opened.amount,
        currency: opened.currency,
        name: "HelloVerify",
        description: r.gateway,
        order_id: opened.orderId,
        prefill: { name: `${user.first} ${user.last}`.trim(), email: billing.email, contact: `${user.dial}${user.phone}` },
        onSuccess: (payload) => {
          void payBatch({ intent: opened.intent, ...payload }).then(done);
        },
        onDismiss: () => setPaying(false),
      });
    } catch {
      setPaying(false);
      setFault(t.errors.upstream);
    }
  }

  return (
    <StepFrame
      {...frame}
      title={r.title}
      lede={r.lede}
      left={tried ? left.length : null}
      onNext={() => void pay()}
      busy={paying}
      nextLabel={paying ? r.paying : fill(r.pay, { amount: money(total, locale) })}
    >
      <Manifest candidates={candidates} onEdit={onStep} t={t} s={s} locale={locale} prices={prices} />
      <ReviewPay
        agree={agree}
        onAgree={(d, on) => setAgree((a) => ({ ...a, [d]: on }))}
        billing={billing}
        onBilling={(patch) => update((b) => ({ ...b, billing: { ...(b.billing ?? blankBilling(user)), ...patch } }))}
        tried={tried}
        fault={fault}
        org={user.org}
        t={t}
        s={s}
        locale={locale}
      />
    </StepFrame>
  );
}
