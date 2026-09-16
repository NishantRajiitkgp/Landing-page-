// Dump an ordered element map (tag.class + box) for a page, for ref-vs-port diffing.
const PORT = process.env.CDP_PORT || 9222;
const [url, width, out] = process.argv.slice(2);
const W = +width;
const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
const send = (m, p = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
await new Promise(r => ws.addEventListener('open', r));
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 1000, deviceScaleFactor: 1, mobile: W < 1080 });
await send('Emulation.setScrollbarsHidden', { hidden: true });
 await send('Page.enable');
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `document.addEventListener('DOMContentLoaded', () => {
    const s = document.createElement('style');
    s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
    document.head.appendChild(s);
  });`,
});
await send('Page.navigate', { url });
await new Promise(r => setTimeout(r, 4000));
const expr = `(() => {
  const MODE = '${process.env.MODE || 'desktop'}';
  const root = document.querySelector('.page');
  const rows = [];
  const walk = (el) => {
    for (const c of el.children) {
      const cls = c.getAttribute('class') || '';
      if (cls === (MODE === 'mobile' ? 'dsk' : 'mob')) continue; // ignore the other breakpoint's tree
      if (cls === 'dsk' || cls === 'mob') { walk(c); continue; }  // transparent wrapper
      const r = c.getBoundingClientRect();
      rows.push([
        c.tagName.toLowerCase() + (cls ? '.' + cls.trim().replace(/\\s+/g, '.') : ''),
        Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height),
        (c.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 28),
      ]);
      walk(c);
    }
  };
  walk(root);
  return rows;
})()`;
const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
const fs = await import('node:fs');
fs.writeFileSync(out, JSON.stringify(r.result.value));
console.log('rows', r.result.value.length, '->', out);
await send('Target.closeTarget', { targetId: t.id });
ws.close();
