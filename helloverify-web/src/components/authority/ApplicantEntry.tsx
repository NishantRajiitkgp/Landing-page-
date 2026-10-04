"use client";

import { useState } from "react";

import "@/app/auth.css";

import { getAuthorityPortal, UAE_PASS, type AuthorityId } from "@/lib/authority/portals";
import type { AuthorityCopy } from "@/lib/copy/authority";

import { ApplicantDialog } from "./ApplicantDialog";
import { UaePassDialog } from "./UaePassDialog";

export function ApplicantEntry({ authority, t }: { authority: AuthorityId; t: AuthorityCopy }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [uaeOpen, setUaeOpen] = useState(false);
  const portal = getAuthorityPortal(authority);

  return (
    <div className="wrap sec3 ap-entry">
      <div className="sec-head">
        <div>
          <div className="k">{t.entry.kicker}</div>
          <h2 className="h2">{t.entry.heading}</h2>
        </div>
        <p className="lede">{t.entry.lede}</p>
      </div>
      <div className="ap-acts">
        <button type="button" className="btn btn-ink btn-sm" onClick={() => setAuthOpen(true)}>
          {t.entry.applicantCta}
        </button>
        {portal.agencyOrigin ? (
          <a className="btn btn-line btn-sm" href={portal.agencyOrigin} target="_blank" rel="noopener noreferrer">
            {t.entry.employerCta}
          </a>
        ) : null}
      </div>

      {authority === "mohesr" ? (
        <div className="ap-uae">
          <p className="p3">{t.entry.uaePassIntro}</p>
          <div className="ap-acts">
            <a className="btn btn-line btn-sm" href={UAE_PASS.signIn} target="_blank" rel="noopener noreferrer">
              {t.entry.uaePassSignIn}
            </a>
            <button type="button" className="lg-edit" onClick={() => setUaeOpen(true)}>
              {t.entry.uaePassSignUpPrefix} {t.entry.uaePassSignUp}
            </button>
          </div>
          <div className="t3">{t.entry.uaePassWhatTitle}</div>
          <p className="p3">{t.entry.uaePassWhatBody}</p>
        </div>
      ) : null}

      <ApplicantDialog open={authOpen} onClose={() => setAuthOpen(false)} authority={authority} t={t} />
      <UaePassDialog open={uaeOpen} onClose={() => setUaeOpen(false)} t={t.entry} />
    </div>
  );
}
