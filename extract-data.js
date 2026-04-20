const fs = require('fs');
const raw = JSON.parse(fs.readFileSync('figma-data-raw.json','utf8'));
const data = JSON.parse(raw.result);

const output = {};

// 1) Primitives Colors
const prims = data['T0 Primitive Colors'];
const palettes = {};
for (const v of prims.variables) {
  const parts = v.name.split('/');
  const pal = parts[0];
  const step = parts[1];
  if (!palettes[pal]) palettes[pal] = [];
  palettes[pal].push({step, hex: v.values['Value']});
}
output.primitives = palettes;

// 2) T1 Color Tokens (colors-master) - light and dark
const t1 = data['T1 Color Tokens'];
const t1Data = {};
for (const v of t1.variables) {
  t1Data[v.name] = { light: v.values['light'], dark: v.values['dark'] };
}
output.colorsMaster = t1Data;

// 3) Utility
const util = data['utility'];
output.utility = {};
for (const v of util.variables) {
  output.utility[v.name] = { light: v.values['light'], dark: v.values['dark'] };
}

// 4) Surface context
const surfCtx = data['T2 Surface Context Tokens'];
output.surfaceContext = { modes: surfCtx.modes.map(m => m.name), variables: {} };
for (const v of surfCtx.variables) {
  output.surfaceContext.variables[v.name] = v.values;
}

// 5) Status context
const statusCtx = data['T3 Status Context Tokens'];
output.statusContext = { modes: statusCtx.modes.map(m => m.name), variables: {} };
for (const v of statusCtx.variables) {
  output.statusContext.variables[v.name] = v.values;
}

// 6) Primitives numbers
const nums = data['primitives-numbers'];
output.primNumbers = [];
for (const v of nums.variables) {
  output.primNumbers.push({ name: v.name, value: v.values['Mode 1'], id: v.id });
}

// 7) Comp size
const comp = data['comp size'];
output.compSize = { modes: comp.modes.map(m => m.name), tokens: [] };
for (const v of comp.variables) {
  const vals = {};
  for (const mode of comp.modes) {
    vals[mode.name] = v.values[mode.name];
  }
  output.compSize.tokens.push({ name: v.name, values: vals });
}

// 8) Typography
const typo = data['typography'];
output.typography = [];
for (const v of typo.variables) {
  output.typography.push({ name: v.name, type: v.type, value: v.values['value'] });
}

fs.writeFileSync('figma-extracted.json', JSON.stringify(output, null, 2));
console.log('Extracted to figma-extracted.json');
console.log('Collections:', Object.keys(data).join(', '));
console.log('Primitive palettes:', Object.keys(palettes).join(', '));
console.log('T1 tokens:', Object.keys(t1Data).length);
console.log('Surface context vars:', Object.keys(output.surfaceContext.variables).length);
console.log('Status context vars:', Object.keys(output.statusContext.variables).length);
console.log('Prim numbers:', output.primNumbers.length);
console.log('Comp size tokens:', output.compSize.tokens.length);
console.log('Typography tokens:', output.typography.length);
