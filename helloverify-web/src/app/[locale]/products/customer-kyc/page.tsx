/** /products/customer-kyc — the Customer KYC redesign's copy, staged: a
 *  hero where the case runs itself, the six steps told by scrolling, and a
 *  drawing or a photograph beside every claim. Motion and its still frames
 *  live in `app/v2/kyc.css`; the sections and two islands are
 *  `components/kyc/*`. */
import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { FaqSection } from "@/components/chrome/FaqSection";
import { Tick } from "@/components/brand/Tick";
import { Arrow } from "@/components/brand/Arrow";
import { KycHeroStage } from "@/components/kyc/KycHeroStage";
import { KycScrolly } from "@/components/kyc/KycScrolly";
import { d, Head, STEPS, Words } from "@/components/kyc/kycParts";
import { KycDecision, KycOps, KycWhy } from "@/components/kyc/KycStory";
import { KycBundle, KycClose, KycRbi, KycWho } from "@/components/kyc/KycOffer";
import { setRequestLocale } from "next-intl/server";
import { BUSINESS } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";
import "@/app/v2/kyc.css";

const PATH = "/products/customer-kyc";

/** The phone's screens, `public/img/kyc/her/*.jpg`: the six steps in
 *  order, then the decision. The hero plays all seven; the scroll story
 *  shows the six. */
const SCREENS = [...STEPS, "done"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}

const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Customer KYC",
  description: copyFor(PATH).description,
  serviceType: "Identity verification",
};

export default async function CustomerKycPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = (await copy(BUSINESS)).customerKyc;
  const screens = SCREENS.map((k) => (
    <Image key={k} src={`/img/kyc/her/${k}.jpg`} alt="" width={720} height={1675} sizes="(max-width: 1080px) 200px, 280px" />
  ));

  return (
    <PageShell crumbs={[{ label: c.crumb }]} closing={false}>
      <div className="kz">
        <div className="wrap">
          <section className="kz-hero" aria-labelledby="kyc-h1">
            <span className="kz-grid" aria-hidden="true" />
            <span className="kz-glow" aria-hidden="true" />
            <div className="kz-hero-copy">
              <p className="k">{c.hero.k}</p>
              <h1 className="h1" id="kyc-h1">
                <Words text={c.hero.h1} />
              </h1>
              <p className="sub">{c.hero.sub}</p>
              <div className="hrow">
                <AppLink href="#bundle" className="btn kz-btn-light">
                  {c.hero.cta}
                  <Arrow />
                </AppLink>
                <AppLink href="#how" className="btn kz-btn-out">{c.hero.cta2}</AppLink>
              </div>
              <ul className="kz-pts">
                {c.hero.points.map((x, i) => (
                  <li key={x} style={d(i)}><span className="pip"><Tick tone="inverse" /></span>{x}</li>
                ))}
              </ul>
            </div>
            <KycHeroStage
              photo={<Image src="/img/kyc/hero-selfie-2.jpg" alt="" width={1024} height={1024} priority sizes="(max-width: 1080px) 92vw, 560px" />}
              screens={screens}
              id={c.hero.case.id}
              time={c.hero.case.time}
              name={c.hero.case.name}
              rows={c.hero.case.rows}
              result={c.hero.case.result}
              passed={c.hero.case.passed}
            />
          </section>
        </div>

        <KycWhy c={c.why} />

        <section className="wrap kz-sec" id="how" aria-labelledby="kyc-how-h">
          <Head k={c.how.k} h={c.how.h} id="kyc-how-h" sub={c.how.sub} />
          <KycScrolly
            screens={screens.slice(0, STEPS.length)}
            steps={STEPS.map((k, i) => ({ n: String(i + 1).padStart(2, "0"), t: c.how.steps[k].t, p: c.how.steps[k].p }))}
          />
          <KycDecision c={c.how.decision} />
        </section>

        <KycOps c={c.ops} />
        <KycBundle c={c.bundle} />
        <KycWho c={c.who} />
        <KycRbi c={c.rbi} />
        <FaqSection head={c.faq.h} faqs={c.faq.items} />
        <KycClose c={c.close} />
      </div>
      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}
