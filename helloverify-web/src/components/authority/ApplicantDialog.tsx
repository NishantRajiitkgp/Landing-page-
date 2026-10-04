"use client";

import { useEffect, useState } from "react";

import { defaultTab, type AuthorityId } from "@/lib/authority/portals";
import type { AuthorityCopy } from "@/lib/copy/authority";

import { ApplicantForgot } from "./ApplicantForgot";
import { ApplicantLogin } from "./ApplicantLogin";
import { ApplicantRegister } from "./ApplicantRegister";

type Panel = "form" | "forgot" | "success" | "duplicate";

export function ApplicantDialog({
  open,
  onClose,
  authority,
  t,
}: {
  open: boolean;
  onClose: () => void;
  authority: AuthorityId;
  t: AuthorityCopy;
}) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab(authority));
  const [panel, setPanel] = useState<Panel>("form");

  useEffect(() => {
    if (!open) {
      setTab(defaultTab(authority));
      setPanel("form");
    }
  }, [open, authority]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="lg-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lg-panel lg-wide" role="dialog" aria-modal="true" aria-label={t.dialog.aria}>
        {panel === "forgot" ? (
          <ApplicantForgot authority={authority} t={t.dialog} onClose={() => setPanel("form")} />
        ) : null}

        {panel === "success" ? (
          <div className="lg-form">
            <h2 className="lg-title">{t.dialog.successTitle}</h2>
            <ul className="lg-sub">
              <li>{t.dialog.success1}</li>
              <li>{t.dialog.success2}</li>
              <li>{authority === "mom" ? t.dialog.momSuccess3 : t.dialog.mohesrSuccess3}</li>
            </ul>
            <button type="button" className="btn btn-ink btn-sm lg-btn" onClick={onClose}>
              {t.dialog.ok}
            </button>
          </div>
        ) : null}

        {panel === "duplicate" ? (
          <div className="lg-form">
            <h2 className="lg-title">{t.dialog.duplicateTitle}</h2>
            <p className="lg-sub">{t.dialog.duplicateBody}</p>
            <button
              type="button"
              className="btn btn-ink btn-sm lg-btn"
              onClick={() => {
                setPanel("form");
                setTab("login");
              }}
            >
              {t.dialog.goToLogin}
            </button>
            <button type="button" className="lg-edit" onClick={() => setPanel("form")}>
              {t.dialog.cancel}
            </button>
          </div>
        ) : null}

        {panel === "form" ? (
          <>
            <div className="lg-tabs" role="tablist" aria-label={t.dialog.aria}>
              {(authority === "mom" ? (["register", "login"] as const) : (["login", "register"] as const)).map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  className={`seg${tab === id ? " on" : ""}`}
                  onClick={() => setTab(id)}
                >
                  {id === "login" ? t.dialog.login : t.dialog.register}
                </button>
              ))}
            </div>
            {tab === "login" ? (
              <ApplicantLogin
                authority={authority}
                t={t.dialog}
                mockHint={t.entry.mockHint}
                onClose={onClose}
                onForgot={() => setPanel("forgot")}
              />
            ) : (
              <ApplicantRegister
                authority={authority}
                t={t.dialog}
                mockHint={t.entry.mockHint}
                onClose={onClose}
                onDuplicate={() => setPanel("duplicate")}
                onSuccess={() => setPanel("success")}
              />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
