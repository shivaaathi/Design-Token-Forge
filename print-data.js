const fs = require('fs');
const d = JSON.parse(fs.readFileSync('figma-extracted.json','utf8'));

// PRIMITIVES - format as JS objects for the HTML
console.log('===== PRIMITIVES =====');
for (const [pal, colors] of Object.entries(d.primitives)) {
  const hexes = colors.map(c => `'${c.hex}'`).join(',');
  const steps = colors.map(c => `'${c.step}'`).join(',');
  console.log(`  '${pal}': {colors:[${hexes}], steps:[${steps}]},`);
}

// T1 COLORS - surface tokens light/dark
console.log('\n===== SURFACE TOKENS (from T1) =====');
const surfNames = ['surface/base', 'surface/bright', 'surface/deep', 'surface/accent', 'surface/dim', 
  'surfacecontainer', 'surfaceovercontainer', 'float', 'inversesurface'];
for (const sn of surfNames) {
  console.log(`\n--- ${sn} ---`);
  for (const [key, val] of Object.entries(d.colorsMaster)) {
    if (key.startsWith(sn + '/') || key.startsWith(sn.replace('/', '/'))) {
      const shortKey = key.replace(sn + '/', '');
      const light = typeof val.light === 'string' && val.light.startsWith('alias:') ? val.light : val.light;
      const dark = typeof val.dark === 'string' && val.dark.startsWith('alias:') ? val.dark : val.dark;
      console.log(`  ${shortKey}: L=${light} D=${dark}`);
    }
  }
}

// SEMANTIC ROLE TOKENS (from T1)
console.log('\n===== SEMANTIC ROLE TOKENS =====');
const roles = ['brand', 'primary', 'success', 'warning', 'danger', 'info'];
for (const role of roles) {
  console.log(`\n--- ${role} ---`);
  for (const [key, val] of Object.entries(d.colorsMaster)) {
    if (key.startsWith(`semantic/${role}/`) || key.startsWith(`semantic/on${role}/`)) {
      console.log(`  ${key}: L=${val.light} D=${val.dark}`);
    }
  }
}

// STATUS CONTEXT (T3)
console.log('\n===== STATUS CONTEXT (T3) =====');
for (const [key, vals] of Object.entries(d.statusContext.variables)) {
  console.log(`  ${key}:`);
  for (const [mode, val] of Object.entries(vals)) {
    console.log(`    ${mode}: ${val}`);
  }
}

// SURFACE CONTEXT (T2)
console.log('\n===== SURFACE CONTEXT (T2) =====');
for (const [key, vals] of Object.entries(d.surfaceContext.variables)) {
  console.log(`  ${key}:`);
  for (const [mode, val] of Object.entries(vals)) {
    console.log(`    ${mode}: ${val}`);
  }
}
