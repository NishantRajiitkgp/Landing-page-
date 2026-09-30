/** italy's own page: the record the homepage seal used to open in place. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AuthorityPage } from "@/components/sections/AuthorityPage";
import { GOVERNMENTS } from "@/lib/copy/governments";
import { copy } from "@/lib/copy/request";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/governments/immigration/embassy-of-italy");
}

export default async function EmbassyOfItaly({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(GOVERNMENTS);
  return <AuthorityPage id="italy" parent={{ label: t.immigration.crumb, href: "/governments/immigration" }} />;
}
