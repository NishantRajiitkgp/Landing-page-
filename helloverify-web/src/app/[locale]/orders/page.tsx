/** /orders — gated. Lists paid cart lines and invite slots. Not in the sitemap. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AccountGate } from "@/components/account/AccountGate";
import { OrdersView } from "@/components/account/OrdersView";
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
  return accountMetadata(locale, "/orders", pick(ACCOUNT, locale).orders.title);
}

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(ACCOUNT);

  return (
    <PageShell crumbs={[{ label: t.orders.crumb }]}>
      <div className="wrap ac-page">
        <h1 className="ac-title">{t.orders.title}</h1>
        <AccountGate locale={locale} loading={t.gate.loading}>
          <OrdersView locale={locale} t={t.orders} />
        </AccountGate>
      </div>
    </PageShell>
  );
}
