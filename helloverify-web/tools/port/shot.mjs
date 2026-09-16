// Screenshot a page region: node shot.mjs <url> <width> <y> <h> <out> [scale]
const PORT = process.env.CDP_PORT || 9222;
const [url, width, y, h, out, scale] = process.argv.slice(2);
const W = +width, Y = +y, H = +h, S = +(scale || 1);
const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await new Promise(r => ws.addEventListener('open', r));
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 1000, deviceScaleFactor: 1, mobile: W < 1080 });
await send('Page.enable');
if (process.env.NOANIM) {
  // Freeze animations before first paint: composited animation layers and
  // captureBeyondViewport disagree about offsets on very tall pages, which
  // shows up as text painted at the wrong y. Freezing also makes the ref/port
  // comparison deterministic.
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `document.addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style');
      s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
      document.head.appendChild(s);
    });`,
  });
}
await send('Page.navigate', { url });
await new Promise(r => setTimeout(r, +(process.env.WAIT || 4000)));
await new Promise(r => setTimeout(r, +(process.env.SETTLE || 0)));
const r = await send('Page.captureScreenshot', {
  format: 'png', captureBeyondViewport: true,
  clip: { x: 0, y: Y, width: W, height: H, scale: S },
});
const fs = await import('node:fs');
fs.writeFileSync(out, Buffer.from(r.data, 'base64'));
console.log('shot', out, W + 'x' + H + '@' + Y);
await send('Target.closeTarget', { targetId: t.id });
ws.close();
