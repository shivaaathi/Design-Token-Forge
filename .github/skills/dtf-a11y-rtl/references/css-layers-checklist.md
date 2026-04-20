# CSS Layers Checklist

## Purpose

CSS `@layer` provides explicit cascade ordering. Without it, specificity conflicts between tokens, themes, and components are resolved by source order — which is fragile.

## Layer Architecture

```css
@layer dtf-base, dtf-theme, dtf-component, dtf-instance;
```

| Layer | What Goes Here | Specificity |
|---|---|---|
| `dtf-base` | Token defaults (primitives, extras) | Lowest |
| `dtf-theme` | Semantic roles, surface contexts, theme overrides `[data-theme]` | ↓ |
| `dtf-component` | Component tokens + structural CSS | ↓ |
| `dtf-instance` | Product overrides `[data-product]`, inline style hooks | Highest |

## Implementation Approach

### Option A: Layer Declarations in Index Files (Recommended)

Add to `packages/tokens/src/index.css`:
```css
@layer dtf-base, dtf-theme, dtf-component, dtf-instance;

@layer dtf-base {
  @import './primitives.css';
  @import './extras.css';
}
@layer dtf-theme {
  @import './semantic.css';
  @import './surfaces.css';
}
```

Add to `packages/components/src/index.css`:
```css
@layer dtf-component {
  @import './button/index.css';
  @import './input/index.css';
  /* ... all components */
}
```

### Option B: Layer Declarations in Each File

Less clean but works if index files can't be restructured:
```css
/* primitives.css */
@layer dtf-base {
  :root { --prim-primary-500: #224FCE; /* ... */ }
}
```

## Impact Assessment

- [ ] Tokens load in `dtf-base` → can be overridden by anything
- [ ] Theme tokens in `dtf-theme` → override base but respect component specifics
- [ ] Components in `dtf-component` → override theme but not instance
- [ ] Product overrides in `dtf-instance` → highest priority
- [ ] **`!important` in reduced-motion/forced-colors**: Still works — `!important` in layers reverses order (lowest layer wins), which is correct for a11y overrides

## Things to NOT Break

1. Demo pages import CSS files directly — they'll need the layer order declaration too
2. Figma sync reads CSS files — layers don't affect variable values
3. `[data-theme="dark"]` selectors must be in `dtf-theme` layer
4. Component `@media` queries stay inside `dtf-component`

## Demo Page Update

Each demo HTML page needs the layer order declaration added:
```html
<style>
  @layer dtf-base, dtf-theme, dtf-component, dtf-instance;
</style>
<!-- Then the CSS imports follow -->
```

## Verification

```bash
# Check layers are declared
grep -r "@layer" packages/tokens/src/ packages/components/src/
echo "(should find layer declarations)"

# Check no unlayered CSS exists in component files
# (All component CSS should be inside @layer dtf-component)
```

## Rollback Plan

If layers cause unexpected issues:
- Remove `@layer` wrappers from index files
- Demo pages still work (they import files directly)
- Layers are additive — removing them returns to source-order cascade
