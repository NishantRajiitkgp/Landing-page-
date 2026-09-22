import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import type { ServiceFacts } from "@/lib/seo/schema/service";
import { VerticalPage } from "@/components/templates/VerticalPage";
import { setRequestLocale } from "next-intl/server";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/individuals/home-family";


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
 *  apart. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Home and family background checks",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
};

export default async function Page({
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
    <VerticalPage
      service={SERVICE}
      crumbs={[{ label: "Individuals", href: "/individuals" }, { label: "Home & family" }]}
      eyebrow="Individuals · Home & family"
      h1={<>The people <em>in your home.</em></>}
      sub="A nanny, a driver, a cook, a carer for your parents. They hold your keys and your children's hands — and usually arrive on a recommendation and a photocopy."
      primary={{ label: "Check someone now", href: "https://app.helloverify.com" }}
      secondary={{ label: "See what gets checked", href: "#turnaround" }}
      strip={[
        <><b>30 min</b> typical turnaround</>,
        <><b>₹499</b> to start</>,
        <><b>WhatsApp</b> — no app to install</>,
        <><span className="dot" /> they consent first, always</>,
      ]}
      /* ANSWER BLOCKS (BUILD-SPEC §11a.2). `VerticalPage` renders each of these
         four head/lede pairs as the section's H2 and lede, so the conversion is
         a prop change rather than markup: statement heading becomes the
         question a family types, lede becomes the self-contained answer at 43,
         39, 41 and 41 words. Each names the household check rather than "all
         three" or "the whole thing", which pointed outside the block and made
         it unciteable (§11a.2 rule 3).
         Every figure is one of this page's own `lanes` pills or `rows`. */
      verifyHead="What does a background check on a nanny or driver cover?"
      verifyLede="A HelloVerify household check covers three things: identity with a photo match, the criminal and global-database record, and whether the address given is real. Identity takes 15 minutes, driving licence and criminal record 30 minutes each; a previous household employer takes two days."
      laneCols={3}
      lanes={[
        {
          gt: "01 — Identity",
          gh: "Who they are",
          pills: [
            { n: "Identity", t: "15 min", fast: true },
            { n: "Photo match", t: "seconds", fast: true },
            { n: "Age", t: "15 min", fast: true },
            { n: "Driving licence", t: "30 min", fast: true },
          ],
        },
        {
          gt: "02 — Record",
          gh: "What's on file",
          pills: [
            { n: "Criminal", t: "30 min", fast: true },
            { n: "Global database", t: "15 min", fast: true },
          ],
        },
        {
          gt: "03 — Where they live",
          gh: "Is it real",
          pills: [
            { n: "Current address", t: "30 min", fast: true },
            { n: "Previous employment", t: "2 days" },
          ],
        },
      ]}
      stepsHead="How do I check a nanny or driver before they start?"
      stepsLede="A HelloVerify home-and-family check runs in a WhatsApp conversation: you photograph the person's document, they consent on their own phone after seeing exactly what is being checked, and the report returns to the same chat in about 30 minutes."
      steps={[
        { n: "01 · You", t: "Send a photo", p: "Message HelloV and photograph their document. Takes about a minute." },
        { n: "02 · Them", t: "They agree", p: "They get a message showing exactly what's being checked, and consent on their own phone." },
        { n: "03 · The report", t: "You know", p: "Plain language, sources named, back in the same chat — usually in about 30 minutes." },
      ]}
      tableHead="How long does a nanny or driver background check take?"
      tableLede="Most HelloVerify household checks finish inside 30 minutes, measured from upload to report: identity and a global database screen in 15 minutes, driving licence, criminal record and current address in 30. Only a previous household employer is slow, at two days."
      rows={[
        { nm: "Identity", sub: "name, DOB, photo match", tm: "15 min", fast: true, src: "issuing registry" },
        { nm: "Global database screen", sub: "watchlists, adverse media", tm: "15 min", fast: true, src: "global databases" },
        { nm: "Driving licence", sub: "class, validity, endorsements", tm: "30 min", fast: true, src: "state transport authority" },
        { nm: "Criminal record", sub: "court & police databases", tm: "30 min", fast: true, src: "court records" },
        { nm: "Current address", sub: "residence confirmation", tm: "30 min", fast: true, src: "address records" },
        { nm: "Previous employment", sub: "household or agency reference", tm: "2 days", src: "the previous employer" },
      ]}
      tableNote="Times shown are from upload to report · all checks require the person's consent"
      /* This section renders `VerticalPage`'s certification cards, so the
         answer deliberately says nothing about which credentials are held:
         that list lives in `lib/content/company.ts` and on
         `/platform/security-compliance`, and `check:llms` gates it. Restating
         it in a lede on six vertical pages is how those copies drift. The
         answer takes the consent-and-retention half, as the old lede did. */
      complianceHead="Is verification fair to the person being checked?"
      complianceLede="The person being checked is usually looking for work: they see exactly what is being verified, consent to it, and their documents are held under retention limits rather than forever. A verified record is also portable proof for the next family."
      faqHead={<>From families.</>}
      faqs={[
        {
          q: "Isn't it awkward to ask?",
          a: "Less than you'd expect — verification is now normal for household staff, and many candidates prefer it, because a verified record is portable proof for the next family too. The request comes from us, not you.",
        },
        {
          q: "What if they have no formal documents?",
          a: "Most people have at least one government ID, which anchors identity and criminal checks. If nothing can be verified, the report says so plainly — that's information too, and it's better than assuming.",
        },
        {
          q: "Does a clean report mean they're safe?",
          a: "It means the records confirm what they told you. That's a floor, not a guarantee — keep doing the human things: references, a trial period, meeting the family. Verification removes a specific risk, not all of them.",
        },
        {
          q: "Can I check an agency's staff?",
          a: "Yes, with the individual's consent. Agencies often say staff are 'verified' without saying by whom or against what — this tells you which authority confirmed it and when.",
        },
      ]}
      closing={{
        heading: <>Peace of mind, <em>in half an hour.</em></>,
        sub: "One photo, their consent, and a report you can rely on.",
        ctaLabel: "Check someone now",
        ctaHref: "https://app.helloverify.com",
        img: "/img/04-nanny-gurugram.jpg",
      }}
    />
  );
}
