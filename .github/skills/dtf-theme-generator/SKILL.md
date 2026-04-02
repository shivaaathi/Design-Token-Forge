---
name: dtf-theme-generator
description: "Brand theme generation and customization for Design Token Forge. Use when: creating a custom brand theme, generating product-specific token overrides, building the DTF CLI tool, implementing the palette-engine-to-CSS pipeline, writing getting-started documentation for new teams, explaining how to customize the design system, or creating a product token file from a brand color."
---

# DTF Theme Generator — Brand Customization Pipeline

## Purpose

Enable teams to customize Design Token Forge for their brand with a single input (brand color) and get a complete, WCAG-compliant token override file.

## When to Use

- Creating a custom brand theme for a product
- Building the `dtf` CLI tool
- Writing the "Getting Started" customization guide
- Generating product-specific `[data-product]` override CSS

## Current State

### What exists:
- `packages/generator/src/palette-engine.js` — sophisticated CIE L* + OKLCH color generator
- `packages/generator/src/export-figma.js` — Figma variable export
- `scripts/generate-surfaces.cjs` — surface token generation

### What's missing:
- No CLI entry point (`dtf brand --color "#E53F28"`)
- No "brand color → complete theme CSS" pipeline
- No product token template
- No getting-started docs

## Procedure

### Phase 1: CLI Tool

Follow [CLI Build Checklist](./references/cli-build-checklist.md).

### Phase 2: Theme Generation Pipeline

Follow [Theme Pipeline Checklist](./references/theme-pipeline-checklist.md).

### Phase 3: Getting Started Docs

Follow [Getting Started Checklist](./references/getting-started-checklist.md).

## Architecture: How Theme Customization Works

### The 5-Layer Cascade

```
Layer 1: Token Defaults     (primitives.css, extras.css)
Layer 2: Global Tokens       (semantic.css, surfaces.css)
Layer 3: Product Tokens      [data-product="acme"] { --prim-brand-*: ... }
Layer 4: Component Tokens    [data-product="acme"] .btn { --btn-*: ... }
Layer 5: Instance Overrides  style="--btn-radius: var(--radius-full)"
```

To create a brand theme, you only need Layer 3 — override the primitive palette. Layers 2-5 auto-resolve because they alias through the primitive tokens.

### Minimum Override Set

To rebrand the entire system, a team needs to override **only these tokens**:

```css
[data-product="acme"] {
  /* Primary palette (22 steps) */
  --prim-primary-white: #FFFFFF;
  --prim-primary-25: #F5F7FF;
  /* ... 20 more steps ... */
  --prim-primary-900: #0A1959;
  --prim-primary-black: #000000;

  /* Brand palette (22 steps) — often same as primary for simple brands */
  --prim-brand-white: #FFFFFF;
  --prim-brand-25: #FFF5F2;
  /* ... */

  /* Optional: custom font */
  --font-family-sans: 'Inter', system-ui, sans-serif;
}
```

That's it — 44-88 tokens to rebrand the ENTIRE system.

## How the Palette Engine Works

Input: one hex color (e.g., `#E53F28`)
Output: 22-step palette with guaranteed WCAG contrast

Algorithm:
1. Convert hex → OKLCH (perceptually uniform color space)
2. Set CIE L* tone axis (10 = darkest, 900 = lightest)
3. Apply chroma bell curve (vibrant at key step, muted at extremes)
4. Gamut-map each step to sRGB (reduce chroma until in-gamut)
5. Verify WCAG contrast ratios at key steps (500→white, 600→white)

Result example:
```
Step 25:  #FFF5F2  — background tint
Step 100: #FED0C3  — light accent
Step 300: #F5755D  — mid accent
Step 500: #E53F28  — KEY COLOR (input)
Step 600: #C7311F  — filled button bg
Step 700: #9E2517  — hover state
Step 900: #451008  — darkest shade
```
