/** /individuals/hellov — consumer product page (Template 4: receipts + the phone).
 *  Leads with the job, brand follows (IA §10.3). Prices are placeholders pending sign-off. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import { HelloVPhone } from "@/components/blocks/HelloVPhone";
import { setRequestLocale } from "next-intl/server";
import { Tick } from "@/components/brand/Tick";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { INDIVIDUALS } from "@/lib/copy/individuals";
import { copy } from "@/lib/copy/request";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/individuals/hellov";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}


/** BUILD-SPEC §8.2 (`Service`, per solution) and §11a.3 (`areaServed`).
 *  `description` is this page's own reviewed description, read from the copy
 *  table (`lib/seo/copy.ts`, §8.1) rather than paraphrased here, so the page
 *  title, the meta description, the Service node and llms.txt cannot drift
 *  apart.
 *
 *  NOT IN `lib/copy/individuals.en.tsx`, with the other five hundred strings
 *  on this page, and the reason is that this object is evaluated at module
 *  scope where there is no request and therefore no `await copy()`. `name`
 *  and `serviceType` are the call `lib/copy/business.en.tsx` already made —
 *  schema.org classification, structure in the sense an href is. The two
 *  `offers` are the uncomfortable half: they repeat `plans.basic.tt`/`.sub`
 *  and `plans.advanced.tt`/`.sub` word for word, with no type between the two
 *  copies. Recorded in that dictionary's header rather than resolved here. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "HelloV — verification from your phone",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
  offers: [
    { name: "Basic", description: "The essentials, in half an hour" },
    { name: "Advanced", description: "For the people inside your home" },
  ],
};

export default async function HelloVPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(INDIVIDUALS);
  const c = t.hellov;

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/individuals" }, { label: c.crumb }]}
      closing={{
        heading: c.closing.heading,
        sub: c.closing.sub,
        ctaLabel: c.closing.ctaLabel,
        ctaHref: "https://app.helloverify.com",
        img: "/img/15-home-doorway.jpg",
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">{c.hero.k}</div>
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="sub">{c.hero.sub}</p>
        <div className="hrow">
          <a href="https://app.helloverify.com" className="btn btn-ink">{c.hero.cta}</a>
          <a href="#plans" className="btn btn-ghost">
            <span>{c.hero.plans}</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{c.strip.thirtyMin}</span>
          <span className="it">{c.strip.noApp}</span>
          <span className="it">{c.strip.price}</span>
          <span className="it">{c.strip.consent}</span>
        </div>
      </div>

      {/* the chat, and who people check */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). Question-shaped H2, and a lede
            that answers it in 43 words while naming HelloV and the four people
            families check — "the same app you already use" pointed at something
            outside the block and could not be lifted (§11a.2 rule 3).

            The four subjects and the 30-minute figure are the `when3` cards
            directly below, and the strip above carries the turnaround. The two
            blocks after this one measure 44 words each. */}
        <SecHead k={c.chat.k} h={c.chat.h}>
          {c.chat.lede}
        </SecHead>
        <div className="body3 split3">
          <div>
            <div className="when3 tight">
              <div className="w">
                <div className="wt">{c.when.driver.wt}</div>
                <p className="wp">{c.when.driver.wp}</p>
                <span className="wm">{c.when.driver.wm}</span>
              </div>
              <div className="w">
                <div className="wt">{c.when.maid.wt}</div>
                <p className="wp">{c.when.maid.wp}</p>
                <span className="wm">{c.when.maid.wm}</span>
              </div>
              <div className="w">
                <div className="wt">{c.when.tenant.wt}</div>
                <p className="wp">{c.when.tenant.wp}</p>
                <span className="wm">{c.when.tenant.wm}</span>
              </div>
              <div className="w">
                <div className="wt">{c.when.online.wt}</div>
                <p className="wp">{c.when.online.wp}</p>
                <span className="wm">{c.when.online.wm}</span>
              </div>
            </div>
          </div>
          <div className="fig">
            <HelloVPhone />
          </div>
        </div>
      </div>

      {/* plans */}
      <div className="wrap sec3" id="plans">
        {/* "how much does a background check cost" is a top consumer query
            (§11a.3), so the price belongs in the answer rather than only in the
            cards. Both figures and both check counts are the two `rc` cards
            below and the strip above; nothing new is claimed. Note the
            NO PRICE FIGURES IN THIS BLOCK, deliberately. The `pricenote`
            directly below still says the prices are placeholders pending
            commercial sign-off, and an answer block is designed to be read
            AWAY from its page — so the disclaimer does not travel with the
            number, and an engine would cite an unsigned price as fact. The
            question therefore asks how HelloV is priced, which the plan model
            answers truthfully, rather than what it costs. The cards below still
            show the current figures with their disclaimer intact.

            Same call `/business/smb` made for its ₹349/₹999 packages, so the
            two pages agree. Revisit both together once prices are signed off.
            39 words. */}
        <SecHead k={c.plans.k} h={c.plans.h}>
          {c.plans.lede}
        </SecHead>
        <div className="body3 rack3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", maxWidth: 900 }}>
          {/* Each `.ln` keeps its two children — the `<Tick />` and the label —
              so these are one text-node swap apiece, and the five labels come
              from ONE flat table because three of them appear on both cards.
              The card chrome ("Plan", "Per person", "incl. GST", "30 minutes",
              "Buy now") is `plans.card`, said once for the same reason. */}
          <div className="rc">
            <div className="hd"><span>{c.plans.card.hd}</span><span>{c.plans.basic.hd}</span></div>
            <div className="tt">{c.plans.basic.tt}</div>
            <div className="sub">{c.plans.basic.sub}</div>
            <div className="sep" />
            <div className="ln"><Tick /><span>{c.plans.lines.licence}</span></div>
            <div className="ln"><Tick /><span>{c.plans.lines.criminal}</span></div>
            <div className="ln"><Tick /><span>{c.plans.lines.address}</span></div>
            <div className="sep" />
            <div className="price">
              <span className="lb">{c.plans.card.perPerson}</span>
              <span className="v">{c.plans.basic.price}<small>{c.plans.card.inclGst}</small></span>
            </div>
            <div className="ready">
              <span className="lb">{c.plans.basic.ready}</span>
              <span className="v">{c.plans.card.thirtyMinutes}</span>
            </div>
            <div className="bc" />
            <div className="buy">
              <span className="who">{c.plans.basic.who}</span>
              <a href="https://app.helloverify.com" className="btn btn-ink btn-sm">{c.plans.card.buy}</a>
            </div>
          </div>
          <div className="rc">
            <div className="hd"><span>{c.plans.card.hd}</span><span>{c.plans.advanced.hd}</span></div>
            <div className="tt">{c.plans.advanced.tt}</div>
            <div className="sub">{c.plans.advanced.sub}</div>
            <div className="sep" />
            <div className="ln"><Tick /><span>{c.plans.lines.licence}</span></div>
            <div className="ln"><Tick /><span>{c.plans.lines.criminal}</span></div>
            <div className="ln"><Tick /><span>{c.plans.lines.address}</span></div>
            <div className="ln"><Tick /><span>{c.plans.lines.identityPhotoMatch}</span></div>
            <div className="ln"><Tick /><span>{c.plans.lines.globalDatabase}</span></div>
            <div className="sep" />
            <div className="price">
              <span className="lb">{c.plans.card.perPerson}</span>
              <span className="v">{c.plans.advanced.price}<small>{c.plans.card.inclGst}</small></span>
            </div>
            <div className="ready">
              <span className="lb">{c.plans.advanced.ready}</span>
              <span className="v">{c.plans.card.thirtyMinutes}</span>
            </div>
            <div className="bc" />
            <div className="buy">
              <span className="who">{c.plans.advanced.who}</span>
              <a href="https://app.helloverify.com" className="btn btn-ink btn-sm">{c.plans.card.buy}</a>
            </div>
          </div>
        </div>
        <div className="pricenote">{c.plans.note}</div>
      </div>

      {/* consent */}
      <div className="wrap sec3">
        <SecHead k={c.rule.k} h={c.rule.h}>
          {c.rule.lede}
        </SecHead>
        {/* HowTo (§17 condition 18), and the weakest name of the eight: this
            band's `<h2>` is a yes/no legal question rather than a task, where
            the other seven are "how does X work". It is still the right one
            to use — the three cards ARE the sequence that answers it (consent,
            then the check, then deletion), and the alternative was inventing
            "How consent works", a string that appears nowhere on the page and
            that the gate's verbatim check would reject. Reconsider if a
            process-shaped heading is ever written for this band. `name` is now
            the same LEAF the `<h2>` reads, so the two cannot be parted by a
            translation. */}
        <Steps
          name={c.rule.h}
          items={[c.steps.agree, c.steps.check, c.steps.deleted]}
        />
      </div>

      {/* FAQ — markup and FAQPage node both from the same records (see
          FaqSection), which is what Google requires the two to do (§8.2). The
          ORDER is structure and stays here. */}
      <FaqSection
        head={c.faqHead}
        faqs={[c.faqs.knows, c.faqs.refuse, c.faqs.search, c.faqs.receive, c.faqs.thirty]}
      />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}
