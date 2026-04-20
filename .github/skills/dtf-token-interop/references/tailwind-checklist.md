# Tailwind CSS Preset Checklist

## Purpose

Create a Tailwind CSS preset so teams using Tailwind can access DTF tokens as utility classes.

## Output File
`dist/tailwind-preset.js`

## Mapping

| DTF Token | Tailwind Config Key | Example Class |
|---|---|---|
| `--prim-primary-500` | `colors.primary.500` | `text-primary-500` |
| `--spacing-16` | `spacing.16` (or `4` in rem) | `p-4` |
| `--radius-md` | `borderRadius.md` | `rounded-md` |
| `--shadow-lg` | `boxShadow.lg` | `shadow-lg` |
| `--font-size-14` | `fontSize.14` | `text-14` |
| `--font-weight-medium` | `fontWeight.medium` | `font-medium` |
| `--duration-normal` | `transitionDuration.normal` | `duration-normal` |
| `--z-modal` | `zIndex.modal` | `z-modal` |

## Preset Structure

```javascript
// dist/tailwind-preset.js
module.exports = {
  theme: {
    colors: {
      primary: {
        25: 'var(--prim-primary-25)',
        50: 'var(--prim-primary-50)',
        // ... all steps via CSS custom properties
        900: 'var(--prim-primary-900)',
      },
      brand: { /* same pattern */ },
      danger: { /* same pattern */ },
      // ... all palettes
      // Semantic aliases
      'content-default': 'var(--primary-content-default)',
      'content-strong': 'var(--primary-content-strong)',
    },
    spacing: {
      0: '0px',
      1: 'var(--spacing-1)',
      2: 'var(--spacing-2)',
      // ... all spacing tokens
    },
    borderRadius: {
      none: 'var(--radius-none)',
      xs: 'var(--radius-xs)',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
      full: 'var(--radius-full)',
    },
    boxShadow: {
      none: 'var(--shadow-none)',
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
      xl: 'var(--shadow-xl)',
    },
  },
};
```

## Key Design Decision: `var()` vs Resolved Values

**Use `var()` references** — not resolved hex/px values. This means:
- Tailwind classes respond to theme changes (`data-theme="dark"`)
- Product overrides (`data-product`) work automatically
- One preset works for all themes

Trade-off: Tailwind's `opacity` modifier (`bg-primary-500/50`) won't work with `var()` references. Document this limitation.

## Script

### File: `scripts/export-tailwind.cjs`

1. Parse `primitives.css` → extract palette steps
2. Parse `extras.css` → extract radius, shadow, spacing
3. Generate JS module with CSS `var()` references
4. Write to `dist/tailwind-preset.js`

## Consumer Usage

```javascript
// tailwind.config.js
const dtfPreset = require('@design-token-forge/tokens/tailwind-preset');

module.exports = {
  presets: [dtfPreset],
  // ... rest of config
};
```

And in HTML:
```html
<!-- Tokens CSS must also be imported for var() to resolve -->
<link rel="stylesheet" href="@design-token-forge/tokens">
```

## Verification

```bash
# 1. Generate
node scripts/export-tailwind.cjs

# 2. Valid JS module
node -e "const p = require('./dist/tailwind-preset.js'); console.log(Object.keys(p.theme))"

# 3. Has expected keys
node -e "
const p = require('./dist/tailwind-preset.js');
for (const k of ['colors', 'spacing', 'borderRadius', 'boxShadow']) {
  console.log(k in (p.theme || {}) ? '✅ ' + k : '❌ ' + k);
}
"

# 4. Values use var() (not hardcoded)
node -e "
const p = require('./dist/tailwind-preset.js');
const json = JSON.stringify(p);
const varRefs = (json.match(/var\(--/g) || []).length;
console.log('var() references:', varRefs, '(should be > 100)');
"
```
