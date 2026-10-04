/** /cart — gated. Lists items and checks out (mock skips Razorpay). Not in the sitemap. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AccountGate } from "@/components/account/AccountGate";
import { CartView } from "@/components/account/CartView";
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
  return accountMetadata(locale, "/cart", pick(ACCOUNT, locale).cart.title);
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(ACCOUNT);

  return (
    <PageShell crumbs={[{ label: t.cart.crumb }]}>
      <div className="wrap ac-page">
        <h1 className="ac-title">{t.cart.title}</h1>
        <AccountGate locale={locale} loading={t.gate.loading}>
          <CartView locale={locale} t={t.cart} />
        </AccountGate>
      </div>
    </PageShell>
  );
}
