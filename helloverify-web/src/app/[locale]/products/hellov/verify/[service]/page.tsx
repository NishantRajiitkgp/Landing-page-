/** /products/hellov/verify/[service] — buy and verify one of the four HelloV
 *  home services through the Hello Staff backend. Static shell per service;
 *  the browser loads the case. noindex, not in the sitemap. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import "@/app/v2/momapply.css";
import "@/app/v2/momflow.css";
import "@/app/v2/hellostaff.css";

import { PageShell } from "@/components/chrome/PageShell";
import { fill } from "@/components/momapply/fill";
import { HelloStaffFlow } from "@/components/hellostaff/HelloStaffFlow";
import { pick } from "@/lib/copy";
import { HELLOSTAFF } from "@/lib/copy/hellostaff";
import { copy } from "@/lib/copy/request";
import { HS_SERVICES, hsService } from "@/lib/hellostaff/catalog";
import { DEMO_OTP } from "@/lib/hellostaff/demo";
import { helloStaffLive } from "@/lib/hellostaff/env";
import { localise } from "@/lib/i18n/href";
import { absoluteUrl } from "@/lib/seo/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return HS_SERVICES.map((s) => ({ service: s.slug }));
}

type Params = Promise<{ locale: string; service: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, service } = await params;
  const s = hsService(service);
  if (!s) return {};
  const t = pick(HELLOSTAFF, locale);
  return {
    title: `${fill(t.meta.title, { service: t.services[s.slug].t })} — HelloVerify`,
    robots: { index: false, follow: false },
    alternates: { canonical: absoluteUrl(`/${locale}/products/hellov/verify/${s.slug}`) },
  };
}

export default async function HelloStaffVerifyPage({ params }: { params: Params }) {
  const { locale, service } = await params;
  setRequestLocale(locale);
  const s = hsService(service);
  if (!s) notFound();
  const t = await copy(HELLOSTAFF);

  return (
    <PageShell crumbs={[{ label: "HelloV", href: "/products/hellov" }, { label: t.crumb }]} closing={false} showSignUp={false}>
      <div className="wrap ma-page">
        <HelloStaffFlow
          t={t}
          service={s}
          termsHref={localise("/legal/terms-of-service", locale)}
          hellovHref={localise("/products/hellov", locale)}
          demoCode={helloStaffLive() ? null : DEMO_OTP}
        />
      </div>
    </PageShell>
  );
}
