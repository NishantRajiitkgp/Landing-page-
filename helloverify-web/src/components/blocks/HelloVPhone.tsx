/** HelloV WhatsApp phone — lifted verbatim from the canvas CONSUMER artboard
 *  so the consumer pages and the homepage show the identical device.
 *  Every class here is a canvas class, defined at both breakpoints — checked.
 *  lint-collisions: canvas-verbatim */
import { Tick } from "@/components/brand/Tick";

export function HelloVPhone() {
  return (
    <div className="phone2">
      {' '}
      <div className="scr">
        {' '}
        <div className="chd">
          {' '}
          <div className="cav">
            <Tick tone="inverse" />
          </div>
          {' '}
          <div>
            <div className="cnm">
              HelloV
            </div>
            <div className="cst2">
              <span className="dot live">
              </span>
              online · WhatsApp
            </div>
          </div>
          {' '}
        </div>
        {' '}
        <div className="cmsgs">
          {' '}
          <div className="b in" style={{ animation: 'm1 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            Hi Priya — who are we verifying today?
            <span className="ts">
              09:12
            </span>
          </div>
          {' '}
          <div className="b out" style={{ animation: 'm2 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            A driver for the school run. Advanced please.
            <span className="ts">
              09:13
            </span>
          </div>
          {' '}
          <div className="b in" style={{ animation: 'm3 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            Send a photo of his driving licence, front and back.
            <span className="ts">
              09:13
            </span>
          </div>
          {' '}
          <div className="b out img" style={{ animation: 'm4 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            <div className="lic chat" style={{  }}>
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
            <span className="ts">
              09:15
            </span>
          </div>
          {' '}
          <div className="typing" style={{ animation: 'ty1 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            <i>
            </i>
            <i>
            </i>
            <i>
            </i>
          </div>
          {' '}
          <div className="b in" style={{ animation: 'm5 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            Read in 1.2 s ·{' '}
            <b>
              MH12 •••• 3391
            </b>
            , valid till 2031. Checking with RTO Pune and the courts now.
            <span className="ts">
              09:15
            </span>
          </div>
          {' '}
          <div className="typing" style={{ animation: 'ty2 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            <i>
            </i>
            <i>
            </i>
            <i>
            </i>
          </div>
          {' '}
          <div className="b in rep" style={{ animation: 'm6 14.0s cubic-bezier(0.16, 1, 0.3, 1) infinite' }}>
            {' '}
            <div className="rh">
              <span className="rv">
                Verified
              </span>
              <span className="rt">
                27 min
              </span>
            </div>
            {' '}
            <div className="rr">
              <Tick />
              Driving licence · valid
            </div>
            {' '}
            <div className="rr">
              <Tick />
              Criminal record · none found
            </div>
            {' '}
            <div className="rr">
              <Tick />
              Current address · confirmed
            </div>
            {' '}
            <div className="rf">
              Report PDF · 2 pages
            </div>
            {' '}
            <span className="ts">
              09:42
            </span>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </div>
      {' '}
    </div>
  );
}
