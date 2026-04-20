# Component CSS Checklist

## File Location & Naming
- [ ] File: `packages/components/src/{component}/{component}.css`
- [ ] File header: markup examples for all modes/variants
- [ ] BEM naming: `.{component}`, `.{component}__{element}`, `.{component}--{modifier}` (data-attr preferred over modifiers)

## Internal Variable Prefix
- [ ] Unique 2-3 letter prefix: `--_{xx}-*`
- [ ] Prefix is NOT used by any other component (check existing: btn, al, fu, sw, in, ck, bd, tt, ts, pg, rg)
- [ ] All rendering properties use internal vars, never public tokens directly

## Required Sections (in order)

### 1. Keyframe Animations (if needed)
- [ ] `@keyframes` defined before component rules
- [ ] Named with component prefix: `{comp}-shimmer`, `{comp}-rotate`

### 2. BASE — Internal Active Variables
- [ ] All internal `--_{xx}-*` vars initialized with base/default values
- [ ] Layout properties set: display, flex-direction, gap, position
- [ ] All visual properties read from internal vars: `height: var(--_{xx}-height)`
- [ ] Default variant surface vars set (outline or primary depending on component type)

### 3. SIZE SELECTORS — All 10 Densities
- [ ] Optional: `.{comp}:not([data-size])` as alias for base (combined with `[data-size="base"]`)
- [ ] Required selectors: micro, tiny, small, base, medium, large, big, huge, mega, ultra
- [ ] **CRITICAL**: Every selector sets ALL internal dimension vars — no cascade inheritance
- [ ] Check: count internal vars in base, count in each size selector — must match

### 4. SHAPE MODIFIERS (if applicable)
- [ ] `[data-rounded]` → `--_{xx}-radius: var(--{comp}-radius-rounded)` (pill shape)
- [ ] `[data-square]` → `--_{xx}-radius: 0px`

### 5. VARIANT/ROLE SELECTORS
- [ ] Default variant: `:not([data-variant])` combined with explicit `[data-variant="{default}"]`
- [ ] Each variant sets ALL surface internal vars (bg, fg, border-color minimum)
- [ ] Per-variant hover states set: `[data-variant="x"]:hover { --_{xx}-bg: ... }`
- [ ] Per-variant active states: `[data-variant="x"]:active { --_{xx}-bg: ... }`

### 6. ELEMENT STYLES (Sub-components)
- [ ] Each BEM element has its own rule block
- [ ] Element sizes read from internal vars (e.g., icon svg width from `--_{xx}-icon-size`)
- [ ] Text elements reference `--_{xx}-fs`, color from `--_{xx}-fg`

### 7. STATE STYLES
- [ ] `:hover` — background, border-color, shadow transitions
- [ ] `:active` — pressed state (bg-active, shadow-active)
- [ ] `:focus-visible` — outline ring (NOT `:focus` alone)
- [ ] `:disabled` AND `[data-disabled]` — both covered
- [ ] Disabled: `pointer-events: none`, `cursor: default`, opacity from token
- [ ] Error: `[data-error]` — border-color switches to danger token
- [ ] Component-specific: `[data-dragover]`, `[data-loading]`, `[data-indeterminate]`, etc.

### 8. FOCUS RING
- [ ] Uses `:focus-visible` (keyboard-only), NOT `:focus`
- [ ] `outline: var(--{comp}-focus-outline-width) solid var(--{comp}-focus-outline-color)`
- [ ] `outline-offset: var(--{comp}-focus-outline-offset)`
- [ ] For composed inputs: `:has(.{comp}__input:focus-visible)` on parent

### 9. FORCED COLORS — `@media (forced-colors: active)`
- [ ] Section present with `@media (forced-colors: active)` wrapper
- [ ] Borders: `ButtonText` default, `Highlight` on hover/focus
- [ ] Disabled: `GrayText` for border + text
- [ ] Links: `LinkText` for interactive text elements
- [ ] No background-color overrides (system manages backgrounds)

### 10. REDUCED MOTION — `@media (prefers-reduced-motion: reduce)`
- [ ] Section present with `@media (prefers-reduced-motion: reduce)` wrapper
- [ ] `transition-duration: 0.01ms !important` (not 0s — Safari bug)
- [ ] `animation-duration: 0.01ms !important` if animations exist
- [ ] Indeterminate/spinning animations frozen

## CSS Quality Rules
- [ ] No `!important` except in forced-colors and reduced-motion media queries
- [ ] No magic numbers — all values from tokens or internal vars
- [ ] Transitions use token values: `var(--{comp}-transition-duration) var(--{comp}-transition-easing)`
- [ ] `cursor: pointer` on interactive elements, `cursor: default` on disabled
- [ ] `position: relative` on containers that hold absolutely-positioned children (hidden inputs)
