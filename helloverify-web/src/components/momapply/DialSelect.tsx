"use client";

import Image from "next/image";

import { DIAL_CODES, dialCountry, flagSrc } from "@/lib/leads/dial-codes";

/** Flag + calling code with the native `<select>` laid invisibly over it. */
export function DialSelect({
  value,
  onChange,
  label,
  disabled,
}: {
  value: string;
  onChange: (dial: string) => void;
  label: string;
  disabled?: boolean;
}) {
  const country = dialCountry(value) ?? DIAL_CODES[0];

  return (
    <div className="phone-dial ma-dial" title={country.name}>
      <Image className="phone-flag" src={flagSrc(country.iso)} alt="" width={22} height={16} unoptimized />
      <span className="phone-code">{country.dial}</span>
      <svg className="phone-chevron" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
        <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <select
        aria-label={label}
        autoComplete="tel-country-code"
        value={country.dial}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {DIAL_CODES.map((row) => (
          <option key={row.iso} value={row.dial}>
            {row.name} ({row.dial})
          </option>
        ))}
      </select>
    </div>
  );
}
