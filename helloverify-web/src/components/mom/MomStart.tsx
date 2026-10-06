"use client";

import { useState } from "react";

import "@/app/auth.css";

import { ApplicantDialog } from "@/components/authority/ApplicantDialog";
import type { AuthorityCopy } from "@/lib/copy/authority";

/** Applicants' "Start Verification". The dialog mounts on click, so its
 *  copy is not in the page's initial HTML. */
export function MomStart({ label, t }: { label: string; t: AuthorityCopy }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="btn btn-ink btn-sm" onClick={() => setOpen(true)}>
        {label}
      </button>
      {open ? <ApplicantDialog open authority="mom" t={t} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
