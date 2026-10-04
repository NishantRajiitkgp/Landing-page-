/** /profile-settings — gated. Not in the sitemap. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AccountGate } from "@/components/account/AccountGate";
import { ProfileForm } from "@/components/account/ProfileForm";
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
  return accountMetadata(locale, "/profile-settings", pick(ACCOUNT, locale).profile.title);
}

export default async function ProfileSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(ACCOUNT);

  return (
    <PageShell crumbs={[{ label: t.profile.crumb }]}>
      <div className="wrap ac-page">
        <h1 className="ac-title">{t.profile.title}</h1>
        <AccountGate locale={locale} loading={t.gate.loading}>
          <ProfileForm t={t.profile} />
        </AccountGate>
      </div>
    </PageShell>
  );
}
