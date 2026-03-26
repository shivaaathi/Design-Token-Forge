# Demo Page Checklist

## File Location
- [ ] File: `demo/{component-name}.html` (kebab-case, matches component folder name)
- [ ] For multi-word names: file uses kebab-case (`file-upload.html`, `progress-bar.html`)
- [ ] Component folder name may differ from demo filename (e.g., folder `progress-ring/` → demo `progress-circle.html`)

## HTML Head — CSS Import Order (EXACT)
```html
<link rel="stylesheet" href="../packages/tokens/src/index.css">
<link rel="stylesheet" href="../packages/components/src/{comp}/{comp}.tokens.css">
<link rel="stylesheet" href="../packages/components/src/{comp}/{comp}.css">
<link rel="stylesheet" href="shared.css">
```
- [ ] Order is: global tokens → component tokens → component CSS → shared.css
- [ ] Paths use `../packages/` relative from demo folder
- [ ] No extra stylesheets unless component has custom demo-only styles in `<style>` tag

## Navigation Bar

### Top Nav (`.explorer-nav`)
- [ ] Home icon links to `index.html`
- [ ] Component name in `.nav-switcher-btn` matches page title
- [ ] Nav dropdown `#navDropdown` contains ALL existing components

### Nav Dropdown Link Order
- [ ] Color System group: color-system, color-tokens
- [ ] Guides group: frameworks
- [ ] Components group: button, icon-button, split-button, input, textarea, select, menu-button, toggle, checkbox, radio, slider, datepicker, file-upload, avatar, badge, tooltip, alert, toast, progress-bar, progress-circle, [future components in build order]
- [ ] Current page has `aria-current="page"` on its own link
- [ ] `aria-current="page"` appears on EXACTLY ONE link
- [ ] Each link has `<span class="dd-hint">~XX vars</span>` with correct var count
- [ ] **NO corrupted/garbled HTML** — verify after sed operations

### Theme Toggle
- [ ] `<button class="theme-toggle" id="themeToggle">Toggle Dark</button>`
- [ ] Positioned in `.nav-actions` div

## Sidebar Navigation
- [ ] `<aside class="sidebar-nav" id="sidebarNav">`
- [ ] Each link: `<a href="#sec-{id}"><span class="sn-num">{N}</span>{Title}</a>`
- [ ] Numbers are sequential starting from 1
- [ ] Every sidebar link has a matching `<section id="sec-{id}">` in main content
- [ ] No orphan links (link without section) or orphan sections (section without link)

## Page Structure
- [ ] `.page-layout` wraps sidebar + content
- [ ] `.page-content` wraps header + controls + main
- [ ] `.demo-header` with `<h1>` and `.demo-meta` badges
- [ ] Demo badges show: var count, variant/role count, size count, axis info

## Global Controls (Pill Bars)
- [ ] Wrapped in `<nav class="global-controls">`
- [ ] Each control group: label + `.pill-bar` with `role="radiogroup"`
- [ ] Pill buttons: `role="radio"`, `aria-pressed="true|false"`, `data-ctrl-{axis}="{value}"`
- [ ] Default pill has `aria-pressed="true"`
- [ ] Standard axes: variant (or role), size, shape (if applicable), mode (if applicable)
- [ ] Pill data attributes: `data-ctrl-variant`, `data-ctrl-size`, `data-ctrl-role`, `data-ctrl-mode`, etc.

## Required Sections

### MANDATORY for ALL components (none are optional):
1. **Hero Preview + Inspector** (`#sec-hero`) — Live component + resolved token inspector panel
2. **Variant/Role Gallery** (`#sec-variants` or `#sec-roles`) — All variants or roles side by side
3. **Density Scale** (`#sec-density`) — All 10 sizes in a strip
4. **State Matrix** (`#sec-states`) — Every variant × state (default, hover, active, disabled, error)
5. **Surface Context** (`#sec-surface`) — Component on 3 surface backgrounds (level-0, level-1, level-2)
6. **Shape & Shadow** (`#sec-shape`) — Radius scale, shadow presets, rounded/pill demo
7. **Slots & Anatomy** (`#sec-slots`) — Sub-element showcase (icon, label, close, etc.)
8. **Accessibility** (`#sec-a11y`) — See A11y section rules below
9. **Framework** (`#sec-framework`) — See Framework section rules below

### Additional sections (component-specific):
- Motion (`#sec-motion`): animation/transition demos (required if component has enter/exit/dismiss)
- Context Playground (`#sec-playground`): interactive role/surface switcher (for role-based components)
- Modes (`#sec-modes`): for multi-mode components (dropzone/button)

### Section HTML Structure (exact):
```html
<section class="section" id="sec-{name}">
  <div class="section-header"><h2>{Title}</h2><span class="section-tag">{Tag}</span></div>
  <p class="section-desc">{Description}</p>
  <div class="section-body">{Content}</div>
</section>
```

## Accessibility Section — 4 Standard Cards
- [ ] Card 1: **Focus Ring** — `:focus-visible` keyboard demo
- [ ] Card 2: **Disabled** — `data-disabled` / `:disabled` state
- [ ] Card 3: **Reduced Motion** — `prefers-reduced-motion` note
- [ ] Card 4: **Forced Colors** — High Contrast system colors
- [ ] Grid: `.a11y-grid > .a11y-card > .a11y-card-title + .a11y-card-desc`

## Framework Section — 4 Tabs
- [ ] Container: `.fw-snippet`
- [ ] Head: `.fw-snippet-head` with icon SVG + component wrapper name
- [ ] Tabs: React (`data-tab="react"`), Vue (`data-tab="vue"`), HTML (`data-tab="html"`), CSS Tokens (`data-tab="css"`)
- [ ] First tab (React or HTML) has `aria-selected="true"` and panel has `data-active`
- [ ] React panel: JSX with `className`, props as `{variable}`, `data-*={prop}`
- [ ] Vue panel: template with `:data-*="prop"`, `<slot />`, `v-if` conditionals
- [ ] HTML panel: static markup with hardcoded `data-*` values
- [ ] CSS panel: token reference grouped by axis (Shape, Dimension, Surface, Typography, Slots, Motion, A11y)

## JavaScript Pattern
- [ ] `<script src="shared.js"></script>` before page script
- [ ] Page JS wrapped in IIFE: `(function(){ 'use strict'; ... })();`
- [ ] Constants: `VARIANTS`, `SIZES`, `ROLES` arrays as needed
- [ ] Factory function: `make{Comp}(opts)` — builds component DOM
- [ ] Helper: `wrapCard(el, label)` — `.variant-card` wrapper
- [ ] Helper: `clr(id)` — clear container by ID
- [ ] Helper: `cap(s)` — capitalize string
- [ ] Render functions: `renderHero()`, `renderVariants()`, `renderDensity()`, etc.
- [ ] `applyGlobals()` — master re-render function
- [ ] Pill bar listeners: `document.getElementById('{axis}Bar').addEventListener('click', ...)`
- [ ] `window.DTF.onThemeChange = {callback}` for theme-switch re-render
- [ ] `applyGlobals()` called at end of IIFE for initial render
