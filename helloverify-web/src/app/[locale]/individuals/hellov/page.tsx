/** /individuals/hellov — consumer product page (Template 4: receipts + the phone).
 *  Leads with the job, brand follows (IA §10.3). Prices are placeholders pending sign-off. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import type { Faq } from "@/lib/seo/schema/faq";
import { HelloVPhone } from "@/components/blocks/HelloVPhone";
import { setRequestLocale } from "next-intl/server";
import { Tick } from "@/components/brand/Tick";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";

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


/** The FAQ copy, stated once. `<FaqSection>` renders it and emits the
 *  matching `FAQPage` node from the same array — Google requires the two to
 *  say the same words (BUILD-SPEC §8.2, and `lib/seo/schema/faq.ts`). */
const FAQS: Faq[] = [
  {
    q: "Does the person know I'm checking them?",
    a:
      "Yes — always. They get a message explaining what is being verified and must consent on their own phone before anything runs. A check without consent isn't something we can do, or would.",
  },
  {
    q: "What if they refuse?",
    a:
      "Then no check runs and you aren't charged. How you read a refusal is your judgement — plenty of people simply want to know what's being collected before they agree.",
  },
  {
    q: "How is this different from searching their name online?",
    a:
      "A search finds what someone published. We ask the authority that issued the document whether the record is real — the transport office for a licence, the courts for a criminal record. The report names that source beside every result.",
  },
  {
    q: "What do I actually receive?",
    a:
      "A short report in plain language: what was checked, what came back, and who confirmed it. No risk scores, no opinions about the person — facts with sources.",
  },
  {
    q: "Is 30 minutes realistic?",
    a:
      "For licence, criminal and address checks, usually yes — those registries answer digitally. If something needs a slower route, the chat tells you before you pay.",
  },
];

/** BUILD-SPEC §8.2 (`Service`, per solution) and §11a.3 (`areaServed`).
 *  `description` is this page's own reviewed description, read from the copy
 *  table (`lib/seo/copy.ts`, §8.1) rather than paraphrased here, so the page
 *  title, the meta description, the Service node and llms.txt cannot drift
 *  apart. */
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

  return (
    <PageShell
      crumbs={[{ label: "Individuals", href: "/individuals" }, { label: "HelloV" }]}
      closing={{
        heading: (
          <>
            Thirty minutes now, or <em>years of wondering.</em>
          </>
        ),
        sub: "Message HelloV on WhatsApp. That's the whole setup.",
        ctaLabel: "Start on WhatsApp",
        ctaHref: "https://app.helloverify.com",
        img: "/img/15-home-doorway.jpg",
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">Individuals · HelloV</div>
        <h1 className="h1">
          Verify anyone.<br />
          <em>From your phone, in 30 minutes.</em>
        </h1>
        <p className="sub">
          Send a photo of the document over WhatsApp. We check it with the authority that issued
          it — the transport office, the court, the registry — and send the report back to the
          same chat.
        </p>
        <div className="hrow">
          <a href="https://app.helloverify.com" className="btn btn-ink">Start on WhatsApp</a>
          <a href="#plans" className="btn btn-ghost">
            <span>See the two plans</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>30 min</b> typical turnaround</span>
          <span className="it"><b>No</b> app, no account</span>
          <span className="it"><b>₹499</b> to start</span>
          <span className="it"><span className="dot" /> they consent first, always</span>
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
        <SecHead k="In one conversation" h="Can I run a background check over WhatsApp?">
          Yes. HelloV runs entirely inside WhatsApp — no download, no dashboard, no password.
          Families use it before hiring a driver, a maid or nanny, before handing a tenant the
          keys, and before believing someone they met online. Each check takes about 30 minutes.
        </SecHead>
        <div className="body3 split3">
          <div>
            <div className="when3 tight">
              <div className="w">
                <div className="wt">A driver</div>
                <p className="wp">For the school run, the night shift, the family car. Licence, record, address.</p>
                <span className="wm">30 min</span>
              </div>
              <div className="w">
                <div className="wt">A maid or nanny</div>
                <p className="wp">The person alone in your home with your children. Identity, criminal record, address.</p>
                <span className="wm">30 min</span>
              </div>
              <div className="w">
                <div className="wt">A tenant</div>
                <p className="wp">Before the keys and the deposit change hands. Identity, criminal, credit.</p>
                <span className="wm">30 min</span>
              </div>
              <div className="w">
                <div className="wt">Someone you met online</div>
                <p className="wp">Before dinner, before an investment, before you believe the profile.</p>
                <span className="wm">30 min</span>
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
        <SecHead k="Plans" h="How is a HelloV background check priced?">
          HelloV is priced per person rather than by subscription, with two plans. Basic covers
          driving licence, criminal record and current address. Advanced adds identity with photo
          match and a global database screen. Both return a report in 30 minutes.
        </SecHead>
        <div className="body3 rack3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", maxWidth: 900 }}>
          <div className="rc">
            <div className="hd"><span>Plan</span><span>HelloV · Basic</span></div>
            <div className="tt">Basic</div>
            <div className="sub">The essentials, in half an hour</div>
            <div className="sep" />
            <div className="ln"><Tick /><span>Driving licence</span></div>
            <div className="ln"><Tick /><span>Criminal record</span></div>
            <div className="ln"><Tick /><span>Current address</span></div>
            <div className="sep" />
            <div className="price">
              <span className="lb">Per person</span>
              <span className="v">₹499<small>incl. GST</small></span>
            </div>
            <div className="ready">
              <span className="lb">3 checks · ready in</span>
              <span className="v">30 minutes</span>
            </div>
            <div className="bc" />
            <div className="buy">
              <span className="who">Drivers, tenants, dates</span>
              <a href="https://app.helloverify.com" className="btn btn-ink btn-sm">Buy now</a>
            </div>
          </div>
          <div className="rc">
            <div className="hd"><span>Plan</span><span>HelloV · Advanced</span></div>
            <div className="tt">Advanced</div>
            <div className="sub">For the people inside your home</div>
            <div className="sep" />
            <div className="ln"><Tick /><span>Driving licence</span></div>
            <div className="ln"><Tick /><span>Criminal record</span></div>
            <div className="ln"><Tick /><span>Current address</span></div>
            <div className="ln"><Tick /><span>Identity &amp; photo match</span></div>
            <div className="ln"><Tick /><span>Global database screen</span></div>
            <div className="sep" />
            <div className="price">
              <span className="lb">Per person</span>
              <span className="v">₹799<small>incl. GST</small></span>
            </div>
            <div className="ready">
              <span className="lb">5 checks · ready in</span>
              <span className="v">30 minutes</span>
            </div>
            <div className="bc" />
            <div className="buy">
              <span className="who">Nannies, carers, live-in staff</span>
              <a href="https://app.helloverify.com" className="btn btn-ink btn-sm">Buy now</a>
            </div>
          </div>
        </div>
        <div className="pricenote">
          Prices shown are placeholders pending commercial sign-off · the person being verified
          consents before any check runs
        </div>
      </div>

      {/* consent */}
      <div className="wrap sec3">
        <SecHead k="The rule" h="Is it legal to check someone yourself?">
          Yes — with consent, which is the law rather than a HelloV policy. The person receives a
          message showing exactly what will be checked and consents on their own phone; without
          that no check runs and you aren't charged. Documents are deleted on schedule.
        </SecHead>
        <Steps
          items={[
          { n: "01", t: "They agree", p: "The person receives a message, sees exactly what will be checked, and consents on their own phone." },
          { n: "02", t: "We check", p: "Only the checks they agreed to, only at the authority that issued the document." },
          { n: "03", t: "Then it's deleted", p: "Documents are kept for a bounded period, encrypted, then removed on schedule." },
          ]}
        />
      </div>

      {/* FAQ — markup and FAQPage node both from FAQS (see FaqSection). */}
      <FaqSection head={<>Before you start.</>} faqs={FAQS} />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}
