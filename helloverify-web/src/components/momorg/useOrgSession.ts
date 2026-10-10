"use client";

import { useEffect, useState } from "react";

import { momOrg } from "@/lib/mom/org/client";
import type { OrgUser } from "@/lib/mom/org/types";

export type OrgSessionState = { ready: boolean; user: OrgUser | null; demo: boolean };

/** The session is an httpOnly cookie, so the page asks the API after mount. */
export function useOrgSession(): OrgSessionState {
  const [state, setState] = useState<OrgSessionState>({ ready: false, user: null, demo: false });

  useEffect(() => {
    let live = true;
    void momOrg.session().then((res) => {
      if (!live) return;
      setState(res.ok ? { ready: true, user: res.user, demo: res.demo } : { ready: true, user: null, demo: false });
    });
    return () => {
      live = false;
    };
  }, []);

  return state;
}
