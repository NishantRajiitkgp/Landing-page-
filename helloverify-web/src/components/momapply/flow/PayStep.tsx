"use client";

import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { COMPANY_MAX, FULL_NAME_MAX, isCompany, isFullName } from "@/lib/mom/apply/policy";
import type { Draft } from "@/lib/mom/apply/types";

import { AlertIcon } from "../icons";
import type { UpdateDraft } from "./draft";
import { TextField } from "./Fields";
import { fieldId } from "./steps";

/** Billing name starts as the passport name. A company is only for the invoice. */
export function PayStep({
  draft,
  update,
  s,
  tried,
  fault,
}: {
  draft: Draft;
  update: UpdateDraft;
  s: MomStepsCopy;
  tried: boolean;
  fault: string | null;
}) {
  const name = draft.billing.name ?? draft.about.fullName;
  const company = draft.billing.company;
  const nameError = tried && !isFullName(name) ? (name.trim() ? s.issues.name : s.issues.required) : null;
  const companyError = tried && company.trim() !== "" && !isCompany(company) ? s.issues.company : null;
  const set = (patch: Partial<Draft["billing"]>) => update((d) => ({ ...d, billing: { ...d.billing, ...patch } }));

  return (
    <>
      {fault ? (
        <p className="ma-alert" role="alert">
          <AlertIcon />
          {fault}
        </p>
      ) : null}
      <TextField
        id={fieldId("billingName")}
        label={s.pay.name}
        value={name}
        autoComplete="name"
        maxLength={FULL_NAME_MAX}
        error={nameError}
        onChange={(v) => set({ name: v })}
      />
      <TextField
        id={fieldId("billingCompany")}
        label={s.pay.company}
        value={company}
        optional={s.nav.optional}
        placeholder={s.pay.companyPlaceholder}
        autoComplete="organization"
        maxLength={COMPANY_MAX}
        error={companyError}
        onChange={(v) => set({ company: v })}
      />
    </>
  );
}
