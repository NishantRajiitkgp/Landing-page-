import Link from "next/link";

import type { MomApplyCopy } from "@/lib/copy/momApply";
import { localise } from "@/lib/i18n/href";
import { MOM_REGISTER_PATH, MOM_SIGN_IN_PATH } from "@/lib/mom/paths";

/** Create account / Sign in are two pages; this pair moves between them. */
export function AccountTabs({
  t,
  locale,
  current,
  paths = { register: MOM_REGISTER_PATH, signIn: MOM_SIGN_IN_PATH },
}: {
  t: Pick<MomApplyCopy, "tabs">;
  locale: string;
  current: "register" | "signIn";
  paths?: { register: string; signIn: string };
}) {
  const tabs = [
    { id: "register", href: paths.register, label: t.tabs.register },
    { id: "signIn", href: paths.signIn, label: t.tabs.signIn },
  ] as const;

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
