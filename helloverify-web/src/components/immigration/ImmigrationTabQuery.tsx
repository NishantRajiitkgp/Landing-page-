"use client";

import { useEffect } from "react";

import { parseImmigrationTab } from "@/lib/immigration/tab";

/** The page stays statically prerendered: the query is read after mount,
 *  the same way `ContactTabs` reads `?tab=`. */
export function ImmigrationTabQuery({ authoritiesHref }: { authoritiesHref: string }) {
  useEffect(() => {
    if (parseImmigrationTab(new URLSearchParams(window.location.search).get("tab")) === "authorities") {
      window.location.replace(authoritiesHref);
    }
  }, [authoritiesHref]);
  return null;
}
