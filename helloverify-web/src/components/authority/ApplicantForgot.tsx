"use client";

import { useState } from "react";

import { authorityClient } from "@/lib/authority/client";
import type { AuthorityId } from "@/lib/authority/portals";
import { isValidEmail, normalizeEmail } from "@/lib/authority/validate";
import type { AuthorityCopy } from "@/lib/copy/authority";

export function ApplicantForgot({
  authority,
  t,
  onClose,
}: {
  authority: AuthorityId;
  t: AuthorityCopy["dialog"];
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const username = normalizeEmail(email);
    if (!isValidEmail(username)) {
      setError(t.invalidEmail);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authorityClient.forgotPassword(authority, { username });
      if (res.status === false) {
        setError(res.message ?? t.resetFailed);
        return;
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : t.resetFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="lg-form"
      onSubmit={(e) => {
        e.preventDefault();
        void send();
      }}
    >
      <h2 className="lg-title">{t.forgotPassword}</h2>
      <p className="lg-sub">{t.resetLead}</p>
      <label className="lg-label" htmlFor="ap-forgot-email">
        {t.email}
      </label>
      <input
        id="ap-forgot-email"
        className="inp lg-input"
        type="email"
        value={email}
        placeholder={t.emailPlaceholder}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="btn btn-ink btn-sm lg-btn" disabled={loading}>
        {loading ? t.sending : t.sendReset}
      </button>
      <button type="button" className="lg-edit" onClick={onClose}>
        {t.cancel}
      </button>
      {error ? <p className="lg-err">{error}</p> : null}
    </form>
  );
}
