/* ═══════════════════════════════════════════════════════════════
   Design Token Forge — Config-to-Tokens Generator

   Generates parseCSSTokens-compatible token objects from a
   project's config.json, using the palette engine to resolve
   key hex → 22 steps → individual token hex values.

   Used by build-static.js to make config.json the authoritative
   source of truth for the build pipeline.
   ═══════════════════════════════════════════════════════════════ */

import { generatePalette, STEP_NAMES } from '../generator/src/palette-engine.js';

// ── Constants (must match color-system.html) ──────────────────

const TOKEN_ROLES = ['primary', 'brand', 'danger', 'warning', 'info', 'success'];

const ROLE_TO_PALETTE_KEY = {
  primary: 'monochromatic', brand: 'brand', danger: 'danger',
  warning: 'warning', info: 'info', success: 'success',
  greyscale: 'greyscale', desaturated: 'desaturated'
};

const PALETTE_KEY_TO_ROLE = {
  monochromatic: 'primary', brand: 'brand', danger: 'danger',
  warning: 'warning', info: 'info', success: 'success',
  greyscale: 'greyscale', desaturated: 'desaturated'
};

const SURFACE_NAMES = [
  'bright', 'base', 'dim', 'deep', 'accent',
  'container', 'over-container', 'float', 'inverse'
];

const SURF_PROP_ORDER = [
  'bg', 'subtle', 'elevated', 'outline', 'separator',
  'ct-default', 'ct-strong', 'ct-subtle', 'ct-faint',
  'cm-bg', 'cm-bg-hover', 'cm-bg-pressed',
  'cm-outline', 'cm-outline-hover', 'cm-outline-pressed', 'cm-separator'
];

// Default surface maps — used when config has no surfaceMap
const DEFAULT_SURF_L = {
  bright:           {bg:'white',subtle:'25',elevated:'50',outline:'150',separator:'150','ct-default':'900','ct-strong':'black','ct-subtle':'600','ct-faint':'400','cm-bg':'25','cm-bg-hover':'50','cm-bg-pressed':'75','cm-outline':'150','cm-outline-hover':'200','cm-outline-pressed':'250','cm-separator':'150'},
  base:             {bg:'25',subtle:'50',elevated:'75',outline:'150',separator:'175','ct-default':'900','ct-strong':'black','ct-subtle':'600','ct-faint':'400','cm-bg':'white','cm-bg-hover':'25','cm-bg-pressed':'50','cm-outline':'150','cm-outline-hover':'200','cm-outline-pressed':'250','cm-separator':'175'},
  dim:              {bg:'50',subtle:'75',elevated:'100',outline:'175',separator:'175','ct-default':'900','ct-strong':'black','ct-subtle':'600','ct-faint':'400','cm-bg':'25','cm-bg-hover':'50','cm-bg-pressed':'75','cm-outline':'175','cm-outline-hover':'200','cm-outline-pressed':'300','cm-separator':'175'},
  deep:             {bg:'75',subtle:'100',elevated:'150',outline:'175',separator:'200','ct-default':'900','ct-strong':'black','ct-subtle':'600','ct-faint':'450','cm-bg':'50','cm-bg-hover':'75','cm-bg-pressed':'100','cm-outline':'200','cm-outline-hover':'250','cm-outline-pressed':'300','cm-separator':'200'},
  container:        {bg:'white',subtle:'25',elevated:'50',outline:'150',separator:'150','ct-default':'900','ct-strong':'black','ct-subtle':'600','ct-faint':'400','cm-bg':'25','cm-bg-hover':'50','cm-bg-pressed':'75','cm-outline':'150','cm-outline-hover':'200','cm-outline-pressed':'250','cm-separator':'150'},
  'over-container': {bg:'white',subtle:'25',elevated:'50',outline:'150',separator:'175','ct-default':'900','ct-strong':'black','ct-subtle':'600','ct-faint':'400','cm-bg':'50','cm-bg-hover':'75','cm-bg-pressed':'100','cm-outline':'175','cm-outline-hover':'200','cm-outline-pressed':'250','cm-separator':'175'},
  float:            {bg:'white',subtle:'25',elevated:'50',outline:'150',separator:'175','ct-default':'900','ct-strong':'black','ct-subtle':'550','ct-faint':'400','cm-bg':'50','cm-bg-hover':'75','cm-bg-pressed':'100','cm-outline':'175','cm-outline-hover':'250','cm-outline-pressed':'300','cm-separator':'175'},
  inverse:          {bg:'900',subtle:'850',elevated:'800',outline:'700',separator:'700','ct-default':'25','ct-strong':'white','ct-subtle':'250','ct-faint':'400','cm-bg':'850','cm-bg-hover':'800','cm-bg-pressed':'750','cm-outline':'600','cm-outline-hover':'550','cm-outline-pressed':'500','cm-separator':'700'}
};

const DEFAULT_SURF_D = {
  bright:           {bg:'850',subtle:'800',elevated:'750',outline:'700',separator:'700','ct-default':'50','ct-strong':'white','ct-subtle':'250','ct-faint':'450','cm-bg':'800','cm-bg-hover':'750','cm-bg-pressed':'700','cm-outline':'600','cm-outline-hover':'550','cm-outline-pressed':'500','cm-separator':'700'},
  base:             {bg:'900',subtle:'850',elevated:'800',outline:'750',separator:'700','ct-default':'50','ct-strong':'white','ct-subtle':'250','ct-faint':'450','cm-bg':'850','cm-bg-hover':'800','cm-bg-pressed':'750','cm-outline':'600','cm-outline-hover':'550','cm-outline-pressed':'500','cm-separator':'700'},
  dim:              {bg:'900',subtle:'850',elevated:'800',outline:'750',separator:'750','ct-default':'75','ct-strong':'white','ct-subtle':'250','ct-faint':'450','cm-bg':'850','cm-bg-hover':'800','cm-bg-pressed':'750','cm-outline':'600','cm-outline-hover':'550','cm-outline-pressed':'500','cm-separator':'750'},
  deep:             {bg:'black',subtle:'900',elevated:'850',outline:'800',separator:'750','ct-default':'75','ct-strong':'white','ct-subtle':'300','ct-faint':'450','cm-bg':'900','cm-bg-hover':'850','cm-bg-pressed':'800','cm-outline':'700','cm-outline-hover':'600','cm-outline-pressed':'550','cm-separator':'750'},
  container:        {bg:'850',subtle:'800',elevated:'750',outline:'700',separator:'700','ct-default':'50','ct-strong':'white','ct-subtle':'250','ct-faint':'450','cm-bg':'800','cm-bg-hover':'750','cm-bg-pressed':'700','cm-outline':'600','cm-outline-hover':'550','cm-outline-pressed':'500','cm-separator':'700'},
  'over-container': {bg:'800',subtle:'750',elevated:'700',outline:'600',separator:'600','ct-default':'50','ct-strong':'white','ct-subtle':'200','ct-faint':'400','cm-bg':'750','cm-bg-hover':'700','cm-bg-pressed':'600','cm-outline':'550','cm-outline-hover':'500','cm-outline-pressed':'450','cm-separator':'600'},
  float:            {bg:'750',subtle:'700',elevated:'600',outline:'550',separator:'550','ct-default':'25','ct-strong':'white','ct-subtle':'200','ct-faint':'300','cm-bg':'700','cm-bg-hover':'600','cm-bg-pressed':'550','cm-outline':'500','cm-outline-hover':'450','cm-outline-pressed':'400','cm-separator':'550'},
  inverse:          {bg:'900',subtle:'850',elevated:'800',outline:'700',separator:'700','ct-default':'25','ct-strong':'white','ct-subtle':'250','ct-faint':'400','cm-bg':'850','cm-bg-hover':'800','cm-bg-pressed':'750','cm-outline':'600','cm-outline-hover':'550','cm-outline-pressed':'500','cm-separator':'700'}
};

const DEFAULT_SURF_LA = {bg:'25',subtle:'50',elevated:'75',outline:'175',separator:'175','ct-default':'800','ct-strong':'900','ct-subtle':'700','ct-faint':'500','cm-bg':'white','cm-bg-hover':'25','cm-bg-pressed':'50','cm-outline':'175','cm-outline-hover':'200','cm-outline-pressed':'250','cm-separator':'175'};
const DEFAULT_SURF_DA = {bg:'900',subtle:'850',elevated:'800',outline:'750',separator:'750','ct-default':'75','ct-strong':'white','ct-subtle':'150','ct-faint':'400','cm-bg':'850','cm-bg-hover':'800','cm-bg-pressed':'750','cm-outline':'600','cm-outline-hover':'550','cm-outline-pressed':'500','cm-separator':'750'};

const DEFAULT_LIGHT_MAP = {
  'content-default':14,'content-strong':15,'content-subtle':10,'content-faint':7,
  'component-bg-default':13,'component-bg-hover':14,'component-bg-pressed':15,
  'component-outline-default':9,'component-outline-hover':10,'component-outline-pressed':12,
  'component-separator':4,
  'container-bg':2,'container-hover':3,'container-pressed':4,'container-outline':7,'container-separator':4,
  'on-component':-1,'on-container':15
};

const DEFAULT_DARK_MAP = {
  'content-default':5,'content-strong':4,'content-subtle':7,'content-faint':10,
  'component-bg-default':12,'component-bg-hover':10,'component-bg-pressed':9,
  'component-outline-default':12,'component-outline-hover':10,'component-outline-pressed':9,
  'component-separator':17,
  'container-bg':18,'container-hover':17,'container-pressed':16,'container-outline':14,'container-separator':17,
  'on-component':-1,'on-container':4
};

// ── Palette generation ────────────────────────────────────────

function buildPalettes(paletteKeys) {
  const palettes = {};
  for (const [key, hex] of Object.entries(paletteKeys)) {
    palettes[key] = generatePalette(hex);
  }
  return palettes;
}

// Build a step-name → hex lookup for a palette
function stepLookup(palette) {
  const map = {};
  for (const step of palette.steps) {
    map[step.name] = step.hex;
  }
  return map;
}

// ── Token generators ──────────────────────────────────────────

/**
 * Generate primitive color tokens from palettes.
 * Returns { light: { 'prim-monochromatic-white': '#FFFFFF', ... } }
 * (primitives have no dark block — all values are in :root)
 */
function generatePrimitiveTokens(palettes) {
  const light = {};
  // Palette prefix mapping: palette key → CSS prefix
  for (const [key, palette] of Object.entries(palettes)) {
    for (const step of palette.steps) {
      light[`prim-${key}-${step.name}`] = step.hex;
    }
  }
  return { light, dark: {} };
}

/**
 * Generate semantic tokens from semantic map + palettes.
 * Returns { light: { 'primary-content-default': '#hex', ... }, dark: { ... } }
 */
function generateSemanticTokens(semanticMap, palettes) {
  const lightMap = semanticMap.light || DEFAULT_LIGHT_MAP;
  const darkMap  = semanticMap.dark  || DEFAULT_DARK_MAP;
  const light = {};
  const dark = {};

  for (const role of TOKEN_ROLES) {
    const palKey = ROLE_TO_PALETTE_KEY[role];
    const palette = palettes[palKey];
    if (!palette) continue;

    for (const [prop, idx] of Object.entries(lightMap)) {
      light[`${role}-${prop}`] = idx === -1 ? '#FFFFFF' : palette.steps[idx].hex;
    }
    for (const [prop, idx] of Object.entries(darkMap)) {
      dark[`${role}-${prop}`] = idx === -1 ? '#FFFFFF' : palette.steps[idx].hex;
    }
  }

  return { light, dark };
}

/**
 * Generate surface tokens from surface map + palettes.
 * Respects surfacePaletteSrc to pick the correct palette per surface.
 * Returns { light: { 'surface-bright-bg': '#hex', ... }, dark: { ... },
 *           paletteSrc: { 'surface-bright-bg': 'desaturated', ... } }
 */
function generateSurfaceTokens(surfaceMap, palettes, surfacePaletteSrc) {
  const monoPal = palettes.monochromatic;
  if (!monoPal) return null;

  // Default palette source: accent → monochromatic, all others → greyscale
  const defaultSrc = {};
  for (const sn of SURFACE_NAMES) defaultSrc[sn] = sn === 'accent' ? 'monochromatic' : 'greyscale';
  const srcMap = { ...defaultSrc, ...(surfacePaletteSrc || {}) };

  // Map role names used in color-system editor to actual palette keys
  const roleToKey = { primary: 'monochromatic', ...ROLE_TO_PALETTE_KEY };

  const surfL  = surfaceMap?.light       || DEFAULT_SURF_L;
  const surfD  = surfaceMap?.dark        || DEFAULT_SURF_D;
  const surfLA = surfaceMap?.lightAccent || DEFAULT_SURF_LA;
  const surfDA = surfaceMap?.darkAccent  || DEFAULT_SURF_DA;

  const light = {};
  const dark = {};
  const palSrc = {};  // track which palette each token came from

  for (const name of SURFACE_NAMES) {
    const isAccent = name === 'accent';
    const lMap  = isAccent ? surfLA : surfL[name];
    const dMap  = isAccent ? surfDA : surfD[name];

    // Resolve the palette for this surface
    const srcRole = srcMap[name] || 'greyscale';
    const palKey  = roleToKey[srcRole] || srcRole;
    const palette = palettes[palKey] || palettes.greyscale;
    const look    = stepLookup(palette);

    if (!lMap || !dMap) continue;

    for (const prop of SURF_PROP_ORDER) {
      const cssName = `surface-${name}-${prop}`;
      light[cssName] = look[lMap[prop]] || '#000000';
      dark[cssName]  = look[dMap[prop]] || '#000000';
      palSrc[cssName] = palKey;
    }
  }

  return { light, dark, paletteSrc: palSrc };
}

// ── Main export ───────────────────────────────────────────────

/**
 * Generate token override objects from a project config.
 * Each returned object has the same shape as parseCSSTokens():
 *   { light: { cssVarName: hexValue }, dark: { ... } }
 *
 * Fields not present in config are omitted (caller should fall
 * back to CSS-parsed values for those).
 *
 * @param {Object} config — project config.json contents
 * @param {Object} basePrimitiveTokens — existing parsed primitives
 *   (non-color tokens like spacing/font are preserved from here)
 * @returns {{ primitiveTokens?, semanticTokens?, surfaceTokens? }}
 */
export function generateTokenOverrides(config, basePrimitiveTokens) {
  if (!config?.paletteKeys) return {};

  const palettes = buildPalettes(config.paletteKeys);
  const result = {};

  // Primitives: overlay config-derived colors onto existing tokens
  // (preserves spacing, font-size, font-weight, etc. from CSS)
  const colorTokens = generatePrimitiveTokens(palettes);
  result.primitiveTokens = {
    light: { ...basePrimitiveTokens.light, ...colorTokens.light },
    dark:  { ...basePrimitiveTokens.dark,  ...colorTokens.dark }
  };

  // Semantics: full replacement if config has semanticMap
  if (config.semanticMap) {
    result.semanticTokens = generateSemanticTokens(config.semanticMap, palettes);
  }

  // Surfaces: full replacement if config has surfaceMap, defaults if not
  result.surfaceTokens = generateSurfaceTokens(
    config.surfaceMap || null, palettes, config.surfacePaletteSrc || null
  );

  return result;
}
