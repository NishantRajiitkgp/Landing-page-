import Image from "next/image";
import { SIZES_AVATAR, tint } from "@/lib/img";
/** How a verification runs, end to end. */

export function HowItWorks() {
  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: '120px', paddingBottom: '140px' }}>
          {' '}
          <div className="sec-head">
            {' '}
            <h2 className="h2">
              One upload.
              <br />
              Then we get to work.
            </h2>
            {' '}
            <p className="lede" style={{ marginBottom: '8px' }}>
              A driving licence in Bengaluru, start to finish. Thirty minutes, on loop.
            </p>
            {' '}
          </div>
          {' '}
          <div className="stage" style={{ marginTop: '72px' }}>
            {' '}
            <div className="clock">
              <span>
                09:40
              </span>
              <span className="tr">
                <i>
                </i>
              </span>
              <span>
                10:10
              </span>
            </div>
            {' '}
            <div className="strack">
            </div>
            {' '}
            <div className="trail">
            </div>
            {' '}
            <div className="pk">
            </div>
            {' '}
            <div className="node" style={{ insetInlineStart: '14.25%', animationName: 'node0' }}>
            </div>
            {' '}
            <div className="node" style={{ insetInlineStart: '38.08%', animationName: 'node1' }}>
            </div>
            {' '}
            <div className="node" style={{ insetInlineStart: '61.9%', animationName: 'node2' }}>
            </div>
            {' '}
            <div className="node" style={{ insetInlineStart: '85.75%', animationName: 'node3' }}>
            </div>
            {' '}
            <div className="stlbl" style={{ insetInlineStart: '14.25%' }}>
              <b>
                Upload
              </b>
              <span>
                09:40 · candidate's phone
              </span>
            </div>
            {' '}
            <div className="stlbl" style={{ insetInlineStart: '38.08%' }}>
              <b>
                Read
              </b>
              <span>
                1.2 s · HelloVerify AI
              </span>
            </div>
            {' '}
            <div className="stlbl" style={{ insetInlineStart: '61.9%' }}>
              <b>
                Confirm
              </b>
              <span>
                RTO Karnataka · the source
              </span>
            </div>
            {' '}
            <div className="stlbl" style={{ insetInlineStart: '85.75%' }}>
              <b>
                Report
              </b>
              <span>
                10:10 · shared with HR
              </span>
            </div>
            {' '}
            <div className="panels">
              {' '}
              <div className="panel">
                {' '}
                <div className="viewf">
                  {' '}
                  <div className="lic big" style={{ animation: 'flat 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span className="lt">
                      Driving licence
                    </span>
                    <span className="lr">
                      IND
                    </span>
                    <div className="face">
                    </div>
                    <div className="ln1">
                    </div>
                    <div className="ln2">
                    </div>
                    <div className="ln3">
                    </div>
                    <div className="ln4">
                    </div>
                    <div className="holo">
                    </div>
                  </div>
                  {' '}
                  <div className="corners">
                    <i className="c1">
                    </i>
                    <i className="c2">
                    </i>
                    <i className="c3">
                    </i>
                    <i className="c4">
                    </i>
                  </div>
                  {' '}
                  <div className="flash">
                  </div>
                  {' '}
                </div>
                {' '}
                <div className="chipline" style={{ animation: 'r_cap 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                  <span className="chipok">
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '12px', height: '12px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_cap 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                    Captured
                  </span>
                  <span className="mono" style={{ color: 'var(--muted)' }}>
                    sharp · no glare · all edges
                  </span>
                </div>
                {' '}
              </div>
              {' '}
              <div className="panel">
                {' '}
                <div className="scanwrap">
                  <div className="lic small" style={{  }}>
                    <span className="lt">
                      Driving licence
                    </span>
                    <span className="lr">
                      IND
                    </span>
                    <div className="face">
                    </div>
                    <div className="ln1">
                    </div>
                    <div className="ln2">
                    </div>
                    <div className="ln3">
                    </div>
                    <div className="ln4">
                    </div>
                    <div className="holo">
                    </div>
                  </div>
                  <div className="beam">
                  </div>
                </div>
                {' '}
                <div className="flds">
                  {' '}
                  <div className="fld">
                    <span className="l">
                      Name
                    </span>
                    <span className="v tw" style={{ animation: 'tw1 12.0s steps(9) infinite' }}>
                      A. RAMESH
                    </span>
                  </div>
                  {' '}
                  <div className="fld">
                    <span className="l">
                      Licence
                    </span>
                    <span className="v tw" style={{ animation: 'tw2 12.0s steps(14) infinite' }}>
                      KA05 •••• 4812
                    </span>
                  </div>
                  {' '}
                  <div className="fld">
                    <span className="l">
                      Class
                    </span>
                    <span className="v tw" style={{ animation: 'tw3 12.0s steps(10) infinite' }}>
                      LMV · MCWG
                    </span>
                  </div>
                  {' '}
                  <div className="fld">
                    <span className="l">
                      Valid till
                    </span>
                    <span className="v tw" style={{ animation: 'tw4 12.0s steps(14) infinite' }}>
                      13 · 03 · 2039
                    </span>
                  </div>
                  {' '}
                </div>
                {' '}
                <div className="chks">
                  {' '}
                  <div className="chk" style={{ animation: 'r_c1 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_c1 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                    <span>
                      Template{' '}
                      &amp;
                      {' '}fonts
                    </span>
                    <b>
                      match
                    </b>
                  </div>
                  {' '}
                  <div className="chk" style={{ animation: 'r_c2 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_c2 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                    <span>
                      Face vs. selfie
                    </span>
                    <b>
                      98%
                    </b>
                  </div>
                  {' '}
                  <div className="chk" style={{ animation: 'r_c3 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_c3 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                    <span>
                      Issuer
                    </span>
                    <b>
                      RTO Karnataka
                    </b>
                  </div>
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
              <div className="panel">
                {' '}
                <div className="who" style={{ animation: 'r_who 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                  <div className="seal">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" stroke="#15140F" strokeWidth="1.5" strokeLinejoin="round">
                      </path>
                    </svg>
                  </div>
                  <div>
                    <div className="n">
                      Regional Transport Office
                    </div>
                    <div className="s">
                      Karnataka · issuing authority
                    </div>
                  </div>
                </div>
                {' '}
                <div className="ringwrap">
                  {' '}
                  <svg viewBox="0 0 100 100" width="104" height="104" aria-hidden="true">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#E3DFD6" strokeWidth="2">
                    </circle>
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#CFCAC0" strokeWidth="2.5" strokeLinecap="round" pathLength="100" transform="rotate(-90 50 50)" style={{ strokeDasharray: '100', strokeDashoffset: '100', animation: 'ring 12.0s linear infinite, ringdone 12.0s linear infinite' }}>
                    </circle>
                  </svg>
                  {' '}
                  <div className="rc-in">
                    <span className="wait" style={{ animation: 'waiting 12.0s linear infinite' }}>
                      waiting for
                      <br />
                      the RTO
                    </span>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '30px', height: '30px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_rto 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                  </div>
                  {' '}
                </div>
                {' '}
                <div className="evs">
                  {' '}
                  <div className="ev" style={{ animation: 'r_e1 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span className="ts">
                      09:41
                    </span>
                    <span>
                      Request filed with the issuing office
                    </span>
                  </div>
                  {' '}
                  <div className="ev ok" style={{ animation: 'r_e2 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span className="ts">
                      10:08
                    </span>
                    <span>
                      Record matched · licence valid
                    </span>
                  </div>
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
              <div className="panel">
                {' '}
                <div className="who" style={{ animation: 'r_rep 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                  <div className="ph av" style={{ background: tint("/img/21-portrait-ramesh.jpg") }}>
                    <div className="light">
                    </div>
                    <Image className="pimg" src="/img/21-portrait-ramesh.jpg" alt="" fill sizes={SIZES_AVATAR} />
                  </div>
                  <div>
                    <div className="n">
                      A. Ramesh
                    </div>
                    <div className="s">
                      Delivery rider · Bengaluru
                    </div>
                  </div>
                </div>
                {' '}
                <div className="rows">
                  {' '}
                  <div className="row" style={{ animation: 'r_r1 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span>
                      PAN
                    </span>
                    <span className="t">
                      15 min
                    </span>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_r1 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                  </div>
                  {' '}
                  <div className="row" style={{ animation: 'r_r2 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span>
                      Registration certificate
                    </span>
                    <span className="t">
                      28 min
                    </span>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_r2 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                  </div>
                  {' '}
                  <div className="row" style={{ animation: 'r_r3 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span>
                      Driving licence
                    </span>
                    <span className="t">
                      30 min
                    </span>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_r3 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                  </div>
                  {' '}
                  <div className="row" style={{ animation: 'r_r4 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span>
                      Criminal
                    </span>
                    <span className="t">
                      30 min
                    </span>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_r4 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                  </div>
                  {' '}
                </div>
                {' '}
                <div className="foot" style={{ animation: 'r_foot 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                  30 min · 4 sources
                </div>
                {' '}
                <div className="sealglow">
                </div>
                {' '}
                <div className="vseal">
                  <span>
                    Verified
                  </span>
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
          <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '40px' }}>
            {' '}
            <div className="cap">
              <div className="n">
                01
              </div>
              <div className="t">
                Upload
              </div>
              <p className="p">
                Photograph the document. Edges, glare and focus are checked before the shutter fires.
              </p>
            </div>
            {' '}
            <div className="cap">
              <div className="n">
                02
              </div>
              <div className="t">
                Read
              </div>
              <p className="p">
                AI captures every field, checks the document against itself, and finds the office that issued it.
              </p>
            </div>
            {' '}
            <div className="cap">
              <div className="n">
                03
              </div>
              <div className="t">
                Confirm
              </div>
              <p className="p">
                The request goes to the issuer. For a degree, that means the registrar — not a website that looks like one.
              </p>
            </div>
            {' '}
            <div className="cap">
              <div className="n">
                04
              </div>
              <div className="t">
                Report
              </div>
              <p className="p">
                One report, with the source named beside every result.
              </p>
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
            One upload. Then we get to work.
          </h2>
          {' '}
          <p className="lede">
            A driving licence in Bengaluru, start to finish. Thirty minutes, on loop.
          </p>
          {' '}
          <div className="clock" style={{ position: 'static', marginTop: '24px' }}>
            <span>
              09:40
            </span>
            <span className="tr" style={{ flex: '1' }}>
              <i>
              </i>
            </span>
            <span>
              10:10
            </span>
          </div>
          {' '}
          <div className="vstage">
            {' '}
            <div className="vrail">
            </div>
            <div className="vtrail">
            </div>
            <div className="vpk">
            </div>
            {' '}
            <div className="stn2">
              {' '}
              <div className="node" style={{ animationName: 'node0' }}>
              </div>
              {' '}
              <div className="stlbl2">
                <b>
                  Upload
                </b>
                <span>
                  09:40 · candidate's phone
                </span>
              </div>
              {' '}
              <div className="panel">
                {' '}
                <div className="viewf">
                  {' '}
                  <div className="lic big" style={{ animation: 'flat 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span className="lt">
                      Driving licence
                    </span>
                    <span className="lr">
                      IND
                    </span>
                    <div className="face">
                    </div>
                    <div className="ln1">
                    </div>
                    <div className="ln2">
                    </div>
                    <div className="ln3">
                    </div>
                    <div className="ln4">
                    </div>
                    <div className="holo">
                    </div>
                  </div>
                  {' '}
                  <div className="corners">
                    <i className="c1">
                    </i>
                    <i className="c2">
                    </i>
                    <i className="c3">
                    </i>
                    <i className="c4">
                    </i>
                  </div>
                  {' '}
                  <div className="flash">
                  </div>
                  {' '}
                </div>
                {' '}
                <div className="chipline" style={{ animation: 'r_cap 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                  <span className="chipok">
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '12px', height: '12px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_cap 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                    Captured
                  </span>
                  <span className="mono" style={{ color: 'var(--muted)' }}>
                    sharp · no glare · all edges
                  </span>
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div className="stn2">
              {' '}
              <div className="node" style={{ animationName: 'node1' }}>
              </div>
              {' '}
              <div className="stlbl2">
                <b>
                  Read
                </b>
                <span>
                  1.2 s · HelloVerify AI
                </span>
              </div>
              {' '}
              <div className="panel">
                {' '}
                <div className="scanwrap">
                  <div className="lic small" style={{  }}>
                    <span className="lt">
                      Driving licence
                    </span>
                    <span className="lr">
                      IND
                    </span>
                    <div className="face">
                    </div>
                    <div className="ln1">
                    </div>
                    <div className="ln2">
                    </div>
                    <div className="ln3">
                    </div>
                    <div className="ln4">
                    </div>
                    <div className="holo">
                    </div>
                  </div>
                  <div className="beam">
                  </div>
                </div>
                {' '}
                <div className="flds">
                  {' '}
                  <div className="fld">
                    <span className="l">
                      Name
                    </span>
                    <span className="v tw" style={{ animation: 'tw1 12.0s steps(9) infinite' }}>
                      A. RAMESH
                    </span>
                  </div>
                  {' '}
                  <div className="fld">
                    <span className="l">
                      Licence
                    </span>
                    <span className="v tw" style={{ animation: 'tw2 12.0s steps(14) infinite' }}>
                      KA05 •••• 4812
                    </span>
                  </div>
                  {' '}
                  <div className="fld">
                    <span className="l">
                      Class
                    </span>
                    <span className="v tw" style={{ animation: 'tw3 12.0s steps(10) infinite' }}>
                      LMV · MCWG
                    </span>
                  </div>
                  {' '}
                  <div className="fld">
                    <span className="l">
                      Valid till
                    </span>
                    <span className="v tw" style={{ animation: 'tw4 12.0s steps(14) infinite' }}>
                      13 · 03 · 2039
                    </span>
                  </div>
                  {' '}
                </div>
                {' '}
                <div className="chks">
                  {' '}
                  <div className="chk" style={{ animation: 'r_c1 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_c1 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                    <span>
                      Template{' '}
                      &amp;
                      {' '}fonts
                    </span>
                    <b>
                      match
                    </b>
                  </div>
                  {' '}
                  <div className="chk" style={{ animation: 'r_c2 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_c2 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                    <span>
                      Face vs. selfie
                    </span>
                    <b>
                      98%
                    </b>
                  </div>
                  {' '}
                  <div className="chk" style={{ animation: 'r_c3 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_c3 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                    <span>
                      Issuer
                    </span>
                    <b>
                      RTO Karnataka
                    </b>
                  </div>
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div className="stn2">
              {' '}
              <div className="node" style={{ animationName: 'node2' }}>
              </div>
              {' '}
              <div className="stlbl2">
                <b>
                  Confirm
                </b>
                <span>
                  RTO Karnataka · the source
                </span>
              </div>
              {' '}
              <div className="panel">
                {' '}
                <div className="who" style={{ animation: 'r_who 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                  <div className="seal">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" stroke="#15140F" strokeWidth="1.5" strokeLinejoin="round">
                      </path>
                    </svg>
                  </div>
                  <div>
                    <div className="n">
                      Regional Transport Office
                    </div>
                    <div className="s">
                      Karnataka · issuing authority
                    </div>
                  </div>
                </div>
                {' '}
                <div className="ringwrap">
                  {' '}
                  <svg viewBox="0 0 100 100" width="104" height="104" aria-hidden="true">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#E3DFD6" strokeWidth="2">
                    </circle>
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#CFCAC0" strokeWidth="2.5" strokeLinecap="round" pathLength="100" transform="rotate(-90 50 50)" style={{ strokeDasharray: '100', strokeDashoffset: '100', animation: 'ring 12.0s linear infinite, ringdone 12.0s linear infinite' }}>
                    </circle>
                  </svg>
                  {' '}
                  <div className="rc-in">
                    <span className="wait" style={{ animation: 'waiting 12.0s linear infinite' }}>
                      waiting for
                      <br />
                      the RTO
                    </span>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '30px', height: '30px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_rto 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                  </div>
                  {' '}
                </div>
                {' '}
                <div className="evs">
                  {' '}
                  <div className="ev" style={{ animation: 'r_e1 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span className="ts">
                      09:41
                    </span>
                    <span>
                      Request filed with the issuing office
                    </span>
                  </div>
                  {' '}
                  <div className="ev ok" style={{ animation: 'r_e2 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span className="ts">
                      10:08
                    </span>
                    <span>
                      Record matched · licence valid
                    </span>
                  </div>
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div className="stn2">
              {' '}
              <div className="node" style={{ animationName: 'node3' }}>
              </div>
              {' '}
              <div className="stlbl2">
                <b>
                  Report
                </b>
                <span>
                  10:10 · shared with HR
                </span>
              </div>
              {' '}
              <div className="panel">
                {' '}
                <div className="who" style={{ animation: 'r_rep 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                  <div className="ph av" style={{ background: tint("/img/21-portrait-ramesh.jpg") }}>
                    <div className="light">
                    </div>
                    <Image className="pimg" src="/img/21-portrait-ramesh.jpg" alt="" fill sizes={SIZES_AVATAR} />
                  </div>
                  <div>
                    <div className="n">
                      A. Ramesh
                    </div>
                    <div className="s">
                      Delivery rider · Bengaluru
                    </div>
                  </div>
                </div>
                {' '}
                <div className="rows">
                  {' '}
                  <div className="row" style={{ animation: 'r_r1 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span>
                      PAN
                    </span>
                    <span className="t">
                      15 min
                    </span>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_r1 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                  </div>
                  {' '}
                  <div className="row" style={{ animation: 'r_r2 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span>
                      Registration certificate
                    </span>
                    <span className="t">
                      28 min
                    </span>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_r2 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                  </div>
                  {' '}
                  <div className="row" style={{ animation: 'r_r3 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span>
                      Driving licence
                    </span>
                    <span className="t">
                      30 min
                    </span>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_r3 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                  </div>
                  {' '}
                  <div className="row" style={{ animation: 'r_r4 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                    <span>
                      Criminal
                    </span>
                    <span className="t">
                      30 min
                    </span>
                    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: '14px', height: '14px' }}>
                      <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="24" style={{ strokeDasharray: '24', strokeDashoffset: '24', animation: 't_r4 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                      </path>
                    </svg>
                  </div>
                  {' '}
                </div>
                {' '}
                <div className="foot" style={{ animation: 'r_foot 12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
                  30 min · 4 sources
                </div>
                {' '}
                <div className="sealglow">
                </div>
                {' '}
                <div className="vseal">
                  <span>
                    Verified
                  </span>
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
      </div>
    </>
  );
}
