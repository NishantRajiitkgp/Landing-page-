import { FieldError } from "@/components/momapply/PasswordField";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import { ORG_MAX, REG_MAX } from "@/lib/mom/org/policy";
import type { OrgKind } from "@/lib/mom/org/types";

type Field = "org" | "reg" | "kind";

/** The organisation half of registration: who is paying and what the invoice says. */
export function OrgFields({
  t,
  org,
  reg,
  kind,
  onOrg,
  onReg,
  onKind,
  shown,
  touch,
}: {
  t: MomOrgCopy["register"];
  org: string;
  reg: string;
  kind: OrgKind | null;
  onOrg: (v: string) => void;
  onReg: (v: string) => void;
  onKind: (v: OrgKind) => void;
  shown: (f: Field) => string | null;
  touch: (f: Field) => void;
}) {
  const regErr = shown("reg");
  const regDescribed = regErr ? "mo-reg-err" : "mo-reg-hint";

  return (
    <>
      <div className="ma-field">
        <label className="ma-l" htmlFor="mo-org">
          {t.org}
        </label>
        <div className={`ma-ctl${shown("org") ? " is-bad" : ""}`}>
          <input
            id="mo-org"
            autoComplete="organization"
            maxLength={ORG_MAX}
            placeholder={t.orgPlaceholder}
            value={org}
            aria-invalid={shown("org") ? true : undefined}
            aria-describedby={shown("org") ? "mo-org-err" : undefined}
            onChange={(e) => onOrg(e.target.value)}
            onBlur={() => touch("org")}
          />
        </div>
        {shown("org") ? <FieldError id="mo-org-err">{shown("org")}</FieldError> : null}
      </div>

      <div className="ma-field">
        <div className="ma-lrow">
          <label className="ma-l" htmlFor="mo-reg">
            {t.reg}
          </label>
          <span className="mf-opt">{t.optional}</span>
        </div>
        <div className={`ma-ctl${regErr ? " is-bad" : ""}`}>
          <input
            id="mo-reg"
            dir="auto"
            autoComplete="off"
            maxLength={REG_MAX}
            placeholder={t.regPlaceholder}
            value={reg}
            aria-invalid={regErr ? true : undefined}
            aria-describedby={regDescribed}
            onChange={(e) => onReg(e.target.value.toUpperCase())}
            onBlur={() => touch("reg")}
          />
        </div>
        {regErr ? (
          <FieldError id="mo-reg-err">{regErr}</FieldError>
        ) : (
          <p className="mf-hint" id="mo-reg-hint">
            {t.regHint}
          </p>
        )}
      </div>

      <fieldset className="ma-field mf-set">
        <legend className="ma-l">{t.kind}</legend>
        <div className={`mf-pills${shown("kind") ? " is-bad" : ""}`}>
          {t.kinds.map((k, i) => (
            <label key={k.id} className={kind === k.id ? "is-on" : undefined}>
              <input
                id={i === 0 ? "mo-kind" : undefined}
                type="radio"
                name="mo-kind"
                checked={kind === k.id}
                aria-describedby={shown("kind") ? "mo-kind-err" : undefined}
                onChange={() => onKind(k.id as OrgKind)}
              />
              <span>{k.t}</span>
            </label>
          ))}
        </div>
        {shown("kind") ? <FieldError id="mo-kind-err">{shown("kind")}</FieldError> : null}
      </fieldset>
    </>
  );
}
