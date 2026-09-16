/**
 * Blog posts. Real content lives here until a CMS lands (BUILD-SPEC G7) — the
 * shape is deliberately CMS-ready: one record per post, body as sections.
 */

export type Post = {
  slug: string;
  title: string;
  standfirst: string;
  date: string;
  readMins: number;
  category: string;
  author: { name: string; role: string; img: string };
  /** Body as H2-anchored sections — each independently citable (AEO, BUILD-SPEC §11a). */
  sections: { id: string; h: string; paras: string[]; quote?: string }[];
};

export const POSTS: Post[] = [
  {
    slug: "primary-source-vs-database",
    title: "Primary source vs. database: the difference that decides everything",
    standfirst:
      "Two products can offer the same list of checks and give you opposite answers. The difference isn't features — it's who you asked.",
    date: "2026-09-02",
    readMins: 6,
    category: "Verification",
    author: { name: "HelloVerify", role: "Verification operations", img: "/img/21-portrait-ramesh.jpg" },
    sections: [
      {
        id: "the-same-list",
        h: "Two vendors, the same feature list",
        paras: [
          "Put two background verification proposals side by side and they will look interchangeable. Both offer identity, education, employment, criminal records. Both quote turnaround times. Both have logos of certifications along the bottom.",
          "The difference is invisible on the feature list and total in practice: one of them asks the university whether the degree exists, and the other asks a database that once recorded that it did.",
        ],
      },
      {
        id: "what-a-database-knows",
        h: "What a database actually knows",
        paras: [
          "An aggregated database knows what someone typed into it, at some point, from some source. That is genuinely useful for sanctions lists and watchlists, because there the list is the authority — being on it is the fact being checked.",
          "It is close to useless against a competent forgery of a degree certificate. The forger is not trying to fool the database; the database has no record of that graduate either way. A name-based match returns a plausible-looking result, and everyone moves on.",
        ],
        quote: "The credential either exists at the institution that issued it, or it doesn't. Everything else is opinion.",
      },
      {
        id: "the-third-answer",
        h: "The third answer nobody wants to give",
        paras: [
          "Primary source verification produces three outcomes, not two. Verified: the registrar confirmed the record. Not verified: the registrar has no such record. And unverifiable: the registrar could not be reached at all.",
          "That third state is where the industry quietly misleads. A system built to return pass or fail has to put unverifiable somewhere, and it almost always lands on pass. The employer sees a green tick that means nothing was actually confirmed.",
          "Reporting it honestly is uncomfortable — it makes a vendor look slower and less complete. It is also the only version that protects both the employer and the candidate, because a person from a country with damaged record-keeping is not a person who lied.",
        ],
      },
      {
        id: "what-it-costs",
        h: "What honesty costs, in days",
        paras: [
          "Asking the source takes longer. A registrar answers in days, not milliseconds — which is why our education check is quoted at three days while a database lookup is instant.",
          "The right response to that gap is not to pretend it doesn't exist. It is to run everything that can be digital in parallel — identity, licence, provident-fund history, court records, most of which come back inside an hour — so the only thing you are waiting on is the thing that genuinely requires a human at an institution.",
        ],
      },
      {
        id: "how-to-tell",
        h: "How to tell which one you're buying",
        paras: [
          "Ask three questions. First: for each check, who exactly confirms it — name the institution, not the category. Second: what do you return when the source cannot be reached, and where does that appear in the report. Third: can I see the evidence behind a result, with a date on it.",
          "A vendor doing primary source verification answers all three immediately, because those answers are the product. A vendor reselling database access will answer the first vaguely, the second not at all, and the third with a screenshot of their dashboard.",
        ],
      },
    ],
  },
  {
    slug: "what-30-minutes-actually-means",
    title: "What “30 minutes” actually means in a verification quote",
    standfirst:
      "Turnaround times are quoted from wildly different starting points. Here's how to read one honestly — and what we measure.",
    date: "2026-08-14",
    readMins: 4,
    category: "Operations",
    author: { name: "HelloVerify", role: "Verification operations", img: "/img/21-portrait-ramesh.jpg" },
    sections: [
      {
        id: "the-clock",
        h: "Where the clock starts",
        paras: [
          "Most quoted turnaround times begin when the vendor starts work, which can be hours after the candidate uploaded anything — or days, if a document was rejected for quality and nobody chased it.",
          "We measure from upload to report, including the queue. It makes our numbers look worse against vendors who measure from their own convenience, and it is the only number that describes the experience of the person waiting for a job.",
        ],
      },
      {
        id: "parallel",
        h: "Why parallel matters more than fast",
        paras: [
          "A package with four checks is not four times slower than one check, because the checks run simultaneously. A package is only as slow as its slowest member.",
          "That is also why mixing one slow check into an otherwise fast package is expensive in time: adding an education check to a 30-minute blue-collar package makes it a three-day package. Knowing that in advance lets you stage the decision — hire on the fast checks, confirm the slow one before confirmation of employment.",
        ],
      },
      {
        id: "the-honest-caveat",
        h: "The caveat we put in writing",
        paras: [
          "Times assume the issuer responds normally. Registries close for holidays, courts have backlogs, and some institutions still confirm by post. When that happens the report shows the request as pending with the route being used, rather than stalling silently.",
          "If a time is going to be missed, the useful moment to know is before you ordered the check — which is why country-level timings are published rather than quoted on request.",
        ],
      },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
