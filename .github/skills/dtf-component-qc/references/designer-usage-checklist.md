# Designer-Usage Completeness Checklist

## Why This Matters

Components built "for name's sake" get rejected by design teams. This checklist ensures every component supports the customization depth designers actually need in production.

## Per-Size Scaling (CRITICAL — Most Commonly Missed)

### Icon slots MUST scale with density
- [ ] `--{comp}-icon-size-micro` through `--{comp}-icon-size-ultra` (10 entries)
- [ ] NOT a single `--{comp}-icon-size: 20px` — this breaks proportions at small/large sizes
- [ ] Icon in `micro` should be ~14px, in `ultra` should be ~40px
- [ ] **Audit**: Does changing `data-size` visually scale the icon proportionally? If icon stays fixed while container grows, this is BROKEN.

### Font size MUST scale with density
- [ ] `--{comp}-font-size-micro` through `--{comp}-font-size-ultra` (10 entries)
- [ ] Follows the global scale: 10px → 24px progressively

### Gap MUST scale with density
- [ ] `--{comp}-gap-micro` through `--{comp}-gap-ultra` (10 entries)
- [ ] Gap at micro (~2-4px), gap at ultra (~16-20px)

### Padding MUST scale with density
- [ ] Both X and Y padding per density (10 entries each)
- [ ] Padding-X at micro (~6-8px), at ultra (~32-40px)

## Shape System

### Rounded/pill override
- [ ] Token: `--{comp}-radius-rounded: var(--radius-full)` or similar
- [ ] Data attribute: `data-rounded` or `data-shape="pill"`
- [ ] CSS handles: `[data-rounded] { --_{xx}-radius: var(--{comp}-radius-rounded) }`
- [ ] Components that MUST support this: Button, Badge, Avatar, Alert, Toast, Input, Progress-bar

### Square override
- [ ] Token: `--{comp}-radius-square: 0px`
- [ ] Data attribute: `data-shape="square"`
- [ ] Components that MUST support this: Avatar, Badge

## Variant × Role Matrix (Display/Feedback Components)

### Structural variants (HOW it looks)
- [ ] `filled` — solid background, high contrast
- [ ] `outline` — border only, transparent/subtle background
- [ ] `soft` — tinted background, lower contrast

### Semantic roles (WHAT it means)
- [ ] `primary` / `info` — blue/brand
- [ ] `success` — green
- [ ] `warning` — amber/yellow
- [ ] `danger` / `error` — red
- [ ] `neutral` — gray

### Combined: role × variant
- [ ] Every role works with every structural variant
- [ ] Token naming: `--{comp}-{role}-{variant}-bg` or role applied via `--_{xx}-fill` override
- [ ] Demo shows the full matrix: 5 roles × 3 variants = 15 combinations

## State Coverage (Per Variant/Role)

### For each variant/role, ALL these states must have tokens:
- [ ] Default: bg, fg, border-color
- [ ] Hover: bg-hover, fg-hover (if changes), border-color-hover
- [ ] Active/pressed: bg-active, border-color-active
- [ ] Disabled: bg-disabled, fg-disabled, border-color-disabled, opacity-disabled
- [ ] Error: border-color-error (if applicable)

### States that are commonly missing:
- [ ] Per-role disabled (each role has own disabled color, not just global opacity)
- [ ] Hover for non-interactive (hover on container changes bg subtly for affordance)
- [ ] Focus-within (when a child element inside the component receives focus)

## Loading / Skeleton State

### Components that need loading state:
- Avatar: skeleton pulse while image loads
- Button: shimmer animation on label
- Card: skeleton placeholder blocks
- Table: row shimmer
- Any async-populated component

### Token requirements:
- [ ] `--{comp}-skeleton-bg` or `--{comp}-loading-bg`
- [ ] `--{comp}-skeleton-animation` referencing `@keyframes`
- [ ] CSS: `[data-loading]` or `[data-skeleton]` data attribute
- [ ] Reduced motion: skeleton animation stops

## Truncation & Overflow

### Every text slot must handle overflow:
- [ ] Single-line text: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`
- [ ] Multi-line text: `display: -webkit-box; -webkit-line-clamp: {N}; overflow: hidden`
- [ ] Token: `--{comp}-max-lines` (optional, for configurable line clamping)
- [ ] Demo: show component with 200+ character text to verify

### Specific overflow rules:
- Badge labels: single-line truncation with max-width
- Toast/Alert body: multi-line clamp or scroll area
- Avatar initials: overflow hidden, centered
- File names: ellipsis in middle or end
- Tooltip: max-width with word-wrap

## Dismiss / Close Pattern

### Components that need dismiss:
- Alert, Toast, Badge (optional), Modal, Drawer, Sheet

### Requirements:
- [ ] Close button slot with icon (X)
- [ ] `@keyframes` for dismiss animation (fade + scale or slide)
- [ ] CSS transition: `[data-dismissing]` state triggers animation
- [ ] Token: `--{comp}-dismiss-duration`, `--{comp}-dismiss-easing`
- [ ] Demo: interactive click-to-dismiss with animation visible
- [ ] Reduced motion: dismiss is instant (no animation)

## Enter / Exit Animations

### Components that need enter/exit:
- Tooltip, Toast, Alert (optional), Modal, Drawer, Popover

### Requirements:
- [ ] `@keyframes {comp}-enter` and `@keyframes {comp}-exit`
- [ ] Tokens: `--{comp}-enter-duration`, `--{comp}-enter-easing`, `--{comp}-enter-transform`
- [ ] CSS: `[data-entering]` / `[data-exiting]` or `.{comp}[data-visible]`
- [ ] Demo: toggle button to show/hide with animation
- [ ] Reduced motion: no transform, instant opacity change

## Focus & Keyboard Navigation

### Focus-visible ring:
- [ ] 2px outline, primary color, 2px offset (standard)
- [ ] Visible on ALL background surfaces

### Focus-within (for composed components):
- [ ] When a child button/input inside Alert, Toast, Card, etc. receives focus
- [ ] Parent container shows subtle focus indicator
- [ ] CSS: `.{comp}:focus-within { ... }`

### Keyboard interactions:
- [ ] Tab order follows visual order
- [ ] Escape closes dismissible components
- [ ] Enter/Space activates interactive elements

## Group / Stack Layout

### Components that appear in groups:
- Avatar group (overlapping)
- Badge group (pill bar)
- Alert stack (vertical)
- Toast stack (vertical with spacing)
- Button group (horizontal)

### Requirements:
- [ ] Token: `--{comp}-group-gap` or `--{comp}-stack-gap`
- [ ] CSS: `.{comp}-group` or `.{comp}-stack` wrapper class
- [ ] Demo: show 3-5 components in group layout

## Custom Instance Theming

### Single-instance color override:
- [ ] Designers can override a single component's colors via inline `style`
- [ ] Internal vars (`--_{xx}-bg`, etc.) can be overridden from outside
- [ ] Document which CSS custom properties are the "theming surface"
- [ ] CSS Tokens tab in framework snippets shows all overridable tokens
