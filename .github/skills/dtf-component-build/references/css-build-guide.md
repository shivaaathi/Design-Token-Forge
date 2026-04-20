# CSS Build Guide

## Overview

Component CSS translates token defaults into rendered styles using internal bridge variables, data-attribute selectors, and state management.

## File Creation

### Location
`packages/components/src/{component}/{component}.css`

### Internal Variable Convention

The component CSS NEVER reads public tokens directly in property declarations. Instead:
1. Public tokens (`--{comp}-*`) are set in the token file
2. Size/variant selectors map public tokens → internal bridge vars (`--_{xx}-*`)
3. Base styles read from internal vars only

```css
/* ✅ CORRECT: base reads internal var */
.comp { height: var(--_cp-height); }
[data-size="base"] { --_cp-height: var(--comp-height-base); }

/* ❌ WRONG: base reads public token directly */
.comp { height: var(--comp-height-base); }
```

### Required Section Order

```css
/* ============================================================
 *  {COMPONENT NAME}
 *  Markup: <div class="{comp}" data-size="base" data-variant="filled">
 *            <span class="{comp}__icon">…</span>
 *            <span class="{comp}__label">…</span>
 *          </div>
 * ============================================================ */

/* ── 1. KEYFRAMES (if needed) ──────────────────────── */
@keyframes {comp}-shimmer { /* ... */ }

/* ── 2. BASE ───────────────────────────────────────── */
.{comp} {
  /* Internal bridge vars (defaults = base size, default variant) */
  --_{xx}-height:   var(--{comp}-height-base);
  --_{xx}-px:       var(--{comp}-padding-x-base);
  --_{xx}-py:       var(--{comp}-padding-y-base);
  --_{xx}-fs:       var(--{comp}-font-size-base);
  --_{xx}-radius:   var(--{comp}-radius-base);
  --_{xx}-gap:      var(--{comp}-gap-base);
  --_{xx}-icon:     var(--{comp}-icon-size-base);
  --_{xx}-bg:       var(--{comp}-{default-variant}-bg);
  --_{xx}-fg:       var(--{comp}-{default-variant}-fg);
  --_{xx}-border:   var(--{comp}-{default-variant}-border-color);
  --_{xx}-shadow:   var(--{comp}-shadow);

  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: var(--_{xx}-gap);
  position: relative;

  /* Dimension */
  height: var(--_{xx}-height);
  padding-inline: var(--_{xx}-px);
  padding-block: var(--_{xx}-py);

  /* Shape */
  border-radius: var(--_{xx}-radius);
  border: var(--{comp}-border-width) var(--{comp}-border-style) var(--_{xx}-border);
  box-shadow: var(--_{xx}-shadow);

  /* Surface */
  background-color: var(--_{xx}-bg);
  color: var(--_{xx}-fg);

  /* Typography */
  font-family: var(--{comp}-font-family);
  font-size: var(--_{xx}-fs);
  font-weight: var(--{comp}-font-weight);
  line-height: var(--{comp}-line-height);
  letter-spacing: var(--{comp}-letter-spacing);

  /* Motion */
  transition-property: var(--{comp}-transition-property);
  transition-duration: var(--{comp}-transition-duration);
  transition-timing-function: var(--{comp}-transition-easing);

  /* Interactive */
  cursor: pointer;
  user-select: none;
}

/* ── 3. SIZE SELECTORS (all 10) ────────────────────── */
.{comp}:not([data-size]),
.{comp}[data-size="base"] {
  --_{xx}-height: var(--{comp}-height-base);
  --_{xx}-px:     var(--{comp}-padding-x-base);
  --_{xx}-py:     var(--{comp}-padding-y-base);
  --_{xx}-fs:     var(--{comp}-font-size-base);
  --_{xx}-radius: var(--{comp}-radius-base);
  --_{xx}-gap:    var(--{comp}-gap-base);
  --_{xx}-icon:   var(--{comp}-icon-size-base);
}

.{comp}[data-size="micro"] {
  --_{xx}-height: var(--{comp}-height-micro);
  --_{xx}-px:     var(--{comp}-padding-x-micro);
  --_{xx}-py:     var(--{comp}-padding-y-micro);
  --_{xx}-fs:     var(--{comp}-font-size-micro);
  --_{xx}-radius: var(--{comp}-radius-micro);
  --_{xx}-gap:    var(--{comp}-gap-micro);
  --_{xx}-icon:   var(--{comp}-icon-size-micro);
}
/* ... repeat for tiny, small, medium, large, big, huge, mega, ultra */
/* CRITICAL: every size selector sets ALL internal dimension vars */

/* ── 4. SHAPE MODIFIERS ────────────────────────────── */
.{comp}[data-rounded] {
  --_{xx}-radius: var(--{comp}-radius-rounded);
}

/* ── 5. VARIANT SELECTORS ──────────────────────────── */
.{comp}:not([data-variant]),
.{comp}[data-variant="filled"] {
  --_{xx}-bg:     var(--{comp}-filled-bg);
  --_{xx}-fg:     var(--{comp}-filled-fg);
  --_{xx}-border: var(--{comp}-filled-border-color);
}
.{comp}[data-variant="outlined"] {
  --_{xx}-bg:     var(--{comp}-outlined-bg);
  --_{xx}-fg:     var(--{comp}-outlined-fg);
  --_{xx}-border: var(--{comp}-outlined-border-color);
}
/* ... repeat for soft, ghost, etc. */

/* ── 6. ROLE SELECTORS (if applicable) ─────────────── */
.{comp}[data-role="danger"] {
  --_{xx}-bg:     var(--{comp}-danger-bg);
  --_{xx}-fg:     var(--{comp}-danger-fg);
  --_{xx}-border: var(--{comp}-danger-border-color);
}
/* ... repeat for success, warning, info, neutral, brand */

/* ── 7. INTERACTIVE STATES ─────────────────────────── */
.{comp}:hover:not(:disabled):not([data-disabled]) {
  --_{xx}-bg:     var(--{comp}-{variant}-bg-hover);
  --_{xx}-border: var(--{comp}-{variant}-border-color-hover);
  --_{xx}-shadow: var(--{comp}-shadow-hover);
}
.{comp}:active:not(:disabled):not([data-disabled]) {
  --_{xx}-bg:     var(--{comp}-{variant}-bg-active);
  --_{xx}-shadow: var(--{comp}-shadow-active);
}
/* Per-variant hover/active states for each variant */

/* ── 8. DISABLED STATE ─────────────────────────────── */
.{comp}:disabled,
.{comp}[data-disabled] {
  opacity: var(--{comp}-opacity-disabled);
  pointer-events: none;
  cursor: default;
}

/* ── 9. FOCUS RING ─────────────────────────────────── */
.{comp}:focus-visible {
  outline: var(--{comp}-focus-outline-width) solid var(--{comp}-focus-outline-color);
  outline-offset: var(--{comp}-focus-outline-offset);
}

/* ── 10. SUB-ELEMENTS ──────────────────────────────── */
.{comp}__icon { /* ... */ }
.{comp}__label { /* ... */ }

/* ── 11. CONDITIONAL SLOT STYLING (:has) ───────────── */
.{comp}:has(> .{comp}__icon:first-child) {
  padding-inline-start: var(--_{xx}-px-icon);
}

/* ── 12. FORCED COLORS ─────────────────────────────── */
@media (forced-colors: active) {
  .{comp} {
    border: 2px solid ButtonText;
  }
  .{comp}:hover {
    border-color: Highlight;
  }
  .{comp}:disabled,
  .{comp}[data-disabled] {
    border-color: GrayText;
    color: GrayText;
  }
}

/* ── 13. REDUCED MOTION ────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .{comp} {
    transition-duration: 0.01ms !important;
  }
}
```

## Entry Point File

Create `packages/components/src/{component}/index.css`:
```css
@import './{component}.tokens.css';
@import './{component}.css';
```

## Validation Commands

```bash
COMP="{component}"
PREFIX="{xx}"  # 2-3 letter internal prefix

# 1. Internal vars used consistently
echo "=== Internal var usage ==="
grep -c "var(--_${PREFIX}-" "packages/components/src/$COMP/$COMP.css"

# 2. All 10 size selectors present
for size in micro tiny small base medium large big huge mega ultra; do
  grep -q "data-size=\"$size\"" "packages/components/src/$COMP/$COMP.css" && echo "✅ $size" || echo "❌ $size"
done

# 3. Focus-visible present (NOT just :focus)
grep -q "focus-visible" "packages/components/src/$COMP/$COMP.css" && echo "✅ focus-visible" || echo "❌ focus-visible MISSING"

# 4. Forced-colors present
grep -q "forced-colors" "packages/components/src/$COMP/$COMP.css" && echo "✅ forced-colors" || echo "❌ forced-colors MISSING"

# 5. Reduced-motion present
grep -q "prefers-reduced-motion" "packages/components/src/$COMP/$COMP.css" && echo "✅ reduced-motion" || echo "❌ reduced-motion MISSING"

# 6. No !important outside media queries
grep "!important" "packages/components/src/$COMP/$COMP.css" | grep -v "@media" | grep -v "prefers-reduced-motion" | grep -v "forced-colors"
echo "(should be 0 lines)"

# 7. Entry point exists
cat "packages/components/src/$COMP/index.css"
```
