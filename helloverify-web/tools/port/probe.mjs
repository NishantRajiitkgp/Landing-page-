// Minimal CDP driver: launch-less (attaches to a running chrome --remote-debugging-port),
// sets a mobile-ish viewport, evaluates an expression, optionally screenshots.
const PORT = process.env.CDP_PORT || 9222;
const url = process.argv[2];
const width = +(process.argv[3] || 390);
const height = +(process.argv[4] || 800);
const expr = process.argv[5];
const shot = process.argv[6];

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();
const ws = new WebSocket(targets.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await new Promise(r => ws.addEventListener('open', r));
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
});
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 900 });
await send('Page.enable');
await send('Page.navigate', { url });
await new Promise(r => setTimeout(r, 3500));
if (expr) {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  console.log(JSON.stringify(r.result?.value ?? r, null, 2));
}
if (shot) {
  const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const fs = await import('node:fs');
  fs.writeFileSync(shot, Buffer.from(r.data, 'base64'));
  console.log('shot', shot);
}
await send('Target.closeTarget', { targetId: targets.id });
ws.close();
