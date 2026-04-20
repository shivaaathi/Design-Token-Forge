// This script generates the complete updated JavaScript data for the HTML
// by reading from figma-extracted.json and resolving all aliases

const fs = require('fs');
const d = JSON.parse(fs.readFileSync('figma-extracted.json', 'utf8'));

function r(alias) {
  if (!alias || typeof alias !== 'string' || !alias.startsWith('alias:')) return alias;
  const ref = alias.replace('alias:', '');
  const parts = ref.split('/');
  for (let i = parts.length - 1; i >= 1; i--) {
    const pal = parts.slice(0, i).join('/');
    const step = parts.slice(i).join('/');
    if (d.primitives[pal]) {
      const found = d.primitives[pal].find(c => c.step === step);
      if (found) return found.hex;
    }
  }
  return alias;
}

// Build surfaces
const surfNames = ['surface/base', 'surface/bright', 'surface/deep', 'surface/accent', 'surface/dim',
  'surfacecontainer', 'surfaceovercontainer', 'float', 'inversesurface'];
const surfLabels = ['surface-base', 'surface-bright', 'surface-deep', 'surface-accent', 'surface-dim',
  'container', 'over-container', 'float', 'inversesurface'];
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
  const bg = t['bg'] || '#000';
  const hover = t['hover'] || bg;
  const pressed = t['pressed'] || hover;
  const outline = t['outline'] || '#333';
  const sep = t['separator'] || t['separator-default'] || outline;
  const ct = {
    def: t['content/default'] || '#888',
    str: t['content/strong'] || '#FFF',
    sub: t['content/subtle'] || '#666',
    fnt: t['content/faint'] || '#444'
  };
  const cm = {
    bg: t['component/bg-default'] || '#222',
    bgHv: t['component/bg-hover'] || '#333',
    bgPr: t['component/bg-pressed'] || t['component/fill-pressed'] || '#333',
    ol: t['component/outline-default'] || '#444',
    olHv: t['component/outline-hover'] || '#555',
    olPr: t['component/outline-pressed'] || '#555',
    sep: t['component/separator'] || t['component/separator-default'] || '#333'
  };

  // For sm (semantic), we need the primary role tokens - they come from the T1 color tokens
  // Get primary semantic tokens
  const smPrefix = 'semantic/primary/';
  const smTokens = {};
  for (const [k, v] of Object.entries(d.colorsMaster)) {
    if (k.startsWith(smPrefix)) {
      smTokens[k.replace(smPrefix, '')] = r(theme === 'light' ? v.light : v.dark);
    }
  }
  // Also get onprimary tokens
  for (const [k, v] of Object.entries(d.colorsMaster)) {
    if (k.startsWith('semantic/onprimary/')) {
      smTokens[k.replace('semantic/onprimary/', 'on-')] = r(theme === 'light' ? v.light : v.dark);
    }
  }

  const sm = {
    bg: smTokens['component/bg-default'] || '#286CE5',
    bgHv: smTokens['component/bg-hover'] || '#1F5FD1',
    bgPr: smTokens['component/bg-pressed'] || '#1F5FD1',
    ol: smTokens['component/outline-default'] || '#286CE5',
    olHv: smTokens['component/outline-hover'] || '#1F5FD1',
    cBg: smTokens['container/bg'] || '#EBF2FF',
    cOl: smTokens['container/outline'] || '#93B6F5',
    onCm: smTokens['on-component-content/default'] || '#FFFFFF',
    onCt: smTokens['on-container-content/default'] || smTokens['content/default'] || '#1852BA'
  };

  const shadow = sn === 'float';
  const id = surfNames[idx];
  return { id: id.replace('surface/', 'surface-'), label: surfLabels[idx], desc: surfDescs[idx], bg, hover, pressed, outline, sep, ct, cm, sm, shadow };
}

// Build all surfaces
const surfsLight = surfNames.map((sn, i) => surfObj(sn, i, 'light'));
const surfsDark = surfNames.map((sn, i) => surfObj(sn, i, 'dark'));

// Fix IDs to match the format used in HTML
surfsLight.forEach((s, i) => { if (!s.id.startsWith('surface-') && s.id !== 'float') s.id = s.id; });

console.log('// SURFS_LIGHT');
console.log('const SURFS_LIGHT = ' + JSON.stringify(surfsLight, null, 2) + ';');
console.log();
console.log('// SURFS_DARK');
console.log('const SURFS_DARK = ' + JSON.stringify(surfsDark, null, 2) + ';');
console.log();

// Build roles
const roles = ['brand', 'primary', 'danger', 'warning', 'info', 'success'];
const roleColors = { brand: '#E53F28', primary: '#286CE5', danger: '#D11F24', warning: '#BA8D18', info: '#1878BA', success: '#0F9146' };
const roleDescs = {
  brand: 'Product brand identity', primary: 'Primary UI actions', danger: 'Destructive / error states',
  warning: 'Caution & warning states', info: 'Informational states', success: 'Positive / success states'
};

const rolesObj = {};
for (const role of roles) {
  const content = [], component = [], container = [];
  const onCmKey = `semantic/on${role}/component-content/default`;
  const onCtKey = `semantic/on${role}/container-content/default`;

  for (const [k, v] of Object.entries(d.colorsMaster)) {
    if (k.startsWith(`semantic/${role}/content/`)) {
      const n = k.replace(`semantic/${role}/`, '');
      content.push({ n, l: r(v.light), d: r(v.dark) });
    }
    if (k.startsWith(`semantic/${role}/component/`)) {
      const n = k.replace(`semantic/${role}/`, '');
      component.push({ n, l: r(v.light), d: r(v.dark) });
    }
    if (k.startsWith(`semantic/${role}/container/`)) {
      const n = k.replace(`semantic/${role}/`, '');
      container.push({ n, l: r(v.light), d: r(v.dark) });
    }
  }

  const onCm = d.colorsMaster[onCmKey] ? { l: r(d.colorsMaster[onCmKey].light), d: r(d.colorsMaster[onCmKey].dark) } : { l: '#FFFFFF', d: '#FFFFFF' };
  const onCt = d.colorsMaster[onCtKey] ? { l: r(d.colorsMaster[onCtKey].light), d: r(d.colorsMaster[onCtKey].dark) } : { l: '#000', d: '#FFF' };

  rolesObj[role] = {
    color: roleColors[role] || r(d.colorsMaster[`semantic/${role}/component/bg-default`]?.light) || '#888',
    desc: roleDescs[role],
    tokens: { content, component, container },
    onComponent: onCm,
    onContainer: onCt
  };
}

console.log('// ROLES');
console.log('const ROLES = ' + JSON.stringify(rolesObj, null, 2) + ';');
console.log();

// PRIMS (primitive palettes)
const primsObj = {};
for (const [pal, colors] of Object.entries(d.primitives)) {
  primsObj[pal] = {
    colors: colors.map(c => c.hex),
    steps: colors.map(c => c.step)
  };
}
console.log('// PRIMS');
console.log('const PRIMS = ' + JSON.stringify(primsObj, null, 2) + ';');
console.log();

// SPACING PRIMS
const spacingPrims = d.primNumbers.map(n => ({
  val: typeof n.value === 'number' ? n.value : 0,
  id: n.id,
  name: n.name
})).sort((a, b) => a.val - b.val);
console.log('// SPACING_PRIMS');
console.log('const SPACING_PRIMS = ' + JSON.stringify(spacingPrims, null, 2) + ';');
console.log();

// COMP SIZE
// Need to resolve alias references for comp size values
function resolveCompVal(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.startsWith('alias:')) {
    const ref = v.replace('alias:', '');
    // Check primitives-numbers
    const found = d.primNumbers.find(n => n.name === ref);
    if (found) return typeof found.value === 'number' ? found.value : 0;
    // Check typography (for font-size aliases)
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

const modeOrder = ['micro', 'tiny', 'small', 'base', 'medium', 'large', 'big', 'huge', 'mega', 'ultra'];

// Group the comp size tokens
const compGroups = {};
for (const t of d.compSize.tokens) {
  const parts = t.name.split('/');
  const group = parts.length > 1 ? parts.slice(0, -1).join(' / ') : parts[0];
  if (!compGroups[group]) compGroups[group] = [];

  const vals = modeOrder.map(m => resolveCompVal(t.values[m]));
  compGroups[group].push({ name: t.name, group, vals });
}

const compSizeData = [];
for (const [group, tokens] of Object.entries(compGroups)) {
  for (const t of tokens) {
    compSizeData.push({ group: t.group, name: t.name, vals: t.vals });
  }
}

console.log('// MODES');
console.log('const MODES = ' + JSON.stringify(modeOrder) + ';');
console.log();
console.log('// COMP_SIZE_DATA');
console.log('const COMP_SIZE_DATA = ' + JSON.stringify(compSizeData, null, 2) + ';');
console.log();

// TYPOGRAPHY
const typoScale = d.typography
  .filter(t => t.name.startsWith('font size/'))
  .map(t => {
    const size = parseInt(t.name.replace('font size/', ''));
    return { val: size, id: t.name };
  })
  .sort((a, b) => a.val - b.val);

const fontWeights = d.typography
  .filter(t => t.name.startsWith('font weight/'))
  .map(t => ({ name: t.name.replace('font weight/', ''), value: t.value }));

const fontFamily = d.typography.find(t => t.name === 'font family');

console.log('// TYPO_SCALE');
console.log('const TYPO_SCALE = ' + JSON.stringify(typoScale, null, 2) + ';');
console.log();
console.log('// FONT_WEIGHTS');
console.log('const FONT_WEIGHTS = ' + JSON.stringify(fontWeights, null, 2) + ';');
console.log();
console.log('// FONT_FAMILY');
console.log('const FONT_FAMILY = ' + JSON.stringify(fontFamily?.value || 'Zoho Puvi') + ';');
console.log();

// Summary stats
const totalColorTokens = Object.keys(d.colorsMaster).length + Object.keys(d.primitives).reduce((sum, k) => sum + d.primitives[k].length, 0);
console.log('// STATS');
console.log(`// Total primitives-colors: ${Object.keys(d.primitives).reduce((sum, k) => sum + d.primitives[k].length, 0)}`);
console.log(`// Total T1 color tokens: ${Object.keys(d.colorsMaster).length}`);
console.log(`// Total surface context vars: ${Object.keys(d.surfaceContext.variables).length}`);
console.log(`// Total status context vars: ${Object.keys(d.statusContext.variables).length}`);
console.log(`// Total spacing primitives: ${d.primNumbers.length}`);
console.log(`// Total comp size tokens: ${d.compSize.tokens.length}`);
console.log(`// Total typography tokens: ${d.typography.length}`);
console.log(`// Total variables: 607`);
console.log(`// Collections: 8`);
