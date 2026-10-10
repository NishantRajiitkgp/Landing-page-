"use client";

import { useState, type ReactNode } from "react";

import type { MomApplyCopy } from "@/lib/copy/momApply";
import { PASSWORD_MAX, PASSWORD_RULES, passwordRules } from "@/lib/mom/account/policy";

import { EyeIcon, TickIcon } from "./icons";

export function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  t,
  rules,
  autoComplete,
  aside,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  t: MomApplyCopy["password"];
  rules?: boolean;
  autoComplete: "new-password" | "current-password";
  aside?: ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const met = passwordRules(value);

  return (
    <div className="ma-field">
      <div className="ma-lrow">
        <label className="ma-l" htmlFor={id}>
          {label}
        </label>
        {aside}
      </div>
      <div className={`ma-ctl${error ? " is-bad" : ""}`}>
        <input
          id={id}
          type={shown ? "text" : "password"}
          autoComplete={autoComplete}
          maxLength={PASSWORD_MAX}
          placeholder={placeholder}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={[rules ? `${id}-rules` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
        <button
          type="button"
          className="ma-icon-btn"
          aria-label={shown ? t.hide : t.show}
          aria-pressed={shown}
          onClick={() => setShown((s) => !s)}
        >
          <EyeIcon off={shown} />
        </button>
      </div>
      {rules ? (
        <ul className="ma-rules" id={`${id}-rules`}>
          {PASSWORD_RULES.map((rule) => (
            <li key={rule} className={met[rule] ? "is-met" : undefined}>
              <span className="ma-rule-dot">{met[rule] ? <TickIcon /> : null}</span>
              {t.rules[rule]}
            </li>
          ))}
        </ul>
      ) : null}
      {error ? <FieldError id={`${id}-err`}>{error}</FieldError> : null}
    </div>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p className="ma-err" id={id}>
      {children}
    </p>
  );
}
