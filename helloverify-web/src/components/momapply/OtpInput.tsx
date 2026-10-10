"use client";

import { useEffect, useRef, useState } from "react";

import { OTP_LENGTH, otpDigits } from "@/lib/mom/account/policy";

/** One real input under six drawn boxes, so paste, SMS autofill and screen
 *  readers all see a single code field. */
export function OtpInput({
  id,
  label,
  value,
  onChange,
  onComplete,
  invalid,
  disabled,
  autoFocus,
  describedBy,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  describedBy?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (invalid && !disabled) ref.current?.focus();
  }, [invalid, disabled]);

  const now = Math.min(value.length, OTP_LENGTH - 1);

  return (
    <div className={`ma-otp${invalid ? " is-bad" : ""}${disabled ? " is-off" : ""}`} dir="ltr">
      <input
        ref={ref}
        id={id}
        className="ma-otp-in"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        value={value}
        disabled={disabled}
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          const next = otpDigits(e.target.value);
          onChange(next);
          if (next.length === OTP_LENGTH) onComplete?.(next);
        }}
      />
      <div className="ma-otp-boxes" aria-hidden="true">
        {Array.from({ length: OTP_LENGTH }, (_, i) => (
          <span
            key={i}
            className={`ma-box${value[i] ? " is-full" : ""}${focused && i === now ? " is-now" : ""}`}
          >
            {value[i] ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
