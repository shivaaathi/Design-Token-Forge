# Token File Checklist

## File Location & Naming
- [ ] File: `packages/components/src/{component}/{component}.tokens.css`
- [ ] All tokens scoped under `.{component}` selector (not `:root`)
- [ ] File header comment states component name, "Layer 0", and approx var count

## 7-Axis Coverage (ALL required)

### 📐 SHAPE
- [ ] `--{comp}-radius-{size}` for all 10 densities (micro → ultra)
- [ ] Values reference `var(--radius-*)` globals, never hardcoded
- [ ] Border tokens: `--{comp}-border-width`, `--{comp}-border-style`
- [ ] Shadow tokens: `--{comp}-shadow` (default, hover, active if interactive)
- [ ] Optional: `--{comp}-radius-rounded: var(--radius-full)`, `--{comp}-clip-path: none`

### 📏 DIMENSION
- [ ] Height/size per density: `--{comp}-height-{size}` × 10
- [ ] Padding X per density: `--{comp}-padding-x-{size}` × 10
- [ ] Padding Y per density: `--{comp}-padding-y-{size}` × 10 (if needed)
- [ ] Gap per density: `--{comp}-gap-{size}` × 10
- [ ] Width constraints: `--{comp}-max-width`, `--{comp}-inline-size` if applicable
- [ ] Exact size names: micro, tiny, small, base, medium, large, big, huge, mega, ultra

### 🎨 SURFACE
- [ ] Per-variant tokens follow: `--{comp}-{variant}-{property}[-{state}]`
- [ ] Each variant has: bg, bg-hover, bg-active, bg-disabled, fg, fg-disabled
- [ ] Each variant has: border-color, border-color-hover, border-color-disabled
- [ ] Each variant has: opacity-disabled (usually 0.5)
- [ ] OR for role-based: `--{comp}-{role}-bg`, `--{comp}-{role}-fg`, etc.
- [ ] Standard roles if applicable: primary, success, warning, danger, neutral
- [ ] Error state tokens: `--{comp}-*-error` border/fg/bg
- [ ] Label/helper shared: `--{comp}-label-color`, `--{comp}-helper-color`
- [ ] All colors reference semantic/surface globals — ZERO hardcoded hex

### ✏️ TYPOGRAPHY
- [ ] `--{comp}-font-family: var(--font-family-sans)`
- [ ] `--{comp}-font-size-{size}` × 10 densities
- [ ] `--{comp}-font-weight` (at least one: regular, medium, or semibold)
- [ ] `--{comp}-line-height: var(--line-height-normal)`
- [ ] `--{comp}-letter-spacing` if applicable

### 🧩 SLOTS
- [ ] Icon size per density: `--{comp}-icon-size-{size}` × 10 entries (NOT a single `--{comp}-icon-size`)
- [ ] Icon color: `--{comp}-icon-color` referencing semantic fg token
- [ ] Label/helper slots: gap, font-size, font-weight
- [ ] Sub-element tokens (close button, progress bar, badge dot, etc.)
- [ ] Each slot references global tokens
- [ ] **AUDIT**: Count icon-size tokens — if < 10, component is incomplete

### ⚡ MOTION
- [ ] `--{comp}-transition-property` (list: background-color, border-color, color, opacity, etc.)
- [ ] `--{comp}-transition-duration: var(--duration-normal)`
- [ ] `--{comp}-transition-easing: var(--easing-in-out)`
- [ ] Animation tokens if component has enter/exit/indeterminate states

### ♿ ACCESSIBILITY
- [ ] `--{comp}-focus-outline-width: 2px`
- [ ] `--{comp}-focus-outline-color: var(--primary-component-outline-default)`
- [ ] `--{comp}-focus-outline-offset: 2px`
- [ ] `--{comp}-min-tap-target: 44px` (if interactive)

## Zero Hardcoded Values Rule
- [ ] `grep` the file: no `#` hex values, no bare `px` values outside border-width
- [ ] Every color = `var(--{semantic}-*)` or `var(--surface-*)`
- [ ] Every spacing = `var(--spacing-*)` 
- [ ] Every radius = `var(--radius-*)`
- [ ] Every shadow = `var(--shadow-*)`
- [ ] Every font = `var(--font-*)`
- [ ] Every duration = `var(--duration-*)`, easing = `var(--easing-*)`
- [ ] Allowed raw values: `0`, `0px`, `none`, `transparent`, `1px`, `2px` (border-width), `0.5` (opacity)
