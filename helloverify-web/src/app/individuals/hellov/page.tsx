/** /individuals/hellov — consumer product page (Template 4: receipts + the phone).
 *  Leads with the job, brand follows (IA §10.3). Prices are placeholders pending sign-off. */
import type { Metadata } from "next";
import { PageShell } from "@/components/chrome/PageShell";
import { HelloVPhone } from "@/components/blocks/HelloVPhone";

export const metadata: Metadata = {
  title: "Verify anyone from your phone — HelloV by HelloVerify",
  description:
    "Send a photo of the document over WhatsApp and get a verified report in about 30 minutes. Drivers, maids, tenants, dates — consent-first, from ₹499.",
};

const Tick = () => (
  <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HelloVPage() {
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
        <div className="sec-head">
          <div>
            <div className="k">In one conversation</div>
            <h2 className="h2" style={{ marginTop: 12 }}>It happens<br />in WhatsApp.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            No download, no dashboard, no password to forget. The same app you already use to
            send photos of everything else.
          </p>
        </div>
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
        <div className="sec-head">
          <div>
            <div className="k">Plans</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Two plans.<br />One receipt.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Pay per person, not per month. Everything runs in parallel, so the report is only as
            slow as its slowest check.
          </p>
        </div>
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
        <div className="sec-head">
          <div>
            <div className="k">The rule</div>
            <h2 className="h2" style={{ marginTop: 12 }}>You can't check<br />someone secretly.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            That isn't a limitation we added reluctantly — it's the line between verification and
            surveillance, and it's the law.
          </p>
        </div>
        <div className="body3 steps3" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <div>
            <div className="n">01</div>
            <div className="t">They agree</div>
            <p className="p">The person receives a message, sees exactly what will be checked, and consents on their own phone.</p>
          </div>
          <div>
            <div className="n">02</div>
            <div className="t">We check</div>
            <p className="p">Only the checks they agreed to, only at the authority that issued the document.</p>
          </div>
          <div>
            <div className="n">03</div>
            <div className="t">Then it's deleted</div>
            <p className="p">Documents are kept for a bounded period, encrypted, then removed on schedule.</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="wrap sec3" style={{ paddingBottom: 30 }}>
        <div className="sec-head" style={{ marginBottom: 44 }}>
          <div>
            <div className="k">Questions</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Before you start.</h2>
          </div>
        </div>
        <div className="faq3">
          <details>
            <summary>Does the person know I'm checking them?<span className="m">+</span></summary>
            <p className="a">
              Yes — always. They get a message explaining what is being verified and must consent on
              their own phone before anything runs. A check without consent isn't something we can
              do, or would.
            </p>
          </details>
          <details>
            <summary>What if they refuse?<span className="m">+</span></summary>
            <p className="a">
              Then no check runs and you aren't charged. How you read a refusal is your judgement —
              plenty of people simply want to know what's being collected before they agree.
            </p>
          </details>
          <details>
            <summary>How is this different from searching their name online?<span className="m">+</span></summary>
            <p className="a">
              A search finds what someone published. We ask the authority that issued the document
              whether the record is real — the transport office for a licence, the courts for a
              criminal record. The report names that source beside every result.
            </p>
          </details>
          <details>
            <summary>What do I actually receive?<span className="m">+</span></summary>
            <p className="a">
              A short report in plain language: what was checked, what came back, and who confirmed
              it. No risk scores, no opinions about the person — facts with sources.
            </p>
          </details>
          <details>
            <summary>Is 30 minutes realistic?<span className="m">+</span></summary>
            <p className="a">
              For licence, criminal and address checks, usually yes — those registries answer
              digitally. If something needs a slower route, the chat tells you before you pay.
            </p>
          </details>
        </div>
      </div>
    </PageShell>
  );
}
