/** /resources — hub for the organic-growth surface (IA §7). */
import type { Metadata } from "next";
import { PageShell } from "@/components/chrome/PageShell";
import { CHECKS } from "@/lib/content/checks";
import { COUNTRIES } from "@/lib/content/countries";

export const metadata: Metadata = {
  title: "Resources — HelloVerify",
  description:
    "The check library, country guides, a glossary of verification terms, and writing about how verification actually works.",
};

export default function ResourcesHub() {
  return (
    <PageShell
      crumbs={[{ label: "Resources" }]}
      closing={{
        heading: (
          <>
            Can't find your check <em>or your country?</em>
          </>
        ),
        sub: "Ask us directly — the answer is usually yes, with a caveat worth hearing.",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Resources</div>
        <h1 className="h1">
          How verification <em>actually works.</em>
        </h1>
        <p className="sub">
          What each check answers, how long it takes where, and the vocabulary the industry uses
          carelessly. Written to be useful before you buy anything.
        </p>
      </div>

      <div className="wrap sec3" style={{ paddingTop: 60 }}>
        <div className="rcard3">
          <a href="/resources/checks">
            <div className="rk">Library</div>
            <div className="rt3">The check library</div>
            <p className="rp">Every check: what it answers, who confirms it, how long it takes, and what it cannot tell you.</p>
            <div className="rm">{CHECKS.length} checks documented →</div>
          </a>
          <a href="/resources/countries">
            <div className="rk">Guides</div>
            <div className="rt3">Country guides</div>
            <p className="rp">What verification is like in a given country — the registries, the timelines, the local trap.</p>
            <div className="rm">{COUNTRIES.length} countries documented →</div>
          </a>
          <a href="/resources/glossary">
            <div className="rk">Reference</div>
            <div className="rt3">Glossary</div>
            <p className="rp">Attestation, screening, primary source, adverse media — terms used loosely, defined precisely.</p>
            <div className="rm">Plain definitions →</div>
          </a>
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">Writing</div>
            <h2 className="h2" style={{ marginTop: 12 }}>From the blog.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Occasional, specific, and written by people who run these checks rather than a content team.
          </p>
        </div>
        <div className="body3 rcard3">
          <a href="/resources/blog/primary-source-vs-database">
            <div className="rk">Verification · 6 min</div>
            <div className="rt3">Primary source vs. database</div>
            <p className="rp">Why two products that look identical on a feature list give you completely different answers.</p>
            <div className="rm">Read →</div>
          </a>
          <a href="/resources/blog">
            <div className="rk">Index</div>
            <div className="rt3">All writing</div>
            <p className="rp">Everything we've published, newest first.</p>
            <div className="rm">Browse →</div>
          </a>
        </div>
      </div>
    </PageShell>
  );
}
