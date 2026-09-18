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
      verifyHead={<>Three things<br />worth knowing.</>}
      verifyLede="Who they actually are, what the courts say, and whether the address they gave you is real. All three usually come back inside half an hour."
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
      stepsHead={<>Before the<br />first day.</>}
      stepsLede="The whole thing happens in a WhatsApp conversation, usually while you're still deciding."
      steps={[
        { n: "01 · You", t: "Send a photo", p: "Message HelloV and photograph their document. Takes about a minute." },
        { n: "02 · Them", t: "They agree", p: "They get a message showing exactly what's being checked, and consent on their own phone." },
        { n: "03 · The report", t: "You know", p: "Plain language, sources named, back in the same chat — usually in about 30 minutes." },
      ]}
      tableHead={<>What takes<br />how long.</>}
      tableLede="Measured from upload to report. Household checks are deliberately the fast ones — the decision is usually being made this week."
      rows={[
        { nm: "Identity", sub: "name, DOB, photo match", tm: "15 min", fast: true, src: "issuing registry" },
        { nm: "Global database screen", sub: "watchlists, adverse media", tm: "15 min", fast: true, src: "global databases" },
        { nm: "Driving licence", sub: "class, validity, endorsements", tm: "30 min", fast: true, src: "state transport authority" },
        { nm: "Criminal record", sub: "court & police databases", tm: "30 min", fast: true, src: "court records" },
        { nm: "Current address", sub: "residence confirmation", tm: "30 min", fast: true, src: "address records" },
        { nm: "Previous employment", sub: "household or agency reference", tm: "2 days", src: "the previous employer" },
      ]}
      tableNote="Times shown are from upload to report · all checks require the person's consent"
      complianceHead={<>Fair to them,<br />too.</>}
      complianceLede="The person you're checking is usually looking for work. They see what's being verified, consent to it, and the documents don't live with us forever."
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
