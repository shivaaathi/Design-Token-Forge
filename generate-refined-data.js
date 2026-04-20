// Refined token data generator — resolves ALL aliases including hidden Figma primitives
// Produces the single source of truth for the Tokn portal

const fs = require('fs');
const d = JSON.parse(fs.readFileSync('figma-extracted.json', 'utf8'));

// ========== HIDDEN PRIMITIVES (exist in Figma but marked hiddenFromPublishing) ==========
const HIDDEN_PRIMS = {
  'Monochromatic/Color320': '#0C3C64',
  'Monochromatic/Color420': '#06263D'
};

// ========== ALIAS RESOLVER ==========
function r(alias) {
  if (!alias || typeof alias !== 'string' || !alias.startsWith('alias:')) return alias;
  const ref = alias.replace('alias:', '');

  // Check hidden primitives first
  if (HIDDEN_PRIMS[ref]) return HIDDEN_PRIMS[ref];

  const parts = ref.split('/');
  for (let i = parts.length - 1; i >= 1; i--) {
    const pal = parts.slice(0, i).join('/');
    const step = parts.slice(i).join('/');
    if (d.primitives[pal]) {
      const found = d.primitives[pal].find(c => c.step === step);
      if (found) return found.hex;
    }
  }
  return alias; // unresolvedreturn as-is
}

// ========== 1. PRIMITIVE PALETTES ==========
const PRIMS = {};
for (const [pal, colors] of Object.entries(d.primitives)) {
  PRIMS[pal] = { colors: colors.map(c => c.hex), steps: colors.map(c => c.step) };
}

// ========== 2. SURFACES (9 surfaces × light/dark) ==========
const surfNames = [
  'surface/base', 'surface/bright', 'surface/deep', 'surface/accent', 'surface/dim',
  'surfacecontainer', 'surfaceovercontainer', 'float', 'inversesurface'
];
const surfLabels = [
  'surface-base', 'surface-bright', 'surface-deep', 'surface-accent', 'surface-dim',
  'container', 'over-container', 'float', 'inversesurface'
];
const surfDescs = [
  'Default canvas surface', 'Brightest / elevated surface', 'Deeply layered — sidebars',
  'Primary-tinted accent surface', 'Receded / dimmed surface', 'Card / container surface',
  'Elements on top of containers', 'Floating elements — tooltips, popovers',
  'Always dark — identical in both themes'
];

function buildSurf(sn, theme) {
  const prefix = sn + '/';
  const t = {};
  for (const [k, v] of Object.entries(d.colorsMaster)) {
    if (k.startsWith(prefix)) {
      const short = k.replace(prefix, '');
      t[short] = r(theme === 'light' ? v.light : v.dark);
    }
  }
  return t;
}

function surfObj(sn, idx, theme) {
  const t = buildSurf(sn, theme);

  // Semantic primary tokens (global, not surface-specific)
  const smTokens = {};
  for (const [k, v] of Object.entries(d.colorsMaster)) {
    if (k.startsWith('semantic/primary/')) {
      smTokens[k.replace('semantic/primary/', '')] = r(theme === 'light' ? v.light : v.dark);
    }
    if (k.startsWith('semantic/onprimary/')) {
      smTokens[k.replace('semantic/onprimary/', 'on-')] = r(theme === 'light' ? v.light : v.dark);
    }
  }

  return {
    id: surfLabels[idx],
    label: surfLabels[idx],
    desc: surfDescs[idx],
    bg: t['bg'] || '#000',
    hover: t['hover'] || t['bg'] || '#000',
    pressed: t['pressed'] || t['hover'] || '#000',
    outline: t['outline'] || '#333',
    sep: t['separator'] || t['separator-default'] || t['outline'] || '#333',
    ct: {
      def: t['content/default'] || '#888',
      str: t['content/strong'] || '#FFF',
      sub: t['content/subtle'] || '#666',
      fnt: t['content/faint'] || '#444'
    },
    cm: {
      bg: t['component/bg-default'] || '#222',
      bgHv: t['component/bg-hover'] || '#333',
      bgPr: t['component/bg-pressed'] || t['component/fill-pressed'] || '#333',
      ol: t['component/outline-default'] || '#444',
      olHv: t['component/outline-hover'] || '#555',
      olPr: t['component/outline-pressed'] || '#555',
      sep: t['component/separator'] || t['component/separator-default'] || '#333'
    },
    sm: {
      bg: smTokens['component/bg-default'] || '#286CE5',
      bgHv: smTokens['component/bg-hover'] || '#1F5FD1',
      bgPr: smTokens['component/bg-pressed'] || '#1F5FD1',
      ol: smTokens['component/outline-default'] || '#286CE5',
      olHv: smTokens['component/outline-hover'] || '#1F5FD1',
      cBg: smTokens['container/bg'] || '#EBF2FF',
      cHv: smTokens['container/hover'] || '#E3EDFF',
      cPr: smTokens['container/pressed'] || '#D9E7FF',
      cOl: smTokens['container/outline'] || '#93B6F5',
      cSep: smTokens['container/separator'] || '#7CA6F2',
      onCm: smTokens['on-component-content/default'] || '#FFFFFF',
      onCt: smTokens['on-container-content/default'] || smTokens['content/default'] || '#1852BA'
    },
    shadow: sn === 'float'
  };
}

const SURFS_LIGHT = surfNames.map((sn, i) => surfObj(sn, i, 'light'));
const SURFS_DARK = surfNames.map((sn, i) => surfObj(sn, i, 'dark'));

// ========== 3. SEMANTIC ROLES (all 6) ==========
const roleNames = ['primary', 'brand', 'success', 'warning', 'danger', 'info'];
const roleDescs = {
  primary: 'Primary UI actions & links',
  brand: 'Product brand identity',
  success: 'Positive / success states',
  warning: 'Caution & warning states',
  danger: 'Destructive / error states',
  info: 'Informational states'
};

const ROLES = {};
for (const role of roleNames) {
  const content = [], component = [], container = [];

  for (const [k, v] of Object.entries(d.colorsMaster)) {
    if (k.startsWith(`semantic/${role}/content/`)) {
      content.push({ n: k.replace(`semantic/${role}/`, ''), l: r(v.light), d: r(v.dark) });
    }
    if (k.startsWith(`semantic/${role}/component/`)) {
      component.push({ n: k.replace(`semantic/${role}/`, ''), l: r(v.light), d: r(v.dark) });
    }
    if (k.startsWith(`semantic/${role}/container/`)) {
      container.push({ n: k.replace(`semantic/${role}/`, ''), l: r(v.light), d: r(v.dark) });
    }
  }

  const onCmKey = `semantic/on${role}/component-content/default`;
  const onCtKey = `semantic/on${role}/container-content/default`;
  const onCm = d.colorsMaster[onCmKey]
    ? { l: r(d.colorsMaster[onCmKey].light), d: r(d.colorsMaster[onCmKey].dark) }
    : { l: '#FFFFFF', d: '#FFFFFF' };
  const onCt = d.colorsMaster[onCtKey]
    ? { l: r(d.colorsMaster[onCtKey].light), d: r(d.colorsMaster[onCtKey].dark) }
    : { l: '#000', d: '#FFF' };

  // Determine role's accent color (from component/bg-default light)
  const bgDefault = component.find(t => t.n === 'component/bg-default');
  const color = bgDefault ? bgDefault.l : '#888';

  ROLES[role] = { color, desc: roleDescs[role], tokens: { content, component, container }, onComponent: onCm, onContainer: onCt };
}

// ========== 4. SPACING PRIMITIVES ==========
const SPACING_PRIMS = d.primNumbers
  .map(n => ({ val: typeof n.value === 'number' ? n.value : 0, name: n.name, id: n.id }))
  .sort((a, b) => a.val - b.val);

// ========== 5. TYPOGRAPHY ==========
const TYPO_SCALE = d.typography
  .filter(t => t.name.startsWith('font size/'))
  .map(t => ({ val: parseInt(t.name.replace('font size/', '')), id: t.name }))
  .sort((a, b) => a.val - b.val);

const FONT_WEIGHTS = d.typography
  .filter(t => t.name.startsWith('font weight/'))
  .map(t => ({ name: t.name.replace('font weight/', ''), value: t.value }));

const FONT_FAMILY = d.typography.find(t => t.name === 'font family')?.value || 'Zoho Puvi';

// ========== 6. COMPONENT SIZES ==========
const MODES = ['micro', 'tiny', 'small', 'base', 'medium', 'large', 'big', 'huge', 'mega', 'ultra'];

function resolveCompVal(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.startsWith('alias:')) {
    const ref = v.replace('alias:', '');
    const found = d.primNumbers.find(n => n.name === ref);
    if (found) return typeof found.value === 'number' ? found.value : 0;
    const typoMatch = d.typography.find(t => t.name === ref);
    if (typoMatch) {
      if (typeof typoMatch.value === 'string' && typoMatch.value.startsWith('alias:')) {
        const numRef = typoMatch.value.replace('alias:', '');
        const numFound = d.primNumbers.find(n => n.name === numRef);
        return numFound ? numFound.value : parseInt(numRef) || 0;
      }
      return typoMatch.value;
    }
    return parseInt(ref) || 0;
  }
  return v || 0;
}

const COMP_SIZE_DATA = [];
for (const t of d.compSize.tokens) {
  const vals = MODES.map(m => resolveCompVal(t.values[m]));
  COMP_SIZE_DATA.push({ group: t.name.split('/')[0], name: t.name, vals });
}

// ========== 7. UTILITY TOKENS ==========
const UTILITY = {};
for (const [k, v] of Object.entries(d.utility)) {
  UTILITY[k] = { l: r(v.light), d: r(v.dark) };
}

// ========== OUTPUT ==========
const output = [
  '// ═══════════════════════════════════════════════════════════════',
  '// TOKN DESIGN SYSTEM — REFINED DATA',
  '// Generated: ' + new Date().toISOString(),
  '// Source: Figma "Desktop Color Tokens - Dec 2025"',
  '// Total: 607 variables across 8 collections',
  '// ═══════════════════════════════════════════════════════════════',
  '',
  '// PRIMITIVES (8 palettes, 148 colors)',
  'const PRIMS = ' + JSON.stringify(PRIMS, null, 2) + ';',
  '',
  '// SURFACES — LIGHT (9 surface contexts)',
  'const SURFS_LIGHT = ' + JSON.stringify(SURFS_LIGHT, null, 2) + ';',
  '',
  '// SURFACES — DARK (9 surface contexts)',
  'const SURFS_DARK = ' + JSON.stringify(SURFS_DARK, null, 2) + ';',
  '',
  '// SEMANTIC ROLES (6 roles: primary, brand, success, warning, danger, info)',
  'const ROLES = ' + JSON.stringify(ROLES, null, 2) + ';',
  '',
  '// SPACING PRIMITIVES (39 values)',
  'const SPACING_PRIMS = ' + JSON.stringify(SPACING_PRIMS, null, 2) + ';',
  '',
  '// TYPOGRAPHY SCALE (13 font sizes)',
  'const TYPO_SCALE = ' + JSON.stringify(TYPO_SCALE, null, 2) + ';',
  '',
  '// FONT WEIGHTS',
  'const FONT_WEIGHTS = ' + JSON.stringify(FONT_WEIGHTS, null, 2) + ';',
  '',
  '// FONT FAMILY',
  'const FONT_FAMILY = ' + JSON.stringify(FONT_FAMILY) + ';',
  '',
  '// COMPONENT SIZE TOKENS (93 tokens × 10 modes)',
  'const MODES = ' + JSON.stringify(MODES) + ';',
  'const COMP_SIZE_DATA = ' + JSON.stringify(COMP_SIZE_DATA, null, 2) + ';',
  '',
  '// UTILITY TOKENS',
  'const UTILITY = ' + JSON.stringify(UTILITY, null, 2) + ';',
  '',
  '// STATS',
  '// Primitive colors: ' + Object.values(d.primitives).reduce((s, p) => s + p.length, 0),
  '// T1 color tokens: ' + Object.keys(d.colorsMaster).length,
  '// Surface context tokens: ' + Object.keys(d.surfaceContext.variables).length,
  '// Status context tokens: ' + Object.keys(d.statusContext.variables).length,
  '// Spacing primitives: ' + d.primNumbers.length,
  '// Component size tokens: ' + d.compSize.tokens.length,
  '// Typography tokens: ' + d.typography.length,
  '// Total: 607 variables, 8 collections',
];

fs.writeFileSync('html-data-refined.js', output.join('\n'));
console.log('✅ Wrote html-data-refined.js');

// Verify no unresolved aliases remain
const fileContent = fs.readFileSync('html-data-refined.js', 'utf8');
const aliasCount = (fileContent.match(/alias:/g) || []).length;
if (aliasCount > 0) {
  console.log('⚠️  WARNING: ' + aliasCount + ' unresolved alias references remain');
  const lines = fileContent.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('alias:')) console.log('  Line ' + (i + 1) + ': ' + line.trim());
  });
} else {
  console.log('✅ All aliases fully resolved — zero unresolved references');
}

// Quick stats
console.log('\n📊 Data Summary:');
console.log('  Palettes: ' + Object.keys(PRIMS).length);
console.log('  Surfaces (light): ' + SURFS_LIGHT.length);
console.log('  Surfaces (dark): ' + SURFS_DARK.length);
console.log('  Roles: ' + Object.keys(ROLES).length + ' (' + Object.keys(ROLES).join(', ') + ')');
console.log('  Spacing: ' + SPACING_PRIMS.length);
console.log('  Typo sizes: ' + TYPO_SCALE.length);
console.log('  Font weights: ' + FONT_WEIGHTS.length);
console.log('  Comp size tokens: ' + COMP_SIZE_DATA.length);
console.log('  Utility: ' + Object.keys(UTILITY).length);
