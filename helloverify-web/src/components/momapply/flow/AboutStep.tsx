"use client";

import { useState } from "react";

import type { MomErrors } from "@/lib/copy/momApply";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { aboutIssues, FULL_NAME_MAX, normalizePassport, PASSPORT_MAX, PASSPORT_SLOT } from "@/lib/mom/apply/policy";
import { PASS_TYPES, type About, type Draft } from "@/lib/mom/apply/types";

import type { UpdateDraft } from "./draft";
import { DocSlot } from "./DocSlot";
import { ChoiceField, CountryField, TextField } from "./Fields";
import { fieldId } from "./steps";

const yearsFrom = (date: string, years: number) => `${Number(date.slice(0, 4)) + years}${date.slice(4)}`;

export function AboutStep({
  draft,
  update,
  s,
  errors,
  locale,
  now,
  tried,
}: {
  draft: Draft;
  update: UpdateDraft;
  s: MomStepsCopy;
  errors: MomErrors;
  locale: string;
  now: string;
  tried: boolean;
}) {
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set());
  const a = draft.about;
  const issues = aboutIssues(a, draft.docs, now);
  const show = (f: keyof typeof issues) => {
    const issue = issues[f];
    return issue && (tried || touched.has(f)) ? s.issues[issue] : null;
  };
  const touch = (f: string) => setTouched((t) => (t.has(f) ? t : new Set(t).add(f)));
  const set = (patch: Partial<About>) => update((d) => ({ ...d, about: { ...d.about, ...patch } }));

  return (
    <>
      <TextField
        id={fieldId("fullName")}
        label={s.about.fullName}
        value={a.fullName}
        autoComplete="name"
        maxLength={FULL_NAME_MAX}
        error={show("fullName")}
        onChange={(v) => set({ fullName: v })}
        onBlur={() => touch("fullName")}
      />
      <div className="ma-row2">
        <TextField
          id={fieldId("dob")}
          type="date"
          label={s.about.dob}
          value={a.dob}
          autoComplete="bday"
          min={yearsFrom(now, -90)}
          max={yearsFrom(now, -16)}
          error={show("dob")}
          onChange={(v) => set({ dob: v })}
          onBlur={() => touch("dob")}
        />
        <CountryField
          id={fieldId("nationality")}
          label={s.about.nationality}
          locale={locale}
          value={a.nationality}
          placeholder={s.nav.select}
          error={show("nationality")}
          onChange={(v) => set({ nationality: v })}
          onBlur={() => touch("nationality")}
        />
      </div>
      <div className="ma-row2">
        <TextField
          id={fieldId("passportNo")}
          label={s.about.passportNo}
          value={a.passportNo}
          dir="ltr"
          autoCapitalize="characters"
          autoComplete="off"
          maxLength={PASSPORT_MAX}
          error={show("passportNo")}
          onChange={(v) => set({ passportNo: normalizePassport(v) })}
          onBlur={() => touch("passportNo")}
        />
        <TextField
          id={fieldId("passportExpiry")}
          type="date"
          label={s.about.passportExpiry}
          value={a.passportExpiry}
          min={now}
          max={yearsFrom(now, 15)}
          error={show("passportExpiry")}
          onChange={(v) => set({ passportExpiry: v })}
          onBlur={() => touch("passportExpiry")}
        />
      </div>
      <ChoiceField
        id={fieldId("passType")}
        label={s.about.pass}
        value={a.passType}
        options={PASS_TYPES.map((p) => ({ value: p, label: s.about.passes[p] }))}
        error={show("passType")}
        onChange={(v) => set({ passType: v })}
      />
      <div className="ma-field">
        <DocSlot
          slot={PASSPORT_SLOT}
          doc={draft.docs.passport}
          t={s.docs}
          optional={s.nav.optional}
          issues={s.issues}
          errors={errors}
          error={show("passport")}
          locale={locale}
          onChange={(doc) =>
            update((d) => {
              const docs = { ...d.docs };
              if (doc) docs.passport = doc;
              else delete docs.passport;
              return { ...d, docs };
            })
          }
        />
      </div>
    </>
  );
}
