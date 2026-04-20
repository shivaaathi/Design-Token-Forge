const fs = require('fs');
const d = JSON.parse(fs.readFileSync('figma-extracted.json','utf8'));

// Helper to resolve alias to hex
function resolveAlias(alias, primitives) {
  if (!alias || !alias.startsWith('alias:')) return alias;
  const ref = alias.replace('alias:', '');
  const parts = ref.split('/');
  const pal = parts.length > 2 ? parts.slice(0, parts.length - 1).join('/') : parts[0];
  const step = parts[parts.length - 1];
  if (primitives[pal]) {
    const found = primitives[pal].find(c => c.step === step);
    if (found) return found.hex;
  }
  return alias; // return raw if not found
}

// Build resolved surface data
const surfNames = ['surface/base', 'surface/bright', 'surface/deep', 'surface/accent', 'surface/dim',
  'surfacecontainer', 'surfaceovercontainer', 'float', 'inversesurface'];

const resolvedSurfaces = {};
for (const sn of surfNames) {
  const surfData = {};
  for (const [key, val] of Object.entries(d.colorsMaster)) {
    if (key.startsWith(sn + '/')) {
      const shortKey = key.replace(sn + '/', '');
      surfData[shortKey] = {
        light: resolveAlias(val.light, d.primitives),
        dark: resolveAlias(val.dark, d.primitives)
      };
    }
  }
  resolvedSurfaces[sn] = surfData;
}

console.log('RESOLVED SURFACES:');
console.log(JSON.stringify(resolvedSurfaces, null, 2));
