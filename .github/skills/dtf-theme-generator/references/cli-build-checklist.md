# CLI Build Checklist

## Entry Point

### File: `packages/generator/src/cli.js`

```javascript
#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { generateTheme } from './theme-generator.js';

const { values } = parseArgs({
  options: {
    color: { type: 'string', short: 'c', description: 'Brand primary color (hex)' },
    name: { type: 'string', short: 'n', description: 'Product name for data-product attribute' },
    output: { type: 'string', short: 'o', default: './brand-theme.css', description: 'Output CSS file path' },
    help: { type: 'boolean', short: 'h' }
  }
});

if (values.help || !values.color) {
  console.log(`
  Design Token Forge — Theme Generator

  Usage:
    dtf --color "#E53F28" --name "acme" --output ./src/acme-theme.css

  Options:
    -c, --color   Brand primary color (hex) [required]
    -n, --name    Product name (used in [data-product="name"]) [optional]
    -o, --output  Output file path [default: ./brand-theme.css]
    -h, --help    Show this help
  `);
  process.exit(values.help ? 0 : 1);
}

await generateTheme(values);
```

### package.json bin field
```json
{
  "bin": { "dtf": "./src/cli.js" }
}
```

## Theme Generator Module

### File: `packages/generator/src/theme-generator.js`

Inputs:
- `color`: hex string (e.g., "#E53F28")
- `name`: product name (optional, for data-product scoping)
- `output`: file path

Pipeline:
1. Validate hex color input
2. Call `palette-engine.js` to generate 22-step palette
3. Generate semantic role mappings (light + dark)
4. Format as CSS with `[data-product]` selector (or `:root`)
5. Write to output file

### Output Format
```css
/* Design Token Forge — Brand Theme: {name}
 * Generated from: {color}
 * Date: {ISO date}
 */

[data-product="{name}"] {
  /* ── Primary Palette (22 steps) ── */
  --prim-primary-white: #FFFFFF;
  --prim-primary-25: {generated};
  --prim-primary-50: {generated};
  /* ... all 22 steps ... */

  /* ── Brand Palette (mirrors primary for single-brand) ── */
  --prim-brand-white: #FFFFFF;
  --prim-brand-25: {generated};
  /* ... */
}

[data-product="{name}"][data-theme="dark"] {
  /* Dark mode overrides (if needed) */
  /* Usually NOT needed — semantic.css handles dark mode automatically */
  /* Only include if brand colors need different dark-mode values */
}
```

## Testing

```bash
cd packages/generator

# 1. CLI help works
node src/cli.js --help

# 2. Generate a test theme
node src/cli.js --color "#E53F28" --name "test" --output /tmp/test-theme.css

# 3. Output file exists and has content
[ -f /tmp/test-theme.css ] && echo "✅ file created" || echo "❌ missing"
wc -l /tmp/test-theme.css
echo "(should be 50-100 lines)"

# 4. Output has correct CSS structure
grep "data-product" /tmp/test-theme.css && echo "✅ scoped" || echo "❌ missing scope"
grep "\-\-prim-primary-500" /tmp/test-theme.css && echo "✅ tokens" || echo "❌ missing tokens"

# 5. No WCAG contrast failures in output
# (palette-engine verifies internally — check its console output)
```

## Verification Checklist

- [ ] CLI runs with `node src/cli.js --help`
- [ ] CLI requires `--color` flag (exits with error if missing)
- [ ] Generated CSS has `[data-product]` selector
- [ ] Generated CSS has all 22 primary palette steps
- [ ] Generated CSS has no hardcoded values outside the palette
- [ ] WCAG contrast verified for key steps (500, 600 against white)
- [ ] Output file is valid CSS (no syntax errors)
