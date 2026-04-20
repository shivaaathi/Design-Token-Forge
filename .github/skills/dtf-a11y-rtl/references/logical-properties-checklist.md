# Logical Properties Checklist

## Rule

Use CSS logical properties instead of physical properties. This makes components automatically RTL-compatible.

## Conversion Table

| Physical (LTR-only) | Logical (RTL-compatible) |
|---|---|
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `padding-top` | `padding-block-start` |
| `padding-bottom` | `padding-block-end` |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `left` | `inset-inline-start` |
| `right` | `inset-inline-end` |
| `top` | `inset-block-start` |
| `bottom` | `inset-block-end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |
| `text-align: left` | `text-align: start` |
| `text-align: right` | `text-align: end` |
| `width` | `inline-size` (when direction-aware) |
| `height` | `block-size` (when direction-aware) |
| `min-width` | `min-inline-size` |
| `max-width` | `max-inline-size` |

## Shorthand Properties (already direction-aware)

These do NOT need conversion — they work in both directions:
- `padding-inline: Xpx;` (sets both start and end)
- `padding-block: Xpx;`
- `margin-inline: Xpx;`
- `margin-block: Xpx;`
- `inset-inline: Xpx;`
- `gap` (flexbox/grid)
- `border-radius` (corner naming: `start-start`, `start-end`, etc.)

## Exceptions (keep physical)

- `width`/`height` for fixed dimensions (component height, icon size) — these don't flip in RTL
- `top`/`bottom` for vertical positioning (tooltip arrow, dropdown offset)
- `border-radius` shorthand (4-value is fine — CSS resolves per writing mode)
- `transform: translateX()` — use `translateX()` with negative values for RTL, OR prefer `inset-inline-start` positioning

## Per-Component Conversion

For each component, run:

```bash
COMP="{component}"
CSS="packages/components/src/$COMP/$COMP.css"

# Find physical properties to convert
grep -nE "padding-(left|right)|margin-(left|right)|text-align:\s*(left|right)|border-(left|right)" "$CSS"
echo "---"
grep -nE "\b(left|right)\s*:" "$CSS" | grep -v "border-radius\|text-align"
```

### Conversion Procedure

1. Read the component CSS fully to understand the layout
2. For each `padding-left/right` → replace with `padding-inline-start/end`
3. For each `margin-left/right` → replace with `margin-inline-start/end`
4. For `left: Xpx` positioning → evaluate if it's directional:
   - If directional (e.g., icon on left side) → `inset-inline-start`
   - If not directional (e.g., centering) → keep as `left`
5. For `text-align: left/right` → `text-align: start/end`
6. Test: visual appearance in LTR should be identical after conversion

## Token Variable Names

Token names stay as-is (e.g., `--btn-padding-x-base`). Only the CSS `property:` changes. The variable name `padding-x` is a design abstraction — it maps to `padding-inline` in CSS.

```css
/* ✅ Correct: token name stays, property becomes logical */
.btn {
  padding-inline: var(--_btn-px);
  padding-block: var(--_btn-py);
}
```

## Verification

```bash
# After conversion, check NO physical directional properties remain
for dir in packages/components/src/*/; do
  comp=$(basename "$dir")
  css="$dir/${comp}.css"
  [ -f "$css" ] || continue
  hits=$(grep -cE "padding-(left|right)[^:]|margin-(left|right)" "$css" 2>/dev/null)
  if [ "$hits" -gt 0 ]; then
    echo "⚠️  $comp: $hits physical direction properties"
  else
    echo "✅ $comp"
  fi
done
```
