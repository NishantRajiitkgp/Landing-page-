"use client";

import type { ReactNode } from "react";

import { fill, fillNodes } from "@/components/momapply/fill";
import { CountryField, TextField } from "@/components/momapply/flow/Fields";
import { AlertIcon } from "@/components/momapply/icons";
import { FieldError } from "@/components/momapply/PasswordField";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { localise } from "@/lib/i18n/href";
import {
  ADDRESS_MAX,
  billingIssues,
  DECLARATIONS,
  PO_MAX,
  type BatchBilling,
  type BillingField,
  type Declaration,
  type Declarations,
} from "@/lib/mom/org/checkout";
import { ORG_MAX, REG_MAX } from "@/lib/mom/org/policy";

export const agreeId = (d: Declaration) => `mo-agree-${d}`;
export const billId = (f: BillingField) => `mo-bill-${f}`;

/** Field ids still open, in the order they appear. */
export function reviewLeft(agree: Declarations, billing: BatchBilling): string[] {
  const issues = billingIssues(billing);
  return [
    ...DECLARATIONS.filter((d) => !agree[d]).map(agreeId),
    ...(["org", "reg", "email", "address", "country", "po"] as const).filter((f) => issues[f]).map(billId),
  ];
}

/** The three confirmations and who the invoice is made out to. */
export function ReviewPay({
  agree,
  onAgree,
  billing,
  onBilling,
  tried,
  fault,
  org,
  t,
  s,
  locale,
}: {
  agree: Declarations;
  onAgree: (d: Declaration, on: boolean) => void;
  billing: BatchBilling;
  onBilling: (patch: Partial<BatchBilling>) => void;
  tried: boolean;
  fault: string | null;
  org: string;
  t: MomOrgCopy;
  s: MomStepsCopy;
  locale: string;
}) {
  const r = t.review;
  const issues = tried ? billingIssues(billing) : {};
  const err = (f: BillingField) => (issues[f] ? t.errors[issues[f]] : null);
  const link = (path: string, label: string) => (
    <a href={localise(path, locale)} target="_blank" rel="noopener">
      {label}
    </a>
  );
  const text: Record<Declaration, ReactNode> = {
    act: fill(r.act, { org: org.trim() || billing.org.trim() }),
    consent: r.consent,
    terms: fillNodes(r.terms, { terms: link("/legal/terms-of-service", t.register.terms), privacy: link("/legal/privacy-policy", t.register.privacy) }),
  };

  return (
    <>
      <section className="mf-rev-s mo-declare" aria-labelledby="mo-declare-t">
        <header className="mf-rev-h">
          <h3 id="mo-declare-t">{r.declare}</h3>
        </header>
        {DECLARATIONS.map((d) => {
          const bad = tried && !agree[d];
          return (
            <div className="ma-field" key={d}>
              <label className={`ma-check${bad ? " is-bad" : ""}`}>
                <input
                  id={agreeId(d)}
                  type="checkbox"
                  checked={agree[d]}
                  aria-invalid={bad ? true : undefined}
                  aria-describedby={bad ? `${agreeId(d)}-err` : undefined}
                  onChange={(e) => onAgree(d, e.target.checked)}
                />
                <span>{text[d]}</span>
              </label>
              {bad ? <FieldError id={`${agreeId(d)}-err`}>{s.issues.agree}</FieldError> : null}
            </div>
          );
        })}
      </section>

      <section className="mf-rev-s mo-bill" aria-labelledby="mo-bill-t">
        <header className="mf-rev-h">
          <h3 id="mo-bill-t">{r.invoice}</h3>
        </header>
        <div className="mo-bill-g">
          <TextField id={billId("org")} label={r.org} value={billing.org} autoComplete="organization" maxLength={ORG_MAX} error={err("org")} onChange={(v) => onBilling({ org: v })} />
          <TextField
            id={billId("reg")}
            label={r.reg}
            value={billing.reg}
            optional={t.register.optional}
            placeholder={t.register.regPlaceholder}
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={REG_MAX}
            dir="ltr"
            error={err("reg")}
            onChange={(v) => onBilling({ reg: v })}
          />
          <TextField
            id={billId("email")}
            label={r.email}
            value={billing.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            dir="ltr"
            maxLength={254}
            error={err("email")}
            onChange={(v) => onBilling({ email: v })}
          />
          <TextField
            id={billId("po")}
            label={r.po}
            value={billing.po}
            optional={t.register.optional}
            spellCheck={false}
            maxLength={PO_MAX}
            error={err("po")}
            onChange={(v) => onBilling({ po: v })}
          />
          <div className="mo-bill-wide">
            <TextField
              id={billId("address")}
              label={r.address}
              value={billing.address}
              placeholder={r.addressPlaceholder}
              autoComplete="street-address"
              maxLength={ADDRESS_MAX}
              error={err("address")}
              onChange={(v) => onBilling({ address: v })}
            />
          </div>
          <CountryField
            id={billId("country")}
            label={r.country}
            placeholder={r.country}
            value={billing.country}
            error={err("country")}
            onChange={(v) => onBilling({ country: v })}
            locale={locale}
          />
        </div>
      </section>

      {fault ? (
        <p className="ma-alert" role="alert">
          <AlertIcon />
          {fault}
        </p>
      ) : null}
    </>
  );
}
