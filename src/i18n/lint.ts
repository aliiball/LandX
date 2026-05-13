// TR/EN parity linter. Exits non-zero if any key is present in one bundle and missing in the other.
// Run via `pnpm i18n:lint`.

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'src/i18n');

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...flatten(v as Record<string, unknown>, key));
    } else {
      out.push(key);
    }
  }
  return out;
}

function loadNamespace(lang: string, ns: string): string[] {
  const file = join(ROOT, lang, `${ns}.json`);
  const raw = JSON.parse(readFileSync(file, 'utf-8')) as Record<string, unknown>;
  return flatten(raw);
}

const namespaces = readdirSync(join(ROOT, 'tr'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''));

let mismatch = 0;

for (const ns of namespaces) {
  const trKeys = new Set(loadNamespace('tr', ns));
  const enKeys = new Set(loadNamespace('en', ns));

  const onlyTr = [...trKeys].filter((k) => !enKeys.has(k));
  const onlyEn = [...enKeys].filter((k) => !trKeys.has(k));

  if (onlyTr.length > 0) {
    console.error(`[i18n:lint] missing in EN/${ns}.json:`, onlyTr);
    mismatch += onlyTr.length;
  }
  if (onlyEn.length > 0) {
    console.error(`[i18n:lint] missing in TR/${ns}.json:`, onlyEn);
    mismatch += onlyEn.length;
  }
}

if (mismatch > 0) {
  console.error(`[i18n:lint] ${mismatch} parity violation(s) found`);
  process.exit(1);
}

console.info('[i18n:lint] TR/EN parity OK');
