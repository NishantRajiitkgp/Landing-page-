"use client";

import { useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { saveLoginUserDetail } from "@/lib/auth/client";
import type { TravelUser } from "@/lib/auth/types";
import { isEmail, isGender, isName } from "@/lib/auth/validate";
import type { AccountCopy } from "@/lib/copy/account";

export function ProfileForm({ t }: { t: AccountCopy["profile"] }) {
  const { ready, setUser, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** The fields re-seed whenever the stored user changes, including after a
   *  save; `undefined` means not seeded yet, which `null` (no user) is not. */
  const [seeded, setSeeded] = useState<TravelUser | null | undefined>(undefined);
  if (ready && user !== seeded) {
    setSeeded(user);
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setMobile(user?.mobile_num ?? user?.phone ?? "");
    setGender(user?.gender ?? "");
  }
  const loading = seeded === undefined;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!isName(name) || !isEmail(email) || !isGender(gender)) {
      setError(t.errors.required);
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await saveLoginUserDetail({
        name: name.trim(),
        email: email.trim(),
        mobile_num: mobile,
        gender,
      });
      if (res?.status && res.data) {
        setUser({ user: res.data });
        setMessage(t.success);
      } else {
        setError(res?.message ?? t.errors.update);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.update);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="ac-status">{t.loading}</p>;

  return (
    <form className="ac-form" onSubmit={(e) => void save(e)}>
      <div className="ac-row">
        <label className="ac-field">
          {t.nameLabel}
          <input
            className="inp"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            autoComplete="name"
          />
        </label>
        <label className="ac-field">
          {t.emailLabel}
          <input
            className="inp"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            autoComplete="email"
          />
        </label>
      </div>
      <div className="ac-row">
        <label className="ac-field">
          {t.mobileLabel}
          <input className="inp" value={mobile} disabled placeholder={t.mobilePlaceholder} />
        </label>
        <div className="ac-field">
          <span>{t.genderLabel}</span>
          <div className="ac-genders">
            {(
              [
                ["MALE", t.genderMale],
                ["FEMALE", t.genderFemale],
                ["OTHER", t.genderOther],
              ] as const
            ).map(([g, label]) => (
              <button
                key={g}
                type="button"
                className={`ac-gender${gender === g ? " is-on" : ""}`}
                onClick={() => setGender(g)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-ink btn-sm" disabled={saving}>
        {saving ? t.updating : t.updateProfile}
      </button>
      {message ? (
        <p className="ac-msg" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="ac-msg" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
