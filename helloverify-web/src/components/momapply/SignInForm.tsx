"use client";

import type { ReactNode } from "react";

import type { MomApplyCopy } from "@/lib/copy/momApply";
import { localise } from "@/lib/i18n/href";
import { momAccount } from "@/lib/mom/account/client";
import { DEMO_SEED } from "@/lib/mom/account/demo";
import { MOM_APPLY_PATH } from "@/lib/mom/paths";

import { SignInPanel } from "./SignInPanel";
import { useMomSession } from "./useMomSession";

export function SignInForm({ t, locale, tabs }: { t: MomApplyCopy; locale: string; tabs: ReactNode }) {
  const session = useMomSession();
  return (
    <SignInPanel
      t={t}
      tabs={tabs}
      api={momAccount}
      signedIn={Boolean(session.applicant)}
      demo={session.demo}
      seed={DEMO_SEED}
      home={localise(MOM_APPLY_PATH, locale)}
    />
  );
}
