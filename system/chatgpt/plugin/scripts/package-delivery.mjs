import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { root, repo } from './build.mjs';
import { packagePilot } from './package.mjs';
import { createDelivery } from './delivery.mjs';

const { endpoint } = JSON.parse(await readFile(resolve(root, 'config/remote-mcp.json'), 'utf8'));
await packagePilot(endpoint);
const record = await createDelivery(resolve(root, 'dist/portable/insites-chatgpt'), { endpoint });
console.log(`Delivery ready: ${resolve(repo, 'system/chatgpt/downloads/insites-chatgpt.zip')}`);
console.log(`Verified eight skills, remote MCP declarations and source digests. ZIP SHA-256: ${record.archiveSHA256}`);
console.log('No account import, installation, deployment or Git push was performed.');
