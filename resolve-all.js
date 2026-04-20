const fs = require('fs');
const d = JSON.parse(fs.readFileSync('figma-extracted.json','utf8'));

// Resolve alias to hex
function r(alias) {
  if (!alias || typeof alias !== 'string' || !alias.startsWith('alias:')) return alias;
  const ref = alias.replace('alias:', '');
  const parts = ref.split('/');
  const pal = parts.slice(0, -1).join('/');
  const step = parts[parts.length - 1];
  if (d.primitives[pal]) {
    const found = d.primitives[pal].find(c => c.step === step);
    if (found) return found.hex;
  }
  // Try with just first part as palette key
  if (d.primitives[parts[0]]) {
    const found = d.primitives[parts[0]].find(c => c.step === parts[1]);
    if (found) return found.hex;
  }
  return alias;
}

// Resolve semantic roles
const roles = ['brand', 'primary', 'success', 'warning', 'danger', 'info'];
const roleData = {};
for (const role of roles) {
  const tokens = {};
  for (const [k, v] of Object.entries(d.colorsMaster)) {
    if (k.startsWith(`semantic/${role}/`) || k.startsWith(`semantic/on${role}/`)) {
      const key = k.replace(`semantic/${role}/`, '').replace(`semantic/on${role}/`, 'on' + role + '/');
      tokens[key] = { l: r(v.light), d: r(v.dark) };
    }
  }
  roleData[role] = tokens;
}
console.log('SEMANTIC ROLES (resolved):');
for (const [role, tokens] of Object.entries(roleData)) {
  console.log(`\n${role}:`);
  for (const [k, v] of Object.entries(tokens)) {
    console.log(`  ${k}: L=${v.l} D=${v.d}`);
  }
}

// Comp sizes
console.log('\n\nCOMP SIZE:');
console.log('Modes:', d.compSize.modes.join(', '));
for (const t of d.compSize.tokens) {
  const vals = d.compSize.modes.map(m => {
    const v = t.values[m];
    if (typeof v === 'string' && v.startsWith('alias:')) return v.replace('alias:', '@');
    return v;
  });
  console.log(`  ${t.name}: [${vals.join(',')}]`);
}

// Numbers
console.log('\n\nPRIMITIVES NUMBERS:');
for (const n of d.primNumbers) {
  const v = n.value;
  const val = (typeof v === 'string' && v.startsWith('alias:')) ? v : v;
  console.log(`  ${n.name}: ${val} (${n.id})`);
}

// Typography
console.log('\n\nTYPOGRAPHY:');
for (const t of d.typography) {
  console.log(`  ${t.name}: ${t.value} (${t.type})`);
}

// Surface context (T2)
console.log('\n\nSURFACE CONTEXT (T2):');
for (const [k, vals] of Object.entries(d.surfaceContext.variables)) {
  const resolved = {};
  for (const [mode, val] of Object.entries(vals)) {
    resolved[mode] = val;
  }
  console.log(`  ${k}: ${JSON.stringify(resolved)}`);
}

// Status context (T3)
console.log('\n\nSTATUS CONTEXT (T3):');
for (const [k, vals] of Object.entries(d.statusContext.variables)) {
  const resolved = {};
  for (const [mode, val] of Object.entries(vals)) {
    resolved[mode] = val;
  }
  console.log(`  ${k}: ${JSON.stringify(resolved)}`);
}
