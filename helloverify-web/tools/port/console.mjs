const PORT = process.env.CDP_PORT || 9222;
const url = process.argv[2], W = +(process.argv[3] || 1440);
const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const pending = new Map(); const msgs = [];
const send = (m, p = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
await new Promise(r => ws.addEventListener('open', r));
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); return; }
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type))
    msgs.push(m.params.type + ': ' + m.params.args.map(a => a.value ?? a.description ?? a.type).join(' ').slice(0, 300));
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error')
    msgs.push('log-error: ' + m.params.entry.text.slice(0, 200));
  if (m.method === 'Runtime.exceptionThrown')
    msgs.push('exception: ' + (m.params.exceptionDetails.text || '') + ' ' + (m.params.exceptionDetails.exception?.description || '').slice(0, 200));
});
await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 1080 });
await send('Page.navigate', { url });
await new Promise(r => setTimeout(r, 6000));
console.log(msgs.length ? msgs.join('\n') : 'no console errors or warnings');
await send('Target.closeTarget', { targetId: t.id });
ws.close();
