/**
 * Build script for @design-token-forge/components
 * Processes:
 *   1. All-in-one dist/index.css (from src/index.css)
 *   2. Per-component dist/{name}/index.css bundles
 */
import { readdir, stat, writeFile, mkdir } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { join, basename } from 'node:path';

const SRC = 'src';
const DIST = 'dist';

execSync(`rm -rf ${DIST}`);
await mkdir(DIST, { recursive: true });

// 1. Build the all-in-one entry
console.log('  src/index.css → dist/index.css');
execSync(`npx postcss ${SRC}/index.css --no-map -o ${DIST}/index.css`, { stdio: 'inherit' });

// 2. Build per-component bundles
const entries = await readdir(SRC);
let count = 0;

for (const entry of entries) {
  const srcDir = join(SRC, entry);
  const s = await stat(srcDir);
  if (!s.isDirectory()) continue;

  const outDir = join(DIST, entry);
  await mkdir(outDir, { recursive: true });

  // Check if component has its own index.css
  const hasIndex = await stat(join(srcDir, 'index.css')).then(() => true, () => false);
  const name = entry; // e.g. "button", "checkbox"

  let inputFile;
  if (hasIndex) {
    inputFile = join(srcDir, 'index.css');
  } else {
    // Create a temporary entry that imports tokens + styles
    const tokensFile = `${name}.tokens.css`;
    const stylesFile = `${name}.css`;
    const tmpEntry = join(srcDir, '_entry.tmp.css');
    await writeFile(tmpEntry, `@import './${tokensFile}';\n@import './${stylesFile}';\n`);
    inputFile = tmpEntry;
  }

  const outFile = join(outDir, 'index.css');
  console.log(`  ${inputFile} → ${outFile}`);
  execSync(`npx postcss ${inputFile} --no-map -o ${outFile}`, { stdio: 'inherit' });

  // Clean up temp file if created
  if (!hasIndex) {
    const { unlink } = await import('node:fs/promises');
    await unlink(join(srcDir, '_entry.tmp.css'));
  }

  count++;
}

console.log(`✓ Built all-in-one + ${count} per-component bundles to ${DIST}/`);
