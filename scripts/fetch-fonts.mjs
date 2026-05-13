// Fetch Geist + JetBrains Mono variable woff2 files into public/fonts/.
// Idempotent — skips if files already exist.
import { access, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const fontsDir = resolve(process.cwd(), 'public/fonts');
await mkdir(fontsDir, { recursive: true });

const fonts = [
  {
    name: 'geist-variable.woff2',
    url: 'https://cdn.jsdelivr.net/npm/@fontsource-variable/geist@5.1.0/files/geist-latin-wght-normal.woff2',
  },
  {
    name: 'jetbrains-mono-variable.woff2',
    url: 'https://cdn.jsdelivr.net/npm/@fontsource-variable/jetbrains-mono@5.1.0/files/jetbrains-mono-latin-wght-normal.woff2',
  },
];

for (const font of fonts) {
  const target = resolve(fontsDir, font.name);
  try {
    await access(target);
    console.info(`[fetch-fonts] ${font.name} exists — skipping`);
    continue;
  } catch {
    /* not present, fetch */
  }
  console.info(`[fetch-fonts] downloading ${font.name} from ${font.url}`);
  const res = await fetch(font.url);
  if (!res.ok) {
    console.error(`[fetch-fonts] failed: HTTP ${res.status} for ${font.url}`);
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(target, buf);
  console.info(`[fetch-fonts] wrote ${target} (${buf.byteLength} bytes)`);
}

console.info('[fetch-fonts] done');
