/** Prints one element and nothing around it; see `.is-print` in momorg.css. */
export function printOnly(el: HTMLElement | null) {
  if (!el) return;
  el.classList.add("is-print");
  const done = () => {
    el.classList.remove("is-print");
    window.removeEventListener("afterprint", done);
  };
  window.addEventListener("afterprint", done);
  window.print();
}
