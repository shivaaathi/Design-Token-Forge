---
name: dtf-a11y-rtl
description: "Accessibility and RTL/i18n improvements for Design Token Forge components. Use when: adding focus-visible to components, adding logical properties (padding-inline, margin-block), implementing RTL support, adding min tap-target enforcement, auditing WCAG compliance, fixing keyboard navigation, adding ARIA attributes, implementing dir=rtl selectors, adding @layer cascade strategy, or improving accessibility of any component."
---

# DTF Accessibility & RTL — Standards Enforcement

## Purpose

Ensure every DTF component meets WCAG 2.2 AA accessibility standards and works correctly in both LTR and RTL layouts.

## When to Use

- Adding `:focus-visible` to components that lack it
- Converting physical properties to logical properties for RTL
- Adding `@layer` cascade structure
- Auditing or fixing any accessibility issue
- Adding min tap-target enforcement
- Reviewing keyboard navigation patterns

## Current State (known gaps)

### `:focus-visible` — 4 components missing
- `input.css` — MISSING (uses native `:focus` passthrough only)
- `select.css` — MISSING
- `textarea.css` — MISSING
- `tooltip.css` — MISSING (not interactive, but trigger elements need it)

### Logical Properties — 15/20 components missing
Only 5 components use `padding-inline`/`margin-inline`:
- button, input, radio, checkbox, menu-button
- All others use physical `padding-left`/`padding-right`

### `@layer` — Not implemented anywhere
No CSS cascade layers exist in the project.

## Procedure

### Phase 1: Focus-Visible Audit & Fix

Follow [Focus-Visible Checklist](./references/focus-visible-checklist.md).

### Phase 2: Logical Properties Conversion

Follow [Logical Properties Checklist](./references/logical-properties-checklist.md).

### Phase 3: CSS Layers

Follow [CSS Layers Checklist](./references/css-layers-checklist.md).

### Phase 4: Min Tap-Target Enforcement

Follow [Tap-Target Checklist](./references/tap-target-checklist.md).

### Phase 5: Verification

Follow [A11y Verification Checklist](./references/a11y-verify-checklist.md).

## Rules (NEVER violate)

1. **`:focus-visible` only** — never use bare `:focus` for visual focus rings (exception: composed inputs where `:has(:focus-visible)` on parent is also acceptable)
2. **Logical properties** — always use `*-inline-*` and `*-block-*` instead of `*-left/*-right` and `*-top/*-bottom`
3. **44px minimum** — interactive elements must have at least 44×44px touch target (WCAG 2.5.8)
4. **Never remove outlines** — only replace with styled outlines on `:focus-visible`
5. **`forced-colors`** — every component must have `@media (forced-colors: active)` section
6. **`reduced-motion`** — every component must have `@media (prefers-reduced-motion: reduce)` section
