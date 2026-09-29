#!/usr/bin/env node
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directory = fileURLToPath(new URL('../', import.meta.url));
const environment = path.join(directory, '.env');
if (!existsSync(environment)) {
  let source = readFileSync(path.join(directory, '.env.example'), 'utf8');
  source = source.replaceAll('CHANGE-ME', () =>
    randomBytes(32).toString('hex')
  );
  writeFileSync(environment, source, { mode: 0o600 });
}
let wpEnvironment = readFileSync(environment, 'utf8');
if (!/^BDK_PREVIEW_SECRET=.+$/m.test(wpEnvironment)) {
  wpEnvironment += `\nBDK_PREVIEW_SECRET=${randomBytes(32).toString('hex')}\n`;
  writeFileSync(environment, wpEnvironment, { mode: 0o600 });
}
mkdirSync(path.join(directory, 'scripts/.local'), { recursive: true });
function compose(...args) {
  const result = spawnSync('docker', ['compose', ...args], {
    cwd: directory,
    stdio: 'inherit',
  });
  if (result.error || result.status !== 0)
    throw new Error(`Docker ${args[0]} failed; credentials were not printed.`);
}
compose('up', '-d');
// Wait for the HTTP installer/core to finish copying before invoking WP-CLI.
const url = readFileSync(environment, 'utf8')
  .match(/^WP_SITEURL=(.+)$/m)?.[1]
  .trim();
if (!url) throw new Error('WP_SITEURL is required in the local environment.');
let ready = false;
for (let attempt = 0; attempt < 60; attempt++) {
  try {
    const response = await fetch(`${url}/wp-admin/install.php`, {
      signal: AbortSignal.timeout(2000),
    });
    if (response.ok) {
      ready = true;
      break;
    }
  } catch {
    /* Startup only; the final failure is explicit. */
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
if (!ready)
  throw new Error(
    'WordPress did not become ready within 60 attempts. Inspect Docker service logs.'
  );
compose('run', '--rm', 'cli', 'sh', '/scripts/init.sh');
const credentials = JSON.parse(
  readFileSync(path.join(directory, 'scripts/.local/credentials.json'), 'utf8')
);
const auth = Buffer.from(
  `${credentials.username}:${credentials.applicationPassword}`
).toString('base64');
const response = await fetch(
  `${credentials.url}/wp-json/wp/v2/posts?context=edit&per_page=1`,
  { headers: { Authorization: `Basic ${auth}` }, redirect: 'error' }
);
if (!response.ok)
  throw new Error(
    `Persisted application credential check failed: HTTP ${response.status}. No automatic credential rotation performed.`
  );
const preview = JSON.parse(
  readFileSync(
    path.join(directory, 'scripts/.local/preview-credentials.json'),
    'utf8'
  )
);
const appEnvironment = path.resolve(directory, '../bdkinc/.env');
let source = existsSync(appEnvironment)
  ? readFileSync(appEnvironment, 'utf8')
  : '';
const previewSecret = wpEnvironment
  .match(/^BDK_PREVIEW_SECRET=(.+)$/m)?.[1]
  .trim();
const previewAudience = wpEnvironment.match(/^FRONTEND_URL=(.+)$/m)?.[1].trim();
for (const [key, value] of Object.entries({
  WORDPRESS_URL: preview.url,
  WORDPRESS_USERNAME: preview.username,
  WORDPRESS_APPLICATION_PASSWORD: preview.applicationPassword,
  BDK_PREVIEW_SECRET: previewSecret,
  BDK_PREVIEW_AUDIENCE: previewAudience,
})) {
  source = source.replace(new RegExp(`^${key}=.*(?:\\r?\\n|$)`, 'gm'), '');
  if (source && !source.endsWith('\n')) source += '\n';
  source += `${key}=${JSON.stringify(value)}\n`;
}
writeFileSync(appEnvironment, source, { mode: 0o600 });
console.log(
  'WordPress ready. Credentials saved only in ignored local files; no values emitted. Run wp:seed next.'
);
