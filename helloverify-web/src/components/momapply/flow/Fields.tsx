"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

import { countryOptions } from "@/lib/mom/apply/countries";

import { FieldError } from "../PasswordField";

const ctl = (error?: string | null, extra = "") => `ma-ctl${extra}${error ? " is-bad" : ""}`;
const described = (id: string, error?: string | null) => (error ? `${id}-err` : undefined);

function Label({ id, label, optional }: { id: string; label: string; optional?: string }) {
  return (
    <div className="ma-lrow">
      <label className="ma-l" htmlFor={id}>
        {label}
      </label>
      {optional ? <span className="mf-opt">{optional}</span> : null}
    </div>
  );
}

type TextProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  optional?: string;
  hint?: ReactNode;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "placeholder" | "autoComplete" | "inputMode" | "maxLength" | "dir" | "type" | "min" | "max" | "autoCapitalize" | "spellCheck"
>;

export function TextField({ id, label, value, onChange, onBlur, error, optional, hint, ...input }: TextProps) {
  const describedBy = [hint ? `${id}-hint` : "", described(id, error) ?? ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className="ma-field">
      <Label id={id} label={label} optional={optional} />
      <div className={ctl(error)}>
        <input
          id={id}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          {...input}
        />
      </div>
      {hint ? (
        <p className="mf-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? <FieldError id={`${id}-err`}>{error}</FieldError> : null}
    </div>
  );
}

function Chevron() {
  return (
    <svg className="mf-chev" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
      <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Select({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  children,
  label,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  error?: string | null;
  children: ReactNode;
  label?: string;
  describedBy?: string;
}) {
  return (
    <div className={ctl(error, " mf-sel")}>
      <select
        id={id}
        value={value}
        aria-label={label}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={value ? undefined : "is-empty"}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
      <Chevron />
    </div>
  );
}

export function SelectField({
  label,
  optional,
  ...props
}: Parameters<typeof Select>[0] & { label: string; optional?: string }) {
  return (
    <div className="ma-field">
      <Label id={props.id} label={label} optional={optional} />
      <Select {...props} label={undefined} describedBy={described(props.id, props.error)} />
      {props.error ? <FieldError id={`${props.id}-err`}>{props.error}</FieldError> : null}
    </div>
  );
}

export function CountryField(props: Omit<Parameters<typeof SelectField>[0], "children"> & { locale: string }) {
  const { locale, ...rest } = props;
  const { leaders, rest: others } = countryOptions(locale);
  return (
    <SelectField {...rest}>
      {leaders.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name}
        </option>
      ))}
      <option disabled value="—">
        ──────────
      </option>
      {others.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name}
        </option>
      ))}
    </SelectField>
  );
}

/** Radio pills. The first radio carries `id`, so focus can land on the group. */
export function ChoiceField<V extends string>({
  id,
  label,
  value,
  options,
  onChange,
  error,
  compact,
}: {
  id: string;
  label: string;
  value: V | "";
  options: readonly { value: V; label: string }[];
  onChange: (value: V) => void;
  error?: string | null;
  compact?: boolean;
}) {
  return (
    <fieldset className="ma-field mf-set" aria-describedby={described(id, error)} aria-invalid={error ? true : undefined}>
      <legend className="ma-l">{label}</legend>
      <div className={`mf-pills${compact ? " is-compact" : ""}${error ? " is-bad" : ""}`}>
        {options.map((o, i) => (
          <label key={o.value} className={o.value === value ? "is-on" : undefined}>
            <input
              type="radio"
              id={i === 0 ? id : undefined}
              name={id}
              value={o.value}
              checked={o.value === value}
              onChange={() => onChange(o.value)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error ? <FieldError id={`${id}-err`}>{error}</FieldError> : null}
    </fieldset>
  );
}

/** `YYYY-MM` as two selects: native month inputs are missing in Safari and
 *  Firefox. Either half may be empty while the applicant picks. */
export function MonthField({
  id,
  label,
  value,
  onChange,
  error,
  locale,
  monthLabel,
  yearLabel,
  firstYear,
  lastYear,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  locale: string;
  monthLabel: string;
  yearLabel: string;
  firstYear: number;
  lastYear: number;
}) {
  const [y = "", m = ""] = value.split("-");
  const set = (year: string, month: string) => onChange(year || month ? `${year}-${month}` : "");
  const months = new Intl.DateTimeFormat(`${locale}-u-nu-latn`, { month: "short" });
  const years: string[] = [];
  for (let year = lastYear; year >= firstYear; year--) years.push(String(year));

  return (
    <fieldset className="ma-field mf-set" aria-describedby={described(id, error)}>
      <legend className="ma-l">{label}</legend>
      <div className="mf-month">
        <Select id={id} value={m} label={`${label} · ${monthLabel}`} placeholder={monthLabel} error={error} onChange={(v) => set(y, v)}>
          {Array.from({ length: 12 }, (_, i) => {
            const mm = String(i + 1).padStart(2, "0");
            return (
              <option key={mm} value={mm}>
                {months.format(new Date(2000, i, 1))}
              </option>
            );
          })}
        </Select>
        <Select id={`${id}-y`} value={y} label={`${label} · ${yearLabel}`} placeholder={yearLabel} error={error} onChange={(v) => set(v, m)}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </div>
      {error ? <FieldError id={`${id}-err`}>{error}</FieldError> : null}
    </fieldset>
  );
}
