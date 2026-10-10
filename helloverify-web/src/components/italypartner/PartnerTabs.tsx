import Link from "next/link";

import type { ItalyPartnerCopy } from "@/lib/copy/italyPartner";
import { localise } from "@/lib/i18n/href";
import { ITALY_JOIN_PATH, ITALY_SIGN_IN_PATH } from "@/lib/italy/paths";

/** Join and sign in are two pages; this pair moves between them. */
export function PartnerTabs({
  t,
  locale,
  current,
}: {
  t: ItalyPartnerCopy;
  locale: string;
  current: "join" | "signIn";
}) {
  const tabs = [
    { id: "join" as const, href: ITALY_JOIN_PATH, label: t.tabs.join },
    { id: "signIn" as const, href: ITALY_SIGN_IN_PATH, label: t.tabs.signIn },
  ];

  return (
    <nav className="ma-tabs" aria-label={t.tabs.aria}>
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={localise(tab.href, locale)}
          className={tab.id === current ? "is-on" : undefined}
          aria-current={tab.id === current ? "page" : undefined}
          replace
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
