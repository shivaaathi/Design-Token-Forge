# Cross-Component Consistency Checklist

## Naming Parity

### Token prefix convention
- [ ] Component prefix is consistent: `--{comp}-*` (e.g., `--alert-*`, `--badge-*`)
- [ ] Prefix matches folder name (folder `alert/` → tokens `--alert-*`)
- [ ] Internal vars use 2-3 letter abbreviation: `--_{xx}-*`
- [ ] No prefix collisions with existing components

### Size names — exact match across ALL components
```
micro, tiny, small, base, medium, large, big, huge, mega, ultra
```
- [ ] Exactly 10 density steps — no missing, no extras
- [ ] Names spelled identically (not "sm" or "md" — always full words)
- [ ] `base` is always the default (not "default" or "normal")

### State names — exact match
```
hover, active, disabled, error, focus, dragover, loading, indeterminate
```
- [ ] States use past/present form consistently (not "hovered" or "errored")

### Variant naming by type
| Component Type | Standard Variants |
|---|---|
| Button-family | primary, secondary, tertiary, ghost, danger, success, warning, neutral, outline, brand |
| Input-family | outline, filled, ghost |
| Checkbox-family | "" (filled), outlined |
| Badge | filled, outlined, soft, ghost |
| File Upload | outline, filled |
| Display/feedback | Roles, not variants: info/primary, success, warning, danger, neutral |

- [ ] Component uses the correct variant set for its type
- [ ] Default variant is explicitly stated in CSS (`:not([data-variant])`)

## Token Coverage Parity

### Every per-size property must have all 10 entries
Run this audit:
```bash
cd packages/components/src/{component}/
# Count per-size token groups — should be multiples of 10
grep -c '\-micro:' {component}.tokens.css
grep -c '\-ultra:' {component}.tokens.css
# These counts should match
```

### Surface tokens — all states covered
For each variant/role, verify these exist:
- bg, bg-hover, bg-active, bg-disabled
- fg, fg-disabled
- border-color, border-color-hover, border-color-disabled
- opacity-disabled

```bash
# Quick audit: count surface tokens per variant
grep -c '{variant}-bg' {component}.tokens.css
```

## CSS Structural Parity

### Section order matches convention
Every component CSS should have sections in this order:
1. Keyframes (if any)
2. Base + internal vars
3. Size selectors (10)
4. Shape modifiers
5. Variant/role selectors
6. Element/slot styles
7. State styles
8. Focus
9. Forced colors
10. Reduced motion

- [ ] No missing sections (especially forced-colors and reduced-motion — commonly forgotten)

### Internal var completeness
```bash
# Count internal vars in base section
grep -c '\-\-_' {component}.css | head -1

# Count internal vars in each size selector
# Each size selector should set the SAME number of vars
```
- [ ] Every size selector sets identical number of internal vars
- [ ] No "partial" selectors that only override some vars

## Demo Page Parity

### Navigation consistency
- [ ] ALL demo pages have identical nav dropdown link list (except aria-current differs)
- [ ] Link order is consistent across ALL pages

### Section consistency
- [ ] Every demo has at minimum: Hero, Variants/Roles, Density, A11y, Framework
- [ ] A11y section always has 4 cards (Focus, Disabled, Reduced Motion, Forced Colors)
- [ ] Framework section always has 4 tabs (React, Vue, HTML, CSS Tokens)
- [ ] Section tags use consistent vocabulary: Live, Surface, Dimension, States, Shape, Slots, Motion, A11y, Integration

### JavaScript API consistency
- [ ] Factory function follows `make{CompName}(opts)` pattern
- [ ] Options object supports: variant/role, size, disabled, error, label, and component-specific props
- [ ] All render functions follow `render{SectionName}()` pattern
- [ ] Global apply function: `applyGlobals()` calls all render functions
- [ ] Theme hook: `window.DTF.onThemeChange = {function}`

## Global Token Reference Audit

After building, verify all referenced global tokens actually exist:
```bash
# Extract all var() references from token file
grep -oP 'var\(--[a-z0-9-]+\)' {component}.tokens.css | sort -u

# Cross-check against global token definitions
for token in $(grep -oP '(?<=var\()--[a-z0-9-]+(?=\))' {component}.tokens.css | sort -u); do
  found=$(grep -r "  $token:" packages/tokens/src/ | wc -l)
  if [ "$found" -eq 0 ]; then echo "MISSING: $token"; fi
done
```
- [ ] All referenced global tokens exist in `packages/tokens/src/`
- [ ] No orphan references (referencing tokens that don't exist → CSS vars resolve to initial)
