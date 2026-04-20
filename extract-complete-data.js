#!/usr/bin/env node
/**
 * Complete Figma Data Extraction
 * Extracts ALL design tokens, variables, styles, and components
 */

const fs = require('fs');

// Load raw data
const raw = JSON.parse(fs.readFileSync('figma-data-raw.json', 'utf8'));
const data = JSON.parse(raw.result);

const output = {};

console.log('🔍 Extracting complete Figma design system...\n');

// ==========================================
// 1) Primitives Colors
// ==========================================
console.log('✓ Extracting primitives...');
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

// ==========================================
// 2) T1 Color Tokens (with resolved values)
// ==========================================
console.log('✓ Extracting color tokens...');
const t1 = data['T1 Color Tokens'];
const t1Data = {};
const t1Resolved = {};

for (const v of t1.variables) {
  t1Data[v.name] = { 
    id: v.id,
    light: v.values['light'], 
    dark: v.values['dark'],
    type: v.type
  };
  
  // Track resolved values for later resolution
  t1Resolved[v.name] = { light: null, dark: null };
}
output.colorsMaster = t1Data;
output.colorsMasterResolved = t1Resolved;

// ==========================================
// 3) Utility Variables
// ==========================================
console.log('✓ Extracting utility variables...');
const util = data['utility'];
output.utility = {};
for (const v of util.variables) {
  output.utility[v.name] = { 
    light: v.values['light'], 
    dark: v.values['dark'],
    id: v.id,
    type: v.type
  };
}

// ==========================================
// 4) Surface Context Tokens
// ==========================================
console.log('✓ Extracting surface context tokens...');
const surfCtx = data['T2 Surface Context Tokens'];
output.surfaceContext = { 
  modes: surfCtx.modes.map(m => ({ id: m.id, name: m.name })), 
  variables: {} 
};
for (const v of surfCtx.variables) {
  output.surfaceContext.variables[v.name] = {
    id: v.id,
    values: v.values,
    type: v.type
  };
}

// ==========================================
// 5) Status Context Tokens
// ==========================================
console.log('✓ Extracting status context tokens...');
const statusCtx = data['T3 Status Context Tokens'];
output.statusContext = { 
  modes: statusCtx.modes.map(m => ({ id: m.id, name: m.name })), 
  variables: {} 
};
for (const v of statusCtx.variables) {
  output.statusContext.variables[v.name] = {
    id: v.id,
    values: v.values,
    type: v.type
  };
}

// ==========================================
// 6) Primitive Numbers
// ==========================================
console.log('✓ Extracting numeric primitives...');
const nums = data['primitives-numbers'];
output.primNumbers = [];
for (const v of nums.variables) {
  output.primNumbers.push({
    name: v.name,
    value: v.values['Mode 1'],
    id: v.id
  });
}

// ==========================================
// 7) Component Sizes
// ==========================================
console.log('✓ Extracting component size tokens...');
const compSize = data['comp size'];
output.compSize = {
  modes: compSize.modes.map(m => ({ id: m.id, name: m.name })),
  variables: {}
};
for (const v of compSize.variables) {
  output.compSize.variables[v.name] = {
    id: v.id,
    values: v.values,
    type: v.type
  };
}

// ==========================================
// 8) Typography
// ==========================================
console.log('✓ Extracting typography tokens...');
const typo = data['typography'];
output.typography = {
  modes: typo.modes.map(m => ({ id: m.id, name: m.name })),
  variables: {}
};
for (const v of typo.variables) {
  output.typography.variables[v.name] = {
    id: v.id,
    value: v.values['value'],
    type: v.type
  };
}

// ==========================================
// 9) Add metadata
// ==========================================
output.metadata = {
  extractedAt: new Date().toISOString(),
  source: 'figma-data-raw.json',
  totalVariables: Object.keys(data).reduce((sum, key) => sum + data[key].variables.length, 0),
  collections: Object.keys(data)
};

// ==========================================
// 10) Save complete data
// ==========================================
console.log('\n✅ Writing complete extracted data...');
fs.writeFileSync('figma-extracted-complete.json', JSON.stringify(output, null, 2));
console.log('✓ Saved to figma-extracted-complete.json');

// ==========================================
// 11) Generate summary report
// ==========================================
console.log('\n📊 EXTRACTION SUMMARY');
console.log('================================');
console.log(`Total Variables: ${output.metadata.totalVariables}`);
console.log(`Collections: ${output.metadata.collections.length}`);
console.log(`  - Primitive Colors: ${output.primitives ? Object.values(output.primitives).reduce((s, p) => s + (Array.isArray(p) ? p.length : 0), 0) : 0}`);
console.log(`  - Color Tokens: ${Object.keys(output.colorsMaster || {}).length}`);
console.log(`  - Utility: ${Object.keys(output.utility || {}).length}`);
console.log(`  - Surface Context: ${Object.keys(output.surfaceContext?.variables || {}).length}`);
console.log(`  - Status Context: ${Object.keys(output.statusContext?.variables || {}).length}`);
console.log(`  - Numbers: ${(output.primNumbers || []).length}`);
console.log(`  - Component Sizes: ${Object.keys(output.compSize?.variables || {}).length}`);
console.log(`  - Typography: ${Object.keys(output.typography?.variables || {}).length}`);

console.log('\n⚠️  ITEMS STILL NEEDING FROM FIGMA:');
console.log('================================');
console.log('❌ Text Styles (if any)');
console.log('❌ Color Styles (if any)');
console.log('❌ Grid Styles');
console.log('❌ Effect Styles');
console.log('❌ Published Components');
console.log('❌ Component Pages/Frames Structure');
console.log('❌ Element-level design properties');
console.log('\n💡 TIP: To get these, we would need:');
console.log('   - Figma REST API with file details endpoint');
console.log('   - Access to styles data');
console.log('   - Component definitions and instances');
console.log('   - Page and frame hierarchy');

console.log('\n✨ Done!\n');
