/** The relay's clock, camera and animation loop, used only by
 *  `./RelayStage.tsx`.
 *
 *  A class outside React for the reason the follow-the-sun loop was one: it
 *  runs 60 times a second and reads its own mutable state. React hears only
 *  what it renders — the journey, its step, whether it is playing, the
 *  desks' clocks (every 10 minutes of journey time) and the real time once a
 *  second for the counters. Everything that moves every frame goes straight
 *  to the DOM: `--rl-p` (progress) on the band, and on the map `--rl-cx`/`--rl-cy`/
 *  `--rl-ck` (the camera: the map point at the view's centre, CSS px per map
 *  px) and `--rl-dx`/`--rl-dy` (the document), which the pins, tags and flying
 *  document read in `presence.css` to stay on their places as the camera
 *  moves.
 *
 *  THE CAMERA eases toward the shot the journey calls for (`shotAt`): close
 *  on the hirer, each flight whole, close on the source while it checks, the
 *  hirer as the answer lands, then the whole network. Under reduced motion
 *  it holds the whole network.
 *
 *  PLAYING. The first time the map is well in view it plays the journeys in
 *  turn (`auto`), each holding on "Verified" before the next. Picking a
 *  country or touching the timeline hands control to the visitor: that
 *  journey plays once and rests. Paused, nothing moves (WCAG 2.2.2); under
 *  `prefers-reduced-motion` nothing plays on its own.
 *
 *  THE PAINTER LOADS LATE (`lib/whenNear`), with the land dots. */
import { HOLD_MS, JOURNEYS, JOURNEY_MS, JOURNEY_ORDER, at, docAt, fit, journeyTime, minutesAt, shotAt, stepAt, wide, type Cam, type Ends } from "@/lib/relayData";
import { offsetsAt, OFFICES, worldAt } from "@/lib/sunMap";
import { whenNear } from "@/lib/whenNear";
import type { RelayPainter } from "./relayPaint";

type Listeners = {
  journey(i: number): void;
  step(s: number): void;
  playing(on: boolean): void;
  desks(t: number): void;
  now(t: number): void;
  frame(p: number, mins: number): void;
};

export class RelayLoop {
  private j = 0;
  private p = 1;
  private playing = false;
  private auto = false;
  private hold = 0;
  private visible = false;
  private reduce = false;
  private seen = false;
  private raf = 0;
  private last = 0;
  private step = -1;
  private deskQ = -1;
  private vw = 1200;
  private vh = 434;
  private cam: Cam | null = null;
  private painter: RelayPainter | null = null;

  constructor(
    private cv: HTMLCanvasElement,
    private map: HTMLElement,
    private on: Listeners,
  ) {}

  attach(stage: HTMLElement): () => void {
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.on.now(Date.now());
    const ro = new ResizeObserver(() => {
      this.vw = this.map.clientWidth || 1200;
      this.vh = this.map.clientHeight || 434;
      this.painter?.resize(this.vw, this.vh);
      this.cam = null;
      this.kick();
    });
    ro.observe(this.map);
    this.emit();
    const io = new IntersectionObserver(
      ([e]) => {
        this.visible = e.isIntersecting;
        if (e.intersectionRatio >= 0.35 && !this.seen) {
          this.seen = true;
          if (!this.reduce) this.start(0, true);
        }
        this.kick();
      },
      { threshold: [0, 0.35] },
    );
    io.observe(stage);
    const stopNear = whenNear(stage, () => import("./relayPaint"), ({ RelayPainter, readPalette }) => {
      this.painter = new RelayPainter(this.cv, readPalette(stage));
      this.painter.resize(this.vw, this.vh);
      this.kick();
    });
    const tick = window.setInterval(() => {
      if (this.visible) this.on.now(Date.now());
    }, 1000);
    return () => {
      stopNear();
      ro.disconnect();
      io.disconnect();
      clearInterval(tick);
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    };
  }

  private start(i: number, auto: boolean) {
    this.j = i;
    this.p = 0;
    this.hold = 0;
    this.auto = auto;
    this.on.journey(i);
    this.setPlaying(true);
  }

  private setPlaying(on: boolean) {
    this.playing = on;
    this.on.playing(on);
    this.kick();
  }

  /** The play button: resume, or replay a finished journey. */
  toggle() {
    if (this.playing) return this.setPlaying(false);
    if (this.p >= 1) this.p = 0;
    this.setPlaying(true);
  }

  /** A country chip: that journey, from the top, once. */
  pick(i: number) {
    this.start(i, false);
  }

  /** The timeline: hold the journey at `p`. */
  scrub(p: number) {
    this.auto = false;
    if (this.playing) this.setPlaying(false);
    this.p = Math.max(0, Math.min(1, p));
    this.kick();
  }

  /** An arrow key: move the held journey by `d`, from where the loop has it
   *  (not from the last frame React saw, which lags quick presses). */
  nudge(d: number) {
    this.scrub(this.p + d);
  }

  /** Draw at least one more frame. Starting the loop afresh resets its
   *  clock, so time off screen or paused is not played back in one jump. */
  kick() {
    if (!this.raf && this.visible) {
      this.last = 0;
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  private ends(): Ends {
    const J = JOURNEYS[JOURNEY_ORDER[this.j]];
    const desk = OFFICES.find((o) => o.k === J.desk)!;
    return { src: at(J.src), dst: at(J.dst), desk };
  }

  /** Tells React what it renders, when it changes; returns the journey's instant. */
  private emit(): number {
    const J = JOURNEYS[JOURNEY_ORDER[this.j]];
    const s = stepAt(this.p);
    if (s !== this.step) {
      this.step = s;
      this.on.step(s);
    }
    const t = journeyTime(J, this.p, Date.now());
    const q = Math.floor(t / 600000);
    if (q !== this.deskQ) {
      this.deskQ = q;
      this.on.desks(t);
    }
    this.on.frame(this.p, minutesAt(J, this.p));
    return t;
  }

  private frame = (tt: number) => {
    this.raf = 0;
    const dt = this.last ? Math.min(64, tt - this.last) : 16;
    this.last = tt;
    if (this.playing) {
      if (this.p < 1) {
        this.p = Math.min(1, this.p + dt / JOURNEY_MS);
      } else if (this.auto) {
        this.hold += dt;
        if (this.hold >= HOLD_MS) this.start((this.j + 1) % JOURNEY_ORDER.length, true);
      } else {
        this.setPlaying(false);
      }
    }
    const t = this.emit();
    const e = this.ends();

    // The camera: eased toward its shot, the zoom in log space so it feels
    // even; snapped on the first frame and under reduced motion.
    const target = fit(this.reduce ? wide() : shotAt(e, this.p), this.vw, this.vh);
    let settling = false;
    if (!this.cam || this.reduce) {
      this.cam = target;
    } else {
      const a = 1 - Math.exp(-dt / 520);
      const c = this.cam;
      this.cam = { x: c.x + (target.x - c.x) * a, y: c.y + (target.y - c.y) * a, k: Math.exp(Math.log(c.k) + (Math.log(target.k) - Math.log(c.k)) * a) };
      settling = Math.abs(target.x - c.x) + Math.abs(target.y - c.y) > 0.3 || Math.abs(target.k / c.k - 1) > 0.002;
    }
    const doc = docAt(e, this.p);
    // The document's size: small in flight, large at the source while it is
    // checked and stamped, and again when it lands.
    const p = this.p;
    const grow = (a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
    const ds = p < 0.42 ? 1 : p < 0.7 ? 1 + 1.7 * grow(0.42, 0.47) : p < 0.93 ? 2.7 - 1.7 * grow(0.7, 0.76) : p < 0.985 ? 1 + 1.3 * grow(0.93, 0.97) : 1;
    const st = this.map.style;
    st.setProperty("--rl-ds", ds.toFixed(3));
    // Pulled back to the whole network, the source's tag steps aside; and a
    // tag whose point the camera has left fades, rather than being cut by
    // the map's edge.
    st.setProperty("--rl-fade", p >= 0.985 ? "1" : "0");
    const inView = (q: { x: number; y: number }) => Math.abs(q.x - this.cam!.x) * this.cam!.k < this.vw / 2 - 70 && Math.abs(q.y - this.cam!.y) * this.cam!.k < this.vh / 2 - 20;
    st.setProperty("--rl-sv", inView(e.src) ? "1" : "0");
    st.setProperty("--rl-dv", inView(e.dst) ? "1" : "0");
    st.setProperty("--rl-cx", this.cam.x.toFixed(2));
    st.setProperty("--rl-cy", this.cam.y.toFixed(2));
    st.setProperty("--rl-ck", this.cam.k.toFixed(4));
    st.setProperty("--rl-dx", doc.x.toFixed(2));
    st.setProperty("--rl-dy", doc.y.toFixed(2));

    const J = JOURNEYS[JOURNEY_ORDER[this.j]];
    this.painter?.draw(t, tt, worldAt(t, offsetsAt(t)), !this.playing || this.reduce, e, this.p, J.desk, this.cam, doc);
    if (this.visible && this.painter && (this.playing || settling)) this.raf = requestAnimationFrame(this.frame);
  };
}
