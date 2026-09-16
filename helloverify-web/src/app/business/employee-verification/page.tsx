/** /business/employee-verification — vertical page (Template 3). */
import type { Metadata } from "next";
import { PageShell } from "@/components/chrome/PageShell";

export const metadata: Metadata = {
  title: "Employee verification — HelloVerify",
  description:
    "Existing staff, contractors and gig workforces — verified at joining and re-verified when it matters. EPFO-backed employment history in 60 minutes.",
};

export default function EmployeeVerificationPage() {
  return (
    <PageShell
      crumbs={[{ label: "Business", href: "/business" }, { label: "Employee verification" }]}
      closing={{
        heading: (
          <>
            The people you already trust, <em>on the record.</em>
          </>
        ),
        sub: "Roll out re-verification without disrupting a single shift.",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Business · Employee verification</div>
        <h1 className="h1">
          Know your workforce. <em>Still.</em>
        </h1>
        <p className="sub">
          Verification isn't only for new hires. Contractors, gig fleets and staff moving into
          sensitive roles — re-verified in the background, from provident-fund records to courts.
        </p>
        <div className="hrow">
          <a href="/contact" className="btn btn-ink">Talk to sales</a>
          <a href="#when" className="btn btn-ghost">
            <span>When to re-verify</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>60 min</b> digital employment check</span>
          <span className="it"><b>EPFO</b>-backed work history</span>
          <span className="it"><b>Zero</b> forms for the employee</span>
          <span className="it"><span className="dot" /> consent captured every run</span>
        </div>
      </div>

      {/* what we check */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">What we check</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Work history,<br />from the record.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Digital first: provident-fund records answer in an hour. Where an employer must be
            called, we call — and the report says who picked up.
          </p>
        </div>
        <div className="body3 cloud3" style={{ marginTop: 40 }}>
          <span className="pl3 fast"><span className="d" />Digital employment<span className="t">60 min</span></span>
          <span className="pl3 fast"><span className="d" />Moonlighting<span className="t">60 min</span></span>
          <span className="pl3 fast"><span className="d" />Entitlement to work<span className="t">60 min</span></span>
          <span className="pl3 fast"><span className="d" />Criminal refresh<span className="t">30 min</span></span>
          <span className="pl3 fast"><span className="d" />Current address<span className="t">30 min</span></span>
          <span className="pl3"><span className="d" />Employment (manual)<span className="t">2 days</span></span>
          <span className="pl3"><span className="d" />Education<span className="t">3 days</span></span>
        </div>
      </div>

      {/* when to re-verify */}
      <div className="wrap sec3" id="when">
        <div className="sec-head">
          <div>
            <div className="k">When it matters</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Four moments<br />worth a second look.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            A check is a snapshot. These are the moments the picture changes — and the ones
            auditors ask about.
          </p>
        </div>
        <div className="body3 when3">
          <div className="w">
            <div className="wt">Joining</div>
            <p className="wp">The baseline: identity, work history and records confirmed before access is granted.</p>
            <span className="wm">same day</span>
          </div>
          <div className="w">
            <div className="wt">Role change</div>
            <p className="wp">Moving into finance, security or childcare-adjacent work triggers the checks that role demands.</p>
            <span className="wm">60 min</span>
          </div>
          <div className="w">
            <div className="wt">Annual refresh</div>
            <p className="wp">Criminal and moonlighting refresh across the workforce, batched so HR does nothing manually.</p>
            <span className="wm">runs overnight</span>
          </div>
          <div className="w">
            <div className="wt">Incident</div>
            <p className="wp">A targeted re-run with an auditable trail, ready for legal the same day.</p>
            <span className="wm">30 min</span>
          </div>
        </div>
      </div>

      {/* how it works */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">How it works</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Quiet by design.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Employees consent once on their own phone; after that, refreshes run without
            interrupting anyone's day.
          </p>
        </div>
        <div className="body3 steps3" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <div>
            <div className="n">01 · One CSV or API call</div>
            <div className="t">Enroll</div>
            <p className="p">Upload the roster or sync from your HRMS. Each employee gets a consent link.</p>
          </div>
          <div>
            <div className="n">02 · On schedule</div>
            <div className="t">Verify</div>
            <p className="p">Checks run digitally against provident-fund, court and registry records. Humans handle the exceptions.</p>
          </div>
          <div>
            <div className="n">03 · Only the changes</div>
            <div className="t">Alert</div>
            <p className="p">You hear about the deltas — a new court record, a second employer — not five hundred clean results.</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="wrap sec3" style={{ paddingBottom: 30 }}>
        <div className="sec-head" style={{ marginBottom: 44 }}>
          <div>
            <div className="k">Questions</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Fair questions.</h2>
          </div>
        </div>
        <div className="faq3">
          <details>
            <summary>Is re-verifying existing employees even legal?<span className="m">+</span></summary>
            <p className="a">
              Yes, with consent — which the flow captures per run, not as a blanket signature from
              five years ago. Scope is limited to what the role justifies, and employees can see
              what was checked.
            </p>
          </details>
          <details>
            <summary>What is a "digital employment" check?<span className="m">+</span></summary>
            <p className="a">
              Work history reconstructed from provident-fund contribution records — employer names,
              overlaps and gaps — confirmed at the source in about an hour, without calling anyone's
              current employer.
            </p>
          </details>
          <details>
            <summary>Can it detect moonlighting?<span className="m">+</span></summary>
            <p className="a">
              Concurrent PF contributions from a second employer show up in the same 60-minute check.
              The report shows the overlap period, not an accusation — what you do with it is policy.
            </p>
          </details>
          <details>
            <summary>Will employees be contacted?<span className="m">+</span></summary>
            <p className="a">
              Only for consent, on their own phone. Digital checks never touch their employer or
              colleagues; manual employment checks do, and are marked clearly before you order one.
            </p>
          </details>
        </div>
      </div>
    </PageShell>
  );
}
