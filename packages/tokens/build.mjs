/**
 * Build script for @design-token-forge/tokens
 * Processes each CSS source file through PostCSS → dist/
 */
import { readdir } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const SRC = 'src';
const DIST = 'dist';

const files = (await readdir(SRC)).filter(f => f.endsWith('.css'));

execSync(`mkdir -p ${DIST}`);

for (const file of files) {
  const src = join(SRC, file);
  const out = join(DIST, file);
  console.log(`  ${src} → ${out}`);
  execSync(`npx postcss ${src} --no-map -o ${out}`, { stdio: 'inherit' });
}

console.log(`✓ Built ${files.length} token files to ${DIST}/`);
