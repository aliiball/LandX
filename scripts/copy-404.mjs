// Copy build/client/index.html to build/client/404.html for GitHub Pages SPA fallback.
// Required only for hash-routing demo build (R-05).
import { access, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const indexPath = resolve(root, 'build/client/index.html');
const fallbackPath = resolve(root, 'build/client/404.html');

try {
  await access(indexPath);
  await copyFile(indexPath, fallbackPath);
  console.info(`[copy-404] copied ${indexPath} -> ${fallbackPath}`);
} catch (err) {
  console.error('[copy-404] failed:', err);
  process.exit(1);
}
