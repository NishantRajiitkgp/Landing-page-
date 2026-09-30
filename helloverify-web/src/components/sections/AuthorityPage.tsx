/** The body of an authority's own page (30 Sep 2026): the seal's mark and
    name as the hero, then its record (`./AuthorityRecord`). The homepage
    seals link here. MOM keeps its longer case study page; Latvia, Italy and
    MOHESR use this. */
import Image from "next/image";
import { getLocale } from "next-intl/server";

import { PageShell } from "@/components/chrome/PageShell";
import { copy } from "@/lib/copy/request";
import { GOVERNMENTS } from "@/lib/copy/governments";
import { localise } from "@/lib/i18n/href";
import { SECTIONS, type GovSealId } from "@/lib/copy/sections";
import { AuthorityRecord } from "./AuthorityRecord";
import { sealItem } from "./GovSeals";

export async function AuthorityPage({ id, parent }: { id: GovSealId; parent: { label: string; href: string } }) {
  const t = (await copy(SECTIONS)).govSeals;
  const gov = await copy(GOVERNMENTS);
  const g = await sealItem(id);

  return (
    <PageShell
      crumbs={[{ label: gov.crumb, href: "/governments" }, parent, { label: g.name }]}
      closing={{ heading: gov.mom.closing.heading, sub: gov.mom.closing.sub, img: "/img/10-ministry-hall.jpg" }}
    >
      <div className="wrap hero3 au-hero">
        <span className="au-mark"><Image src={g.logo} alt="" width={72} height={72} /></span>
        <div className="k">{t.kicker}</div>
        <h1 className="h1">{g.name}</h1>
      </div>
      <div className="wrap au-body">
        <AuthorityRecord g={g} stamp={t.stamp} labels={{ problem: t.problemK, deliver: t.deliverK, why: t.whyK }} partner={t.partner} contactHref={localise("/contact", await getLocale())} />
      </div>
    </PageShell>
  );
}
