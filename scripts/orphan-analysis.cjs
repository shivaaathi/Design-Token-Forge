/**
 * Deep analysis: Find every hex value in semantic.css and surfaces.css
 * that does NOT exist in primitives.css → these become raw values in Figma
 * instead of aliases, breaking the cascade.
 */
const fs = require('fs');

function parse(file) {
  const css = fs.readFileSync(file, 'utf-8');
  const light = {}, dark = {};
  const darkIdx = css.indexOf('[data-theme="dark"]');
  const lightBlock = darkIdx >= 0 ? css.slice(0, darkIdx) : css;
  const darkBlock  = darkIdx >= 0 ? css.slice(darkIdx)    : '';
  const re = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(lightBlock)) !== null) light[m[1]] = m[2].trim();
  re.lastIndex = 0;
  while ((m = re.exec(darkBlock)) !== null)  dark[m[1]]  = m[2].trim();
  return { light, dark };
}

const prims    = parse('packages/tokens/src/primitives.css');
const semantic = parse('packages/tokens/src/semantic.css');
const surfaces = parse('packages/tokens/src/surfaces.css');

// Build the set of ALL hex values that exist in primitives
const primHexSet = new Set();
for (const val of Object.values(prims.light)) {
  if (/^#[0-9a-fA-F]{6}$/i.test(val)) primHexSet.add(val.toUpperCase());
}
// Also add #FFFFFF and #000000 explicitly
primHexSet.add('#FFFFFF');
primHexSet.add('#000000');

console.log(`T0 Primitives: ${primHexSet.size} unique hex values\n`);

function analyzeFile(name, data) {
  let total = 0, orphans = 0;
  const orphanList = [];
  for (const theme of ['light', 'dark']) {
    for (const [varName, val] of Object.entries(data[theme])) {
      if (!/^#[0-9a-fA-F]{6}$/i.test(val)) continue;
      total++;
      if (!primHexSet.has(val.toUpperCase())) {
        orphans++;
        orphanList.push({ theme, varName, val });
      }
    }
  }
  console.log(`=== ${name} ===`);
  console.log(`  Total hex values: ${total}`);
  console.log(`  Aliased to T0:    ${total - orphans}`);
  console.log(`  Orphaned (raw):   ${orphans}`);
  console.log(`  Alias coverage:   ${((total - orphans) / total * 100).toFixed(1)}%`);
  if (orphanList.length > 0) {
    console.log(`  Orphan details:`);
    for (const o of orphanList) {
      console.log(`    [${o.theme}] --${o.varName}: ${o.val}`);
    }
  }
  console.log('');
  return { total, orphans, orphanList };
}

const semResult = analyzeFile('SEMANTIC.CSS', semantic);
const surfResult = analyzeFile('SURFACES.CSS', surfaces);

const totalOrphans = semResult.orphans + surfResult.orphans;
const totalTokens = semResult.total + surfResult.total;
console.log(`════════════════════════════════════════`);
console.log(`TOTAL: ${totalOrphans}/${totalTokens} tokens are RAW hex (no alias)`);
console.log(`       ${((totalTokens - totalOrphans) / totalTokens * 100).toFixed(1)}% alias coverage`);
console.log(`       ${totalOrphans} tokens will NOT cascade when primitives change`);
console.log(`════════════════════════════════════════`);

// Also check: which primitive palettes are actually USED by semantic/surfaces?
const usedPrimNames = new Map(); // hex → prim var name
for (const [name, val] of Object.entries(prims.light)) {
  if (/^#[0-9a-fA-F]{6}$/i.test(val)) usedPrimNames.set(val.toUpperCase(), name);
}

console.log('\nPrimitive palette usage by surfaces.css:');
const paletteUsage = {};
for (const theme of ['light', 'dark']) {
  for (const val of Object.values(surfaces[theme])) {
    if (!/^#[0-9a-fA-F]{6}$/i.test(val)) continue;
    const primName = usedPrimNames.get(val.toUpperCase());
    if (primName) {
      const palette = primName.split('-')[1]; // e.g., "greyscale" from "prim-greyscale-100"
      paletteUsage[palette] = (paletteUsage[palette] || 0) + 1;
    }
  }
}
for (const [palette, count] of Object.entries(paletteUsage).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${palette}: ${count} references`);
}

console.log('\nPrimitive palette usage by semantic.css:');
const semPaletteUsage = {};
for (const theme of ['light', 'dark']) {
  for (const val of Object.values(semantic[theme])) {
    if (!/^#[0-9a-fA-F]{6}$/i.test(val)) continue;
    const primName = usedPrimNames.get(val.toUpperCase());
    if (primName) {
      const palette = primName.split('-')[1];
      semPaletteUsage[palette] = (semPaletteUsage[palette] || 0) + 1;
    }
  }
}
for (const [palette, count] of Object.entries(semPaletteUsage).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${palette}: ${count} references`);
}
