# Theme Pipeline Checklist

## Full Pipeline: Brand Color → Working Theme

### Step 1: Color Input Validation
- [ ] Accept hex format: `#RGB`, `#RRGGBB`, `#RRGGBBAA`
- [ ] Strip leading `#` if present
- [ ] Reject invalid hex (non-hex chars, wrong length)
- [ ] Reject achromatic colors with warning (grey/white/black — no hue to generate palette from)

### Step 2: Palette Generation
- [ ] Call `palette-engine.js` with input color
- [ ] Receive 22-step palette array
- [ ] Verify step 500 ≈ input color (within ΔE < 3)
- [ ] Verify step 600 passes WCAG AA against white (≥ 4.5:1)
- [ ] Log contrast ratios for key steps

### Step 3: Semantic Role Mapping
The generated palette maps to semantic token aliases:

| Token | Light Mode | Dark Mode |
|---|---|---|
| `content-default` | step 700 | step 200 |
| `content-strong` | step 900 | step 50 |
| `content-subtle` | step 500 | step 300 |
| `content-faint` | step 300 | step 500 |
| `component-bg-default` | step 600 | step 500 |
| `component-bg-hover` | step 700 | step 400 |
| `component-bg-pressed` | step 800 | step 600 |
| `component-outline-default` | step 500 | step 400 |
| `on-component` | white | white |
| `container-bg` | step 50 | step 900 |

Note: These mappings are already in `semantic.css` as aliases to `--prim-*`. The generator only needs to provide `--prim-*` values — semantic resolution happens automatically.

### Step 4: CSS Output
- [ ] Generate `[data-product="{name}"]` scoped CSS
- [ ] Include ALL 22 palette steps for primary
- [ ] Include comment header with source color and generation date
- [ ] Do NOT include semantic tokens (they auto-resolve from primitives)
- [ ] Do NOT include surface tokens (they auto-resolve from semantics)

### Step 5: Optional — Full Brand Kit
If `--full` flag is passed:
- [ ] Also generate brand palette (from a secondary color, or mirror primary)
- [ ] Also generate danger/warning/success palettes (keep defaults or accept overrides)
- [ ] Also generate custom font-family override

## Integration with Existing System

### Where the theme CSS goes in the cascade:
```html
<!-- Consumer's HTML -->
<html data-theme="light" data-product="acme">
<head>
  <!-- DTF tokens (base) -->
  <link rel="stylesheet" href="@design-token-forge/tokens">
  <!-- Product theme (overrides) -->
  <link rel="stylesheet" href="./acme-theme.css">
  <!-- DTF components -->
  <link rel="stylesheet" href="@design-token-forge/components">
</head>
```

Theme CSS loads AFTER tokens but BEFORE components. This is the Layer 3 (Product Tokens) slot in the cascade.

## Verification

```bash
# Generate theme and immediately test it
node packages/generator/src/cli.js --color "#E53F28" --name "test" --output /tmp/test-theme.css

# Verify the generated CSS is valid by parsing it
node -e "
const css = require('fs').readFileSync('/tmp/test-theme.css', 'utf8');
const varCount = (css.match(/--prim-/g) || []).length;
console.log('Primary palette tokens:', varCount);
console.assert(varCount >= 22, 'Expected >= 22 primary tokens');
console.log('✅ Theme has sufficient tokens');
"
```
