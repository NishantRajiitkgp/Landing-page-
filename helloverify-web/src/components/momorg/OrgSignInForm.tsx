"use client";

import type { ReactNode } from "react";

import { SignInPanel } from "@/components/momapply/SignInPanel";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import { localise } from "@/lib/i18n/href";
import { momOrg } from "@/lib/mom/org/client";
import { ORG_DEMO_SEED } from "@/lib/mom/org/demo";
import { MOM_ORG_PATH } from "@/lib/mom/paths";

import { useOrgSession } from "./useOrgSession";

export function OrgSignInForm({ t, locale, tabs }: { t: MomOrgCopy; locale: string; tabs: ReactNode }) {
  const session = useOrgSession();
  return (
    <SignInPanel
      t={t}
      tabs={tabs}
      api={momOrg}
      signedIn={Boolean(session.user)}
      demo={session.demo}
      seed={ORG_DEMO_SEED}
      home={localise(MOM_ORG_PATH, locale)}
    />
  );
}
