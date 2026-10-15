"use client";
// The pieces of `ContactForm` that only render what they are given. State,
// the action and the arrival logic stay in the form.

import { Field, TEXT_FIELDS } from "@/components/forms/LeadFields";
import { MultiSelect } from "@/components/forms/MultiSelect";
import type { FormsUi } from "@/lib/copy/forms";
import { localise } from "@/lib/i18n/href";
import {
  contactDetailsRequired,
  interestIsMulti,
  type InterestValue,
  type LeadField,
  type SegmentValue,
} from "@/lib/leads/constraints";
import type { FieldErrors, LeadFormState } from "@/lib/leads/state";

export function invalidProps(errors: FieldErrors | undefined, field: LeadField, idPrefix: string) {
  return errors?.[field]
    ? { "aria-invalid": true as const, "aria-describedby": `${idPrefix}${field}-error` }
    : {};
}

export function ContactSuccess({ t, locale, message }: { t: FormsUi; locale: string; message?: string }) {
  const L = (path: string) => localise(path, locale);
  return (
    <div className="form">
      <div className="fld-l" style={{ marginBottom: 10 }}>
        {t.kicker}
      </div>
      <div className="status ok" role="status">
        {message}
      </div>
      <p className="consent">
        {t.success.lead}{" "}
        <a href={L("/platform/security-compliance")}>{t.success.pack}</a> {t.success.mid}{" "}
        <a href={L("/resources/checks")}>{t.success.library}</a> {t.success.end}
      </p>
    </div>
  );
}

export function LeadTextFields({
  t,
  segment,
  values,
  errors,
  idPrefix,
}: {
  t: FormsUi;
  segment: SegmentValue;
  values: LeadFormState["values"];
  errors: FieldErrors | undefined;
  idPrefix: string;
}) {
  return TEXT_FIELDS.map((base) => {
    const words =
      base.id === "company"
        ? segment === "individual"
          ? undefined
          : t.audiences[segment].company
        : base.id === "email"
          ? t.audiences[segment].email
          : t.fields.name;
    if (!words) return null;
    const f = { ...base, ...words };
    const must = f.id === "name" ? contactDetailsRequired(segment) : Boolean(f.required);
    const missing =
      f.id === "email" ? t.checks.emailMissing : f.id === "name" ? t.checks.nameMissing : t.checks.companyInvalid;
    const bad =
      f.id === "email" ? t.checks.emailInvalid : f.id === "name" ? t.checks.nameInvalid : t.checks.companyInvalid;
    return (
      <Field key={f.id} id={f.id} label={must ? `${f.label} *` : f.label} message={errors?.[f.id]} idPrefix={idPrefix}>
        <input
          className="inp"
          id={idPrefix + f.id}
          name={f.id}
          type={f.type}
          placeholder={f.placeholder}
          autoComplete={f.autoComplete}
          required={must}
          minLength={f.minLength}
          pattern={f.pattern}
          maxLength={f.maxLength}
          defaultValue={values?.[f.id] ?? ""}
          onInvalid={(e) => {
            const el = e.currentTarget;
            el.setCustomValidity(el.validity.valueMissing ? missing : bad);
          }}
          onInput={(e) => e.currentTarget.setCustomValidity("")}
          {...invalidProps(errors, f.id, idPrefix)}
        />
      </Field>
    );
  });
}

export function InterestField({
  t,
  segment,
  group,
  offered,
  picked,
  token,
  errors,
  idPrefix,
}: {
  t: FormsUi;
  segment: SegmentValue;
  group: Parameters<typeof interestIsMulti>[0];
  offered: readonly InterestValue[];
  picked: readonly InterestValue[];
  token: number | undefined;
  errors: FieldErrors | undefined;
  idPrefix: string;
}) {
  const id = idPrefix + "interest";
  const error = errors?.interest;
  const interestDefault = picked[0] ?? "";
  return (
    /* Beside Mobile for an individual, who has no company row to fill the
       grid; across both columns otherwise. */
    <Field id="interest" label={t.interest} wide={segment !== "individual"} message={error} idPrefix={idPrefix}>
      {/* `key` forces a remount on each submission, and it is doing real
          work. React resets the form once the action resolves; for an
          <input> that is harmless because `defaultValue` becomes the value
          attribute and the reset restores it. A <select> has no such
          attribute — React applies `defaultValue` by marking an option
          selected at MOUNT only — so without a remount a failed submission
          silently cleared the service the user had picked. Measured, not
          theorised: it was the one field that came back empty. */}
      {/* The audience is in the key too: switching it remounts the
          control with that audience's options. */}
      {interestIsMulti(group) ? (
        <MultiSelect
          key={`${token ?? 0}-${group}-${picked.join(",")}`}
          id={id}
          name="interest"
          label={t.interest}
          options={offered.map((value) => ({ value, label: t.interests[value] }))}
          placeholder={t.audiences[segment].interestPlaceholder}
          countLabel={t.selectedCount}
          defaultValue={picked}
          invalid={Boolean(error)}
          describedBy={error ? `${id}-error` : undefined}
        />
      ) : (
        <select
          key={`${token ?? 0}-${group}-${interestDefault}`}
          className="inp"
          id={id}
          name="interest"
          defaultValue={interestDefault}
          {...invalidProps(errors, "interest", idPrefix)}
        >
          <option value="" disabled>
            {t.audiences[segment].interestPlaceholder}
          </option>
          {offered.map((value) => (
            <option key={value} value={value}>
              {t.interests[value]}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
