/** /orders/candidate — travel invite. Same APIs as the old SPA. Not in the sitemap. */
import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

import { AccountGate } from "@/components/account/AccountGate";
import { CandidateInvite } from "@/components/account/CandidateInvite";
import { PageShell } from "@/components/chrome/PageShell";
import { pick } from "@/lib/copy";
import { accountMetadata } from "@/lib/account/metadata";
import { ACCOUNT } from "@/lib/copy/account";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return accountMetadata(locale, "/orders/candidate", pick(ACCOUNT, locale).candidate.title);
}

export default async function TravelCandidatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(ACCOUNT);

  return (
    <PageShell crumbs={[{ label: t.candidate.crumb }]}>
      <div className="wrap ac-page">
        <h1 className="ac-title">{t.candidate.title}</h1>
        <AccountGate locale={locale} loading={t.gate.loading}>
          <Suspense fallback={<p className="ac-status">{t.gate.loading}</p>}>
            <CandidateInvite locale={locale} kind="travel" t={t.candidate} />
          </Suspense>
        </AccountGate>
      </div>
    </PageShell>
  );
}
