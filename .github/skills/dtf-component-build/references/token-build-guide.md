# Token Build Guide

## Overview

Token CSS defines all default values for a component's visual properties. It's the "design intent" file — what the component looks like before any overrides.

## File Creation

### Location
`packages/components/src/{component}/{component}.tokens.css`

### File Structure (EXACT order)

```css
/* ============================================================
 *  {COMPONENT NAME} — Token Defaults (Layer 0)
 *  ~{N} custom properties across 7 design axes.
 *  Density scale: micro → ultra (10 steps)
 * ============================================================ */

.{component} {

  /* ─── 📐 SHAPE ─────────────────────────────────────────── */
  /* Per-density radius */
  --{comp}-radius-micro:    var(--radius-xs);
  --{comp}-radius-tiny:     var(--radius-xs);
  --{comp}-radius-small:    var(--radius-sm);
  --{comp}-radius-base:     var(--radius-md);
  --{comp}-radius-medium:   var(--radius-md);
  --{comp}-radius-large:    var(--radius-md);
  --{comp}-radius-big:      var(--radius-lg);
  --{comp}-radius-huge:     var(--radius-lg);
  --{comp}-radius-mega:     var(--radius-xl);
  --{comp}-radius-ultra:    var(--radius-xl);

  /* Shape overrides */
  --{comp}-radius-rounded:  var(--radius-full);
  /* Border */
  --{comp}-border-width:    1px;
  --{comp}-border-style:    solid;
  /* Shadow per state */
  --{comp}-shadow:          var(--shadow-none);
  --{comp}-shadow-hover:    var(--shadow-sm);
  --{comp}-shadow-active:   var(--shadow-none);

  /* ─── 📏 DIMENSION ────────────────────────────────────── */
  /* Height per density */
  --{comp}-height-micro:    var(--spacing-20);
  --{comp}-height-tiny:     var(--spacing-24);
  --{comp}-height-small:    var(--spacing-28);
  --{comp}-height-base:     var(--spacing-36);
  --{comp}-height-medium:   var(--spacing-40);
  --{comp}-height-large:    var(--spacing-44);
  --{comp}-height-big:      var(--spacing-48);
  --{comp}-height-huge:     var(--spacing-52);
  --{comp}-height-mega:     var(--spacing-56);
  --{comp}-height-ultra:    var(--spacing-64);

  /* Padding-x per density */
  /* ... 10 entries ... */

  /* Padding-y per density */
  /* ... 10 entries ... */

  /* Gap per density */
  /* ... 10 entries ... */

  /* ─── 🎨 SURFACE ──────────────────────────────────────── */
  /* Primary / filled variant */
  --{comp}-primary-bg:              var(--primary-component-bg-default);
  --{comp}-primary-bg-hover:        var(--primary-component-bg-hover);
  --{comp}-primary-bg-active:       var(--primary-component-bg-pressed);
  --{comp}-primary-fg:              var(--primary-on-component);
  --{comp}-primary-border-color:    transparent;
  /* ... more variants ... */

  /* ─── ✏️ TYPOGRAPHY ───────────────────────────────────── */
  --{comp}-font-family:     var(--font-family-sans);
  /* Font-size per density */
  /* ... 10 entries ... */
  --{comp}-font-weight:     var(--font-weight-medium);
  --{comp}-line-height:     var(--line-height-normal);
  --{comp}-letter-spacing:  var(--letter-spacing-normal);

  /* ─── 🧩 SLOTS ────────────────────────────────────────── */
  /* Icon size per density */
  /* ... 10 entries ... */
  --{comp}-icon-color:      currentColor;
  --{comp}-icon-opacity:    1;

  /* ─── ⚡ MOTION ───────────────────────────────────────── */
  --{comp}-transition-property: background-color, border-color, color, box-shadow, opacity;
  --{comp}-transition-duration: var(--duration-normal);
  --{comp}-transition-easing:   var(--easing-in-out);

  /* ─── ♿ A11Y ──────────────────────────────────────────── */
  --{comp}-focus-outline-width:  2px;
  --{comp}-focus-outline-color:  var(--primary-component-outline-default);
  --{comp}-focus-outline-offset: 2px;
  --{comp}-min-tap-target:       44px;
}
```

## Density Value Scale Reference

When assigning per-density values, use this reference for proportional scaling:

| Density | Height | Padding-X | Padding-Y | Font-Size | Icon-Size | Gap | Radius |
|---------|--------|-----------|-----------|-----------|-----------|-----|--------|
| micro   | 20px   | 6px       | 2px       | 10px      | 12px      | 2px | xs     |
| tiny    | 24px   | 8px       | 2px       | 11px      | 14px      | 3px | xs     |
| small   | 28px   | 10px      | 3px       | 12px      | 14px      | 4px | sm     |
| base    | 36px   | 14px      | 6px       | 14px      | 16px      | 6px | md     |
| medium  | 40px   | 16px      | 8px       | 14px      | 18px      | 6px | md     |
| large   | 44px   | 18px      | 8px       | 16px      | 20px      | 8px | md     |
| big     | 48px   | 20px      | 10px      | 16px      | 20px      | 8px | lg     |
| huge    | 52px   | 24px      | 12px      | 18px      | 24px      | 10px| lg     |
| mega    | 56px   | 28px      | 12px      | 20px      | 24px      | 10px| xl     |
| ultra   | 64px   | 32px      | 14px      | 22px      | 28px      | 12px| xl     |

**These are starting values.** Adjust based on the component's nature (e.g., badges are smaller, cards are bigger).

## Validation Commands

```bash
COMP="{component}"

# Count total variables
grep -c "^\s*--" "packages/components/src/$COMP/$COMP.tokens.css"
echo "(should match spec's total_variables)"

# Check for hardcoded hex values (should be 0)
grep -cE "#[0-9a-fA-F]{3,8}" "packages/components/src/$COMP/$COMP.tokens.css"
echo "(should be 0)"

# Check all 7 axis headers present
for axis in "📐 SHAPE" "📏 DIMENSION" "🎨 SURFACE" "✏️ TYPOGRAPHY" "🧩 SLOTS" "⚡ MOTION" "♿ A11Y"; do
  grep -q "$axis" "packages/components/src/$COMP/$COMP.tokens.css" && echo "✅ $axis" || echo "❌ MISSING $axis"
done

# Count per-density entries (should be 10 each for height, padding-x, font-size, etc.)
for prop in "height" "padding-x" "font-size" "icon-size" "radius"; do
  count=$(grep -c "\-$prop-" "packages/components/src/$COMP/$COMP.tokens.css" 2>/dev/null)
  echo "$prop: $count entries"
done
```
