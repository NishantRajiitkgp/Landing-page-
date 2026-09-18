import Image from "next/image";
import { AVATAR_GT } from "@/lib/img";
/** Where HelloVerify operates, and who vouches for it. */

export function Presence() {
  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: '120px', paddingBottom: '140px' }}>
          {' '}
          <div className="sec-head">
            <h2 className="h2">
              Six offices.
              <br />
              Twelve hours apart.
            </h2>
            <p className="lede" style={{ marginBottom: '8px' }}>
              From Manila to New York, office hours overlap so a request filed at night in one place is picked up in the morning somewhere else. Working hours shown in UTC; the green line is now.
            </p>
          </div>
          {' '}
          <div className="dayband">
            {' '}
            <div className="dayaxis">
              <span style={{ left: '0%' }}>
                00:00
              </span>
              <span style={{ left: '25%' }}>
                06:00
              </span>
              <span style={{ left: '50%' }}>
                12:00
              </span>
              <span style={{ left: '75%' }}>
                18:00
              </span>
              <span style={{ left: '100%' }}>
                24:00 UTC
              </span>
            </div>
            {' '}
            <div className="daygrid">
              <div className="cov" style={{ left: '4.17%', width: '87.5%' }}>
                <span>
                  Someone at a desk · 21 of 24 hours
                </span>
              </div>
              <i style={{ left: '25%' }}>
              </i>
              <i style={{ left: '50%' }}>
              </i>
              <i style={{ left: '75%' }}>
              </i>
              <div className="nowl">
              </div>
            </div>
            {' '}
            <div className="drows">
              <div className="drow">
                <div className="bar2" style={{ left: '4.17%', width: '37.5%', animationDelay: '0.0s' }}>
                  <span className="fl" style={{ width: '24px', height: '24px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="10" fill="#0038A8" />
                      <rect y="10" width="30" height="10" fill="#CE1126" />
                      <polygon points="0,0 13,10 0,20" fill="#FFFFFF" />
                      <circle cx="4.6" cy="10" r="1.7" fill="#FCD116" />
                    </svg>
                  </span>
                  <span className="bc">
                    Manila
                  </span>
                  <span className="bt">
                    09–18 local
                  </span>
                </div>
              </div>
              <div className="drow">
                <div className="bar2" style={{ left: '4.17%', width: '37.5%', animationDelay: '0.1s' }}>
                  <span className="fl" style={{ width: '24px', height: '24px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="10" fill="#EF3340" />
                      <rect y="10" width="30" height="10" fill="#FFFFFF" />
                      <circle cx="6.2" cy="5" r="2.8" fill="#FFFFFF" />
                      <circle cx="7.3" cy="5" r="2.4" fill="#EF3340" />
                    </svg>
                  </span>
                  <span className="bc">
                    Singapore
                  </span>
                  <span className="bt">
                    09–18 local
                  </span>
                </div>
              </div>
              <div className="drow">
                <div className="bar2" style={{ left: '14.58%', width: '37.5%', animationDelay: '0.2s' }}>
                  <span className="fl" style={{ width: '24px', height: '24px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="20" fill="#FFFFFF" />
                      <rect width="30" height="6.7" fill="#FF9933" />
                      <rect y="13.3" width="30" height="6.7" fill="#138808" />
                      <circle cx="15" cy="10" r="2.3" fill="none" stroke="#000080" strokeWidth="0.8" />
                    </svg>
                  </span>
                  <span className="bc">
                    Noida
                  </span>
                  <span className="bt">
                    09–18 local
                  </span>
                </div>
              </div>
              <div className="drow">
                <div className="bar2" style={{ left: '20.83%', width: '37.5%', animationDelay: '0.3s' }}>
                  <span className="fl" style={{ width: '24px', height: '24px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="6.7" fill="#00732F" />
                      <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
                      <rect y="13.3" width="30" height="6.7" fill="#15140F" />
                      <rect width="8" height="20" fill="#FF0000" />
                    </svg>
                  </span>
                  <span className="bc">
                    Dubai
                  </span>
                  <span className="bt">
                    09–18 local
                  </span>
                </div>
              </div>
              <div className="drow">
                <div className="bar2" style={{ left: '25.0%', width: '37.5%', animationDelay: '0.4s' }}>
                  <span className="fl" style={{ width: '24px', height: '24px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="6.7" fill="#CE1126" />
                      <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
                      <rect y="13.3" width="30" height="6.7" fill="#15140F" />
                      <circle cx="15" cy="10" r="1.8" fill="#C09300" />
                    </svg>
                  </span>
                  <span className="bc">
                    Cairo
                  </span>
                  <span className="bt">
                    09–18 local
                  </span>
                </div>
              </div>
              <div className="drow">
                <div className="bar2" style={{ left: '54.17%', width: '37.5%', animationDelay: '0.5s' }}>
                  <span className="fl" style={{ width: '24px', height: '24px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="20" fill="#FFFFFF" />
                      <rect y="0.00" width="30" height="1.54" fill="#B22234" />
                      <rect y="3.08" width="30" height="1.54" fill="#B22234" />
                      <rect y="6.15" width="30" height="1.54" fill="#B22234" />
                      <rect y="9.23" width="30" height="1.54" fill="#B22234" />
                      <rect y="12.31" width="30" height="1.54" fill="#B22234" />
                      <rect y="15.38" width="30" height="1.54" fill="#B22234" />
                      <rect y="18.46" width="30" height="1.54" fill="#B22234" />
                      <rect width="12" height="10.8" fill="#3C3B6E" />
                    </svg>
                  </span>
                  <span className="bc">
                    New York
                  </span>
                  <span className="bt">
                    09–18 local
                  </span>
                </div>
              </div>
            </div>
            {' '}
          </div>
          {' '}
          <div style={{ marginTop: '64px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span className="k" style={{ whiteSpace: 'nowrap' }}>
              Governments we work with
            </span>
            <div style={{ flex: '1', height: '1px', background: 'var(--hair)' }}>
            </div>
          </div>
          {' '}
          <div className="gov">
            <div className="gt">
              <Image src="/img/mom.jpg" alt="" width={AVATAR_GT} height={AVATAR_GT} />
              <div>
                <b>
                  Ministry of Manpower
                </b>
                <span>
                  Singapore
                </span>
              </div>
            </div>
            <div className="gt">
              <span className="fl" style={{ width: '36px', height: '36px' }}>
                <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="30" height="20" fill="#FFFFFF" />
                  <rect width="30" height="6.7" fill="#FF9933" />
                  <rect y="13.3" width="30" height="6.7" fill="#138808" />
                  <circle cx="15" cy="10" r="2.3" fill="none" stroke="#000080" strokeWidth="0.8" />
                </svg>
              </span>
              <div>
                <b>
                  Government of India
                </b>
                <span>
                  Authorities
                </span>
              </div>
            </div>
            <div className="gt">
              <span className="fl" style={{ width: '36px', height: '36px' }}>
                <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="30" height="20" fill="#006C35" />
                  <rect x="7" y="7.2" width="16" height="1.3" fill="#FFFFFF" rx="0.6" />
                  <rect x="9" y="11" width="12" height="1.1" fill="#FFFFFF" rx="0.5" />
                </svg>
              </span>
              <div>
                <b>
                  Kingdom of Saudi Arabia
                </b>
                <span>
                  Authorities
                </span>
              </div>
            </div>
            <div className="gt">
              <span className="fl" style={{ width: '36px', height: '36px' }}>
                <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="30" height="6.7" fill="#00732F" />
                  <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
                  <rect y="13.3" width="30" height="6.7" fill="#15140F" />
                  <rect x="3" width="8" height="20" fill="#FF0000" />
                </svg>
              </span>
              <div>
                <b>
                  United Arab Emirates
                </b>
                <span>
                  Authorities
                </span>
              </div>
            </div>
            <div className="gt">
              <span className="fl" style={{ width: '36px', height: '36px' }}>
                <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="30" height="20" fill="#003399" />
                  <circle cx="21.00" cy="10.00" r="1" fill="#FFCC00" />
                  <circle cx="20.20" cy="13.00" r="1" fill="#FFCC00" />
                  <circle cx="18.00" cy="15.20" r="1" fill="#FFCC00" />
                  <circle cx="15.00" cy="16.00" r="1" fill="#FFCC00" />
                  <circle cx="12.00" cy="15.20" r="1" fill="#FFCC00" />
                  <circle cx="9.80" cy="13.00" r="1" fill="#FFCC00" />
                  <circle cx="9.00" cy="10.00" r="1" fill="#FFCC00" />
                  <circle cx="9.80" cy="7.00" r="1" fill="#FFCC00" />
                  <circle cx="12.00" cy="4.80" r="1" fill="#FFCC00" />
                  <circle cx="15.00" cy="4.00" r="1" fill="#FFCC00" />
                  <circle cx="18.00" cy="4.80" r="1" fill="#FFCC00" />
                  <circle cx="20.20" cy="7.00" r="1" fill="#FFCC00" />
                </svg>
              </span>
              <div>
                <b>
                  European authorities
                </b>
                <span>
                  Verification workflows
                </span>
              </div>
            </div>
          </div>
          {' '}
        </div>
      </div>
      <div className="mob">
        <div className="wrap hair-top" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
          {' '}
          <h2 className="h2">
            Six offices. Twelve hours apart.
          </h2>
          <p className="lede">
            Working hours in UTC. The line is now.
          </p>
          {' '}
          <div className="dayband">
            {' '}
            <div className="dayaxis">
              <span style={{ left: '0%' }}>
                00:00
              </span>
              <span style={{ left: '25%' }}>
                06:00
              </span>
              <span style={{ left: '50%' }}>
                12:00
              </span>
              <span style={{ left: '75%' }}>
                18:00
              </span>
              <span style={{ left: '100%' }}>
                24:00 UTC
              </span>
            </div>
            {' '}
            <div className="daygrid">
              <div className="cov" style={{ left: '4.17%', width: '87.5%' }}>
                <span>
                  Someone at a desk · 21 of 24 hours
                </span>
              </div>
              <i style={{ left: '25%' }}>
              </i>
              <i style={{ left: '50%' }}>
              </i>
              <i style={{ left: '75%' }}>
              </i>
              <div className="nowl">
              </div>
            </div>
            {' '}
            <div className="drows">
              <div className="drow">
                <div className="bar2" style={{ left: '4.17%', width: '37.5%', animationDelay: '0.0s' }}>
                  <span className="fl" style={{ width: '22px', height: '22px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="10" fill="#0038A8" />
                      <rect y="10" width="30" height="10" fill="#CE1126" />
                      <polygon points="0,0 13,10 0,20" fill="#FFFFFF" />
                      <circle cx="4.6" cy="10" r="1.7" fill="#FCD116" />
                    </svg>
                  </span>
                  <span className="bc">
                    Manila
                  </span>
                </div>
              </div>
              <div className="drow">
                <div className="bar2" style={{ left: '4.17%', width: '37.5%', animationDelay: '0.1s' }}>
                  <span className="fl" style={{ width: '22px', height: '22px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="10" fill="#EF3340" />
                      <rect y="10" width="30" height="10" fill="#FFFFFF" />
                      <circle cx="6.2" cy="5" r="2.8" fill="#FFFFFF" />
                      <circle cx="7.3" cy="5" r="2.4" fill="#EF3340" />
                    </svg>
                  </span>
                  <span className="bc">
                    Singapore
                  </span>
                </div>
              </div>
              <div className="drow">
                <div className="bar2" style={{ left: '14.58%', width: '37.5%', animationDelay: '0.2s' }}>
                  <span className="fl" style={{ width: '22px', height: '22px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="20" fill="#FFFFFF" />
                      <rect width="30" height="6.7" fill="#FF9933" />
                      <rect y="13.3" width="30" height="6.7" fill="#138808" />
                      <circle cx="15" cy="10" r="2.3" fill="none" stroke="#000080" strokeWidth="0.8" />
                    </svg>
                  </span>
                  <span className="bc">
                    Noida
                  </span>
                </div>
              </div>
              <div className="drow">
                <div className="bar2" style={{ left: '20.83%', width: '37.5%', animationDelay: '0.3s' }}>
                  <span className="fl" style={{ width: '22px', height: '22px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="6.7" fill="#00732F" />
                      <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
                      <rect y="13.3" width="30" height="6.7" fill="#15140F" />
                      <rect width="8" height="20" fill="#FF0000" />
                    </svg>
                  </span>
                  <span className="bc">
                    Dubai
                  </span>
                </div>
              </div>
              <div className="drow">
                <div className="bar2" style={{ left: '25.0%', width: '37.5%', animationDelay: '0.4s' }}>
                  <span className="fl" style={{ width: '22px', height: '22px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="6.7" fill="#CE1126" />
                      <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
                      <rect y="13.3" width="30" height="6.7" fill="#15140F" />
                      <circle cx="15" cy="10" r="1.8" fill="#C09300" />
                    </svg>
                  </span>
                  <span className="bc">
                    Cairo
                  </span>
                </div>
              </div>
              <div className="drow">
                <div className="bar2" style={{ left: '54.17%', width: '37.5%', animationDelay: '0.5s' }}>
                  <span className="fl" style={{ width: '22px', height: '22px' }}>
                    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="30" height="20" fill="#FFFFFF" />
                      <rect y="0.00" width="30" height="1.54" fill="#B22234" />
                      <rect y="3.08" width="30" height="1.54" fill="#B22234" />
                      <rect y="6.15" width="30" height="1.54" fill="#B22234" />
                      <rect y="9.23" width="30" height="1.54" fill="#B22234" />
                      <rect y="12.31" width="30" height="1.54" fill="#B22234" />
                      <rect y="15.38" width="30" height="1.54" fill="#B22234" />
                      <rect y="18.46" width="30" height="1.54" fill="#B22234" />
                      <rect width="12" height="10.8" fill="#3C3B6E" />
                    </svg>
                  </span>
                  <span className="bc">
                    New York
                  </span>
                </div>
              </div>
            </div>
            {' '}
          </div>
          {' '}
          <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span className="k" style={{ whiteSpace: 'nowrap' }}>
              Governments we work with
            </span>
            <div style={{ flex: '1', height: '1px', background: 'var(--hair)' }}>
            </div>
          </div>
          {' '}
          <div className="gov" style={{ gridTemplateColumns: '1fr', gap: '10px' }}>
            <div className="gt">
              <Image src="/img/mom.jpg" alt="" width={AVATAR_GT} height={AVATAR_GT} />
              <div>
                <b>
                  Ministry of Manpower
                </b>
                <span>
                  Singapore
                </span>
              </div>
            </div>
            <div className="gt">
              <span className="fl" style={{ width: '36px', height: '36px' }}>
                <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="30" height="20" fill="#FFFFFF" />
                  <rect width="30" height="6.7" fill="#FF9933" />
                  <rect y="13.3" width="30" height="6.7" fill="#138808" />
                  <circle cx="15" cy="10" r="2.3" fill="none" stroke="#000080" strokeWidth="0.8" />
                </svg>
              </span>
              <div>
                <b>
                  Government of India
                </b>
                <span>
                  Authorities
                </span>
              </div>
            </div>
            <div className="gt">
              <span className="fl" style={{ width: '36px', height: '36px' }}>
                <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="30" height="20" fill="#006C35" />
                  <rect x="7" y="7.2" width="16" height="1.3" fill="#FFFFFF" rx="0.6" />
                  <rect x="9" y="11" width="12" height="1.1" fill="#FFFFFF" rx="0.5" />
                </svg>
              </span>
              <div>
                <b>
                  Kingdom of Saudi Arabia
                </b>
                <span>
                  Authorities
                </span>
              </div>
            </div>
            <div className="gt">
              <span className="fl" style={{ width: '36px', height: '36px' }}>
                <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="30" height="6.7" fill="#00732F" />
                  <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
                  <rect y="13.3" width="30" height="6.7" fill="#15140F" />
                  <rect x="3" width="8" height="20" fill="#FF0000" />
                </svg>
              </span>
              <div>
                <b>
                  United Arab Emirates
                </b>
                <span>
                  Authorities
                </span>
              </div>
            </div>
            <div className="gt">
              <span className="fl" style={{ width: '36px', height: '36px' }}>
                <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="30" height="20" fill="#003399" />
                  <circle cx="21.00" cy="10.00" r="1" fill="#FFCC00" />
                  <circle cx="20.20" cy="13.00" r="1" fill="#FFCC00" />
                  <circle cx="18.00" cy="15.20" r="1" fill="#FFCC00" />
                  <circle cx="15.00" cy="16.00" r="1" fill="#FFCC00" />
                  <circle cx="12.00" cy="15.20" r="1" fill="#FFCC00" />
                  <circle cx="9.80" cy="13.00" r="1" fill="#FFCC00" />
                  <circle cx="9.00" cy="10.00" r="1" fill="#FFCC00" />
                  <circle cx="9.80" cy="7.00" r="1" fill="#FFCC00" />
                  <circle cx="12.00" cy="4.80" r="1" fill="#FFCC00" />
                  <circle cx="15.00" cy="4.00" r="1" fill="#FFCC00" />
                  <circle cx="18.00" cy="4.80" r="1" fill="#FFCC00" />
                  <circle cx="20.20" cy="7.00" r="1" fill="#FFCC00" />
                </svg>
              </span>
              <div>
                <b>
                  European authorities
                </b>
                <span>
                  Verification workflows
                </span>
              </div>
            </div>
          </div>
          {' '}
        </div>
      </div>
    </>
  );
}
