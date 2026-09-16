import Image from "next/image";
import { SIZES_BENTO_NARROW, SIZES_BENTO_WIDE } from "@/lib/img";
/** Who it is for - the audience bento. */

export function WhoItsFor() {
  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: '120px', paddingBottom: '140px' }}>
          {' '}
          <div className="sec-head">
            {' '}
            <h2 className="h2">
              For the moment you
              <br />
              need to trust someone.
            </h2>
            {' '}
            <p className="lede" style={{ marginBottom: '8px' }}>
              A health ministry licensing ten thousand nurses and a family hiring one nanny need the same thing: a real answer, quickly. Same platform, different door.
            </p>
            {' '}
          </div>
          {' '}
          <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridAutoRows: '290px', gap: '20px' }}>
            {' '}
            <div className="cell ph" style={{ gridRow: 'span 2', background: '#B3B08F' }}>
              {' '}
              <div className="light">
              </div>
              <Image className="pimg" src="/img/10-ministry-hall.jpg" alt="" fill sizes={SIZES_BENTO_NARROW} />
              <div className="note">
                photo · ministry hall
              </div>
              <div className="scrim">
              </div>
              {' '}
              <div className="tag">
                Governments{' '}
                &amp;
                {' '}authorities
              </div>
              <div className="from">
                from 3 days
              </div>
              {' '}
              <div className="body">
                <div className="h">
                  Licences, visas
                  <br />
                  and permits
                </div>
              </div>
              {' '}
            </div>
            {' '}
            <div className="cell ph" style={{ gridColumn: 'span 2', background: '#D8CBB2' }}>
              {' '}
              <div className="light">
              </div>
              <Image className="pimg" src="/img/11-office-first-day.jpg" alt="" fill sizes={SIZES_BENTO_WIDE} />
              <div className="note">
                photo · office, first day
              </div>
              <div className="scrim">
              </div>
              {' '}
              <div className="tag">
                Enterprise{' '}
                &amp;
                {' '}SMB · BGV
              </div>
              <div className="from">
                from 30 min
              </div>
              {' '}
              <div className="body">
                <div className="h">
                  Every hire, white-collar and blue
                </div>
              </div>
              {' '}
            </div>
            {' '}
            <div className="cell ph" style={{ background: '#ADB4BE' }}>
              {' '}
              <div className="light">
              </div>
              <Image className="pimg" src="/img/12-phone-signup.jpg" alt="" fill sizes={SIZES_BENTO_NARROW} />
              <div className="note">
                photo · phone, signup
              </div>
              <div className="scrim">
              </div>
              {' '}
              <div className="tag">
                KYC · Trust{' '}
                &amp;
                {' '}Safety
              </div>
              <div className="from">
                15 min
              </div>
              {' '}
              <div className="body">
                <div className="h">
                  Customers, verified at signup
                </div>
              </div>
              {' '}
            </div>
            {' '}
            <div className="cell ph" style={{ background: '#6E6C63' }}>
              {' '}
              <div className="light">
              </div>
              <Image className="pimg" src="/img/13-factory-floor.jpg" alt="" fill sizes={SIZES_BENTO_NARROW} />
              <div className="note" style={{ color: 'rgba(255,255,255,0.4)' }}>
                photo · factory floor
              </div>
              <div className="scrim">
              </div>
              {' '}
              <div className="tag">
                Vendors · Certifier
              </div>
              <div className="from">
                from 2 days
              </div>
              {' '}
              <div className="body">
                <div className="h">
                  Know who you buy from
                </div>
              </div>
              {' '}
            </div>
            {' '}
            <div className="cell ph" style={{ background: '#C9C2B4' }}>
              {' '}
              <div className="light">
              </div>
              <Image className="pimg" src="/img/14-visa-counter.jpg" alt="" fill sizes={SIZES_BENTO_NARROW} />
              <div className="note">
                photo · visa counter
              </div>
              <div className="scrim">
              </div>
              {' '}
              <div className="tag">
                Premium services
              </div>
              <div className="from">
                assisted
              </div>
              {' '}
              <div className="body">
                <div className="h">
                  Visas and healthcare credentials
                </div>
              </div>
              {' '}
            </div>
            {' '}
            <div className="cell ph" style={{ gridColumn: 'span 2', background: '#D6BCB2' }}>
              {' '}
              <div className="light">
              </div>
              <Image className="pimg" src="/img/15-home-doorway.jpg" alt="" fill sizes={SIZES_BENTO_WIDE} />
              <div className="note">
                photo · home, doorway
              </div>
              <div className="scrim">
              </div>
              {' '}
              <div className="tag">
                Consumer · HelloV
              </div>
              <div className="from">
                30 min
              </div>
              {' '}
              <div className="body">
                <div className="h">
                  The people in your home
                </div>
              </div>
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
            For the moment you need to trust someone.
          </h2>
          {' '}
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {' '}
            <div className="cell ph" style={{ background: '#B3B08F' }}>
              <div className="light">
              </div>
              <div className="scrim">
              </div>
              <div className="tag">
                Governments
              </div>
              <div className="from">
                from 3 days
              </div>
              <div className="body">
                <div className="h">
                  Licences, visas
                  <br />
                  and permits
                </div>
              </div>
            </div>
            {' '}
            <div className="cell ph" style={{ background: '#D8CBB2' }}>
              <div className="light">
              </div>
              <div className="scrim">
              </div>
              <div className="tag">
                Enterprise{' '}
                &amp;
                {' '}SMB · BGV
              </div>
              <div className="from">
                from 30 min
              </div>
              <div className="body">
                <div className="h">
                  Every hire, white-collar and blue
                </div>
              </div>
            </div>
            {' '}
            <div className="cell ph" style={{ background: '#ADB4BE' }}>
              <div className="light">
              </div>
              <div className="scrim">
              </div>
              <div className="tag">
                KYC · Trust{' '}
                &amp;
                {' '}Safety
              </div>
              <div className="from">
                15 min
              </div>
              <div className="body">
                <div className="h">
                  Customers, verified at signup
                </div>
              </div>
            </div>
            {' '}
            <div className="cell ph" style={{ background: '#6E6C63' }}>
              <div className="light">
              </div>
              <div className="scrim">
              </div>
              <div className="tag">
                Vendors · Certifier
              </div>
              <div className="from">
                from 2 days
              </div>
              <div className="body">
                <div className="h">
                  Know who you buy from
                </div>
              </div>
            </div>
            {' '}
            <div className="cell ph" style={{ background: '#C9C2B4' }}>
              <div className="light">
              </div>
              <div className="scrim">
              </div>
              <div className="tag">
                Premium services
              </div>
              <div className="from">
                assisted
              </div>
              <div className="body">
                <div className="h">
                  Visas and healthcare credentials
                </div>
              </div>
            </div>
            {' '}
            <div className="cell ph" style={{ background: '#D6BCB2' }}>
              <div className="light">
              </div>
              <div className="scrim">
              </div>
              <div className="tag">
                Consumer · HelloV
              </div>
              <div className="from">
                30 min
              </div>
              <div className="body">
                <div className="h">
                  The people in your home
                </div>
              </div>
            </div>
            {' '}
          </div>
          {' '}
        </div>
      </div>
    </>
  );
}
