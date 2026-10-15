"use client";

import Image from "next/image";
import { useState } from "react";

import { ErrorText, Field } from "@/components/forms/LeadFields";
import { DEFAULT_DIAL, DIAL_CODES, dialCountry, flagSrc } from "@/lib/leads/dial-codes";
import { LIMITS, PHONE_DIGITS_PATTERN } from "@/lib/leads/constraints";

/** Digits only. A pasted international number (`+971 50 123 4567`) drops the
 *  selected calling code so the field keeps the national number. */
export function nationalDigits(raw: string, dial: string): string {
  const dialDigits = dial.replace(/\D/g, "");
  let digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+") && dialDigits && digits.startsWith(dialDigits)) {
    digits = digits.slice(dialDigits.length);
  }
  return digits.slice(0, LIMITS.phone.max);
}

function knownDial(value: string): string {
  return dialCountry(value)?.dial ?? DEFAULT_DIAL;
}

/** Country calling code (flag + dial) and a digits-only national number.
 *  The `<select>` is the real control — invisible over the flag — so the
 *  posted value, keyboard, and screen reader all use the native list. */
export function PhoneField({
  idPrefix = "",
  required,
  label,
  countryLabel,
  placeholder,
  dialDefault,
  numberDefault,
  numberError,
  countryError,
  missingMessage,
  invalidMessage,
  countryMessage,
}: {
  idPrefix?: string;
  required: boolean;
  label: string;
  countryLabel: string;
  placeholder: string;
  dialDefault: string;
  numberDefault: string;
  numberError?: string;
  countryError?: string;
  missingMessage: string;
  invalidMessage: string;
  countryMessage: string;
}) {
  const [dial, setDial] = useState(() => knownDial(dialDefault));
  const [number, setNumber] = useState(() => nationalDigits(numberDefault, knownDial(dialDefault)));

  const [seed, setSeed] = useState({ dialDefault, numberDefault });
  if (seed.dialDefault !== dialDefault || seed.numberDefault !== numberDefault) {
    const next = knownDial(dialDefault);
    setSeed({ dialDefault, numberDefault });
    setDial(next);
    setNumber(nationalDigits(numberDefault, next));
  }

  const country = dialCountry(dial) ?? DIAL_CODES[0];
  const id = (field: string) => idPrefix + field;

  return (
    <Field
      id="mobile"
      label={required ? `${label} *` : label}
      message={numberError}
      idPrefix={idPrefix}
    >
      <div className="phone inp" dir="ltr">
        <div className="phone-dial" title={country.name}>
          <Image className="phone-flag" src={flagSrc(country.iso)} alt="" width={22} height={16} unoptimized />
          <span className="phone-code">{country.dial}</span>
          <svg className="phone-chevron" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
            <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <select
            id={id("countryCode")}
            name="countryCode"
            required={required}
            autoComplete="tel-country-code"
            aria-label={countryLabel}
            value={dial}
            aria-invalid={countryError ? true : undefined}
            aria-describedby={countryError ? `${id("countryCode")}-error` : undefined}
            onChange={(e) => setDial(knownDial(e.target.value))}
            onInvalid={(e) => e.currentTarget.setCustomValidity(countryMessage)}
            onInput={(e) => e.currentTarget.setCustomValidity("")}
          >
            {DIAL_CODES.map((row) => (
              <option key={row.iso} value={row.dial}>
                {row.name} ({row.dial})
              </option>
            ))}
          </select>
        </div>
        <input
          className="phone-num"
          id={id("mobile")}
          name="mobile"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder={placeholder}
          required={required}
          minLength={LIMITS.phone.min}
          maxLength={LIMITS.phone.max}
          pattern={PHONE_DIGITS_PATTERN}
          value={number}
          aria-invalid={numberError ? true : undefined}
          aria-describedby={numberError ? `${id("mobile")}-error` : undefined}
          onChange={(e) => {
            const next = nationalDigits(e.target.value, dial);
            setNumber(next);
            if (e.target.value !== next) e.target.value = next;
          }}
          onInvalid={(e) => {
            const el = e.currentTarget;
            el.setCustomValidity(el.validity.valueMissing ? missingMessage : invalidMessage);
          }}
          onInput={(e) => e.currentTarget.setCustomValidity("")}
        />
      </div>
      <ErrorText field="countryCode" message={countryError} idPrefix={idPrefix} />
    </Field>
  );
}
