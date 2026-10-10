import type { MomApplyCopy } from "@/lib/copy/momApply";
import { localise } from "@/lib/i18n/href";

import { fillNodes } from "./fill";
import { FieldError } from "./PasswordField";

/** One checkbox for the terms and the privacy policy; both open in a new tab
 *  so a half-filled form survives reading them. */
export function ConsentField({
  t,
  locale,
  checked,
  onChange,
  error,
}: {
  t: Pick<MomApplyCopy["register"], "consent" | "terms" | "privacy">;
  locale: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error: string | null;
}) {
  const doc = (path: string, label: string) => (
    <a href={localise(path, locale)} target="_blank" rel="noopener">
      {label}
    </a>
  );

  return (
    <div className="ma-field">
      <label className={`ma-check${error ? " is-bad" : ""}`}>
        <input
          id="ma-consent"
          type="checkbox"
          checked={checked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "ma-consent-err" : undefined}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>
          {fillNodes(t.consent, {
            terms: doc("/legal/terms-of-service", t.terms),
            privacy: doc("/legal/privacy-policy", t.privacy),
          })}
        </span>
      </label>
      {error ? <FieldError id="ma-consent-err">{error}</FieldError> : null}
    </div>
  );
}
