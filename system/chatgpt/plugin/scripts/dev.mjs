import { spawn } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'node:net';
import { root } from './build.mjs';
import { packagePilot } from './package.mjs';
import { startHttp } from '../server/http.mjs';

const port = Number(process.env.PORT ?? 8787);
// Refuse to expose an unrelated process already listening on the desired port.
await new Promise((resolvePort, reject) => {
  const probe = createServer();
  probe.once('error', () => reject(new Error(`Port ${port} is already in use. Use the running pilot or choose a free PORT.`)));
  probe.listen(port, '127.0.0.1', () => probe.close(resolvePort));
});
const mode = process.argv.includes('--cloudflare') ? 'cloudflare' : 'ngrok';
// Never read or copy tunnel credentials. Use the agent's existing configuration.
const executable = mode === 'ngrok' ? 'ngrok.exe' : 'cloudflared.exe';
const args = mode === 'ngrok' ? ['http', `http://127.0.0.1:${port}`, '--inspect=false', '--log=stdout', '--log-format=json'] : ['tunnel', '--url', `http://127.0.0.1:${port}`, '--no-autoupdate'];
const tunnel = spawn(executable, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
let http;
function stop() { http?.close(); tunnel.kill(); }
process.on('SIGINT', () => { stop(); process.exit(0); });
process.on('SIGTERM', () => { stop(); process.exit(0); });
process.on('exit', stop);
try {
  const publicUrl = await new Promise((resolveUrl, reject) => {
    let settled = false;
    const timer = setTimeout(() => { settled = true; reject(new Error('Tunnel URL was not received in 30 seconds. Check tunnel account configuration.')); }, 30000);
    const consume = () => {
      let pending = '';
      return chunk => {
      if (settled) return;
      pending += chunk.toString();
      const lines = pending.split('\n'); pending = lines.pop();
      for (const line of lines) {
        if (mode === 'ngrok') {
          try { const record = JSON.parse(line); if (record.msg === 'started tunnel' && record.url?.startsWith('https://')) { settled = true; clearTimeout(timer); resolveUrl(record.url); return; } } catch { /* log chunks can be partial */ }
        } else {
          const match = line.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/); if (match) { settled = true; clearTimeout(timer); resolveUrl(match[0]); return; }
        }
      }
      };
    };
    tunnel.stdout.on('data', consume()); tunnel.stderr.on('data', consume());
    tunnel.once('error', () => { clearTimeout(timer); settled = true; reject(new Error(`${executable} could not start. Install or configure the tunnel agent.`)); });
    tunnel.once('exit', code => { if (!settled) { clearTimeout(timer); settled = true; reject(new Error(`Tunnel exited (${code}). Check the tunnel account locally; no credentials were read.`)); } });
  });
  http = await startHttp({ port, publicUrl });
  const endpoint = `${publicUrl}/mcp`;
  await mkdir(resolve(root, 'artifacts'), { recursive: true });
  await writeFile(resolve(root, 'artifacts/session.json'), JSON.stringify({ endpoint, port, serverPid: process.pid, tunnelPid: tunnel.pid, tunnel: mode }, null, 2));
  await packagePilot(endpoint);
  console.log(`MCP URL: ${endpoint}\nLocal simulated-host preview: http://127.0.0.1:${port}/preview\nPress Ctrl+C to stop the local server and this tunnel.`);
  tunnel.once('exit', () => { console.error('Tunnel stopped. The MCP URL is no longer available.'); http.close(); });
} catch (error) { console.error(error.message); stop(); process.exitCode = 1; }
