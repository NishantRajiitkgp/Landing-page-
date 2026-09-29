/** Load a canvas engine only when its section comes near the viewport.
 *
 *  The homepage's canvas islands (globe, trust network, follow-the-sun map,
 *  enterprise rings) render their markup and controls from the eager island,
 *  and fetch the drawing code through this: a dynamic `import()` started the
 *  first time `el` is within `margin` of the viewport, so the engines stay out
 *  of the JS the page's HTML loads up front. An element that never lays out
 *  (a desktop-only stage hidden on a phone) never intersects, so its engine
 *  is never fetched.
 *
 *  `start` runs once, after mount, with the loaded module, and may return its
 *  own teardown. The returned function cancels everything: it is safe to call
 *  before the import resolves (then `start` never runs). */
export function whenNear<M>(
  el: Element,
  load: () => Promise<M>,
  start: (mod: M) => (() => void) | void,
  margin = "1000px 0px",
): () => void {
  let dead = false;
  let stop: (() => void) | void;
  const go = () => {
    io.disconnect();
    load().then(
      (m) => {
        if (!dead) stop = start(m);
      },
      // A failed chunk leaves the static first paint in place; nothing to do.
      () => {},
    );
  };
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) go();
    },
    { rootMargin: margin },
  );
  io.observe(el);
  return () => {
    dead = true;
    io.disconnect();
    stop?.();
  };
}
