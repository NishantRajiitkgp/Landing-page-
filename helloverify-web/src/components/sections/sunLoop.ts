/** The follow-the-sun map's clock and animation loop, used only by
 *  `./SunStage.tsx`.
 *
 *  WHY A CLASS OUTSIDE REACT. The loop runs 60 times a second and has to read
 *  the latest scrub/play/drag state without re-subscribing, so that state
 *  lives here, mutable, and React only hears about the changes it renders
 *  (`on.scrub`, `on.playing`, `on.now`). The same shape as the board's
 *  component fields (`this.suPlaying`, `this.suShown`, …), minus the
 *  `this.state` round-trip on every frame. It also keeps `Date.now()` —
 *  which React's purity lint rightly refuses in render — in one place.
 *
 *  THE LOOP RUNS ONLY WHILE IT HAS SOMETHING TO MOVE: the map is on screen
 *  (IntersectionObserver) and it is playing, being dragged, or has ambient
 *  motion on. Otherwise `kick()` draws one frame and it stops.
 *
 *  THE PAINTER LOADS LATE. The clock, the play/scrub state and the text it
 *  feeds React run from mount; the canvas painter (`./sunPaint`, with the
 *  land dots) is fetched as the map approaches (`lib/whenNear`), and frames
 *  before it arrives advance the state without drawing. */
import { MAP_W, offsetsAt, worldAt } from "@/lib/sunMap";
import { whenNear } from "@/lib/whenNear";
import type { SunPainter } from "./sunPaint";

const PLAY_MS = 14000;
const DAY_MS = 86400000;

type Listeners = { scrub(t: number | null): void; playing(on: boolean): void; now(t: number): void; reduce(on: boolean): void };

export class SunLoop {
  scrub: number | null = null;
  playing = false;
  still = false;
  reduce = false;
  private visible = false;
  private seen = false;
  private drag = false;
  /** A touch that has gone down but not yet moved sideways (see `pointer`). */
  private held = false;
  private x0 = 0;
  private xw = MAP_W;
  private downX = 0;
  private shown = 0;
  private play0 = 0;
  private playStart = 0;
  private raf = 0;
  private painter: SunPainter | null = null;

  constructor(
    private cv: HTMLCanvasElement,
    private labels: { noon: string; midnight: string },
    private on: Listeners,
  ) {}

  /** Observers and the 20-second clock. Returns the teardown. */
  attach(stage: HTMLElement, map: HTMLElement): () => void {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reduce = mq.matches;
    this.on.reduce(this.reduce);
    this.on.now(Date.now());
    // The drawing is the board's fixed 1200 x 434 box, scaled to the column:
    // the cards were placed by hand round the lamps, and reflowing them
    // below 1440px would stack them on each other. The phone ignores `--su-k`:
    // its canvas is sized by CSS and its cards are a list (`presence.css`).
    const ro = new ResizeObserver(() => map.style.setProperty("--su-k", String(stage.clientWidth / MAP_W)));
    ro.observe(stage);
    let auto = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        this.visible = e.isIntersecting;
        if (this.visible) this.kick();
        // The 24-hour time-lapse plays once, on its own, the first time the
        // map is properly in view — not under reduced motion or a pause.
        if (e.intersectionRatio >= 0.35 && !this.seen) {
          this.seen = true;
          if (!this.reduce && !this.still && this.scrub === null) auto = window.setTimeout(() => this.play(true), 700);
        }
      },
      { threshold: [0, 0.35] },
    );
    io.observe(stage);
    const stopNear = whenNear(stage, () => import("./sunPaint"), ({ SunPainter, readPalette }) => {
      this.painter = new SunPainter(this.cv, readPalette(stage));
      this.kick();
    });
    const tick = window.setInterval(() => {
      if (this.scrub === null) this.on.now(Date.now());
    }, 20000);
    return () => {
      stopNear();
      ro.disconnect();
      io.disconnect();
      clearInterval(tick);
      clearTimeout(auto);
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    };
  }

  /** Draw at least one more frame; the loop continues itself if it should. */
  kick() {
    if (!this.raf && this.visible) this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (tt: number) => {
    this.raf = 0;
    let t: number;
    if (this.playing) {
      const k = (tt - this.playStart) / PLAY_MS;
      if (k >= 1) {
        this.playing = false;
        this.setScrub(null);
        this.on.playing(false);
        this.on.now(Date.now());
        t = Date.now();
      } else {
        t = this.play0 + k * DAY_MS;
        const q = t - (t % 600000);
        if (q !== this.scrub) this.setScrub(q);
      }
    } else if (this.drag && this.shown) {
      t = this.shown;
    } else {
      t = this.scrub ?? Date.now();
    }
    const quiet = this.still || this.reduce;
    const p = this.painter;
    p?.draw(t, tt, worldAt(t, offsetsAt(t)), quiet, this.labels);
    // Without a painter yet, only the time-lapse needs frames; its arrival
    // kicks the loop for the rest.
    if (this.visible && (this.playing || (p && (this.drag || !quiet)))) this.raf = requestAnimationFrame(this.frame);
  };

  private setScrub(t: number | null) {
    this.scrub = t;
    this.on.scrub(t);
  }

  private stopPlay() {
    if (!this.playing) return;
    this.playing = false;
    this.on.playing(false);
  }

  play(on: boolean) {
    if (on) {
      const t0 = this.scrub ?? Date.now();
      this.play0 = t0;
      this.playStart = performance.now();
      this.setScrub(t0);
    }
    // Pausing holds the moment it reached. The board fell back to the last
    // drag position, or to live, which read as a jump.
    this.playing = on;
    this.on.playing(on);
    this.kick();
  }

  back() {
    this.stopPlay();
    this.setScrub(null);
    this.on.now(Date.now());
    this.kick();
  }

  /** Half past hour `h` UTC, on the day being shown. */
  pickHour(h: number) {
    const base = this.scrub ?? Date.now();
    this.stopPlay();
    this.setScrub(base - (base % DAY_MS) + h * 3600000 + 1800000);
    this.kick();
  }

  setStill(on: boolean) {
    this.still = on;
    if (on) this.stopPlay();
    this.kick();
  }

  /** Drag: the longitude under the pointer becomes the UTC hour at which the
   *  sun stands over it. The canvas follows the pointer exactly; the text,
   *  which re-renders React, is quantised to five minutes.
   *
   *  A TOUCH WAITS until it has moved 8px sideways, or lifts as a tap. The
   *  stage is `touch-action: pan-y`, so a vertical swipe over the map scrolls
   *  the page and ends in `cancel`; setting the time on `down`, as a mouse
   *  does, would jump the sun under every thumb that scrolls past.
   *
   *  The phone crops the canvas to the offices (`presence.css`, `object-fit`)
   *  and names the visible slice, in map px, as `--su-x0`/`--su-xw`; unset
   *  (desktop) they are the whole map. */
  pointer(kind: "down" | "move" | "up" | "cancel", clientX: number, touch = false) {
    if (kind === "down") {
      const cs = getComputedStyle(this.cv);
      this.x0 = parseFloat(cs.getPropertyValue("--su-x0")) || 0;
      this.xw = parseFloat(cs.getPropertyValue("--su-xw")) || MAP_W;
      this.downX = clientX;
      if (touch) {
        this.held = true;
        return;
      }
      this.drag = true;
    } else if (kind === "move") {
      if (this.held && Math.abs(clientX - this.downX) >= 8) {
        this.held = false;
        this.drag = true;
      }
      if (!this.drag) return;
    } else {
      const tap = kind === "up" && this.held;
      this.held = false;
      this.drag = false;
      if (!tap) return;
    }
    const r = this.cv.getBoundingClientRect();
    const x = Math.max(0, Math.min(MAP_W, this.x0 + ((clientX - r.left) * this.xw) / (r.width || MAP_W)));
    const u = (24 - (x / MAP_W) * 24) % 24;
    const base = this.scrub ?? Date.now();
    const t = base - (base % DAY_MS) + u * 3600000;
    this.shown = t;
    const q = t - (t % 300000);
    this.stopPlay();
    if (q !== this.scrub) this.setScrub(q);
    this.kick();
  }
}
