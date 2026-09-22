import { CertCard } from "@/components/chrome/CertCard";
/** Certifications and compliance.
 *
 *  The cards come from `CREDENTIAL_MARKS` in `lib/content/company.ts` via
 *  `chrome/CertCard.tsx`. Before that, this file hand-wrote eight of them and
 *  was the site's worst credentials outlier: four credentials where `/about`
 *  and `/platform/security-compliance` carry seven, "GDPR compliant" where
 *  the procurement page says "GDPR — aligned" under a standfirst calling
 *  those two different claims, and two different PBSA headings between its own
 *  `.dsk` and `.mob` blocks. Measured 22 Sep 2026; the table carries the
 *  full census. */

export function Compliance() {
  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: '120px', paddingBottom: '140px' }}>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)', gap: '80px', alignItems: 'start' }}>
            {' '}
            <div>
              {' '}
              <h2 className="h2" style={{ fontSize: '56px' }}>
                The unexciting part, done properly.
              </h2>
              {' '}
              <p className="lede" style={{ marginTop: '24px', maxWidth: '420px' }}>
                Every check involves someone's most personal documents. Consent comes first, retention has limits, and all of it is audited by people whose job is to be unimpressed.
              </p>
              {' '}
            </div>
            {' '}
            <div>
              {' '}
              {/* FOUR OF THE EIGHT MARKS, and the subset is deliberate rather
                  than stale (BUILD-SPEC §11a.3, TASKS 2b). ISO/IEC 27701,
                  SOC 2 and ISO 9001 joined the reviewed list on 22 Sep 2026
                  and are NOT added here: this is the homepage, three more
                  cards is homepage bytes against a 460 KB ceiling and a
                  measured 1,089 ms LCP, and TASKS 2b says that wants its own
                  commit with the measurement in it. What has changed is that
                  the four are now NAMED — the count is a choice a reader can
                  see and re-take, not 8 copies of markup nobody diffed. */}
              <CertCard id="iso27001" style={{ borderTopColor: 'transparent', paddingTop: '4px' }} />
              {' '}
              <CertCard id="gdpr" />
              {' '}
              <CertCard id="pbsa" />
              {' '}
              <CertCard id="nsr" />
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {' '}
          <h2 className="h2">
            The unexciting part, done properly.
          </h2>
          {' '}
          <p className="lede">
            Consent comes first, retention has limits, and all of it is audited by people whose job is to be unimpressed.
          </p>
          {' '}
          <div style={{ marginTop: '24px' }}>
            {' '}
            {/* Same four ids as `.dsk` above, which is the point: these are
                separate markup (only the homepage is a two-tree port, Part 6)
                and before this they disagreed — `.dsk` headed the PBSA card
                "Professional Background Screening Association" and `.mob`
                headed it "PBSA member". Two glosses stay shortened, because
                this column is narrower and Part 5 measured that question per
                file rather than assuming it. */}
            <CertCard id="iso27001" />
            {' '}
            <CertCard
              id="gdpr"
              gloss="Consent, retention limits and the right to be forgotten."
            />
            {' '}
            <CertCard id="pbsa" gloss="The global standards body for screening." />
            {' '}
            <CertCard id="nsr" />
            {' '}
          </div>
          {' '}
        </div>
      </div>
    </>
  );
}
