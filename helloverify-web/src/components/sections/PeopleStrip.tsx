import Image from "next/image";
import { SIZES_PERSON, tint } from "@/lib/img";
/** Drifting strip of verified people; the track is duplicated so the loop is seamless. */

export function PeopleStrip() {
  return (
    <>
      <div className="dsk">
        <div className="rise d6" style={{ padding: '40px 0 8px', overflow: 'hidden' }}>
          {' '}
          <div className="track">
            {' '}
            <div className="person ph" style={{ width: '300px', height: '420px', background: tint("/img/01-rider-bengaluru.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/01-rider-bengaluru.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · delivery rider
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Driving licence · 30 min
              </div>
              <div className="who">
                <div className="role">
                  Delivery rider
                </div>
                <div className="city">
                  Bengaluru
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '340px', height: '470px', background: tint("/img/02-nurse-abudhabi.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/02-nurse-abudhabi.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · nurse
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Degree · 3 days
              </div>
              <div className="who">
                <div className="role">
                  Nurse
                </div>
                <div className="city">
                  Abu Dhabi
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '290px', height: '390px', background: tint("/img/03-engineer-manila.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/03-engineer-manila.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · engineer
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Employment · 60 min
              </div>
              <div className="who">
                <div className="role">
                  Software engineer
                </div>
                <div className="city">
                  Manila
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '320px', height: '440px', background: tint("/img/04-nanny-gurugram.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/04-nanny-gurugram.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · nanny
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Criminal · 30 min
              </div>
              <div className="who">
                <div className="role">
                  Nanny
                </div>
                <div className="city">
                  Gurugram
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '300px', height: '400px', background: tint("/img/05-warehouse-pune.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/05-warehouse-pune.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note" style={{ color: 'rgba(255,255,255,0.4)' }}>
                photo · warehouse
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot live">
                </span>
                Reading Aadhaar…
              </div>
              <div className="who">
                <div className="role">
                  Warehouse associate
                </div>
                <div className="city">
                  Pune · identity check, 00:41 elapsed
                </div>
                <div className="progress">
                  <span>
                  </span>
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '330px', height: '460px', background: tint("/img/06-supplier-cairo.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/06-supplier-cairo.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · supplier
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Trade licence · 2 days
              </div>
              <div className="who">
                <div className="role">
                  Textile supplier
                </div>
                <div className="city">
                  Cairo
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '290px', height: '410px', background: tint("/img/07-tenant-singapore.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/07-tenant-singapore.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · tenant
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Identity · 15 min
              </div>
              <div className="who">
                <div className="role">
                  Tenant
                </div>
                <div className="city">
                  Singapore
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '310px', height: '430px', background: tint("/img/08-cfo-london.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/08-cfo-london.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · executive
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Global database · 15 min
              </div>
              <div className="who">
                <div className="role">
                  Chief financial officer
                </div>
                <div className="city">
                  London
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '300px', height: '420px', background: tint("/img/01-rider-bengaluru.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/01-rider-bengaluru.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · delivery rider
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Driving licence · 30 min
              </div>
              <div className="who">
                <div className="role">
                  Delivery rider
                </div>
                <div className="city">
                  Bengaluru
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '340px', height: '470px', background: tint("/img/02-nurse-abudhabi.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/02-nurse-abudhabi.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · nurse
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Degree · 3 days
              </div>
              <div className="who">
                <div className="role">
                  Nurse
                </div>
                <div className="city">
                  Abu Dhabi
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '290px', height: '390px', background: tint("/img/03-engineer-manila.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/03-engineer-manila.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · engineer
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Employment · 60 min
              </div>
              <div className="who">
                <div className="role">
                  Software engineer
                </div>
                <div className="city">
                  Manila
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '320px', height: '440px', background: tint("/img/04-nanny-gurugram.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/04-nanny-gurugram.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · nanny
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Criminal · 30 min
              </div>
              <div className="who">
                <div className="role">
                  Nanny
                </div>
                <div className="city">
                  Gurugram
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '300px', height: '400px', background: tint("/img/05-warehouse-pune.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/05-warehouse-pune.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note" style={{ color: 'rgba(255,255,255,0.4)' }}>
                photo · warehouse
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot live">
                </span>
                Reading Aadhaar…
              </div>
              <div className="who">
                <div className="role">
                  Warehouse associate
                </div>
                <div className="city">
                  Pune · identity check, 00:41 elapsed
                </div>
                <div className="progress">
                  <span>
                  </span>
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '330px', height: '460px', background: tint("/img/06-supplier-cairo.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/06-supplier-cairo.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · supplier
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Trade licence · 2 days
              </div>
              <div className="who">
                <div className="role">
                  Textile supplier
                </div>
                <div className="city">
                  Cairo
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '290px', height: '410px', background: tint("/img/07-tenant-singapore.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/07-tenant-singapore.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · tenant
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Identity · 15 min
              </div>
              <div className="who">
                <div className="role">
                  Tenant
                </div>
                <div className="city">
                  Singapore
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '310px', height: '430px', background: tint("/img/08-cfo-london.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/08-cfo-london.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="note">
                photo · executive
              </div>
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Global database · 15 min
              </div>
              <div className="who">
                <div className="role">
                  Chief financial officer
                </div>
                <div className="city">
                  London
                </div>
              </div>
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
        <div className="wrap" style={{ paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: 'var(--muted)' }}>
          {' '}
          <span>
            Hires, tenants, drivers, suppliers, nannies. Anyone you need to trust.
          </span>
          {' '}
          <span className="mono" style={{ color: 'var(--faint)' }}>
            Times shown are from upload to report
          </span>
          {' '}
        </div>
      </div>
      <div className="mob">
        <div style={{ padding: '12px 0 0', overflow: 'hidden' }}>
          {' '}
          <div className="track">
            {' '}
            <div className="person ph" style={{ width: '200px', height: '270px', background: tint("/img/01-rider-bengaluru.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/01-rider-bengaluru.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Licence · 30 min
              </div>
              <div className="who">
                <div className="role">
                  Delivery rider
                </div>
                <div className="city">
                  Bengaluru
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '220px', height: '300px', background: tint("/img/02-nurse-abudhabi.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/02-nurse-abudhabi.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Degree · 3 days
              </div>
              <div className="who">
                <div className="role">
                  Nurse
                </div>
                <div className="city">
                  Abu Dhabi
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '190px', height: '250px', background: tint("/img/03-engineer-manila.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/03-engineer-manila.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Employment · 60 min
              </div>
              <div className="who">
                <div className="role">
                  Software engineer
                </div>
                <div className="city">
                  Manila
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '200px', height: '280px', background: tint("/img/04-nanny-gurugram.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/04-nanny-gurugram.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Criminal · 30 min
              </div>
              <div className="who">
                <div className="role">
                  Nanny
                </div>
                <div className="city">
                  Gurugram
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '200px', height: '260px', background: tint("/img/05-warehouse-pune.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/05-warehouse-pune.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot live">
                </span>
                Reading Aadhaar…
              </div>
              <div className="who">
                <div className="role">
                  Warehouse associate
                </div>
                <div className="city">
                  Pune · 00:41 elapsed
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '210px', height: '290px', background: tint("/img/06-supplier-cairo.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/06-supplier-cairo.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Trade licence · 2 days
              </div>
              <div className="who">
                <div className="role">
                  Textile supplier
                </div>
                <div className="city">
                  Cairo
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '200px', height: '270px', background: tint("/img/01-rider-bengaluru.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/01-rider-bengaluru.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Licence · 30 min
              </div>
              <div className="who">
                <div className="role">
                  Delivery rider
                </div>
                <div className="city">
                  Bengaluru
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '220px', height: '300px', background: tint("/img/02-nurse-abudhabi.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/02-nurse-abudhabi.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Degree · 3 days
              </div>
              <div className="who">
                <div className="role">
                  Nurse
                </div>
                <div className="city">
                  Abu Dhabi
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '190px', height: '250px', background: tint("/img/03-engineer-manila.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/03-engineer-manila.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Employment · 60 min
              </div>
              <div className="who">
                <div className="role">
                  Software engineer
                </div>
                <div className="city">
                  Manila
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '200px', height: '280px', background: tint("/img/04-nanny-gurugram.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/04-nanny-gurugram.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Criminal · 30 min
              </div>
              <div className="who">
                <div className="role">
                  Nanny
                </div>
                <div className="city">
                  Gurugram
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '200px', height: '260px', background: tint("/img/05-warehouse-pune.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/05-warehouse-pune.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot live">
                </span>
                Reading Aadhaar…
              </div>
              <div className="who">
                <div className="role">
                  Warehouse associate
                </div>
                <div className="city">
                  Pune · 00:41 elapsed
                </div>
              </div>
            </div>
            {' '}
            <div className="person ph" style={{ width: '210px', height: '290px', background: tint("/img/06-supplier-cairo.jpg") }}>
              <div className="light">
              </div>
              <Image className="pimg" src="/img/06-supplier-cairo.jpg" alt="" fill sizes={SIZES_PERSON} loading="eager" />
              <div className="scrim">
              </div>
              <div className="chip">
                <span className="dot">
                </span>
                Trade licence · 2 days
              </div>
              <div className="who">
                <div className="role">
                  Textile supplier
                </div>
                <div className="city">
                  Cairo
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
