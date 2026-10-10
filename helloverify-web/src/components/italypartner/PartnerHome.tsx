"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import { fill } from "@/components/momapply/fill";
import type { ItalyPartnerCopy } from "@/lib/copy/italyPartner";
import { localise } from "@/lib/i18n/href";
import { italyPartner } from "@/lib/italy/partner/client";
import { ITALY_SIGN_IN_PATH } from "@/lib/italy/paths";
import type { Partner } from "@/lib/italy/partner/types";

import { AgreeStep } from "./AgreeStep";
import { useAgency, type AgencyDraft } from "./agency";
import { AgencyStep } from "./AgencyStep";
import { DocsStep } from "./DocsStep";
import { LiveStep } from "./LiveStep";
import { PartnerRail } from "./PartnerRail";
import { usePartnerSession } from "./usePartnerSession";

function useHash(): string {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("hashchange", onStoreChange);
      return () => window.removeEventListener("hashchange", onStoreChange);
    },
    () => location.hash.replace(/^#/, ""),
    () => "",
  );
}

export function PartnerHome({ t, locale }: { t: ItalyPartnerCopy; locale: string }) {
  const router = useRouter();
  const session = usePartnerSession();
  const signInHref = localise(ITALY_SIGN_IN_PATH, locale);

  useEffect(() => {
    if (session.ready && !session.partner) router.replace(signInHref);
  }, [session.ready, session.partner, router, signInHref]);

  if (!session.ready || !session.partner) {
    return (
      <p className="ma-loading" role="status">
        <span className="ma-spin" aria-hidden="true" />
        {t.home.loading}
      </p>
    );
  }

  return (
    <Workspace
      t={t}
      locale={locale}
      partner={session.partner}
      demo={session.demo}
      onSignOut={async () => {
        await italyPartner.signOut();
        router.replace(signInHref);
      }}
    />
  );
}

function Workspace({
  t,
  locale,
  partner,
  demo,
  onSignOut,
}: {
  t: ItalyPartnerCopy;
  locale: string;
  partner: Partner;
  demo: boolean;
  onSignOut: () => Promise<void>;
}) {
  const [leaving, setLeaving] = useState(false);
  const draft = useAgency(partner.id);
  const hash = useHash();
  const step = place(hash, draft);
  const open = draft?.live ? 4 : draft?.cleared ? 3 : draft ? 2 : 1;

  useEffect(() => {
    if (legalHash(hash, draft)) return;
    const fallback = draft?.cleared ? "agreement" : draft ? "documents" : "agency";
    history.replaceState(null, "", `${location.pathname}${location.search}#${fallback}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, [hash, draft]);

  function go(index: number) {
    location.hash = index === 4 ? "live" : index === 3 ? "agreement" : index === 2 ? "documents" : "agency";
  }

  return (
    <div className="ma-apply">
      <header className="ma-apply-head">
        <h1 className="ma-title">{fill(t.home.hello, { name: partner.first })}</h1>
        <button
          type="button"
          className="btn btn-line btn-sm"
          disabled={leaving}
          onClick={() => {
            setLeaving(true);
            void onSignOut();
          }}
        >
          {t.home.signOut}
        </button>
      </header>
      <PartnerRail t={t} current={step} open={open} onGo={go} />
      <div className="ip-work">
        {step === 4 ? (
          <LiveStep t={t} partnerId={partner.id} onBack={() => go(3)} />
        ) : step === 3 ? (
          <AgreeStep t={t} locale={locale} partnerId={partner.id} demo={demo} onBack={() => go(2)} onContinue={() => go(4)} />
        ) : step === 2 ? (
          <DocsStep t={t} locale={locale} partnerId={partner.id} demo={demo} onBack={() => go(1)} onContinue={() => go(3)} />
        ) : (
          <AgencyStep t={t} partnerId={partner.id} onContinue={() => go(2)} />
        )}
      </div>
    </div>
  );
}

function place(hash: string, draft: AgencyDraft | null): number {
  if (hash === "live" && draft?.live) return 4;
  if (hash === "agreement" && draft?.cleared) return 3;
  if (hash === "documents" && draft) return 2;
  return 1;
}

function legalHash(hash: string, draft: AgencyDraft | null): boolean {
  return hash === "" || hash === "agency" || (hash === "documents" && Boolean(draft)) || (hash === "agreement" && Boolean(draft?.cleared)) || (hash === "live" && Boolean(draft?.live));
}
